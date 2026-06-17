/**
 * Authentication API endpoints
 */

import apiClient from "@services/api/apiClient";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  VerifyOTPRequest,
  ChangePasswordRequest,
} from "@shared/types/auth.types";

export const authAPI = {
  /**
   * User login
   */
  login: (credentials: LoginRequest) =>
    apiClient.post<AuthResponse>("/auth/login", credentials),

  /**
   * User registration
   */
  register: (data: RegisterRequest) =>
    apiClient.post<AuthResponse>("/auth/register", data),

  /**
   * Verify OTP
   */
  verifyOTP: (data: VerifyOTPRequest) =>
    apiClient.post("/auth/verify-otp", data),

  /**
   * Resend OTP
   */
  resendOTP: (email: string) => apiClient.post("/auth/resend-otp", { email }),

  /**
   * User logout
   */
  logout: () => apiClient.post("/auth/logout"),

  /**
   * Refresh auth token
   */
  refreshToken: () => apiClient.post<AuthResponse>("/auth/refresh"),

  /**
   * Verify token validity
   */
  verifyToken: () => apiClient.get("/auth/verify"),

  /**
   * Change user password
   */
  changePassword: (data: ChangePasswordRequest) =>
    apiClient.post("/auth/change-password", data),

  /**
   * Get all active sessions
   */
  getSessions: () => apiClient.get("/auth/sessions"),

  /**
   * Delete all sessions (logout all devices)
   */
  deleteSessions: () => apiClient.delete("/auth/sessions"),

  /**
   * Delete a specific active session
   */
  deleteSession: (id: string) => apiClient.delete(`/auth/sessions/${id}`),
};
