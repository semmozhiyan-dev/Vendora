const mongoose = require("mongoose");
const Product = require("../models/product.model");

const isValidNumber = (value) => typeof value === "number" && Number.isFinite(value);

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

const parseNonNegativeNumber = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }
  return parsed;
};

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock } = req.body;

    const product = await Product.create({
      name: name.trim(),
      description: typeof description === "string" ? description.trim() : "",
      price: parseNonNegativeNumber(price),
      stock: stock === undefined ? 0 : parseNonNegativeNumber(stock),
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const { page: pageQuery, limit: limitQuery, minPrice: minPriceQuery, maxPrice: maxPriceQuery } =
      req.query;

    if (pageQuery !== undefined) {
      const parsedPage = Number.parseInt(pageQuery, 10);
      if (Number.isNaN(parsedPage) || parsedPage <= 0) {
        return res.status(400).json({
          success: false,
          message: "page must be a positive integer",
        });
      }
    }

    if (limitQuery !== undefined) {
      const parsedLimit = Number.parseInt(limitQuery, 10);
      if (Number.isNaN(parsedLimit) || parsedLimit <= 0) {
        return res.status(400).json({
          success: false,
          message: "limit must be a positive integer",
        });
      }
    }

    const page = parsePositiveInt(pageQuery, 1);
    const limit = Math.min(parsePositiveInt(limitQuery, 10), 100);
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.name) {
      filter.name = { $regex: req.query.name, $options: "i" };
    }

    if (minPriceQuery !== undefined || maxPriceQuery !== undefined) {
      filter.price = {};

      if (minPriceQuery !== undefined) {
        const minPrice = parseNonNegativeNumber(minPriceQuery);
        if (minPrice === null) {
          return res.status(400).json({
            success: false,
            message: "minPrice must be a non-negative number",
          });
        }
        filter.price.$gte = minPrice;
      }

      if (maxPriceQuery !== undefined) {
        const maxPrice = parseNonNegativeNumber(maxPriceQuery);
        if (maxPrice === null) {
          return res.status(400).json({
            success: false,
            message: "maxPrice must be a non-negative number",
          });
        }
        filter.price.$lte = maxPrice;
      }

      if (filter.price.$gte !== undefined && filter.price.$lte !== undefined) {
        if (filter.price.$gte > filter.price.$lte) {
          return res.status(400).json({
            success: false,
            message: "minPrice cannot be greater than maxPrice",
          });
        }
      }
    }

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      products,
    });
  } catch (error) {
    return next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const allowedFields = ["name", "description", "price", "stock"];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    if (updates.name !== undefined) {
      updates.name = updates.name.trim();
    }

    if (updates.description !== undefined) {
      updates.description = updates.description.trim();
    }

    if (updates.price !== undefined) {
      updates.price = parseNonNegativeNumber(updates.price);
    }

    if (updates.stock !== undefined) {
      updates.stock = parseNonNegativeNumber(updates.stock);
    }

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product id",
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
