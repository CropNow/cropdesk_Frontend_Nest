/**
 * User API endpoints
 * User profile, avatar, account management
 */

import apiClient from './client';

export const userAPI = {
  /**
   * Get current user profile
   */
  getProfile: () => apiClient.get('/users/profile'),

  /**
   * Get current authenticated user
   */
  getMe: () => apiClient.get('/users/me'),

  /**
   * Update user profile
   */
  updateProfile: (data: any) =>
    apiClient.patch('/users/me', data),

  /**
   * Upload user avatar
   */
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Delete user avatar
   */
  deleteAvatar: () => apiClient.delete('/users/avatar'),

  /**
   * Change user password
   */
  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.post('/users/change-password', { currentPassword, newPassword }),

  /**
   * Request password reset
   */
  requestPasswordReset: (email: string) =>
    apiClient.post('/users/forgot-password', { email }),

  /**
   * Reset password with token
   */
  resetPassword: (token: string, newPassword: string) =>
    apiClient.post('/users/reset-password', { token, newPassword }),

  /**
   * Delete account
   */
  deleteAccount: (password: string) =>
    apiClient.delete('/users/account', { data: { password } }),
};
