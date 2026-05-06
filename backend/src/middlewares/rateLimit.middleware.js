const rateLimit = require("express-rate-limit");

const DEFAULT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_MAX = 100;

const parsePositiveInteger = (value, fallback) => {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const windowMs = parsePositiveInteger(process.env.RATE_LIMIT_WINDOW_MS, DEFAULT_WINDOW_MS);
const max = parsePositiveInteger(process.env.RATE_LIMIT_MAX, DEFAULT_MAX);

const rateLimiter = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: true,
  skip: (req) => req.path === "/health" || req.originalUrl === "/health",
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many requests, try again later",
    });
  },
});

module.exports = rateLimiter;