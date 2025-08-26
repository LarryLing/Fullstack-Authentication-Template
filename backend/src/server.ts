import compression from "compression";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import express from "express";
import helmet from "helmet";

import config from "./config/index.js";
import { checkConnection, disconnectFromDatabase } from "./lib/db.js";
import v1Routes from "./routes/v1/index.js";

const app = express();

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (config.NODE_ENV === "development" || !origin || config.WHITELISTED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS error: ${origin} is not allowed by CORS`),
        false
      );
      console.log(`CORS error: ${origin} is not allowed by CORS`);
    }
  },
}

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(compression({ threshold: 1024 }));

app.use(helmet());

(async () => {
  try {
    app.use("/api/v1", v1Routes);

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
