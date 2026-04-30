const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { createProductSchema, updateProductSchema } = require("../validators/product.validator");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", authMiddleware, validate(createProductSchema), createProduct);
router.put("/:id", authMiddleware, validate(updateProductSchema), updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

module.exports = router;
