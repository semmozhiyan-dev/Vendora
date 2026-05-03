"use strict";

const mongoose = require("mongoose");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const logger = require("../utils/logger");
const { createRazorpayOrder: createRzpOrder, verifySignature } = require("../services/payment.service");

const createRazorpayOrder = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { orderId, amount } = req.body;
    logger.info(`[${req.id}] Creating Razorpay order for user: ${userId}`);

    // If only amount is provided (for testing/direct payment)
    if (!orderId && amount) {
      const amountInPaise = Math.round(amount * 100);
      const razorpayOrder = await createRzpOrder(amountInPaise, "INR", `test_${Date.now()}`);
      
      logger.info(`[${req.id}] Razorpay order created (test mode): ${razorpayOrder.id}`);
      
      return res.status(201).json({
        success: true,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
      });
    }

    // Full flow with orderId
    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ success: false, message: "Valid orderId or amount is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (order.status !== "PENDING") {
      return res.status(400).json({ success: false, message: `Order is already ${order.status}` });
    }

    const amountInPaise = Math.round(order.totalAmount * 100);
    const razorpayOrder = await createRzpOrder(amountInPaise, "INR", order._id.toString());

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    logger.info(`[${req.id}] Razorpay order created: ${razorpayOrder.id}`);

    return res.status(201).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId: order._id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    return next(err);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    logger.info(`[${req.id}] Verifying payment for Razorpay order: ${razorpay_order_id}`);

    const isValid = verifySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      logger.error(`[${req.id}] Payment signature mismatch for order: ${razorpay_order_id}`);
      return res.status(400).json({ success: false, message: "Payment verification failed: invalid signature" });
    }

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found for this payment" });
    }

    if (order.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (order.status === "PAID") {
      return res.status(200).json({ success: true, message: "Payment already verified", order });
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.status = "PAID";
    order.paidAt = new Date();
    await order.save();

    logger.info(`[${req.id}] Payment verified and order marked PAID: ${order._id}`);

    const populated = await Order.findById(order._id).populate("items.product");
    return res.status(200).json({ success: true, message: "Payment verified successfully", order: populated });
  } catch (err) {
    return next(err);
  }
};

const handleWebhook = async (req, res, next) => {
  try {
    const crypto = require("crypto");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      logger.error("RAZORPAY_WEBHOOK_SECRET is not set");
      return res.status(500).json({ success: false, message: "Webhook configuration error" });
    }

    const signature = req.headers["x-razorpay-signature"];
    if (!signature) {
      return res.status(400).json({ success: false, message: "Missing webhook signature" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.body)
      .digest("hex");

    if (expectedSignature !== signature) {
      logger.error("Webhook signature mismatch");
      return res.status(400).json({ success: false, message: "Invalid webhook signature" });
    }

    const event = JSON.parse(req.body.toString());
    logger.info(`[Webhook] Event received: ${event.event}`);

    const { event: eventName, payload } = event;

    if (eventName === "payment.captured") {
      const razorpayOrderId = payload.payment.entity.order_id;
      const razorpayPaymentId = payload.payment.entity.id;

      const order = await Order.findOne({ razorpayOrderId });
      if (order && order.status !== "PAID") {
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
        }
        order.razorpayPaymentId = razorpayPaymentId;
        order.status = "PAID";
        order.paidAt = new Date();
        await order.save();
        logger.info(`[Webhook] Order ${order._id} marked PAID via webhook`);
      }
    }

    if (eventName === "payment.failed") {
      const razorpayOrderId = payload.payment.entity.order_id;
      const order = await Order.findOne({ razorpayOrderId });
      if (order && order.status === "PENDING") {
        order.status = "FAILED";
        await order.save();
        logger.info(`[Webhook] Order ${order._id} marked FAILED via webhook`);
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
  handleWebhook,
};
