const express = require("express");
const authMiddleware = require("../../../middlewares/auth.middleware");
const adminMiddleware = require("../../../middlewares/admin.middleware");

// Controllers
const productController = require("../controllers/admin.product.controller");
const orderController = require("../controllers/admin.order.controller");
const userController = require("../controllers/admin.user.controller");
const dashboardController = require("../controllers/admin.dashboard.controller");

const router = express.Router();

// ===== MIDDLEWARE =====
// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

// ===== PRODUCT ROUTES =====
/**
 * @route   POST /api/v1/admin/products
 * @desc    Create a new product
 * @access  Admin
 */
router.post("/products", productController.createProduct);

/**
 * @route   GET /api/v1/admin/products
 * @desc    Get all products (with pagination)
 * @access  Admin
 */
router.get("/products", productController.getAllProducts);

/**
 * @route   PUT /api/v1/admin/products/:id
 * @desc    Update a product
 * @access  Admin
 */
router.put("/products/:id", productController.updateProduct);

/**
 * @route   DELETE /api/v1/admin/products/:id
 * @desc    Delete a product
 * @access  Admin
 */
router.delete("/products/:id", productController.deleteProduct);

// ===== ORDER ROUTES =====
/**
 * @route   GET /api/v1/admin/orders
 * @desc    Get all orders (with pagination and filters)
 * @access  Admin
 */
router.get("/orders", orderController.getAllOrders);

/**
 * @route   GET /api/v1/admin/orders/:id
 * @desc    Get a specific order
 * @access  Admin
 */
router.get("/orders/:id", orderController.getOrderById);

/**
 * @route   PUT /api/v1/admin/orders/:id/status
 * @desc    Update order status
 * @access  Admin
 */
router.put("/orders/:id/status", orderController.updateOrderStatus);

// ===== USER ROUTES =====
/**
 * @route   GET /api/v1/admin/users
 * @desc    Get all users (with pagination)
 * @access  Admin
 */
router.get("/users", userController.getAllUsers);

/**
 * @route   PUT /api/v1/admin/users/:id/role
 * @desc    Update user role
 * @access  Admin
 */
router.put("/users/:id/role", userController.updateUserRole);

/**
 * @route   DELETE /api/v1/admin/users/:id
 * @desc    Delete a user
 * @access  Admin
 */
router.delete("/users/:id", userController.deleteUser);

// ===== DASHBOARD ROUTES =====
/**
 * @route   GET /api/v1/admin/dashboard
 * @desc    Get dashboard statistics
 * @access  Admin
 */
router.get("/dashboard", dashboardController.getDashboard);

module.exports = router;
