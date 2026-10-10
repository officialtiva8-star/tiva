export function notFound(req, res) {
  res.status(404).json({
    success: false,
    error: {
      code: "ROUTE_NOT_FOUND",
      message: "This TIVA route does not exist."
    }
  });
}