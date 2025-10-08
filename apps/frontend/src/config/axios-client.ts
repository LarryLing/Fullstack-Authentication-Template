import { UNAUTHORIZED } from "@fullstack-template/http/constants";
import axios from "axios";

import { AuthErrorCodes } from "@/errors/auth-error";
import { refresh } from "@/features/auth/auth.api";
import { AUTH_QUERY_KEY } from "@/features/auth/auth.constants";
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
        queryClient.invalidateQueries({ queryKey: [AUTH_QUERY_KEY] });
        navigate?.({ to: "/auth/login", search: { redirect: location.href } });
      }
    }

    return Promise.reject({ status, ...data });
  }
);

export default axiosClient;
