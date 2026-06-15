const mongoose = require("mongoose");
const dns = require("dns");
const logger = require("../utils/logger");

dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);

const connectDB = async () => {
  const DB_URL = process.env.DB_URL || process.env.MONGO_URI;

  if (!DB_URL) {
    throw new Error("DB_URL or MONGO_URI is not set in environment variables");
  }

  await mongoose.connect(DB_URL);
  logger.info("MongoDB connected");
};

module.exports = connectDB;
