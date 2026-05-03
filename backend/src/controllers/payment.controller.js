const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const logger = require('../utils/logger');

async function createOrder(req, res, next) {
  try {
    const { amount } = req.body;
    const requestId = req.id || req.headers['x-request-id'] || null;
      logger.info(`[${requestId}] createOrder called`, { requestId });

    if (amount === undefined || amount === null || isNaN(amount)) {
      logger.warn(`[${requestId}] Invalid amount provided`, { amount, requestId });
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const amountPaise = Math.round(Number(amount) * 100);

    const options = {
      amount: amountPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    logger.info(`[${requestId}] Razorpay order created`, { orderId: order && order.id, amount: amountPaise, requestId });

    return res.json({ success: true, order });
  } catch (error) {
    const requestId = req.id || req.headers['x-request-id'] || null;
    logger.error(`[${requestId}] Error in createOrder`, { message: error.message, stack: error.stack });
    return next(error);
  }
}

async function verifyPayment(req, res, next) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const requestId = req.id || req.headers['x-request-id'] || null;
    logger.info(`[${requestId}] verifyPayment called`, { requestId });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      logger.warn(`[${requestId}] Missing required fields for payment verification`, { body: req.body, requestId });
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature === razorpay_signature) {
      logger.info(`[${requestId}] Payment verified successfully`, { razorpay_order_id, razorpay_payment_id, requestId });
      return res.json({ success: true, verified: true });
    }

    logger.warn(`[${requestId}] Invalid signature for payment`, { generatedSignature, receivedSignature: razorpay_signature, requestId });
    return res.status(400).json({ success: false, verified: false, message: 'Invalid signature' });
  } catch (error) {
    const requestId = req.id || req.headers['x-request-id'] || null;
    logger.error(`[${requestId}] Error in verifyPayment`, { message: error.message, stack: error.stack });
    return next(error);
  }
}

module.exports = { createOrder, verifyPayment };
