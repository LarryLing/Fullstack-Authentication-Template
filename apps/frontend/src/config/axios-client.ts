import AuthError, { AUTH_ERROR_CODES } from "@fullstack-template/error/auth-error";
import GenericError from "@fullstack-template/error/generic-error";
import { HTTP_STATUS_CODES } from "@fullstack-template/http/http";
import axios from "axios";

import { AUTH_QUERY_KEYS } from "@/constants/query-keys";
import { refresh } from "@/features/auth/auth.api";
import { navigate } from "@/lib/navigation";

import queryClient from "./query-client";

const options = {
  baseURL: "/api",
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

    if (status === HTTP_STATUS_CODES.UNAUTHORIZED && data.code === AUTH_ERROR_CODES.MISSING_ACCESS_TOKEN) {
      try {
        await refresh();
        return tokenRefreshClient.request(config);
      } catch {
        queryClient.setQueryData([AUTH_QUERY_KEYS.USER], null);
        navigate?.({ to: "/login", search: { redirect: location.href } });
      }
    }

    if (data.code && data.message && status) {
      if (Object.values(AUTH_ERROR_CODES).includes(data.code)) {
        throw new AuthError({
          code: data.code,
          message: data.message,
          status,
        });
      }

      throw new GenericError({
        code: data.code,
        message: data.message,
        status,
      });
    }

    return Promise.reject({ status, ...data });
  }
);

export default axiosClient;
