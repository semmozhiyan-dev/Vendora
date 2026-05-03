const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { addToCartSchema, updateCartItemSchema } = require('../validators/cart.validator');
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cart.controller');

// Apply authentication to all cart routes
router.use(auth);

router.post('/', validate(addToCartSchema), addToCart);
router.get('/', getCart);
router.delete('/clear', clearCart);
router.put('/:productId', validate(updateCartItemSchema), updateCartItem);
router.delete('/:productId', removeCartItem);

module.exports = router;
