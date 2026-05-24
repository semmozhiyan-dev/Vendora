const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const authMiddleware = (req, res, next) => {
  const requestId = req.id || 'NO-ID';
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    logger.info(`[${requestId}] Auth failed: Authorization header missing`);
    return res.status(401).json({
      success: false,
      message: "Authorization header missing",
    });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    logger.info(`[${requestId}] Auth failed: Invalid authorization header format`);
    return res.status(401).json({
      success: false,
      message: "Invalid authorization header format",
    });
  }

  const token = parts[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    logger.error(`[${requestId}] Auth failed: JWT_SECRET is not configured`);
    return res.status(500).json({
      success: false,
      message: "JWT_SECRET is not configured",
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    logger.info(`[${requestId}] Auth success: userId=${decoded.userId}`);
    req.user = decoded;
    return next();
  } catch (error) {
    logger.info(`[${requestId}] Auth failed: Invalid/expired token - ${error.message}`);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;
