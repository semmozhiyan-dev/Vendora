const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitizeMiddleware = require("./middlewares/mongoSanitize.middleware");
const requestIdMiddleware = require("./middlewares/requestId.middleware");
const loggerMiddleware = require("./middlewares/logger.middleware");
const rateLimitMiddleware = require("./middlewares/rateLimit.middleware");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();

// ========== MIDDLEWARE CHAIN ORDER ==========

// 0. Security Headers
app.use(helmet());

// 1. CORS - Configure allowed origins
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "http://localhost:5173", // Vite default
  "http://localhost:5000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 2. Body Parser (JSON)
app.use(express.json({ limit: "10mb" }));

// 3. NoSQL Injection Protection (custom middleware for Express 5 compatibility)
app.use(mongoSanitizeMiddleware);

// 4. Request ID
app.use(requestIdMiddleware);

// 5. Logger
app.use(loggerMiddleware);

// ========== ROUTES ==========
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "API is running..." });
});

app.use("/health", healthRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", rateLimitMiddleware);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/payment", paymentRoutes); // Add alias for backward compatibility

// ========== ERROR HANDLING (MUST BE LAST) ==========
app.use(notFound);
app.use(errorHandler);

module.exports = app;
