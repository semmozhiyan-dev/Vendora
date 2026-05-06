const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createProductSchema, updateProductSchema } = require('../validators/product.validator');
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
router.post('/', auth, validate(createProductSchema), createProduct);
router.put('/:id', auth, validate(updateProductSchema), updateProduct);
router.delete('/:id', auth, deleteProduct);

module.exports = router;
