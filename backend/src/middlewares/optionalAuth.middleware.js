const jwt = require("jsonwebtoken");

const optionalAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // No auth header - treat as guest
  if (!authHeader) {
    return next();
  }

  const parts = authHeader.split(" ");

  // Invalid format - treat as guest
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return next();
  }

  const token = parts[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
  } catch (error) {
    // Invalid token - treat as guest
  }

  return next();
};

module.exports = optionalAuthMiddleware;
