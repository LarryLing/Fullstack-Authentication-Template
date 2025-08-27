import bcrypt from "bcrypt";
import { Request, Response } from "express";

import { User } from "../models/user.js";
import db from "../services/db.js";
import { AuthRequestBody } from "../types.js";
import { generateAccessToken, generateRefreshToken, generateToken } from "../utils.js";

export const email = async (
  req: Request<unknown, unknown, Pick<AuthRequestBody, "email">>,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    const [user] = await db.query<User[]>("SELECT * FROM users WHERE email = ?", [email]);

    if (!user[0]) {
      res.status(404).json({
        message: "User account not found",
      });
      return;
    }

    if (user[0].verified_at) {
      res.status(400).json({
        message: "User account already verified",
      });
      return;
    }

    // TODO: Send email to user

    res.status(200).json({
      message: "Verification email sent",
    });
  } catch (error) {
    const error_message = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({
      message: error_message,
    });
  }
};

export const login = async (
  req: Request<unknown, unknown, Pick<AuthRequestBody, "email" | "password">>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const [user] = await db.query<User[]>("SELECT * FROM users WHERE email = ?", [email]);

    if (!user[0]) {
      res.status(404).json({
        message: "User account not found",
      });
      return;
    }

    const is_password_correct = await bcrypt.compare(password, user[0].password);
    if (!is_password_correct) {
      res.status(401).json({
        message: "Invalid credentials",
      });
      return;
    }

    if (!user[0].verified_at) {
      res.status(401).json({
        message: "User account not verified",
      });
      return;
    }

    const access_token = generateAccessToken({
      id: user[0].id,
      email: user[0].email,
      first_name: user[0].first_name,
      last_name: user[0].last_name,
    });

    const refresh_token = generateRefreshToken({ id: user[0].id });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    await db.query("UPDATE users SET last_logged_in_at = ? WHERE email = ?", [Date.now(), email]);

    res.status(200).json({
      message: "Successfully logged in",
      data: {
        access_token,
      },
    });
  } catch (error) {
    const error_message = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({
      message: error_message,
    });
  }
};

export const signup = async (
  req: Request<unknown, unknown, Pick<AuthRequestBody, "email" | "password" | "first_name" | "last_name">>,
  res: Response
): Promise<void> => {
  try {
    const { email, password, first_name, last_name } = req.body;

    const [user] = await db.query<User[]>("SELECT * FROM users WHERE email = ?", [email]);

    if (user[0]) {
      if (user[0].verified_at) {
        res.status(400).json({
          message: "User account already exists and is verified",
        });
      } else {
        res.status(400).json({
          message: "User account already exists but is not verified",
        });
      }
      return;
    }

    const id = crypto.randomUUID();
    const hashed_password = await bcrypt.hash(password, 10);
    const created_at = Date.now();
    const verification_token = generateToken();
    const verification_token_expires_at = Date.now() + 1000 * 60 * 10;
    await db.query(
      "INSERT INTO users (id, email, password, first_name, last_name, created_at, verification_token, verification_token_expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id, email, hashed_password, first_name, last_name, created_at, verification_token, verification_token_expires_at]
    );

    res.json({
      message: "User account created",
    });
  } catch (error) {
    const error_message = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({
      message: error_message,
    });
  }
};

export const confirmUser = async (
  req: Request<unknown, unknown, Pick<AuthRequestBody, "email" | "verification_token">>,
  res: Response
): Promise<void> => {
  try {
    const { email, verification_token } = req.body;

    const [user] = await db.query<User[]>("SELECT * FROM users WHERE email = ? AND verification_token = ?", [
      email,
      verification_token,
    ]);

    if (!user[0]) {
      res.status(400).json({
        message: "Invalid verification token",
      });
      return;
    }

    if (user[0].verification_token_expires_at && user[0].verification_token_expires_at < Date.now()) {
      res.status(400).json({
        message: "Verification token expired",
      });
      return;
    }

    const now = Date.now();
    await db.query(
      "UPDATE users SET verified_at = ?, last_logged_in_at = ?, verification_token = NULL, verification_token_expires_at = NULL WHERE email = ?",
      [now, now, email]
    );

    res.status(200).json({
      message: "User account verified",
    });
  } catch (error) {
    const error_message = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({
      message: error_message,
    });
  }
};

export const forgotPassword = async (
  req: Request<unknown, unknown, Pick<AuthRequestBody, "email">>,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    const [user] = await db.query<User[]>("SELECT * FROM users WHERE email = ?", [email]);

    if (!user[0]) {
      res.status(400).json({
        message: "User account not found",
      });
      return;
    }

    const reset_password_token = generateToken();
    const reset_password_token_expires_at = Date.now() + 1000 * 60 * 10;
    await db.query("UPDATE users SET reset_password_token = ?, reset_password_token_expires_at = ? WHERE email = ?", [
      reset_password_token,
      reset_password_token_expires_at,
      email,
    ]);

    // TODO: Send email to user

    res.status(200).json({
      message: "Reset password email sent",
    });
  } catch (error) {
    const error_message = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({
      message: error_message,
    });
  }
};

export const resetPassword = async (
  req: Request<unknown, unknown, Pick<AuthRequestBody, "email" | "reset_password_token" | "password">>,
  res: Response
): Promise<void> => {
  try {
    const { email, reset_password_token, password } = req.body;

    const [user] = await db.query<User[]>("SELECT * FROM users WHERE email = ? AND reset_password_token = ?", [
      email,
      reset_password_token,
    ]);

    if (!user[0]) {
      res.status(400).json({
        message: "Invalid reset password token",
      });
      return;
    }

    if (user[0].reset_password_token_expires_at && user[0].reset_password_token_expires_at < Date.now()) {
      res.status(400).json({
        message: "Reset password token expired",
      });
      return;
    }

    const hashed_password = await bcrypt.hash(password, 10);
    await db.query(
      "UPDATE users SET password = ?, reset_password_token = NULL, reset_password_token_expires_at = NULL WHERE email = ?",
      [hashed_password, email]
    );

    res.json({
      message: "Reset password email sent",
    });
  } catch (error) {
    const error_message = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({
      message: error_message,
    });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie("refresh_token");

  res.status(200).json({
    message: "Successfully logged out",
  });
};
