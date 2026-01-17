import { http } from '@/services/http';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from './auth.types';

// Mock User Data (Still used for fallback/mock structure if needed, but primary is API)
const MOCK_USER: User = {
  id: 'mock-user-123',
  email: 'farmer@cropdesk.local',
  firstName: 'John',
  lastName: 'Doe',
  role: 'farmer',
  username: 'Farmer John',
  farmDetails: {
    farmName: 'Green Valley Farm',
    location: {
      latitude: '28.61',
      longitude: '77.20',
      address: '123 Farm Road',
      city: 'New Delhi',
      country: 'India',
    },
  },
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await http.post<LoginResponse>('/auth/login', data);
  console.log('Login Response from the auth.api.ts', response);
  return response.data;
};

export const register = async (
  data: RegisterRequest
): Promise<LoginResponse> => {
  const response = await http.post<LoginResponse>('/auth/register', data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  // If backend has a logout endpoint:
  // await http.post('/auth/logout');
  // Ensure we DO NOT clear 'registeredUser' (which is our client-side DB)
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
  // localStorage.clear(); // DATA LOSS RISK: Don't use clear()
  return;
};

export const resetPassword = async (data: any): Promise<void> => {
  await http.post('/auth/reset-password', data);
};

export const getMe = async (): Promise<User> => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }

  try {
    // Attempt to fetch real user from backend
    const response = await http.get<User>('/auth/me');
    let user = response.data;

    // MERGE LOCAL DATA: Check if we have richer local data (from onboarding)
    const localUserStr = localStorage.getItem('registeredUser');
    if (localUserStr) {
      try {
        const localUser = JSON.parse(localUserStr);
        // Only merge if it looks like the same user (or we are in a mock/dev environment where IDs might differ but intent is same)
        // For strictness we could check IDs, but since backend might return generated ID and local has 'mock-id', we might skip ID check or loose check.
        // For now, we assume the local data is the "source of truth" for profile extensions.
        user = {
          ...user,
          ...localUser,
          // Ensure ID from backend takes precedence if we want to sync, OR local if we are fully mocking.
          // Let's keep backend ID but overlay profile details.
          id: user.id,
          email: user.email, // Trust backend for auth fields
          username: user.username, // Trust backend for auth fields
        };
        // Explicitly overlay nested objects if they exist locally but not on backend (common in partial mock)
        if (localUser.farmerDetails)
          user.farmerDetails = localUser.farmerDetails;
        if (localUser.farmDetails) user.farmDetails = localUser.farmDetails;
        if (localUser.fieldDetails) user.fieldDetails = localUser.fieldDetails;
        if (localUser.cropDetails) user.cropDetails = localUser.cropDetails;
        if (localUser.isOnboardingComplete)
          user.isOnboardingComplete = localUser.isOnboardingComplete;
      } catch (e) {
        console.warn('Failed to parse local user data for merge', e);
      }
    }

    return user;
  } catch (error) {
    console.error('Failed to fetch user from backend', error);
    // STRICT: If API fails (invalid token, server error), we must NOT allow access.
    // No fallbacks to localStorage or Mock user.
    throw error;
  }
};
