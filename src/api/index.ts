import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Create axios instance with session-based auth (HttpOnly cookies)
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Automatically send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// No response interceptor for 401 - let auth services handle it gracefully
// This prevents infinite redirects during initial auth checks

// Generic API methods
export const apiMethods = {
  get: <T = any>(url: string, params?: any): Promise<AxiosResponse<T>> =>
    api.get(url, { params }),

  post: <T = any>(url: string, data?: any): Promise<AxiosResponse<T>> =>
    api.post(url, data),

  put: <T = any>(url: string, data?: any): Promise<AxiosResponse<T>> =>
    api.put(url, data),

  patch: <T = any>(url: string, data?: any): Promise<AxiosResponse<T>> =>
    api.patch(url, data),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    api.delete(url, config),

  // File upload method
  upload: <T = any>(url: string, formData: FormData): Promise<AxiosResponse<T>> =>
    api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};


export default api;