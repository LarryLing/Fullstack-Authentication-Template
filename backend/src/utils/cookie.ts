import { CookieOptions, Response } from "express";

import { NODE_ENV } from "../constants/env.js";
import { sevenDaysFromNow } from "./date.js";

const secure = NODE_ENV !== "development";

const defaults: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure,
};

const getRefreshCookieOptions = (): CookieOptions => {
  return {
    ...defaults,
    expires: sevenDaysFromNow(),
    path: "/api/auth/refresh",
  };
};

export const setAuthCookies = (res: Response, refresh_token: string): void => {
  res.cookie("refresh_token", refresh_token, getRefreshCookieOptions());
};
