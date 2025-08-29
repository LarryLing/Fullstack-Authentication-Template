import axiosClient from "@/config/axios-client";

import type { ConfirmEmailFormType } from "./schemas/confirm-email.schema";
import type { EmailFormType } from "./schemas/email.schema";
import type { LoginFormType } from "./schemas/login.schema";
import type { ResetPasswordFormType } from "./schemas/reset-password.schema";
import type { SignUpFormType } from "./schemas/signup.schema";

export const email = async (data: EmailFormType) => {
  return await axiosClient.post("/auth/email", data);
};

export const signup = async (data: SignUpFormType & { email: string }) => {
  return await axiosClient.post("/auth/signup", data);
};

export const confirmEmail = async (data: Omit<ConfirmEmailFormType, "confirmPassword"> & { email: string }) => {
  return await axiosClient.post("/auth/confirm-email", data);
};

export const resetPassword = async (data: ResetPasswordFormType & { email: string }) => {
  return await axiosClient.post("/auth/reset-password", data);
};

export const login = async (data: LoginFormType & { email: string }) => {
  return await axiosClient.post("/auth/login", data);
};
