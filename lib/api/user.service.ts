import { apiClient } from './axios';
import { API_ENDPOINTS } from './endpoints';
import { User } from '@/types/auth';

// Toggle mock data usage for independent frontend development
// Set to false to hit the actual process.env.NEXT_PUBLIC_API_URL backend
const USE_MOCKS = true;

// Simulated network latency helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_PROFILE: User = {
  id: 'u-1',
  name: 'Jane Doe',
  email: 'user@example.com',
  role: 'user',
  createdAt: new Date().toISOString(),
};

const MOCK_ADMIN_PROFILE: User = {
  id: 'a-1',
  name: 'Alex Admin',
  email: 'admin@example.com',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

const MOCK_USERS_LIST: User[] = [
  MOCK_PROFILE,
  MOCK_ADMIN_PROFILE,
  {
    id: 'u-2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'user',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'u-3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'user',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

/**
 * User API Service
 * 
 * WHO SHOULD USE IT: Profile components, settings pages, and admin tables.
 * WHEN TO MODIFY: Adding fields like profile images, phone numbers, or administrative actions.
 */
export const userService = {
  /**
   * Retrieve the profile details of the authenticated user
   */
  async getProfile(): Promise<User> {
    if (USE_MOCKS) {
      await delay(500);
      return MOCK_PROFILE;
    }
    const response = await apiClient.get<User>(API_ENDPOINTS.USER.PROFILE);
    return response.data;
  },

  /**
   * Update details of the authenticated user profile
   */
  async updateProfile(name: string, email: string): Promise<User> {
    if (USE_MOCKS) {
      await delay(800);
      return {
        ...MOCK_PROFILE,
        name,
        email,
      };
    }
    const response = await apiClient.put<User>(API_ENDPOINTS.USER.UPDATE_PROFILE, {
      name,
      email,
    });
    return response.data;
  },

  /**
   * Fetch a list of all users in the system (Admin only)
   */
  async listUsers(): Promise<User[]> {
    if (USE_MOCKS) {
      await delay(900);
      return MOCK_USERS_LIST;
    }
    const response = await apiClient.get<User[]>(API_ENDPOINTS.USER.LIST);
    return response.data;
  },
};
