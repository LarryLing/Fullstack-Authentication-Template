import { Request, Response } from "express";

import { REFRESH_TOKEN_SECRET } from "../constants/env.js";
import { BAD_REQUEST, CONFLICT, CREATED, NOT_FOUND, OK, UNAUTHORIZED } from "../constants/http.js";
import AuthError, { AuthErrorCodes } from "../errors/auth-error.js";
import { User } from "../models/user.model.js";
import { VerificationCode, VerificationCodeTypes } from "../models/verification-code.model.js";
import db from "../services/db.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import {
  clearAuthCookies,
  getRefreshTokenCookieOptions,
  getAccessTokenCookieOptions,
  setAuthCookies,
} from "../utils/cookie.js";
import { tenMinutesFromNow, ONE_DAY_IN_MILLISECONDS } from "../utils/date.js";
import { generateJwtToken, JwtTokenType, RefreshTokenSignOptions, verifyJwtToken } from "../utils/jwt.js";

export const me = async (req: Request, res: Response) => {
  const { user_id } = req;

  const [user] = await db.query<User[]>("SELECT * FROM users WHERE id = ?", [user_id]);

  if (!user[0]) {
    throw new AuthError({
      message: "User not found",
      status: NOT_FOUND,
      code: AuthErrorCodes.USER_NOT_FOUND,
    });
  }

  res.status(OK).json({
    message: "User successfully retrieved",
    data: {
      user: {
        id: user[0].id,
        email: user[0].email,
        first_name: user[0].first_name,
        last_name: user[0].last_name,
      },
    },
  });
};

export const email = async (req: Request<unknown, unknown, Pick<User, "email">>, res: Response): Promise<void> => {
  const { email } = req.body;

  const [user] = await db.query<User[]>("SELECT * FROM users WHERE email = ?", [email]);

  if (!user[0] || user[0].verified_at === null) {
    throw new AuthError({
      message: "An account with this email does not exist, please sign up",
      status: NOT_FOUND,
      code: AuthErrorCodes.USER_NOT_FOUND,
    });
  }

  res.status(OK).json({
    message: "A verified account with this email was found, please login",
  });
};

export const signup = async (
  req: Request<unknown, unknown, Pick<User, "first_name" | "last_name" | "password" | "email">>,
  res: Response
): Promise<void> => {
  const { first_name, last_name, password, email } = req.body;

  const [user] = await db.query<User[]>("SELECT * FROM users WHERE email = ?", [email]);

  if (user[0] && user[0].verified_at !== null) {
    throw new AuthError({
      message: "An account with this email already exists, please login",
      status: CONFLICT,
      code: AuthErrorCodes.USER_ALREADY_EXISTS,
    });
  }

  const user_id = user[0] ? user[0].id : crypto.randomUUID();
  const hashed_password = await hashPassword(password);
  await db.query(
    "INSERT INTO users (id, first_name, last_name, email, password, created_at) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE first_name = VALUES(first_name), last_name = VALUES(last_name), password = VALUES(password)",
    [user_id, first_name, last_name, email, hashed_password, Date.now()]
  );

  const [codes] = await db.query<VerificationCode[]>(
    "SELECT * FROM verification_codes WHERE user_id = ? AND type = ? AND expires_at > ?",
    [user_id, VerificationCodeTypes.SIGNUP, Date.now()]
  );

  if (codes.length > 0) {
    throw new AuthError({
      message: "A verification code has recently been sent to this email, please check your inbox",
      status: CONFLICT,
      code: AuthErrorCodes.TOO_MANY_REQUESTS,
    });
  }

  const verification_code = crypto.randomUUID();
  const verification_code_issued_at = Date.now();
  const verification_code_expires_at = tenMinutesFromNow().getTime();
  await db.query("INSERT INTO verification_codes (id, user_id, issued_at, expires_at, type) VALUES (?, ?, ?, ?, ?)", [
    verification_code,
    user_id,
    verification_code_issued_at,
    verification_code_expires_at,
    VerificationCodeTypes.SIGNUP,
  ]);

  // TODO: Send email to user

  res.status(CREATED).json({
    message: "Please check your email for a verification code",
  });
};

