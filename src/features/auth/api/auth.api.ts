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
  login: (credentials: LoginRequest) => apiClient.post<AuthResponse>("/auth/login", credentials),

  /**
   * User registration
   */
  register: (data: RegisterRequest) => apiClient.post<AuthResponse>("/auth/register", data),

  /**
   * Verify OTP
   */
  verifyOTP: (data: VerifyOTPRequest) => apiClient.post("/auth/verify-otp", data),

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
  changePassword: (data: ChangePasswordRequest) => apiClient.post("/auth/change-password", data),

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

  /**
   * Generate 2FA secret and QR code setup
   */
  generate2FA: () => apiClient.post("/auth/2fa/generate"),

  /**
   * Verify TOTP token and enable 2FA
   */
  enable2FA: (token: string) => apiClient.post("/auth/2fa/enable", { token }),

  /**
   * Verify TOTP login token
   */
  verify2FALogin: (tempToken: string, token: string) =>
    apiClient.post("/auth/2fa/verify-login", { tempToken, token }),

  /**
   * Disable 2FA
   */
  disable2FA: () => apiClient.post("/auth/2fa/disable"),
};
