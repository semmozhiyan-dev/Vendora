"use strict";

const mongoose = require('mongoose');
const logger = require('../utils/logger');
const Product = require('../models/product.model');

const createProduct = async (req, res, next) => {
  try {
    const { name, description = '', price, stock = 0 } = req.body || {};
  logger.info(`[${req.id}] Creating product: ${name}`);

    if (!req.body) {
      return res.status(400).json({ success: false, message: 'Request body is required' });
    }

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name and price are required' });
    }

    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ success: false, message: 'Price must be a positive number' });
    }

    const numericStock = Number(stock) || 0;
    if (numericStock < 0) {
      return res.status(400).json({ success: false, message: 'Stock cannot be negative' });
    }

    const createdBy = req.user && req.user.userId;

    const product = await Product.create({
      name,
      description,
      price: numericPrice,
      stock: numericStock,
      createdBy
    });

    return res.status(201).json({ success: true, product });
  } catch (err) {
    return next(err);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;
  logger.info(`[${req.id}] Fetching products: page=${page}, limit=${limit}`);

    const [items, total] = await Promise.all([
      Product.find().skip(skip).limit(limit).lean(),
      Product.countDocuments()
    ]);

    return res.status(200).json({ success: true, page, limit, total, items });
  } catch (err) {
    return next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
      logger.info(`[${req.id}] Getting product by id: ${id}`);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product id' });
    }

    const product = await Product.findById(id).lean();
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    return res.status(200).json({ success: true, product });
  } catch (err) {
    return next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`[${req.id}] Updating product: ${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product id' });
    }

    const updates = {};
    const { name, description, price, stock } = req.body || {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) {
      const numericPrice = Number(price);
      if (Number.isNaN(numericPrice) || numericPrice <= 0) {
        return res.status(400).json({ success: false, message: 'Price must be a positive number' });
      }
      updates.price = numericPrice;
    }
    if (stock !== undefined) {
      const numericStock = Number(stock);
      if (Number.isNaN(numericStock) || numericStock < 0) {
        return res.status(400).json({ success: false, message: 'Stock must be a non-negative number' });
      }
      updates.stock = numericStock;
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    Object.assign(product, updates);
    await product.save();

    return res.status(200).json({ success: true, product });
  } catch (err) {
    return next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    logger.info(`[${req.id}] Deleting product: ${id}`);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product id' });
    }

    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    return res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
