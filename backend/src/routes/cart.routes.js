const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.middleware');
const optionalAuth = require('../middlewares/optionalAuth.middleware');
const validate = require('../middlewares/validate.middleware');
const { addToCartSchema, updateCartItemSchema } = require('../validators/cart.validator');
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cart.controller');

// GET cart with optional auth (works for both guests and logged-in users)
router.get('/', optionalAuth, getCart);

// Protect all mutations
router.use(auth);
router.post('/', validate(addToCartSchema), addToCart);
router.delete('/clear', clearCart);
router.put('/:productId', validate(updateCartItemSchema), updateCartItem);
router.delete('/:productId', removeCartItem);

module.exports = router;
