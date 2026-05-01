const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.middleware');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

// Public: list and detail
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected: create, update, delete
router.post('/', auth, createProduct);
router.put('/:id', auth, updateProduct);
router.delete('/:id', auth, deleteProduct);

module.exports = router;
