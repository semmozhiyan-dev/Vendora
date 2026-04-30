const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  if (err && err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid resource id",
    });
  }

  if (err && err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate key error",
    });
  }

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

module.exports = {
  notFound,
  errorHandler,
};
