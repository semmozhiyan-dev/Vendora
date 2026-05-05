"use strict";

const mongoose = require('mongoose');
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const logger = require('../utils/logger');
const { sendEmail } = require('../services/mail.service');
const { orderPlacedTemplate, orderShippedTemplate, orderDeliveredTemplate } = require('../templates/emailTemplates');

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
      shippingAddress: shippingAddress || {},
      timeline: [
        {
          status: 'PENDING',
          timestamp: new Date()
        }
      ]
    });

    const populated = await Order.findById(order._id).populate('items.product');
    
    // Send order placed email (non-blocking)
    const User = require('../models/user.model');
    const userDoc = await User.findById(userId);
    if (userDoc && userDoc.email) {
      console.log(`[ORDER] Sending order placed email to: ${userDoc.email}`);
      sendEmail(userDoc.email, 'Order Placed Successfully - Vendora', orderPlacedTemplate(userDoc.name || 'Customer', order._id));
    } else {
      console.log(`[ORDER] User email not found for userId: ${userId}`);
    }
    
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
    const MAX_LIMIT = 50;
    const limit = Math.min(MAX_LIMIT, Math.max(1, Number(req.query.limit) || 10));
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

const getMyOrders = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const userId = user.userId;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    logger.info(`[${req.id}] Fetching my orders: page=${page}, limit=${limit}`);

    const [items, total] = await Promise.all([
      Order.find({ user: userId })
        .select('status timeline items totalAmount createdAt updatedAt trackingId estimatedDelivery shippingAddress')
        .populate('items.product')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments({ user: userId }),
    ]);

    return res.status(200).json({
      success: true,
      page,
      limit,
      total,
      items,
    });
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
    const isAdmin = user.role === 'admin';

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

    // Only admin or order owner can update
    if (order.user.toString() !== userId && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
    }

    const newStatus = status.toUpperCase();
    const currentStatus = order.status;

    // Validate status transitions
    const validTransitions = {
      PENDING: ['PAID', 'FAILED', 'CANCELLED'],
      PAID: ['SHIPPED', 'CANCELLED'],
      SHIPPED: ['DELIVERED'],
      DELIVERED: [], // Final state
      FAILED: [], // Final state
      CANCELLED: [] // Final state
    };

    // Check if transition is valid
    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${currentStatus} to ${newStatus}. Valid transitions: ${validTransitions[currentStatus]?.join(', ') || 'None (final state)'}`
      });
    }

    order.status = newStatus;
    
    // Generate tracking ID when order is shipped
    if (newStatus === 'SHIPPED' && !order.trackingId) {
      const timestamp = Date.now().toString(36).toUpperCase();
      const random = Math.random().toString(36).substring(2, 7).toUpperCase();
      order.trackingId = `TRK-${timestamp}-${random}`;
      
      // Set estimated delivery (3 to 5 days from now)
      const daysToAdd = Math.floor(Math.random() * 3) + 3; // Random between 3-5
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + daysToAdd);
      order.estimatedDelivery = estimatedDate;
    }
    
    // Add to timeline
    order.timeline.push({
      status: newStatus,
      timestamp: new Date()
    });
    
    await order.save();

    const populated = await Order.findById(order._id).populate('items.product');
    
    // Send email based on status change (non-blocking)
    const orderUser = await require('../models/user.model').findById(order.user);
    if (orderUser && orderUser.email) {
      console.log(`[ORDER STATUS] Status changed to ${newStatus}, sending email to: ${orderUser.email}`);
      if (newStatus === 'SHIPPED') {
        sendEmail(orderUser.email, 'Your Order Has Shipped - Vendora', orderShippedTemplate(orderUser.name || 'Customer', order._id, order.trackingId));
      } else if (newStatus === 'DELIVERED') {
        sendEmail(orderUser.email, 'Order Delivered - Vendora', orderDeliveredTemplate(orderUser.name || 'Customer', order._id));
      }
    } else {
      console.log(`[ORDER STATUS] User email not found for order: ${order._id}`);
    }
    
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
    
    // Add to timeline
    order.timeline.push({
      status: 'CANCELLED',
      timestamp: new Date()
    });
    
    await order.save();

    const populated = await Order.findById(order._id).populate('items.product');
    return res.status(200).json({ success: true, message: 'Order cancelled', order: populated });
  } catch (err) {
    return next(err);
  }
};

const getOrderTracking = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Authentication required' });
    const userId = user.userId;
    const isAdmin = user.role === 'admin';

    const { id } = req.params;
    logger.info(`[${req.id}] Getting order tracking: ${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid order id' });
    }

    const order = await Order.findById(id).lean();
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    // Only owner or admin can access
    if (order.user.toString() !== userId && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this tracking information' });
    }

    const trackingInfo = {
      orderId: order._id,
      status: order.status,
      trackingId: order.trackingId || null,
      estimatedDelivery: order.estimatedDelivery || null,
      timeline: order.timeline || []
    };

    return res.status(200).json({ success: true, tracking: trackingInfo });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getOrderTracking
};
