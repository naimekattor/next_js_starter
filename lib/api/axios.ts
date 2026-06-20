import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getSession, signOut } from 'next-auth/react';
import { env } from '@/config/env';
import { API_ENDPOINTS } from './endpoints';

/**
 * Configure global Axios instance.
 * 
 * WHO SHOULD USE IT: Any service file interacting with external REST endpoints.
 * WHEN TO MODIFY: Adding global headers, timeouts, or changing interceptor logic.
 */
export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Flag to track refreshing state and request queue
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (reason: unknown) => void;
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

// Request Interceptor: Inject JWT token into Authorization header
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // If running client-side, dynamically fetch the session from NextAuth
    if (typeof window !== 'undefined') {
      const session = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Refresh JWT token on 401 error or format error response
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Auto-refresh token if server returns 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Queue requests while token is refreshing
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const session = await getSession();
        const refreshToken = session?.refreshToken;

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call the endpoint using standard axios (to prevent interceptor recursion)
        const response = await axios.post<{ accessToken: string; refreshToken: string }>(
          `${env.NEXT_PUBLIC_API_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
          { refreshToken }
        );

        const { accessToken } = response.data;

        // Process queued requests
        processQueue(null, accessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Force logout if refresh token validation fails
        if (typeof window !== 'undefined') {
          signOut({ callbackUrl: '/auth/login' });
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Globally capture standard HTTP errors and return friendly responses
    const customError = {
      message: (error.response?.data as { message?: string })?.message || error.message || 'An unexpected error occurred.',
      status: error.response?.status,
      data: error.response?.data,
    };

    return Promise.reject(customError);
  }
);
