/**
 * Authentication API endpoints
 */

import apiClient from './client';
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types';

export const authAPI = {
  /**
   * User login
   */
  login: (credentials: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', credentials),

  /**
   * User registration
   */
  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>('/auth/register', data),

  /**
   * User logout
   */
  logout: () => apiClient.post('/auth/logout'),

  /**
   * Refresh auth token
   */
  refreshToken: () => apiClient.post<AuthResponse>('/auth/refresh'),

  /**
   * Verify token validity
   */
  verifyToken: () => apiClient.get('/auth/verify'),
};
