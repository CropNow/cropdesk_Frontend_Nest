/**
 * Centralized API client configuration
 * Handles base URL, interceptors, error handling, and request/response transformation
 */
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

// API Client instance
const apiClient: AxiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    (() => {
      throw new Error(
        "VITE_API_BASE_URL is not set. Create a .env file with VITE_API_BASE_URL=https://apis.cropdesk.in/api/v1",
      );
    })(),
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("authToken");
    const isAuthRoute =
      config.url?.includes("login") ||
      config.url?.includes("register") ||
      config.url?.includes("verify-otp");

    if (token && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const isAuthRoute =
      error.config?.url?.includes("login") ||
      error.config?.url?.includes("register") ||
      error.config?.url?.includes("verify-otp");

    // Handle 401 - Unauthorized
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default apiClient;
