"use strict";

const Joi = require("joi");

const createOrderSchema = Joi.object({
  shippingAddress: Joi.object({
    street: Joi.string().trim().optional(),
    city: Joi.string().trim().optional(),
    state: Joi.string().trim().optional(),
    zip: Joi.string().trim().optional(),
    country: Joi.string().trim().optional(),
  }).optional(),
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().hex().length(24).required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .optional(),
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid("PENDING", "PAID", "FAILED", "CANCELLED", "SHIPPED", "DELIVERED")
    .required(),
});

const verifyPaymentSchema = Joi.object({
  razorpay_order_id: Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required(),
});

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema,
  verifyPaymentSchema,
};
