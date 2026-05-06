const logger = require("../utils/logger");

/**
 * Logger Middleware
 * 
 * Logs all incoming HTTP requests with method, URL, and request ID.
 * Also logs response status and duration.
 */
const loggerMiddleware = (req, res, next) => {
  const requestId = req.id || "NO-ID";
  const { method, url } = req;
  const startTime = Date.now();

  // Log incoming request
  logger.info(`[${requestId}] ${method} ${url}`);

  // Log response when finished
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const { statusCode } = res;
    logger.info(`[${requestId}] ${statusCode} ${method} ${url} - ${duration}ms`);
  });

  next();
};

module.exports = loggerMiddleware;
