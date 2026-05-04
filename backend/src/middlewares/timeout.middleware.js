/**
 * Timeout Middleware
 * 
 * Sets a timeout for all requests to prevent hanging connections.
 * Default timeout is 30 seconds.
 */
const timeoutMiddleware = (req, res, next) => {
  const timeout = parseInt(process.env.REQUEST_TIMEOUT) || 30000; // 30 seconds default
  
  // Set timeout
  req.setTimeout(timeout, () => {
    res.status(408).json({
      success: false,
      message: "Request timeout",
    });
  });
  
  res.setTimeout(timeout, () => {
    res.status(408).json({
      success: false,
      message: "Response timeout",
    });
  });
  
  next();
};

module.exports = timeoutMiddleware;
