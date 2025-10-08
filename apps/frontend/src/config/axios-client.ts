import { AuthErrorCodes } from "@fullstack-template/error/auth-error";
import { HttpStatusCodes } from "@fullstack-template/http/http";
import axios from "axios";

import { refresh } from "@/features/auth/auth.api";
import { AUTH_QUERY_KEY } from "@/features/auth/auth.constants";
import { navigate } from "@/lib/navigation";

import queryClient from "./query-client";

const { UNAUTHORIZED } = HttpStatusCodes;
const { MISSING_ACCESS_TOKEN } = AuthErrorCodes;

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

    if (status === UNAUTHORIZED && data.code === MISSING_ACCESS_TOKEN) {
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
