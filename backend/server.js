require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const logger = require("./src/utils/logger");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 8000;
const GRACEFUL_SHUTDOWN_TIMEOUT = 10000; // 10 seconds

let server;

const startServer = async () => {
  try {
    await connectDB();
    logger.info(`Connected to MongoDB`);

    server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });

    // Setup graceful shutdown handlers
    setupGracefulShutdown();
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

const setupGracefulShutdown = () => {
  const shutdown = async (signal) => {
    logger.info(`${signal} received, starting graceful shutdown...`);

    // Stop accepting new connections
    server.close(async () => {
      logger.info(`Server closed, closing database connection...`);

      try {
        // Close MongoDB connection
        await mongoose.connection.close();
        logger.info(`MongoDB connection closed`);
        logger.info(`Graceful shutdown completed`);
        process.exit(0);
      } catch (err) {
        logger.error(`Error during shutdown: ${err.message}`);
        process.exit(1);
      }
    });

    // Force exit after timeout
    setTimeout(() => {
      logger.error(`Graceful shutdown timeout, forcing exit`);
      process.exit(1);
    }, GRACEFUL_SHUTDOWN_TIMEOUT);
  };

  // Handle SIGTERM (Docker, Kubernetes, etc.)
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  // Handle SIGINT (Ctrl+C)
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Handle uncaught exceptions
  process.on("uncaughtException", (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
    process.exit(1);
  });
};

startServer();
