export function successResponse(
  res,
  data,
  message = "Request completed successfully",
  statusCode = 200
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

export function errorResponse(
  res,
  message = "Request failed",
  statusCode = 400,
  code = "REQUEST_ERROR"
) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    }
  });
}