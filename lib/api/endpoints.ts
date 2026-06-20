/**
 * API Endpoints
 * 
 * Centralized list of backend API routes. This ensures that any endpoint updates 
 * are done in a single location and propagate throughout the application services.
 * 
 * WHO SHOULD USE IT: Backend service integrators.
 * WHEN TO MODIFY: Adding a new route/endpoint to the application.
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    REFRESH_TOKEN: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile/update',
    LIST: '/admin/users',
  },
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;
