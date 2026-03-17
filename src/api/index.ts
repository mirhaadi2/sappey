import axios, { AxiosInstance, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Enable sending cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Axios headers can be a plain object or an AxiosHeaders instance.
      // Clone and update safely while keeping TypeScript happy.
      const existingHeaders = (config.headers ?? {}) as Record<string, string>;
      config.headers = {
        ...existingHeaders,
        Authorization: `Bearer ${token}`,
      } as typeof config.headers;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Only redirect on 401 if the user was previously authenticated (had a token)
    // Profile endpoint 401 is normal for unauthenticated users
    if (error.response?.status === 401) {
      const hadToken = !!localStorage.getItem('auth_token');
      if (hadToken) {
        // Token was expired or invalid
        localStorage.removeItem('auth_token');
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('signin')) {
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);

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