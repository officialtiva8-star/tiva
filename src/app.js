import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

// Basic security headers
app.use(helmet());

// Allow requests from the configured frontend
const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Permit requests without a browser Origin, such as health checks.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by TIVA"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// Parse JSON requests
app.use(
  express.json({
    limit: "1mb"
  })
);

// Basic API information
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    name: "TIVA API",
    message: "Meet, Connect, Share, Live",
    status: "running"
  });
});

// Health check for Render
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    service: "tiva-api",
    timestamp: new Date().toISOString()
  });
});

// API version route
app.get("/api/v1", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the TIVA API",
    version: "1.0.0"
  });
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "TIVA route not found"
  });
});

// General error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.message === "Origin not allowed by TIVA") {
    return res.status(403).json({
      success: false,
      message: "This origin is not allowed"
    });
  }

  console.error("TIVA API error:", err.message);

  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred"
  });
});

export default app;