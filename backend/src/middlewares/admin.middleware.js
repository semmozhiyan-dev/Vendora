const User = require("../models/user.model");

/**
 * Admin Authorization Middleware
 * 
 * Verifies that the authenticated user has admin role.
 * Must be used AFTER authMiddleware.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const adminMiddleware = async (req, res, next) => {
  try {
    const requestId = req.id || "NO-ID";
    const userId = req.user?.userId || req.user?.id;

    // Check if user is authenticated (should be set by authMiddleware)
    if (!req.user || !userId) {
      console.warn(`[${requestId}] Admin access attempt without authentication`);
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Fetch user from database to verify role
    const user = await User.findById(userId).select("role email name");

    if (!user) {
      console.warn(`[${requestId}] Admin access attempt with invalid user ID: ${userId}`);
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user has admin role
    if (user.role !== "admin") {
      console.warn(`[${requestId}] Unauthorized admin access attempt by user: ${user.email} (role: ${user.role})`);
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    // Attach full user info to request for use in controllers
    req.adminUser = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    console.info(`[${requestId}] Admin access granted to: ${user.email}`);
    return next();
  } catch (error) {
    const requestId = req.id || "NO-ID";
    console.error(`[${requestId}] Error in admin middleware: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authorization",
    });
  }
};

module.exports = adminMiddleware;
