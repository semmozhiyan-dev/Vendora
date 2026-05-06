const adminService = require("../services/admin.service");
const { validateProductInput, validatePaginationParams } = require("../validations/admin.validation");

/**
 * Create Product
 * POST /api/v1/admin/products
 */
exports.createProduct = async (req, res) => {
  try {
    const requestId = req.id || "NO-ID";
    const { name, description, price, stock, category, image } = req.body;

    // Validate input
    const validation = validateProductInput({ name, description, price, stock, category });
    if (!validation.isValid) {
      console.warn(`[${requestId}] Invalid product input: ${JSON.stringify(validation.errors)}`);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    // Create product
    const product = await adminService.createProduct({
      name,
      description,
      price,
      stock,
      category,
      image,
    });

    console.info(`[${requestId}] Product created successfully: ${product._id}`);
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error(`[${req.id || "NO-ID"}] Error creating product: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create product",
    });
  }
};

/**
 * Update Product
 * PUT /api/v1/admin/products/:id
 */
exports.updateProduct = async (req, res) => {
  try {
    const requestId = req.id || "NO-ID";
    const { id } = req.params;
    const updateData = req.body;

    // Validate input
    const validation = validateProductInput({ name: updateData.name || "dummy", ...updateData });
    if (!validation.isValid) {
      console.warn(`[${requestId}] Invalid product input: ${JSON.stringify(validation.errors)}`);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    // Update product
    const product = await adminService.updateProduct(id, updateData);

    console.info(`[${requestId}] Product updated successfully: ${id}`);
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error(`[${req.id || "NO-ID"}] Error updating product: ${error.message}`);
    const statusCode = error.message === "Product not found" ? 404 : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update product",
    });
  }
};

/**
 * Delete Product
 * DELETE /api/v1/admin/products/:id
 */
exports.deleteProduct = async (req, res) => {
  try {
    const requestId = req.id || "NO-ID";
    const { id } = req.params;

    const product = await adminService.deleteProduct(id);

    console.info(`[${requestId}] Product deleted successfully: ${id}`);
    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    console.error(`[${req.id || "NO-ID"}] Error deleting product: ${error.message}`);
    const statusCode = error.message === "Product not found" ? 404 : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to delete product",
    });
  }
};

/**
 * Get All Products
 * GET /api/v1/admin/products
 */
exports.getAllProducts = async (req, res) => {
  try {
    const requestId = req.id || "NO-ID";
    const { page = 1, limit = 10, category, isActive } = req.query;

    // Validate pagination
    const validation = validatePaginationParams(page, limit);
    if (!validation.isValid) {
      console.warn(`[${requestId}] Invalid pagination params: ${JSON.stringify(validation.errors)}`);
      return res.status(400).json({
        success: false,
        message: "Invalid pagination parameters",
        errors: validation.errors,
      });
    }

    const filters = { category, isActive: isActive === "true" };
    const result = await adminService.getAllProducts(page, limit, filters);

    console.info(`[${requestId}] Retrieved ${result.data.length} products`);
    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error(`[${req.id || "NO-ID"}] Error fetching products: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch products",
    });
  }
};
