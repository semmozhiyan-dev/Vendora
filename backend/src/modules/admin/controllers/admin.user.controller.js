const adminService = require("../services/admin.service");
const { validateUserRoleUpdate, validatePaginationParams } = require("../validations/admin.validation");

/**
 * Get All Users
 * GET /api/v1/admin/users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const requestId = req.id || "NO-ID";
    const { page = 1, limit = 10, role } = req.query;

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

    const filters = { role };
    const result = await adminService.getAllUsers(page, limit, filters);

    console.info(`[${requestId}] Retrieved ${result.data.length} users`);
    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error(`[${req.id || "NO-ID"}] Error fetching users: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users",
    });
  }
};

/**
 * Update User Role
 * PUT /api/v1/admin/users/:id/role
 */
exports.updateUserRole = async (req, res) => {
  try {
    const requestId = req.id || "NO-ID";
    const { id } = req.params;
    const { role: newRole } = req.body;
    const adminId = req.user?.userId || req.user?.id || req.user?._id || req.adminUser?.id;

    // Check if trying to update self
    if (adminId && id === adminId.toString()) {
      console.warn(`[${requestId}] Admin tried to update their own role`);
      return res.status(403).json({
        success: false,
        message: "Cannot modify your own role",
      });
    }

    // Validate role
    if (!newRole) {
      console.warn(`[${requestId}] Role not provided for user update`);
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    const roleValidation = validateUserRoleUpdate(newRole);
    if (!roleValidation.isValid) {
      console.warn(`[${requestId}] Invalid role: ${newRole}`);
      return res.status(400).json({
        success: false,
        message: roleValidation.error,
      });
    }

    // Update user role
    const user = await adminService.updateUserRole(id, newRole);

    console.info(`[${requestId}] User role updated: ${id} -> ${newRole}`);
    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user,
    });
  } catch (error) {
    console.error(`[${req.id || "NO-ID"}] Error updating user role: ${error.message}`);
    const statusCode = error.message === "User not found" ? 404 : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update user role",
    });
  }
};

/**
 * Delete User
 * DELETE /api/v1/admin/users/:id
 */
exports.deleteUser = async (req, res) => {
  try {
    const requestId = req.id || "NO-ID";
    const { id } = req.params;
    const adminId = req.user?.userId || req.user?.id || req.user?._id || req.adminUser?.id;

    // Check if trying to delete self
    if (adminId && id === adminId.toString()) {
      console.warn(`[${requestId}] Admin tried to delete their own account`);
      return res.status(403).json({
        success: false,
        message: "Cannot delete your own account",
      });
    }

    // Delete user
    const user = await adminService.deleteUser(id);

    console.info(`[${requestId}] User deleted: ${id}`);
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    console.error(`[${req.id || "NO-ID"}] Error deleting user: ${error.message}`);
    const statusCode = error.message === "User not found" ? 404 : 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to delete user",
    });
  }
};
