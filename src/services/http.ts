import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

export const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  timeout: 30000,
});
// console.log('api base url=', import.meta.env.VITE_API_BASE_URL);
// Request interceptor for logging
http.interceptors.request.use(
  (config) => {
    console.log(
      `[HTTP Request] ${config.method?.toUpperCase()} ${config.url}`,
      config.data
    );
    return config;
  },
  (error) => {
    console.error('[HTTP Request Error]', error);
    return Promise.reject(error);
  }
);

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // console.log('Checking Auth Header:', `Bearer ${token.substring(0, 10)}...`);
  } else {
    console.warn('HTTP Request missing Authorization token');
  }
  return config;
});

http.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(
      `[HTTP Response] ${response.status} ${response.config.url}`,
      response.data
    );
    return response;
  },
  (error: AxiosError) => {
    console.error('[HTTP Response Error]', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event('unauthorized'));
    }
    return Promise.reject(error);
  }
);
