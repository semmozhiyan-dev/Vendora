const Razorpay = require('razorpay');

let razorpay = null;

// Lazily initialize Razorpay only when keys are available
function getRazorpay() {
  if (!razorpay) {
    const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay keys missing: set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment');
    }
    razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
}

// Check if keys are available
function isRazorpayAvailable() {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  return !!(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);
}

module.exports = {
  getRazorpay,
  isRazorpayAvailable,
};

