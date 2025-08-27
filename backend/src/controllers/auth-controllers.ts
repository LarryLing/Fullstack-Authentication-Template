import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../constants/env.js";
import { BAD_REQUEST, CONFLICT, NOT_FOUND, OK, UNAUTHORIZED } from "../constants/http.js";
import AuthError from "../errors/auth-error.js";
import { User } from "../models/user.js";
import db from "../services/db.js";
import { AuthRequestBody } from "../types.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { setAuthCookies } from "../utils/cookie.js";
import { tenMinutesFromNow } from "../utils/date.js";
import { generateToken } from "../utils/token.js";

export const email = async (
  req: Request<unknown, unknown, Pick<AuthRequestBody, "email">>,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  const [user] = await db.query<User[]>("SELECT * FROM users WHERE email = ?", [email]);

  if (!user[0]) {
    throw new AuthError({
      message: "An account with this email does not exist, please sign up",
      status: NOT_FOUND,
      code: "USER_NOT_FOUND",
    });
  }

  if (user[0].verified_at) {
    throw new AuthError({
      message: "A verified account with this email already exists, please login",
      status: CONFLICT,
      code: "USER_ALREADY_EXISTS",
    });
  }

  const verification_token = generateToken();
  const verification_token_expires_at = tenMinutesFromNow();
  await db.query("UPDATE users SET verification_token = ?, verification_token_expires_at = ? WHERE email = ?", [
    verification_token,
    verification_token_expires_at,
    email,
  ]);

  // TODO: Send email to user

  res.status(OK).json({
    message: "Verification email sent",
  });
};

export const login = async (
  req: Request<unknown, unknown, Pick<AuthRequestBody, "email" | "password">>,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  const [user] = await db.query<User[]>("SELECT * FROM users WHERE email = ?", [email]);

  if (!user[0]) {
    throw new AuthError({
      message: "An account with this email does not exist, please sign up",
      status: NOT_FOUND,
      code: "USER_NOT_FOUND",
    });
  }

  const is_password_correct = await comparePassword(password, user[0].password);
  if (!is_password_correct) {
    throw new AuthError({
      message: "Invalid credentials",
      status: UNAUTHORIZED,
      code: "INVALID_CREDENTIALS",
    });
  }

  if (!user[0].verified_at) {
    throw new AuthError({
      message: "An unverified account with this email already exists, please verify your account",
      status: CONFLICT,
      code: "USER_NOT_VERIFIED",
    });
  }

  await db.query("UPDATE users SET last_logged_in_at = ? WHERE email = ?", [Date.now(), email]);

  const refresh_token = jwt.sign({ session_id: "123" }, REFRESH_TOKEN_SECRET, { audience: ["user"], expiresIn: "30d" });
  const access_token = jwt.sign({ session_id: "123", user_id: user[0].id }, ACCESS_TOKEN_SECRET, {
    audience: ["user"],
    expiresIn: "15m",
  });

  setAuthCookies(res, access_token, refresh_token);

  res.status(OK).json({
    message: "Successfully logged in",
    data: {
      access_token,
    },
  });
};

export const signup = async (
  req: Request<unknown, unknown, Pick<AuthRequestBody, "email" | "password" | "first_name" | "last_name">>,
  res: Response
): Promise<void> => {
  const { email, password, first_name, last_name } = req.body;

  const [user] = await db.query<User[]>("SELECT * FROM users WHERE email = ?", [email]);

  if (user[0]) {
    if (user[0].verified_at) {
      throw new AuthError({
        message: "A verified account with this email already exists, please login",
        status: CONFLICT,
        code: "USER_ALREADY_EXISTS",
      });
    } else {
      const verification_token = generateToken();
      const verification_token_expires_at = tenMinutesFromNow();
      await db.query("UPDATE users SET verification_token = ?, verification_token_expires_at = ? WHERE email = ?", [
        verification_token,
        verification_token_expires_at,
        email,
      ]);

      // TODO: Send email to user

      throw new AuthError({
        message: "An unverified account with this email already exists, please verify your account",
        status: CONFLICT,
        code: "USER_NOT_VERIFIED",
      });
    }
  }

  const id = crypto.randomUUID();
  const hashed_password = await hashPassword(password);
  const created_at = Date.now();
  const verification_token = generateToken();
  const verification_token_expires_at = tenMinutesFromNow();
  await db.query(
    "INSERT INTO users (id, email, password, first_name, last_name, created_at, verification_token, verification_token_expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [id, email, hashed_password, first_name, last_name, created_at, verification_token, verification_token_expires_at]
  );

  // TODO: Send email to user

  res.json({
    message: "User account created",
  });
};

