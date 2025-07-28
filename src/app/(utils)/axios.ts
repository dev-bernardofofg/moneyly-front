import axios, { AxiosError } from "axios";
import { getCookie } from "./cookies";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://sua.api.com",
});

// Interceptor de request (headers, auth, etc.)
api.interceptors.request.use(
  (config) => {
    const token = getCookie("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response (formata erro)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const message = (error.response?.data as any)?.message || "Erro inesperado";

    return Promise.reject({
      status,
      message,
      data: error.response?.data,
    });
  }
);

export default api;
