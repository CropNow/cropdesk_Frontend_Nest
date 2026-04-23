/**
 * Centralized API client configuration
 * Handles base URL, interceptors, error handling, and request/response transformation
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// API Client instance
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://4.186.31.224:8081/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    // Add auth token if available (except for login and register)
    const token = localStorage.getItem('authToken');
    const isAuthRoute = config.url?.includes('login') || config.url?.includes('register') || config.url?.includes('verify-otp');
    
    if (token && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ [API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error: AxiosError) => {
    console.error(`❌ [API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data || error.message);
    const isAuthRoute = error.config?.url?.includes('login') || error.config?.url?.includes('register') || error.config?.url?.includes('verify-otp');

    // Handle 401 - Unauthorized
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }

    // Handle 403 - Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response?.data);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
