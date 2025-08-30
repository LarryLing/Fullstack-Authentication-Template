import axios from "axios";

const options = {
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
};

const axiosClient = axios.create(options);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status, data } = error.response;
    return Promise.reject({ status, ...data });
  }
);

export default axiosClient;
