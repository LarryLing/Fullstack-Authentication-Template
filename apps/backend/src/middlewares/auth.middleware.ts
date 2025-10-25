import AuthError, { AUTH_ERROR_CODES } from "@fullstack-template/error/auth-error";
import { HTTP_STATUS_CODES } from "@fullstack-template/http/http";
import { NextFunction, Response, Request } from "express";

import { verifyJwtToken } from "../utils/jwt.js";

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  const access_token: string | undefined = req.cookies.access_token;

  if (!access_token) {
    throw new AuthError({
      message: "Missing access token",
      status: HTTP_STATUS_CODES.UNAUTHORIZED,
      code: AUTH_ERROR_CODES.MISSING_ACCESS_TOKEN,
    });
  }

  const { payload } = verifyJwtToken(access_token);

  if (!payload) {
    throw new AuthError({
      message: "Invalid access token",
      status: HTTP_STATUS_CODES.UNAUTHORIZED,
      code: AUTH_ERROR_CODES.INVALID_ACCESS_TOKEN,
    });
  }

  req.user_id = payload.sub;
  next();
};
