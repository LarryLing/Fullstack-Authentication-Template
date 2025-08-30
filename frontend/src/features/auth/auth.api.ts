import axiosClient from "@/config/axios-client";

import type { ForgotPasswordFormType } from "./schemas/forgot-password.schema";
import type { LoginFormType } from "./schemas/login.schema";
import type { ResetPasswordFormType } from "./schemas/reset-password.schema";
import type { SignUpFormType } from "./schemas/signup.schema";

export const getUser = async () => {
  const response = await axiosClient.get("/auth/me");
  return response.data;
};

export const login = async (data: LoginFormType) => {
  const response = await axiosClient.post("/auth/login", data);
  return response.data;
};

export const signup = async (data: SignUpFormType) => {
  const response = await axiosClient.post("/auth/signup", data);
  return response.data;
};

export const confirmSignup = async (code: string) => {
  const response = await axiosClient.post(`/auth/confirm-signup/${code}`);
  return response.data;
};

export const forgotPassword = async (data: ForgotPasswordFormType) => {
  const response = await axiosClient.post("/auth/forgot-password", data);
  return response.data;
};

export const resetPassword = async (data: ResetPasswordFormType & { code: string }) => {
  const response = await axiosClient.patch(`/auth/reset-password/${data.code}`, data);
  return response.data;
};
