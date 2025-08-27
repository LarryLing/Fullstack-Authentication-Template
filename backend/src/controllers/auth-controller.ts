import { Request, Response } from "express";

export const email = async (_req: Request, res: Response): Promise<void> => {
  res.json({
    message: "/api/auth/email",
  });
};

export const login = async (_req: Request, res: Response): Promise<void> => {
  res.json({
    message: "/api/auth/login",
  });
};

export const signup = async (_req: Request, res: Response): Promise<void> => {
  res.json({
    message: "/api/auth/signup",
  });
};

export const confirmUser = async (_req: Request, res: Response): Promise<void> => {
  res.json({
    message: "/api/auth/confirm-user",
  });
};

export const forgotPassword = async (_req: Request, res: Response): Promise<void> => {
  res.json({
    message: "/api/auth/forgot-password",
  });
};

export const resetPassword = async (_req: Request, res: Response): Promise<void> => {
  res.json({
    message: "/api/auth/reset-password",
  });
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.json({
    message: "/api/auth/logout",
  });
};
