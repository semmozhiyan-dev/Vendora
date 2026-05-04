"use strict";

const mongoose = require('mongoose');
const Cart = require('../models/cart.model');
const logger = require('../utils/logger');

let Product = null;
try {
  Product = require('../models/product.model');
} catch (err) {
  // Product model might not exist yet; Product existence checks will be skipped
}

const findOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

const addToCart = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Authentication required' });
    const userId = user.userId;

    const { productId, quantity = 1 } = req.body || {};
      logger.info(`[${req.id}] Adding product to cart: ${productId}, qty=${quantity}`);
    if (!req.body) {
      return res.status(400).json({ success: false, message: 'Request body is required' });
    }
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid productId' });
    }

    const qty = Number(quantity) || 1;
    if (qty < 1) return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });

    if (Product) {
      const exists = await Product.findById(productId).lean();
      if (!exists) return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const cart = await findOrCreateCart(userId);

    const existingIndex = cart.items.findIndex((it) => it.product.equals(productId));
    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += qty;
    } else {
      cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.product');
    return res.status(200).json({ success: true, cart: populated });
  } catch (err) {
    return next(err);
  }
};

const getCart = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Authentication required' });
      logger.info(`[${req.id}] Fetching user cart`);
    const userId = user.userId;

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) return res.status(200).json({ success: true, items: [] });
    return res.status(200).json({ success: true, cart });
  } catch (err) {
    return next(err);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Authentication required' });
    const userId = user.userId;

    const { productId } = req.params;
    const { quantity } = req.body || {};
      logger.info(`[${req.id}] Updating cart item: ${productId}, qty=${quantity}`);
    if (!req.body) {
      return res.status(400).json({ success: false, message: 'Request body is required' });
    }

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid productId' });
    }

    const qty = Number(quantity);
    if (Number.isNaN(qty) || qty < 0) return res.status(400).json({ success: false, message: 'Invalid quantity' });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const itemIndex = cart.items.findIndex((it) => it.product.equals(productId));
    if (itemIndex === -1) return res.status(404).json({ success: false, message: 'Item not found in cart' });

    if (qty === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = Math.max(1, qty);
    }

    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.product');
    return res.status(200).json({ success: true, cart: populated });
  } catch (err) {
    return next(err);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Authentication required' });
    const userId = user.userId;

    const { productId } = req.params;
    logger.info(`[${req.id}] Removing item from cart: ${productId}`);
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid productId' });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const before = cart.items.length;
    cart.items = cart.items.filter((it) => !it.product.equals(productId));
    if (cart.items.length === before) return res.status(404).json({ success: false, message: 'Item not found in cart' });

    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.product');
    return res.status(200).json({ success: true, cart: populated });
  } catch (err) {
    return next(err);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: 'Authentication required' });
    const userId = user.userId;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(200).json({ success: true, items: [] });

    cart.items = [];
    await cart.save();
    return res.status(200).json({ success: true, cart });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
