const Product = require("../../../models/product.model");
const Order = require("../../../models/order.model");
const User = require("../../../models/user.model");

// ===== PRODUCT SERVICES =====

const createProduct = async (data) => {
  try {
    const product = await Product.create(data);
    console.info(`Product created: ${product._id}`);
    return product;
  } catch (error) {
    console.error(`Error creating product: ${error.message}`);
    throw error;
  }
};

const updateProduct = async (productId, data) => {
  try {
    const product = await Product.findByIdAndUpdate(productId, data, { new: true });
    if (!product) {
      throw new Error("Product not found");
    }
    console.info(`Product updated: ${productId}`);
    return product;
  } catch (error) {
    console.error(`Error updating product: ${error.message}`);
    throw error;
  }
};

const deleteProduct = async (productId) => {
  try {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      throw new Error("Product not found");
    }
    console.info(`Product deleted: ${productId}`);
    return product;
  } catch (error) {
    console.error(`Error deleting product: ${error.message}`);
    throw error;
  }
};

const getAllProducts = async (page = 1, limit = 10, filters = {}) => {
  try {
    const skip = (page - 1) * limit;
    const query = {};

    if (filters.category) query.category = filters.category;
    if (filters.isActive !== undefined) query.isActive = filters.isActive;

    const products = await Product.find(query).skip(skip).limit(parseInt(limit));
    const total = await Product.countDocuments(query);

    return {
      data: products,
      pagination: {
        current: page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error(`Error fetching products: ${error.message}`);
    throw error;
  }
};

// ===== ORDER SERVICES =====

const getAllOrders = async (page = 1, limit = 10, filters = {}) => {
  try {
    const skip = (page - 1) * limit;
    const query = {};

    if (filters.status) query.status = filters.status;
    if (filters.userId) query.user = filters.userId;

    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    return {
      data: orders,
      pagination: {
        current: page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error(`Error fetching orders: ${error.message}`);
    throw error;
  }
};

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    // Update the existing order document instead of creating a new one.
    order.status = newStatus;
    await order.save();

    console.info(`Order status updated: ${orderId} -> ${newStatus}`);
    return order;
  } catch (error) {
    console.error(`Error updating order status: ${error.message}`);
    throw error;
  }
};

const getOrderById = async (orderId) => {
  try {
    const order = await Order.findById(orderId)
      .populate("user", "name email")
      .populate("items.product", "name price");

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  } catch (error) {
    console.error(`Error fetching order: ${error.message}`);
    throw error;
  }
};

// ===== USER SERVICES =====

const getAllUsers = async (page = 1, limit = 10, filters = {}) => {
  try {
    const skip = (page - 1) * limit;
    const query = {};

    if (filters.role) query.role = filters.role;

    const users = await User.find(query, "-password").skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 });
    const total = await User.countDocuments(query);

    return {
      data: users,
      pagination: {
        current: page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error(`Error fetching users: ${error.message}`);
    throw error;
  }
};

const updateUserRole = async (userId, newRole) => {
  try {
    const user = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true }).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    console.info(`User role updated: ${userId} -> ${newRole}`);
    return user;
  } catch (error) {
    console.error(`Error updating user role: ${error.message}`);
    throw error;
  }
};

const deleteUser = async (userId) => {
  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      throw new Error("User not found");
    }

    console.info(`User deleted: ${userId}`);
    return user;
  } catch (error) {
    console.error(`Error deleting user: ${error.message}`);
    throw error;
  }
};

const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error(`Error fetching user: ${error.message}`);
    throw error;
  }
};

// ===== DASHBOARD SERVICES =====

const getDashboardStats = async () => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $in: ["PAID", "SHIPPED", "DELIVERED"] } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const recentOrders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 })
      .limit(5);

    return {
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders,
    };
  } catch (error) {
    console.error(`Error fetching dashboard stats: ${error.message}`);
    throw error;
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getUserById,
  getDashboardStats,
};
