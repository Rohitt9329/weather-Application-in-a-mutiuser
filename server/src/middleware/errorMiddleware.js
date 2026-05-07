const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || res.statusCode || 500;

  if (error.code === 11000) {
    return res.status(409).json({ message: "This record already exists" });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource id" });
  }

  return res.status(statusCode === 200 ? 500 : statusCode).json({
    message: error.message || "Something went wrong",
  });
};

module.exports = { errorHandler, notFound };
