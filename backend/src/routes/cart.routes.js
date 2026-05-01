const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.middleware');
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cart.controller');

// Apply authentication to all cart routes
router.use(auth);

router.post('/', addToCart);
router.get('/', getCart);
router.put('/:productId', updateCartItem);
router.delete('/:productId', removeCartItem);
router.delete('/', clearCart);

module.exports = router;
