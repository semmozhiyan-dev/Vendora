const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.DB_URL || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("DB_URL or MONGO_URI is not set in environment variables");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
};

module.exports = connectDB;
