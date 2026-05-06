const logger = require('../utils/logger');

const loggerMiddleware = (req, res, next) => {
  const requestId = req.id || 'NO-ID';
  const { method, url } = req;
  const startTime = Date.now();
  
  // Log incoming request
  logger.info(`[${requestId}] ${method} ${url}`);
  
  // Log response on finish
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const { statusCode } = res;
    logger.info(`[${requestId}] ${statusCode} ${method} ${url} - ${duration}ms`);
  });
  
  next();
};

module.exports = loggerMiddleware;
