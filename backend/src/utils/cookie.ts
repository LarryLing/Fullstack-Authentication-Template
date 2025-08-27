import { CookieOptions, Response } from "express";

import { NODE_ENV } from "../constants/env.js";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date.js";

const secure = NODE_ENV !== "development";

const defaults: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure,
};

const getAccessCookieOptions = (): CookieOptions => {
  return {
    ...defaults,
    expires: fifteenMinutesFromNow(),
  };
};

const getRefreshCookieOptions = (): CookieOptions => {
  return {
    ...defaults,
    expires: thirtyDaysFromNow(),
    path: "/api/auth/refresh",
  };
};

export const setAuthCookies = (res: Response, access_token: string, refresh_token: string): void => {
  res
    .cookie("access_token", access_token, getAccessCookieOptions())
    .cookie("refresh_token", refresh_token, getRefreshCookieOptions());
};
