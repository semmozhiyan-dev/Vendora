const adminService = require("../services/admin.service");
const { validateStatusTransition, validatePaginationParams } = require("../validations/admin.validation");

/**
 * Get All Orders
 * GET /api/v1/admin/orders
 */
exports.getAllOrders = async (req, res) => {
  try {
    const requestId = req.id || "NO-ID";
    const { page = 1, limit = 10, status, userId } = req.query;

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

    const filters = { status, userId };
    const result = await adminService.getAllOrders(page, limit, filters);

    console.info(`[${requestId}] Retrieved ${result.data.length} orders`);
    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error(`[${req.id || "NO-ID"}] Error fetching orders: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders",
    });
  }
};

/**
 * Get Order by ID
 * GET /api/v1/admin/orders/:id
 */
exports.getOrderById = async (req, res) => {
  try {
    const requestId = req.id || "NO-ID";
    const { id } = req.params;

    const order = await adminService.getOrderById(id);

    console.info(`[${requestId}] Order retrieved: ${id}`);
    return res.status(200).json({
      success: true,
      message: "Order retrieved successfully",
      data: order,
    });
  } catch (error) {
    console.error(`[${req.id || "NO-ID"}] Error fetching order: ${error.message}`);
    const statusCode = error.message === "Order not found" ? 404 : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to fetch order",
    });
  }
};

/**
 * Update Order Status
 * PUT /api/v1/admin/orders/:id/status
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const requestId = req.id || "NO-ID";
    const { id } = req.params;
    const { status: newStatus } = req.body;

    if (!newStatus) {
      console.warn(`[${requestId}] Status not provided for order update`);
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    // Get current order to validate transition
    const order = await adminService.getOrderById(id);
    const currentStatus = order.status;

    // Validate status transition
    const transitionValidation = validateStatusTransition(currentStatus, newStatus);
    if (!transitionValidation.isValid) {
      console.warn(`[${requestId}] Invalid status transition: ${currentStatus} -> ${newStatus}`);
      return res.status(400).json({
        success: false,
        message: transitionValidation.error,
      });
    }

    // Update order status
    const updatedOrder = await adminService.updateOrderStatus(id, newStatus);

    console.info(`[${requestId}] Order status updated: ${id} (${currentStatus} -> ${newStatus})`);
    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error(`[${req.id || "NO-ID"}] Error updating order status: ${error.message}`);
    const statusCode = error.message === "Order not found" ? 404 : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update order status",
    });
  }
};
