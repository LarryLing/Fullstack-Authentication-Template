import type { User } from "@/types/user.type";

import axiosClient from "@/config/axios-client";

import type { ForgotPasswordFormType } from "./schemas/forgot-password.schema";
import type { LoginFormType } from "./schemas/login.schema";
import type { ResetPasswordFormType } from "./schemas/reset-password.schema";
import type { SignUpFormType } from "./schemas/signup.schema";

export const login = async (data: LoginFormType) => {
  return await axiosClient.post("/auth/login", data);
};

export const signup = async (data: SignUpFormType) => {
  return await axiosClient.post("/auth/signup", data);
};

export const confirmSignup = async (code: string) => {
  return await axiosClient.post(`/auth/signup/confirm/${code}`);
};

export const forgotPassword = async (data: ForgotPasswordFormType) => {
  return await axiosClient.post("/auth/forgot-password", data);
};

export const confirmForgotPassword = async (code: string) => {
  return await axiosClient.post(`/auth/forgot-password/confirm/${code}`);
};

export const resetPassword = async (data: ResetPasswordFormType & { id: User["id"] }) => {
  return await axiosClient.patch("/auth/reset-password", data);
};
