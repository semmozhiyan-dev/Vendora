const express = require("express");
const cors = require("cors");
const requestIdMiddleware = require("./middlewares/requestId.middleware");
const loggerMiddleware = require("./middlewares/logger.middleware");
const authRoutes = require("./routes/auth.routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

// ========== MIDDLEWARE CHAIN ORDER ==========

// 1. CORS
app.use(cors());

// 2. Body Parser
app.use(express.json());

// 3. Request ID (attach unique ID to every request)
app.use(requestIdMiddleware);

// 4. Logger (log all requests with ID and response time)
app.use(loggerMiddleware);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running...",
  });
});

const cartRoutes = require("./routes/cart.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");

// ========== ROUTES ==========
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);

// ========== ERROR HANDLING (MUST BE LAST) ==========
app.use(notFound);
app.use(errorHandler);

module.exports = app;
