const rateLimit = require('express-rate-limit');

const DEFAULT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const DEFAULT_MAX = 100;

const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || DEFAULT_WINDOW_MS;
const max = Number(process.env.RATE_LIMIT_MAX) || DEFAULT_MAX;

const rateLimiter = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: true,
  // Skip rate limiting for health check endpoint
  skip: (req) => req.path === '/health' || req.originalUrl === '/health',
  handler: (req, res /*, next */) => {
    res.status(429).json({ success: false, message: 'Too many requests, try again later' });
  },
});

module.exports = rateLimiter;
