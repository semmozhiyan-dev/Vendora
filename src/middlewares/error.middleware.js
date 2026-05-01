const logger = require('../utils/logger');

const errorMiddleware = (err, req, res, next) => {
  const requestId = req?.id || 'NO-ID';
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  logger.error(`[${requestId}] ERROR: ${message}`, { 
    statusCode, 
    stack: err.stack 
  });
  
  res.status(statusCode).json({
    success: false,
    message: message
  });
};

module.exports = errorMiddleware;
