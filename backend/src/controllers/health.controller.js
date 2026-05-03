const mongoose = require("mongoose");

const healthCheck = (req, res) => {
  const payload = {
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };

  if (mongoose.connection.readyState === 1) {
    payload.dbStatus = "connected";
  }

  res.status(200).json(payload);
};

module.exports = { healthCheck };