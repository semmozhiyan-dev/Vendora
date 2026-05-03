"use strict";

const mongoose = require('mongoose');
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const logger = require('../utils/logger');

const createOrder = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Authentication required' });
    const userId = user.userId;

    const { shippingAddress, items } = req.body || {};
    logger.info(`[${req.id}] Creating order for user: ${userId}`);

    let orderItems = [];
    let totalAmount = 0;

    if (items && Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        if (!item.productId || !item.quantity) {
          return res.status(400).json({ success: false, message: 'Each item must have productId and quantity' });
        }
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({ success: false, message: `Product ${item.productId} not found` });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({ success: false, message: `Insufficient stock for product: ${product.name}` });
        }
        orderItems.push({ product: product._id, quantity: item.quantity, price: product.price });
        totalAmount += product.price * item.quantity;
      }
    } else {
      const cart = await Cart.findOne({ user: userId }).populate('items.product');
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart is empty' });
      }

      for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
          return res.status(400).json({ success: false, message: `Insufficient stock for product: ${item.product.name}` });
        }
      }

      orderItems = cart.items.map((item) => {
        const price = item.product.price;
        totalAmount += price * item.quantity;
        return { product: item.product._id, quantity: item.quantity, price };
      });

      cart.items = [];
      await cart.save();
    }

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress: shippingAddress || {}
    });

    const populated = await Order.findById(order._id).populate('items.product');
    return res.status(201).json({ success: true, order: populated });
  } catch (err) {
    return next(err);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Authentication required' });
    const userId = user.userId;

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;
  logger.info(`[${req.id}] Fetching user orders: page=${page}, limit=${limit}`);

    const [items, total] = await Promise.all([
      Order.find({ user: userId }).skip(skip).limit(limit).populate('items.product').sort({ createdAt: -1 }).lean(),
      Order.countDocuments({ user: userId })
    ]);

    return res.status(200).json({ success: true, page, limit, total, items });
  } catch (err) {
    return next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Authentication required' });
    const userId = user.userId;

    const { id } = req.params;
      logger.info(`[${req.id}] Getting order by id: ${id}`);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid order id' });
    }

    const order = await Order.findById(id).populate('items.product');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Ensure user can only view their own orders
    if (order.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    return res.status(200).json({ success: true, order });
  } catch (err) {
    return next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Authentication required' });
    const userId = user.userId;

    const { id } = req.params;
    const { status } = req.body || {};
    logger.info(`[${req.id}] Updating order status: ${id} -> ${status}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid order id' });
    }

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const validStatuses = ['PENDING', 'PAID', 'FAILED', 'CANCELLED', 'SHIPPED', 'DELIVERED'];
    if (!validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
    }

    order.status = status.toUpperCase();
    await order.save();

    const populated = await Order.findById(order._id).populate('items.product');
    return res.status(200).json({ success: true, order: populated });
  } catch (err) {
    return next(err);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Authentication required' });
    const userId = user.userId;

    const { id } = req.params;
    logger.info(`[${req.id}] Cancelling order: ${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid order id' });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
    }

    if (!['PENDING', 'PAID'].includes(order.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel order with status: ${order.status}` });
    }

    order.status = 'CANCELLED';
    await order.save();

    const populated = await Order.findById(order._id).populate('items.product');
    return res.status(200).json({ success: true, message: 'Order cancelled', order: populated });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
};
