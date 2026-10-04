/**
 * 404 Not Found handler
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Centralized Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal Server Error";
  let code = err.code || "INTERNAL_ERROR";

  // Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message = `Invalid resource identifier: ${err.value}`;
    code = "INVALID_ID";
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `A record with this ${field} already exists.`;
    code = "DUPLICATE_ENTRY";
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    code = "VALIDATION_ERROR";
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Invalid or expired authentication token";
    code = "AUTH_TOKEN_ERROR";
  }

  // Multer Errors
  if (err.name === "MulterError") {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File size limit exceeded (maximum 5MB allowed)";
      code = "FILE_TOO_LARGE";
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    code,
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
};

export default {
  notFound,
  errorHandler,
};
