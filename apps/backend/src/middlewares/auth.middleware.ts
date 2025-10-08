import AuthError, { AuthErrorCodes } from "@fullstack-template/error/auth-error";
import { HttpStatusCodes } from "@fullstack-template/http/http";
import { NextFunction, Response, Request } from "express";

import { verifyJwtToken } from "../utils/jwt.js";

const { UNAUTHORIZED } = HttpStatusCodes;
const { MISSING_ACCESS_TOKEN, INVALID_ACCESS_TOKEN } = AuthErrorCodes;

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  const access_token: string | undefined = req.cookies.access_token;

  if (!access_token) {
    throw new AuthError({
      message: "Missing access token",
      status: UNAUTHORIZED,
      code: MISSING_ACCESS_TOKEN,
    });
  }

  const { payload } = verifyJwtToken(access_token);

  if (!payload) {
    throw new AuthError({
      message: "Invalid access token",
      status: UNAUTHORIZED,
      code: INVALID_ACCESS_TOKEN,
    });
  }

  req.user_id = payload.sub;
  next();
};
