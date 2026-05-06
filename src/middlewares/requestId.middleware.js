const { v4: uuidv4 } = require('uuid');

const requestIdMiddleware = (req, res, next) => {
  const requestId = `REQ-${uuidv4()}`;
  
  req.id = requestId;
  res.setHeader('X-Request-ID', requestId);
  
  console.log(`[RequestID Middleware] Assigned ${requestId}`);
  
  next();
};

module.exports = requestIdMiddleware;
