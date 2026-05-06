const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const requestId = req.id || 'NO-ID';
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log(`[${requestId}] Auth failed: Authorization header missing`);
    return res.status(401).json({
      success: false,
      message: "Authorization header missing",
    });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    console.log(`[${requestId}] Auth failed: Invalid authorization header format`);
    return res.status(401).json({
      success: false,
      message: "Invalid authorization header format",
    });
  }

  const token = parts[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.log(`[${requestId}] Auth failed: JWT_SECRET is not configured`);
    return res.status(500).json({
      success: false,
      message: "JWT_SECRET is not configured",
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    console.log(`[${requestId}] Auth success: userId=${decoded.userId}`);
    req.user = decoded;
    return next();
  } catch (error) {
    console.log(`[${requestId}] Auth failed: Invalid/expired token -`, error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;
