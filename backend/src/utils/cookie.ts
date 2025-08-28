import { CookieOptions, Response } from "express";

import { NODE_ENV } from "../constants/env.js";
import { oneHourFromNow, sevenDaysFromNow } from "./date.js";

export const REFRESH_COOKIE_PATH = "/api/auth/refresh";

const secure = NODE_ENV !== "development";

const defaults: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure,
};

export const getAccessTokenCookieOptions = (): CookieOptions => {
  return {
    ...defaults,
    expires: oneHourFromNow(),
  };
};

export const getRefreshTokenCookieOptions = (): CookieOptions => {
  return {
    ...defaults,
    expires: sevenDaysFromNow(),
    path: REFRESH_COOKIE_PATH,
  };
};

export const setAuthCookies = (res: Response, access_token: string, refresh_token: string): void => {
  res
    .cookie("access_token", access_token, getAccessTokenCookieOptions())
    .cookie("refresh_token", refresh_token, getRefreshTokenCookieOptions());
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie("access_token").clearCookie("refresh_token", {
    path: REFRESH_COOKIE_PATH,
  });
};
