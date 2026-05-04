const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./modules/admin/routes/admin.routes");
const requestIdMiddleware = require("./middlewares/requestId.middleware");
const loggerMiddleware = require("./middlewares/logger.middleware");
const timeoutMiddleware = require("./middlewares/timeout.middleware");
const mongoSanitizeMiddleware = require("./middlewares/mongoSanitize.middleware");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

// ========== MIDDLEWARE CHAIN ORDER ==========

// 0. Security Headers
app.use(helmet());

// 1. CORS
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5000",
];

app.use(
  cors({
    origin: (origin, callback) => {
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

// 3. NoSQL Injection Protection
app.use(mongoSanitizeMiddleware);

// 4. Request ID
app.use(requestIdMiddleware);

// 5. Logger
app.use(loggerMiddleware);

// 6. Request Timeout
app.use(timeoutMiddleware);

// ========== ROUTES ==========
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running...",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);

// ========== ERROR HANDLING (MUST BE LAST) ==========
app.use(notFound);
app.use(errorHandler);

module.exports = app;
