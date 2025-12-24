import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

export const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  withCredentials: true,
  timeout: 10000,
});

http.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event('unauthorized'));
    }
    return Promise.reject(error);
  }
);
