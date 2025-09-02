import { NextFunction, Response, Request } from "express";

import { UNAUTHORIZED } from "../constants/http.js";
import AuthError, { AuthErrorCodes } from "../errors/auth.error.js";
import { verifyJwtToken } from "../utils/jwt.js";

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  const access_token: string | undefined = req.cookies.access_token;

  if (!access_token) {
    throw new AuthError({
      message: "Missing access token",
      status: UNAUTHORIZED,
      code: AuthErrorCodes.MISSING_ACCESS_TOKEN,
    });
  }

  const { payload } = verifyJwtToken(access_token);

  if (!payload) {
    throw new AuthError({
      message: "Invalid access token",
      status: UNAUTHORIZED,
      code: AuthErrorCodes.INVALID_ACCESS_TOKEN,
    });
  }

  req.user_id = payload.sub;
  next();
};
