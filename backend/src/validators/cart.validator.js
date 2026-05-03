"use strict";

const Joi = require("joi");

const addToCartSchema = Joi.object({
  productId: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid product ID format",
    "string.length": "Invalid product ID format",
    "string.empty": "Product ID is required",
  }),
  quantity: Joi.number().integer().min(1).default(1).messages({
    "number.min": "Quantity must be at least 1",
    "number.integer": "Quantity must be an integer",
  }),
});

const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(0).required().messages({
    "number.min": "Quantity must be at least 0",
    "number.integer": "Quantity must be an integer",
    "any.required": "Quantity is required",
  }),
});

module.exports = {
  addToCartSchema,
  updateCartItemSchema,
};