export const confirmUser = async (
  req: Request<unknown, unknown, Pick<AuthRequestBody, "email" | "verification_token">>,
  res: Response
): Promise<void> => {
  const { email, verification_token } = req.body;

  const [user] = await db.query<User[]>("SELECT * FROM users WHERE email = ? AND verification_token = ?", [
    email,
    verification_token,
  ]);

  if (!user[0]) {
    throw new AuthError({
      message: "The provided verification token is invalid, please request a new one",
      status: BAD_REQUEST,
      code: "INVALID_TOKEN",
    });
  }

  if (user[0].verification_token_expires_at && user[0].verification_token_expires_at < Date.now()) {
    throw new AuthError({
      message: "The provided verification token has expired, please request a new one",
      status: BAD_REQUEST,
      code: "TOKEN_EXPIRED",
    });
  }

  const now = Date.now();
  await db.query(
    "UPDATE users SET verified_at = ?, last_logged_in_at = ?, verification_token = NULL, verification_token_expires_at = NULL WHERE email = ?",
    [now, now, email]
  );

  const refresh_token = jwt.sign({ session_id: "123" }, REFRESH_TOKEN_SECRET, { audience: ["user"], expiresIn: "30d" });
  const access_token = jwt.sign({ session_id: "123", user_id: user[0].id }, ACCESS_TOKEN_SECRET, {
    audience: ["user"],
    expiresIn: "15m",
  });

  setAuthCookies(res, access_token, refresh_token);

  res.status(OK).json({
    message: "User account verified",
    data: {
      access_token,
    },
  });
};

export const forgotPassword = async (
  req: Request<unknown, unknown, Pick<AuthRequestBody, "email">>,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  const [user] = await db.query<User[]>("SELECT * FROM users WHERE email = ?", [email]);

  if (!user[0]) {
    throw new AuthError({
      message: "An account with this email does not exist, please sign up",
      status: NOT_FOUND,
      code: "USER_NOT_FOUND",
    });
  }

  const reset_password_token = generateToken();
  const reset_password_token_expires_at = tenMinutesFromNow();
  await db.query("UPDATE users SET reset_password_token = ?, reset_password_token_expires_at = ? WHERE email = ?", [
    reset_password_token,
    reset_password_token_expires_at,
    email,
  ]);

  // TODO: Send email to user

  res.status(OK).json({
    message: "Reset password email sent",
  });
};

export const resetPassword = async (
  req: Request<unknown, unknown, Pick<AuthRequestBody, "email" | "reset_password_token" | "password">>,
  res: Response
): Promise<void> => {
  const { email, reset_password_token, password } = req.body;

  const [user] = await db.query<User[]>("SELECT * FROM users WHERE email = ? AND reset_password_token = ?", [
    email,
    reset_password_token,
  ]);

  if (!user[0]) {
    throw new AuthError({
      message: "The provided reset password token is invalid, please request a new one",
      status: BAD_REQUEST,
      code: "INVALID_TOKEN",
    });
  }

  if (user[0].reset_password_token_expires_at && user[0].reset_password_token_expires_at < Date.now()) {
    throw new AuthError({
      message: "The provided reset password token has expired, please request a new one",
      status: BAD_REQUEST,
      code: "TOKEN_EXPIRED",
    });
  }

  const hashed_password = await hashPassword(password);
  await db.query(
    "UPDATE users SET password = ?, reset_password_token = NULL, reset_password_token_expires_at = NULL WHERE email = ?",
    [hashed_password, email]
  );

  res.status(OK).json({
    message: "Password reset successfully",
  });
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie("refresh_token");

  res.status(OK).json({
    message: "Successfully logged out",
  });
};
