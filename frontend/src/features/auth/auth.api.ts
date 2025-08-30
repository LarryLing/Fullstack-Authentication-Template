import axiosClient from "@/config/axios-client";

import type { ForgotPasswordSchemaType } from "./schemas/forgot-password.schema";
import type { LoginSchemaType } from "./schemas/login.schema";
import type { ResetPasswordSchemaType } from "./schemas/reset-password.schema";
import type { SignUpSchemaType } from "./schemas/signup.schema";

export const getUser = async () => {
  const response = await axiosClient.get("/auth/me");
  return response.data;
};

export const login = async (data: LoginSchemaType) => {
  const response = await axiosClient.post("/auth/login", data);
  return response.data;
};

export const signup = async (data: SignUpSchemaType) => {
  const response = await axiosClient.post("/auth/signup", data);
  return response.data;
};

export const confirmSignup = async (code: string) => {
  const response = await axiosClient.post(`/auth/confirm-signup/${code}`);
  return response.data;
};

export const forgotPassword = async (data: ForgotPasswordSchemaType) => {
  const response = await axiosClient.post("/auth/forgot-password", data);
  return response.data;
};

export const resetPassword = async (data: ResetPasswordSchemaType & { code: string }) => {
  const response = await axiosClient.patch(`/auth/reset-password/${data.code}`, data);
  return response.data;
};

export const logout = async () => {
  const response = await axiosClient.post("/auth/logout");
  return response.data;
};
