const adminService = require("../services/admin.service");

/**
 * Get Dashboard Statistics
 * GET /api/v1/admin/dashboard
 */
exports.getDashboard = async (req, res) => {
  try {
    const requestId = req.id || "NO-ID";

    const stats = await adminService.getDashboardStats();

    console.info(`[${requestId}] Dashboard stats retrieved`);
    return res.status(200).json({
      success: true,
      message: "Dashboard stats retrieved successfully",
      data: {
        totalUsers: stats.totalUsers,
        totalOrders: stats.totalOrders,
        totalRevenue: stats.totalRevenue,
        recentOrders: stats.recentOrders,
      },
    });
  } catch (error) {
    console.error(`[${req.id || "NO-ID"}] Error fetching dashboard stats: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch dashboard stats",
    });
  }
};
