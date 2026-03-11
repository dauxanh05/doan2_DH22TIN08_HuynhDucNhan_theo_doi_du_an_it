import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth.store';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

export function resolveApiAssetUrl(assetUrl: string | null | undefined) {
  if (!assetUrl) {
    return assetUrl ?? null;
  }

  if (
    assetUrl.startsWith('http://') ||
    assetUrl.startsWith('https://') ||
    assetUrl.startsWith('data:') ||
    assetUrl.startsWith('blob:')
  ) {
    return assetUrl;
  }

  if (assetUrl.startsWith('/uploads/')) {
    return `${API_ORIGIN}${assetUrl}`;
  }

  if (assetUrl.startsWith('uploads/')) {
    return `${API_ORIGIN}/${assetUrl}`;
  }

  return assetUrl;
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send HTTP-only cookies (refresh token)
});

// Request interceptor — attach access token
api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor — auto refresh on 401
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only handle 401, skip if already retried or refresh endpoint itself failed
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url === '/auth/refresh' ||
      originalRequest.url === '/auth/login' ||
      originalRequest.url === '/auth/logout'
    ) {
      return Promise.reject(error);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            originalRequest._retry = true;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Call refresh endpoint — refresh token is in HTTP-only cookie
      const response = await api.post('/auth/refresh');
      const { accessToken, user } = response.data;

      if (!accessToken || !user) {
        throw new Error('Invalid refresh response');
      }

      // Update store with new token
      useAuthStore.getState().setAuth(user, accessToken);

      // Retry all queued requests with new token
      processQueue(null, accessToken);

      // Retry original request
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh failed — token invalid/expired, force logout
      processQueue(refreshError, null);
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
