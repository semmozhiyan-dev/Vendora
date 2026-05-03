const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Create a Razorpay order
router.post('/create-order', /* authMiddleware, */ createOrder);

// Verify a payment signature
router.post('/verify', /* authMiddleware, */ verifyPayment);

module.exports = router;
