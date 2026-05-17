import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { getSession } from "next-auth/react";
import type { ApiError } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://vita-link-api.onrender.com/api";

const httpClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Ping au démarrage pour réveiller Render
if (typeof window !== "undefined") {
  fetch(`${BASE_URL}/health`).catch(() => {});
}

httpClient.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: "Une erreur inattendue s'est produite.",
      statusCode: error.response?.status ?? 500,
    };
    if (error.response?.data) {
      const data = error.response.data as Partial<ApiError>;
      apiError.message = data.message ?? apiError.message;
    }
    if (apiError.statusCode === 401 && typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return Promise.reject(apiError);
  }
);

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    httpClient.get<T>(url, config).then((r) => r.data),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    httpClient.post<T>(url, data, config).then((r) => r.data),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    httpClient.put<T>(url, data, config).then((r) => r.data),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    httpClient.patch<T>(url, data, config).then((r) => r.data),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    httpClient.delete<T>(url, config).then((r) => r.data),
};

export default httpClient;