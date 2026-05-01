const logger = require('../utils/logger');

const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};

const errorHandler = (err, req, res, next) => {
  const requestId = req?.id || 'NO-ID';
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  if (err && err.code === 11000) {
    logger.error(`[${requestId}] ERROR: User already exists`, { 
      statusCode: 409, 
      stack: err.stack 
    });
    return res.status(409).json({
      success: false,
      message: "User already exists",
    });
  }

  logger.error(`[${requestId}] ERROR: ${err.message || 'Internal server error'}`, { 
    statusCode, 
    stack: err.stack 
  });

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

module.exports = {
  notFound,
  errorHandler,
};
