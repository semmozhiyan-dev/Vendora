const mongoose = require("mongoose");

const connectDB = async () => {
  const DB_URL = process.env.DB_URL || process.env.MONGO_URI;

  if (!DB_URL) {
    throw new Error("DB_URL or MONGO_URI is not set in environment variables");
  }

  await mongoose.connect(DB_URL);
  console.log("MongoDB connected");
};

module.exports = connectDB;
