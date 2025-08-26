import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    message: "API is running",
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

export default router;
