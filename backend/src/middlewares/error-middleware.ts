import { Request, Response, NextFunction } from "express";

import config from "../config/index.js";
import GenericError from "../errors/generic-error.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (config.DEBUG) {
    console.error(error);
  }

  if (error instanceof GenericError) {
    res.status(error.status).json({
      error: {
        message: error.message,
        code: error.code,
      },
    });
    return;
  }

  let error_message: string;

  if (error instanceof Error) {
    error_message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    error_message = String(error.message);
  } else if (typeof error === "string") {
    error_message = error;
  } else {
    error_message = "An unknown error occurred";
  }

  res.status(500).json({
    error: {
      message: error_message,
      code: "INTERNAL_SERVER_ERROR",
    },
  });
};
