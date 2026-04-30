const mongoose = require("mongoose");

const connectDB = async () => {
  const { DB_URL } = process.env;

  if (!DB_URL) {
    throw new Error("DB_URL is not set in environment variables");
  }

  await mongoose.connect(DB_URL);
  console.log("MongoDB connected");
};

module.exports = connectDB;
