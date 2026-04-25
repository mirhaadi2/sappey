import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Create axios instance with session-based auth (HttpOnly cookies)
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  // timeout: 30000, // 30 seconds - increased for slower networks
  withCredentials: true, // Automatically send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Log all requests
api.interceptors.request.use(
  (config) => {
    const timestamp = new Date().toISOString();
    console.log(`[API] ${timestamp} → ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Log all responses
api.interceptors.response.use(
  (response) => {
    const timestamp = new Date().toISOString();
    console.log(`[API] ${timestamp} ✓ ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    const timestamp = new Date().toISOString();
    const errorMsg = error.response?.data?.message || error.message;
    const status = error.response?.status || 'TIMEOUT';
    console.error(`[API] ${timestamp} ✗ ${status} ${error.config?.url} - ${errorMsg}`);
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event('website-auth-unauthorized'));
    }
    return Promise.reject(error);
  }
);

// No response interceptor for 401 - let auth services handle it gracefully
// This prevents infinite redirects during initial auth checks

// Generic API methods
export const apiMethods = {
  get: <T = any>(url: string, params?: any): Promise<AxiosResponse<T>> =>
    api.get(url, { params }),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    api.post(url, data, config),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    api.put(url, data, config),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> =>
    api.patch(url, data, config),

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