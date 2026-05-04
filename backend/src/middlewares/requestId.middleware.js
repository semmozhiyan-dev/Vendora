const { v4: uuidv4 } = require("uuid");

/**
 * Request ID Middleware
 * 
 * Generates a unique ID for each request for tracking and logging purposes.
 * The ID is attached to the request object and can be used in logs.
 */
const requestIdMiddleware = (req, res, next) => {
  const requestId = `REQ-${uuidv4()}`;

  req.id = requestId;
  res.setHeader("X-Request-ID", requestId);

  next();
};

module.exports = requestIdMiddleware;
