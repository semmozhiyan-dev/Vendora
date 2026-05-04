/**
 * MongoDB Sanitization Middleware
 * 
 * Prevents NoSQL injection attacks by removing $ and . characters
 * from user input that could be used to manipulate MongoDB queries.
 */
const mongoSanitizeMiddleware = (req, res, next) => {
  // Sanitize function to remove dangerous characters
  const sanitize = (obj) => {
    if (obj && typeof obj === "object") {
      for (const key in obj) {
        // Remove keys that start with $ or contain .
        if (key.startsWith("$") || key.includes(".")) {
          delete obj[key];
        } else if (typeof obj[key] === "object") {
          // Recursively sanitize nested objects
          sanitize(obj[key]);
        }
      }
    }
    return obj;
  };

  // Sanitize request body
  if (req.body) {
    req.body = sanitize(req.body);
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = sanitize(req.query);
  }

  // Sanitize URL parameters
  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
};

module.exports = mongoSanitizeMiddleware;