export const confirmSignup = async (req: Request<{ code: string }, unknown, unknown>, res: Response): Promise<void> => {
  const { code } = req.params;

  const [verification_code] = await db.query<VerificationCode[]>(
    "SELECT * FROM verification_codes WHERE id = ? AND type = ? AND expires_at > ?",
    [code, VerificationCodeTypes.SIGNUP, Date.now()]
  );

  if (!verification_code[0]) {
    throw new AuthError({
      message: "The provided verification code is invalid or has expired, please request a new one",
      status: BAD_REQUEST,
      code: AuthErrorCodes.INVALID_VERIFICATION_CODE,
    });
  }

  await db.query("DELETE FROM verification_codes WHERE user_id = ? AND type = ?", [
    verification_code[0].user_id,
    VerificationCodeTypes.SIGNUP,
  ]);

  const now = Date.now();
  await db.query("UPDATE users SET verified_at = ? WHERE id = ?", [now, verification_code[0].user_id]);

  const refresh_token = generateJwtToken(
    {
      sub: verification_code[0].user_id,
      iat: now,
      jti: crypto.randomUUID(),
      type: JwtTokenType.REFRESH,
    },
    RefreshTokenSignOptions
  );

  const access_token = generateJwtToken({
    sub: verification_code[0].user_id,
    iat: now,
    jti: crypto.randomUUID(),
    type: JwtTokenType.ACCESS,
  });

  setAuthCookies(res, access_token, refresh_token);

  res.status(OK).json({
    message: "Email verified successfully",
  });
};

export const login = async (
  req: Request<unknown, unknown, Pick<User, "email" | "password">>,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  const [user] = await db.query<User[]>("SELECT * FROM users WHERE email = ?", [email]);

  if (!user[0] || user[0].verified_at === null || user[0].password === null) {
    throw new AuthError({
      message: "Incorrect email or password",
      status: UNAUTHORIZED,
      code: AuthErrorCodes.INVALID_CREDENTIALS,
    });
  }

  const is_password_correct = await comparePassword(password, user[0].password);
  if (!is_password_correct) {
    throw new AuthError({
      message: "Incorrect email or password",
      status: UNAUTHORIZED,
      code: AuthErrorCodes.INVALID_CREDENTIALS,
    });
  }

  const now = Date.now();
  await db.query("UPDATE users SET last_logged_in_at = ? WHERE id = ? AND email = ?", [now, user[0].id, email]);

  const refresh_token = generateJwtToken(
    {
      sub: user[0].id,
      iat: now,
      jti: crypto.randomUUID(),
      type: JwtTokenType.REFRESH,
    },
    RefreshTokenSignOptions
  );

  const access_token = generateJwtToken({
    sub: user[0].id,
    iat: now,
    jti: crypto.randomUUID(),
    type: JwtTokenType.ACCESS,
  });

  setAuthCookies(res, access_token, refresh_token);

  res.status(OK).json({
    message: "Successfully logged in",
  });
};

export const forgotPassword = async (
  req: Request<unknown, unknown, Pick<User, "email">>,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  const [user] = await db.query<User[]>("SELECT * FROM users WHERE email = ?", [email]);

  if (!user[0] || user[0].verified_at === null) {
    throw new AuthError({
      message: "An account with this email does not exist, please sign up",
      status: NOT_FOUND,
      code: AuthErrorCodes.USER_NOT_FOUND,
    });
  }

  const [codes] = await db.query<VerificationCode[]>(
    "SELECT * FROM verification_codes WHERE user_id = ? AND type = ? AND expires_at > ?",
    [user[0].id, VerificationCodeTypes.PASSWORD_RESET, Date.now()]
  );

  if (codes.length > 0) {
    throw new AuthError({
      message: "A verification code has already been sent to this email, please check your inbox",
      status: CONFLICT,
      code: AuthErrorCodes.TOO_MANY_REQUESTS,
    });
  }

  const reset_password_code = crypto.randomUUID();
  const reset_password_code_issued_at = Date.now();
  const reset_password_code_expires_at = tenMinutesFromNow().getTime();
  await db.query("INSERT INTO verification_codes (id, user_id, issued_at, expires_at, type) VALUES (?, ?, ?, ?, ?)", [
    reset_password_code,
    user[0].id,
    reset_password_code_issued_at,
    reset_password_code_expires_at,
    VerificationCodeTypes.PASSWORD_RESET,
  ]);

  // TODO: Send email to user

  res.status(OK).json({
    message: "Reset password email sent",
  });
};

