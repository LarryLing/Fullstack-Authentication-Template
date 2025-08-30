import type { User } from "@/types/user.type";

import axiosClient, { tokenRefreshClient } from "@/config/axios-client";

import type { ForgotPasswordSchemaType } from "./schemas/forgot-password.schema";
import type { LoginSchemaType } from "./schemas/login.schema";
import type { ResetPasswordSchemaType } from "./schemas/reset-password.schema";
import type { SignUpSchemaType } from "./schemas/signup.schema";

export const getUser = async () => {
  const response = await axiosClient.get("/auth/me");
  return response.data as User;
};

export const login = async (data: LoginSchemaType) => {
  await axiosClient.post("/auth/login", data);
};

export const signup = async (data: SignUpSchemaType) => {
  await axiosClient.post("/auth/signup", data);
};

export const confirmSignup = async (code: string) => {
  await axiosClient.post(`/auth/confirm-signup/${code}`);
};

export const forgotPassword = async (data: ForgotPasswordSchemaType) => {
  await axiosClient.post("/auth/forgot-password", data);
};

export const confirmForgotPassword = async (code: string) => {
  const response = await axiosClient.post(`/auth/confirm-forgot-password/${code}`);
  return response.data as { user_id: User["id"] };
};

export const resetPassword = async (data: ResetPasswordSchemaType & { id: User["id"] }) => {
  await axiosClient.patch(`/auth/reset-password`, data);
};

export const logout = async () => {
  await axiosClient.post("/auth/logout");
};

export const refresh = async () => {
  await tokenRefreshClient.post("/auth/refresh");
};
