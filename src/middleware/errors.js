export function notFound(req, res) {
  return res.status(404).json({
    error: "The requested API route was not found."
  });
}

export function errorHandler(
  error,
  req,
  res,
  next
) {
  if (res.headersSent) {
    return next(error);
  }

  if (
    error?.message ===
    "Origin not allowed by CORS"
  ) {
    return res.status(403).json({
      error: "This website origin is not allowed."
    });
  }

  console.error(
    "TIVA API error:",
    error?.message || error
  );

  return res.status(500).json({
    error: "An internal server error occurred."
  });
}