export const confirmForgotPassword = async (
  req: Request<{ code: string }, unknown, unknown>,
  res: Response
): Promise<void> => {
  const { code } = req.params;

  const [verification_code] = await db.query<VerificationCode[]>(
    "SELECT * FROM verification_codes WHERE id = ? AND type = ? AND expires_at > ?",
    [code, VerificationCodeTypes.PASSWORD_RESET, Date.now()]
  );

  if (!verification_code[0]) {
    throw new AuthError({
      message: "The provided verification code is invalid or has expired, please request a new one",
      status: BAD_REQUEST,
      code: AuthErrorCodes.INVALID_VERIFICATION_CODE,
    });
  }

  await db.query("DELETE FROM verification_codes WHERE user_id = ? AND type = ?", [
    verification_code[0].user_id,
    VerificationCodeTypes.PASSWORD_RESET,
  ]);

  res.status(OK).json({
    message: "Password reset code confirmed",
  });
};

export const resetPassword = async (
  req: Request<unknown, unknown, Pick<User, "email" | "password">>,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  const [user] = await db.query<User[]>("SELECT * FROM users WHERE email = ?", [email]);

  if (!user[0]) {
    throw new AuthError({
      message: "An account with this email does not exist, please sign up",
      status: NOT_FOUND,
      code: AuthErrorCodes.USER_NOT_FOUND,
    });
  }

  const hashed_password = await hashPassword(password);
  await db.query("UPDATE users SET password = ? WHERE id = ?", [hashed_password, user[0].id]);

  clearAuthCookies(res);

  res.status(OK).json({
    message: "Password reset successfully, please login with your new password",
  });
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  clearAuthCookies(res);

  res.status(OK).json({
    message: "Successfully logged out",
  });
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const refresh_token: string | undefined = req.cookies.refresh_token;

  if (!refresh_token) {
    throw new AuthError({
      message: "No refresh token found, please login",
      status: UNAUTHORIZED,
      code: AuthErrorCodes.MISSING_REFRESH_TOKEN,
    });
  }

  const { payload } = verifyJwtToken(refresh_token, { secret: REFRESH_TOKEN_SECRET });

  if (!payload || payload.type !== JwtTokenType.REFRESH || payload.exp! < Date.now()) {
    throw new AuthError({
      message: "The provided refresh token is invalid or has expired, please login",
      status: UNAUTHORIZED,
      code: AuthErrorCodes.INVALID_REFRESH_TOKEN,
    });
  }

  const should_generate_new_refresh_token = payload.exp! - Date.now() <= ONE_DAY_IN_MILLISECONDS;

  const new_refresh_token = should_generate_new_refresh_token
    ? generateJwtToken(
        {
          sub: payload.sub,
          iat: Date.now(),
          jti: crypto.randomUUID(),
          type: JwtTokenType.REFRESH,
        },
        RefreshTokenSignOptions
      )
    : undefined;

  const new_access_token = generateJwtToken({
    sub: payload.sub,
    iat: Date.now(),
    jti: crypto.randomUUID(),
    type: JwtTokenType.ACCESS,
  });

  if (new_refresh_token) {
    res.cookie("refresh_token", new_refresh_token, getRefreshTokenCookieOptions());
  }

  res.status(OK).cookie("access_token", new_access_token, getAccessTokenCookieOptions()).json({
    message: "Successfully refreshed tokens",
  });
};
