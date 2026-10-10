import { Router } from "express";
import healthRouter from "./health.js";

const router = Router();

router.use("/health", healthRouter);

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    name: "TIVA",
    slogan: "Meet, Connect, Share, Live",
    version: "1.0.0",
    message: "Welcome to the TIVA API"
  });
});

export default router;