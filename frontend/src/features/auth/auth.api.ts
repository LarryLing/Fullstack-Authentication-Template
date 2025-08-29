import axiosClient from "@/config/axios-client";

import type { LoginFormType } from "./schemas/login.schema";

export const login = async (data: LoginFormType) => {
  const response = await axiosClient.post("/auth/login", data);
  return response;
};
