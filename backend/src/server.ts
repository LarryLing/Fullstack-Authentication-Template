import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express from "express";
import path from "path";

import config from "./config/index.js";
import { checkConnection, disconnectFromDatabase } from "./lib/db.js";
import authRoutes from "./routes/auth-routes.js";

const app = express();

if (config.NODE_ENV === "development") {
  const corsOptions: CorsOptions = {
    credentials: true,
    origin(origin, callback) {
      if (config.NODE_ENV === "development" || !origin || config.WHITELISTED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS error: ${origin} is not allowed by CORS`), false);
        console.log(`CORS error: ${origin} is not allowed by CORS`);
      }
    },
  };

  app.use(cors(corsOptions));
}

app.use(express.json());

app.use(cookieParser());

(async () => {
  try {
    app.use("/api/auth", authRoutes);

    if (config.NODE_ENV === "production") {
      const __dirname = path.resolve();

      app.use(express.static(path.join(__dirname, "../frontend/dist")));

      app.get(/(.*)/, (_req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
      });
    }

    app.listen(config.PORT, () => {
      console.log(`Server running: http://localhost:${config.PORT}`);
    });

    await checkConnection();
  } catch (error) {
    console.error("Error starting server:", error);

    if (config.NODE_ENV === "production") {
      process.exit(1);
    }
  }
})();

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
