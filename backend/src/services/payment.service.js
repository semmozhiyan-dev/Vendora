const crypto = require('crypto');
const razorpay = require('../config/razorpay');

async function createRazorpayOrder(amountPaise, currency = 'INR', receipt) {
  if (!amountPaise || isNaN(amountPaise) || Number(amountPaise) <= 0) {
    throw new Error('Invalid amount for Razorpay order');
  }

  const options = {
    amount: Number(amountPaise),
    currency,
    receipt: receipt || `rcpt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);
  return order;
}

function verifySignature({ orderId, paymentId, signature }) {
  if (!orderId || !paymentId || !signature) return false;
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const generated = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return generated === signature;
}

module.exports = { createRazorpayOrder, verifySignature };
