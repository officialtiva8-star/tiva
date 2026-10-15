import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import healthRouter from "./routes/health.js";
import meRouter from "./routes/me.js";
import profileRouter from "./routes/profile.js";
import walletRouter from "./routes/wallet.js";
import postsRouter from "./routes/posts.js";

import {
  notFound,
  errorHandler
} from "./middleware/errors.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());

const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Origin not allowed by CORS")
      );
    }
  })
);

app.use(
  express.json({
    limit: "1mb"
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false
  })
);

app.use("/health", healthRouter);

app.use("/api/me", meRouter);

app.use("/api/profile", profileRouter);

app.use("/api/wallet", walletRouter);

app.use("/api/posts", postsRouter);

app.use(notFound);

app.use(errorHandler);

export default app;