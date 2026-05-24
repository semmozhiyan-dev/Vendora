const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");
const mongoSanitizeMiddleware = require("./middlewares/mongoSanitize.middleware");
const requestIdMiddleware = require("./middlewares/requestId.middleware");
const loggerMiddleware = require("./middlewares/logger.middleware");
const timeoutMiddleware = require("./middlewares/timeout.middleware");
const rateLimitMiddleware = require("./middlewares/rateLimit.middleware");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const usersRoutes = require("./routes/users.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const testRoutes = require("./routes/test.routes"); // Temporary test routes
const adminRoutes = require("./modules/admin/routes/admin.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();
const PRODUCTION_FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://3.105.71.141:80";
const PRODUCTION_SITE_ORIGIN = "http://3.105.71.141";

// ========== MIDDLEWARE CHAIN ORDER ==========

// 0. Security Headers
app.use(helmet());

// 1. CORS - Configure allowed origins
const allowedOrigins = new Set(
  [
    PRODUCTION_FRONTEND_ORIGIN,
    PRODUCTION_SITE_ORIGIN,
    process.env.FRONTEND_URL,
    process.env.FRONTEND_ORIGIN,
    "http://localhost:5173", // Vite default
    "http://localhost:5174", // Vite alternate port
    "http://localhost:5000",
    "http://localhost",
    "http://localhost:80",
  ].filter(Boolean)
);

const corsOptionsDelegate = (req, callback) => {
  const origin = req.header("Origin");

  // Allow requests with no origin (mobile apps, Postman, curl, same-origin non-browser requests)
  if (!origin) {
    return callback(null, { 
      origin: true, 
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Skip-Loading"],
    });
  }

    let isAllowed = allowedOrigins.has(origin);

  if (!isAllowed) {
    try {
      const originUrl = new URL(origin);
      const originHostname = originUrl.hostname;
      const originPort = originUrl.port;
      const requestHostname = req.hostname;
      const xForwardedHost = req.get('x-forwarded-host');
      
      // Allow same-hostname requests (for any IP or domain)
      // Also check x-forwarded-host for proxied requests
      isAllowed = originHostname === requestHostname || 
                  originHostname === xForwardedHost ||
                  requestHostname === 'localhost' ||
                  requestHostname.includes('127.0.0.1') ||
                  requestHostname.includes('backend') ||
                  originHostname.includes('172.') || // Private IPs (AWS, Docker, etc.)
                  originHostname.includes('192.168') || // Private IPs
                  originHostname.includes('localhost') ||
                  originHostname.includes('127.0.0.1');
    } catch (error) {
      isAllowed = false;
    }
  }

  callback(null, {
    origin: isAllowed ? origin : false,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Skip-Loading"],
  });
};

app.use(cors(corsOptionsDelegate));

// 2. Body Parser (JSON)
app.use(express.json({ limit: "10mb" }));

// 3. NoSQL Injection Protection (custom middleware for Express 5 compatibility)
app.use(mongoSanitizeMiddleware);

// 4. Request ID
app.use(requestIdMiddleware);

// 5. Logger
app.use(loggerMiddleware);

// 6. Request Timeout
app.use(timeoutMiddleware);

// ========== ROUTES ==========
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "API is running..." });
});

app.get("/api/metrics", (req, res) => {
  res.status(200).json({
    success: true,
    service: "vendora-backend",
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    dbStatus: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use("/health", healthRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", rateLimitMiddleware);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/payment", paymentRoutes); // Add alias for backward compatibility
app.use("/api/v1/admin", adminRoutes);

// ⚠️ TEMPORARY TEST ROUTES - Remove before production
app.use("/api/v1/test", testRoutes);

// ========== ERROR HANDLING (MUST BE LAST) ==========
app.use(notFound);
app.use(errorHandler);

module.exports = app;
