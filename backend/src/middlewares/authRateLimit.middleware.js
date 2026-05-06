const rateLimit = require("express-rate-limit");

const authRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // 30 failed auth attempts per IP per hour
  skipSuccessfulRequests: true, // Only count failures
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts from this IP. Try again in 1 hour.",
  },
});

module.exports = authRateLimiter;
