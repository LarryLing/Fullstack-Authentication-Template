/* eslint-disable no-console */

import path from "path";

import { HTTP_STATUS_CODES } from "@fullstack-template/http/http";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express from "express";

import "./env-loader.js";
import { NODE_ENV, PORT, APP_ORIGIN } from "./constants/env.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.route.js";
import { checkConnection, disconnectFromDatabase } from "./services/db.js";

const app = express();

if (NODE_ENV === "development") {
  const corsOptions: CorsOptions = {
    origin(origin, callback) {
      if (!origin || APP_ORIGIN === origin) {
        callback(null, true);
      } else {
        callback(new Error(`CORS error: ${origin} is not allowed by CORS`), false);
        console.log(`CORS error: ${origin} is not allowed by CORS`);
      }
    },
    credentials: true,
  };

  app.use(cors(corsOptions));
}

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/api/health", (_, res) => {
  return res.status(HTTP_STATUS_CODES.OK).json({
    status: "healthy",
  });
});

app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

if (NODE_ENV === "production") {
  const __dirname = path.resolve();

  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get(/(.*)/, (_req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
  await checkConnection();
});

const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();
    console.log("Shutting down server...");
    process.exit(0);
  } catch (error) {
    console.error("Error shutting down server:", error);
  }
};

process.on("SIGTERM", handleServerShutdown);
process.on("SIGINT", handleServerShutdown);
