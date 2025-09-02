import { Request, Response, NextFunction } from "express";

import { DEBUG } from "../constants/env.js";
import { INTERNAL_SERVER_ERROR } from "../constants/http.js";
import GenericError from "../errors/generic.error.js";
import { clearAuthCookies, REFRESH_COOKIE_PATH } from "../utils/cookie.js";

export const errorMiddleware = (error: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (DEBUG === "true") {
    console.error(error);
  }

  if (req.path === REFRESH_COOKIE_PATH) {
    clearAuthCookies(res);
  }

  if (error instanceof GenericError) {
    res.status(error.status).json({
      message: error.message,
      code: error.code,
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
    error_message = "An unknown error occurred.";
  }

  res.status(INTERNAL_SERVER_ERROR).json({
    message: error_message,
    code: "INTERNAL_SERVER_ERROR",
  });
};
