export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  status?: string;
  username?: string;
  farmDetails?: {
    farmName?: string;
    location?: {
      latitude?: string;
      longitude?: string;
      address?: string;
      city?: string;
      country?: string;
    };
  };
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface RegisterRequest {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export interface ResetPasswordRequest {
  password: string;
  confirmPassword: string;
}
