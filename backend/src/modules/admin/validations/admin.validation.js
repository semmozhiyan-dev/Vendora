const validateProductInput = (data) => {
  const errors = {};

  if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
    errors.name = "Product name is required";
  }

  if (!data.description || typeof data.description !== "string" || data.description.trim() === "") {
    errors.description = "Product description is required";
  }

  if (data.price === undefined || typeof data.price !== "number" || data.price < 0) {
    errors.price = "Valid product price is required";
  }

  if (data.stock === undefined || typeof data.stock !== "number" || data.stock < 0) {
    errors.stock = "Valid product stock is required";
  }

  if (!data.category || typeof data.category !== "string" || data.category.trim() === "") {
    errors.category = "Product category is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const validateOrderStatusUpdate = (newStatus) => {
  const validStatuses = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
  const statusFlow = {
    PENDING: ["PAID", "CANCELLED"],
    PAID: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED", "CANCELLED"],
    DELIVERED: [],
    CANCELLED: [],
  };

  if (!validStatuses.includes(newStatus)) {
    return {
      isValid: false,
      error: `Invalid status. Allowed: ${validStatuses.join(", ")}`,
    };
  }

  return { isValid: true };
};

const validateStatusTransition = (currentStatus, newStatus) => {
  const allowedTransitions = {
    PENDING: ["PAID", "CANCELLED"],
    PAID: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED", "CANCELLED"],
    DELIVERED: [],
    CANCELLED: [],
  };

  if (!allowedTransitions[currentStatus] || !allowedTransitions[currentStatus].includes(newStatus)) {
    return {
      isValid: false,
      error: `Cannot transition from ${currentStatus} to ${newStatus}`,
    };
  }

  return { isValid: true };
};

const validateUserRoleUpdate = (role) => {
  const validRoles = ["user", "admin"];

  if (!validRoles.includes(role)) {
    return {
      isValid: false,
      error: `Invalid role. Allowed: ${validRoles.join(", ")}`,
    };
  }

  return { isValid: true };
};

const validatePaginationParams = (page, limit) => {
  const errors = {};

  if (page && (isNaN(page) || page < 1)) {
    errors.page = "Page must be a positive number";
  }

  if (limit && (isNaN(limit) || limit < 1 || limit > 100)) {
    errors.limit = "Limit must be between 1 and 100";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  validateProductInput,
  validateOrderStatusUpdate,
  validateStatusTransition,
  validateUserRoleUpdate,
  validatePaginationParams,
};
