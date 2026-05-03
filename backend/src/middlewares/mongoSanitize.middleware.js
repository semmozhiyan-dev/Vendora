/**
 * Custom NoSQL Injection Sanitizer for Express 5
 * Removes $ characters and . at the start of keys to prevent MongoDB operator injection
 * Preserves . in values (for emails, decimals, etc.)
 */

const sanitize = (obj, isKey = false) => {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    // For keys: remove $ and . to prevent operators like $where, $ne, etc.
    if (isKey) {
      return obj.replace(/[$\.]/g, '');
    }
    // For values: only remove $ to prevent injection, keep . for emails/decimals
    return obj.replace(/\$/g, '');
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitize(item, false));
  }
  
  if (typeof obj === 'object') {
    const sanitized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Sanitize the key (remove $ and .)
        const sanitizedKey = sanitize(key, true);
        // Sanitize the value (only remove $)
        sanitized[sanitizedKey] = sanitize(obj[key], false);
      }
    }
    return sanitized;
  }
  
  return obj;
};

const mongoSanitizeMiddleware = (req, res, next) => {
  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.params) {
    req.params = sanitize(req.params);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  next();
};

module.exports = mongoSanitizeMiddleware;
