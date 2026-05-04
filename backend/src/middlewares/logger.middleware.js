const logger = require("../utils/logger");

/**
 * Logger Middleware
 * 
 * Logs all incoming HTTP requests with method, URL, and request ID.
 * Also logs response status and duration.
 */
const loggerMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  // Log incoming request
  logger.info(`[${req.id}] ${req.method} ${req.originalUrl} - Started`);
  
  // Log response when finished
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? "error" : "info";
    
    logger[logLevel](
      `[${req.id}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    );
  });
  
  next();
};

module.exports = loggerMiddleware;
