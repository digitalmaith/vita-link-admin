// =============================================
// VITA-LINK ADMIN — HTTP Client
// Principe S : une seule responsabilité = gérer les requêtes HTTP
// Principe D : les services dépendent de cette abstraction, pas d'axios directement
// =============================================

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { ApiError } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://vita-link-api.onrender.com/api";

// --- Création de l'instance ---

const httpClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Interceptor Request : injecter le token ---

httpClient.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis localStorage (côté client seulement)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("vita-link-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Interceptor Response : normaliser les erreurs ---

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
      apiError.errors = data.errors;
    }

    // Rediriger vers login si 401
    if (apiError.statusCode === 401 && typeof window !== "undefined") {
      window.location.href = "/login";
    }

    return Promise.reject(apiError);
  }
);

// --- Helpers typés ---

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
