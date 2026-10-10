export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode =
    Number.isInteger(err.statusCode) &&
    err.statusCode >= 400 &&
    err.statusCode <= 599
      ? err.statusCode
      : 500;

  if (statusCode >= 500) {
    console.error("[TIVA ERROR]", err.message || "Unknown server error");
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: statusCode === 500 ? "INTERNAL_SERVER_ERROR" : "REQUEST_ERROR",
      message:
        statusCode === 500
          ? "Something went wrong. Please try again later."
          : err.message
    }
  });
}