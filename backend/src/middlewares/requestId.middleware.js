const { v4: uuidv4 } = require("uuid");

/**
 * Request ID Middleware
 * 
 * Generates a unique ID for each request for tracking and logging purposes.
 * The ID is attached to the request object and can be used in logs.
 */
const requestIdMiddleware = (req, res, next) => {
  // Generate unique request ID
  req.id = uuidv4();
  
  // Add request ID to response headers for client tracking
  res.setHeader("X-Request-ID", req.id);
  
  next();
};

module.exports = requestIdMiddleware;
