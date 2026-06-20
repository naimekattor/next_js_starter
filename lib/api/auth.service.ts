import { apiClient } from './axios';
import { API_ENDPOINTS } from './endpoints';
import { AuthResponse, ForgotPasswordResponse, ResetPasswordResponse, User } from '@/types/auth';

// Toggle mock data usage for independent frontend development
// Set to false to hit the actual process.env.NEXT_PUBLIC_API_URL backend
const USE_MOCKS = true;

// Mock user store for local testing
const MOCK_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Jane Doe',
    email: 'user@example.com',
    role: 'user',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a-1',
    name: 'Alex Admin',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
];

// Simulated network latency helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Authentication API Service
 * 
 * WHO SHOULD USE IT: Components/Slices managing user session states.
 * WHEN TO MODIFY: Integrating new auth options, updating fields, or transitioning to real API routes.
 */
export const authService = {
  /**
   * Authenticate a user using email and password
   */
  async login(email: string, password?: string): Promise<AuthResponse> {
    if (USE_MOCKS) {
      await delay(800);
      const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        throw { message: 'Invalid credentials. Please use user@example.com or admin@example.com.', status: 401 };
      }
      return {
        user,
        accessToken: `mock-access-token-for-${user.id}`,
        refreshToken: `mock-refresh-token-for-${user.id}`,
      };
    }

    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Register a new user account
   */
  async signup(name: string, email: string, password?: string): Promise<AuthResponse> {
    if (USE_MOCKS) {
      await delay(1000);
      const exists = MOCK_USERS.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        throw { message: 'Email is already registered.', status: 400 };
      }
      const newUser: User = {
        id: `u-${Math.random().toString(36).substring(2, 9)}`,
        name,
        email,
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      return {
        user: newUser,
        accessToken: `mock-access-token-for-${newUser.id}`,
        refreshToken: `mock-refresh-token-for-${newUser.id}`,
      };
    }

    const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.SIGNUP, {
      name,
      email,
      password,
    });
    return response.data;
  },

  /**
   * Request password reset link sent to an email
   */
  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    if (USE_MOCKS) {
      await delay(600);
      return { message: `A password reset link has been successfully sent to ${email}` };
    }
    const response = await apiClient.post<ForgotPasswordResponse>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email,
    });
    return response.data;
  },

  /**
   * Update password using a token from forgotPassword
   */
  async resetPassword(password: string, token: string): Promise<ResetPasswordResponse> {
    if (USE_MOCKS) {
      await delay(800);
      if (!token || token.length < 5) {
        throw { message: 'Invalid or expired password reset token.', status: 400 };
      }
      return { message: 'Password has been successfully updated.' };
    }
    const response = await apiClient.post<ResetPasswordResponse>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      password,
      token,
    });
    return response.data;
  },
};
