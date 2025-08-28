import { Request, Response } from "express";
import { RowDataPacket } from "mysql2/promise";

import { BAD_REQUEST, CONFLICT, CREATED, NOT_FOUND, OK, UNAUTHORIZED } from "../constants/http.js";
import AuthError, { AuthErrorCodes } from "../errors/auth-error.js";
import { User } from "../models/user.model.js";
import { VerificationCode } from "../models/verification-code.model.js";
import db from "../services/db.js";
import { AuthRequestBodyType } from "../types/auth-request-body.type.js";
import { JwtTokenType } from "../types/jwt-token.type.js";
import { VerificationCodeType } from "../types/verification-code-type.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { clearAuthCookies, setAuthCookies } from "../utils/cookie.js";
import { tenMinutesFromNow, sevenDaysFromNow, oneHourFromNow } from "../utils/date.js";
import { generateJwtToken, RefreshTokenSignOptions } from "../utils/jwt.js";
import { generateVerificationCode } from "../utils/verification-code.js";

export const email = async (
  req: Request<unknown, unknown, Pick<AuthRequestBodyType, "email">>,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  const [user] = await db.query<User[]>("SELECT * FROM users WHERE email = ?", [email]);

  if (!user[0]) {
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

export const requestEmailVerification = async (
  req: Request<unknown, unknown, Pick<AuthRequestBodyType, "email">>,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  const [user] = await db.query<RowDataPacket[]>("SELECT 1 FROM users WHERE email = ?", [email]);

  if (user[0]) {
    throw new AuthError({
      message: "An account with this email already exists, please login",
      status: CONFLICT,
      code: AuthErrorCodes.USER_ALREADY_EXISTS,
    });
  }

  const verification_code = generateVerificationCode();
  const verification_code_issued_at = Date.now();
  const verification_code_expires_at = tenMinutesFromNow();
  await db.query("INSERT INTO verification_codes (email, issued_at, expires_at, code, type) VALUES (?, ?, ?, ?, ?)", [
    email,
    verification_code_issued_at,
    verification_code_expires_at,
    verification_code,
    VerificationCodeType.EMAIL_CONFIRMATION,
  ]);

  // TODO: Send email to user

  res.status(CREATED).json({
    message: "Please check your email for a verification code",
  });
};

export const signup = async (
  req: Request<
    unknown,
    unknown,
    Pick<AuthRequestBodyType, "first_name" | "last_name" | "email" | "password" | "email_confirmation_code">
  >,
  res: Response
): Promise<void> => {
  const { first_name, last_name, email, password, email_confirmation_code } = req.body;

  const [verification_code] = await db.query<VerificationCode[]>(
    "SELECT * FROM verification_codes WHERE email = ? AND code = ? AND type = ?",
    [email, email_confirmation_code, VerificationCodeType.EMAIL_CONFIRMATION]
  );

  if (!verification_code[0]) {
    throw new AuthError({
      message: "The provided verification token is invalid, please request a new one",
      status: BAD_REQUEST,
      code: AuthErrorCodes.INVALID_TOKEN,
    });
  }

  if (verification_code[0].expires_at < Date.now()) {
    throw new AuthError({
      message: "The provided verification token has expired, please request a new one",
      status: BAD_REQUEST,
      code: AuthErrorCodes.TOKEN_EXPIRED,
    });
  }

  await db.query("DELETE FROM verification_codes WHERE email = ? AND code = ? AND type = ?", [
    email,
    email_confirmation_code,
    VerificationCodeType.EMAIL_CONFIRMATION,
  ]);

  const id = crypto.randomUUID();

  const hashed_password = await hashPassword(password);
  const now = Date.now();
  await db.query(
    "INSERT INTO users (id, email, password, first_name, last_name, created_at, last_logged_in_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [id, email, hashed_password, first_name, last_name, now, now]
  );

  const refresh_token = generateJwtToken(
    {
      sub: id,
      iat: now,
      exp: sevenDaysFromNow().getTime(),
      jti: crypto.randomUUID(),
      type: JwtTokenType.REFRESH,
      aud: "user",
    },
    RefreshTokenSignOptions
  );

  const access_token = generateJwtToken({
    sub: id,
    iat: now,
    exp: oneHourFromNow().getTime(),
    jti: crypto.randomUUID(),
    type: JwtTokenType.ACCESS,
    aud: "user",
  });

  setAuthCookies(res, access_token, refresh_token);

  res.status(OK).json({
    message: "User successfully created",
  });

  res.status(OK).json({
    message: "Email verified successfully",
  });
};

export const login = async (
  req: Request<unknown, unknown, Pick<AuthRequestBodyType, "email" | "password">>,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  const [user] = await db.query<User[]>("SELECT * FROM users WHERE email = ?", [email]);

  if (!user[0]) {
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
      exp: sevenDaysFromNow().getTime(),
      jti: crypto.randomUUID(),
      type: JwtTokenType.REFRESH,
      aud: "user",
    },
    RefreshTokenSignOptions
  );

  const access_token = generateJwtToken({
    sub: user[0].id,
    iat: now,
    exp: oneHourFromNow().getTime(),
    jti: crypto.randomUUID(),
    type: JwtTokenType.ACCESS,
    aud: "user",
  });

  setAuthCookies(res, access_token, refresh_token);

  res.status(OK).json({
    message: "Successfully logged in",
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

export const requestPasswordReset = async (
  req: Request<unknown, unknown, Pick<AuthRequestBodyType, "email">>,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  const [user] = await db.query<RowDataPacket[]>("SELECT 1 FROM users WHERE email = ?", [email]);

  if (!user[0]) {
    throw new AuthError({
      message: "An account with this email does not exist, please sign up",
      status: NOT_FOUND,
      code: AuthErrorCodes.USER_NOT_FOUND,
    });
  }

  const reset_password_code = generateVerificationCode();
  const reset_password_code_issued_at = Date.now();
  const reset_password_code_expires_at = tenMinutesFromNow();
  await db.query("INSERT INTO verification_codes (email, issued_at, expires_at, code, type) VALUES (?, ?, ?, ?, ?)", [
    email,
    reset_password_code_issued_at,
    reset_password_code_expires_at,
    reset_password_code,
    VerificationCodeType.PASSWORD_RESET,
  ]);

  // TODO: Send email to user

  res.status(OK).json({
    message: "Reset password email sent",
  });
};

export const resetPassword = async (
  req: Request<unknown, unknown, Pick<AuthRequestBodyType, "email" | "password_reset_code" | "password">>,
  res: Response
): Promise<void> => {
  const { email, password_reset_code, password } = req.body;

  const [verification_code] = await db.query<VerificationCode[]>(
    "SELECT * FROM verification_codes WHERE email = ? AND code = ? AND type = ?",
    [email, password_reset_code, VerificationCodeType.PASSWORD_RESET]
  );

  if (!verification_code[0]) {
    throw new AuthError({
      message: "The provided reset password token is invalid, please request a new one",
      status: BAD_REQUEST,
      code: AuthErrorCodes.INVALID_TOKEN,
    });
  }

  if (verification_code[0].expires_at < Date.now()) {
    throw new AuthError({
      message: "The provided reset password token has expired, please request a new one",
      status: BAD_REQUEST,
      code: AuthErrorCodes.TOKEN_EXPIRED,
    });
  }

  await db.query("DELETE FROM verification_codes WHERE email = ? AND code = ? AND type = ?", [
    email,
    password_reset_code,
    VerificationCodeType.PASSWORD_RESET,
  ]);

  const hashed_password = await hashPassword(password);
  await db.query("UPDATE users SET password = ? WHERE email = ?", [hashed_password, email]);

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
