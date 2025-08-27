import jwt from "jsonwebtoken";

export const generateToken = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateAccessToken = (payload: Record<string, unknown>): string => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not set");
  }

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
};

export const generateRefreshToken = (payload: Record<string, unknown>): string => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET is not set");
  }

  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string): Record<string, unknown> => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not set");
  }

  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as Record<string, unknown>;
};

export const verifyRefreshToken = (token: string): Record<string, unknown> => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET is not set");
  }

  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET) as Record<string, unknown>;
};
