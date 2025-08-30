import axios from "axios";

import { UNAUTHORIZED } from "@/constants/http";
import { AuthErrorCodes } from "@/errors/auth-error";
import { refresh } from "@/features/auth/auth.api";
import { AUTH } from "@/features/auth/contexts/auth.provider";
import { navigate } from "@/lib/navigation";

import queryClient from "./query-client";

const options = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
};

export const tokenRefreshClient = axios.create(options);
tokenRefreshClient.interceptors.response.use((response) => response);

const axiosClient = axios.create(options);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const { status, data } = response || {};

    if (status === UNAUTHORIZED && data.code === AuthErrorCodes.MISSING_ACCESS_TOKEN) {
      try {
        await refresh();
        return tokenRefreshClient.request(config);
      } catch {
        queryClient.invalidateQueries({ queryKey: [AUTH] });
        navigate?.({ to: "/auth/login", search: { redirect: location.href } });
      }
    }

    return Promise.reject({ status, ...data });
  }
);

export default axiosClient;
