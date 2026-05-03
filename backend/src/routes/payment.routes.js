"use strict";

const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { verifyPaymentSchema } = require("../validators/order.validator");
const { createRazorpayOrder, verifyPayment, handleWebhook } = require("../controllers/payment.controller");

// Webhook route with raw body parser (must be first, before any JSON parsing)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

// All other routes use JSON body (parsed by app.js express.json())
router.post("/create-order", auth, createRazorpayOrder);
router.post("/verify", auth, validate(verifyPaymentSchema), verifyPayment);

module.exports = router;
