const logger = require('../utils/logger');

const DEFAULT_TIMEOUT_MS = 10000;

const timeoutMiddleware = (req, res, next) => {
  const requestId = req.id || 'NO-ID';
  const timeoutMs = parseInt(process.env.REQUEST_TIMEOUT_MS, 10) || DEFAULT_TIMEOUT_MS;

  let timeoutId;
  let hasResponded = false;

  // Handle response finish to clear the timer
  const cleanup = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  res.on('finish', cleanup);
  res.on('close', cleanup);

  // Set the timeout
  timeoutId = setTimeout(() => {
    if (!hasResponded && !res.headersSent) {
      hasResponded = true;
      logger.warn(
        `[${requestId}] Request timeout after ${timeoutMs}ms`
      );
      res.status(503).json({
        success: false,
        message: 'Request timeout'
      });
    }
  }, timeoutMs);

  // Also use Node's built-in setTimeout
  req.setTimeout(timeoutMs, () => {
    if (!hasResponded && !res.headersSent) {
      hasResponded = true;
      logger.warn(
        `[${requestId}] Request timeout after ${timeoutMs}ms (socket timeout)`
      );
      res.status(503).json({
        success: false,
        message: 'Request timeout'
      });
    }
  });

  next();
};

module.exports = timeoutMiddleware;
