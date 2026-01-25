export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  id: string;
  email: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  status?: string;
  username?: string;
  bio?: string;

  // Hierarchical Data Structure
  farmers?: Farmer[]; // User manages multiple farmers

  // Local Storage / Onboarding fields
  farmerDetails?: any; // To act as a catch-all for the flat structure used in onboarding
  fieldDetails?: any;
  cropDetails?: any;
  isOnboardingComplete?: boolean;

  // Legacy/Flat fields (Deprecated, kept for temporary compatibility if needed)
  farmDetails?: {
    farmName?: string;
    location?: {
      latitude?: string;
      longitude?: string;
      address?: string;
      city?: string;
      country?: string;
    };
    [key: string]: any; // Allow other properties
  };
}

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: {
    village: string;
    district: string;
    state: string;
  };
  farms: Farm[];
}

export interface Farm {
  id: string;
  name: string;
  farmerId?: string; // Relation ID
  location?: any; // Was string, but backend uses Object (address, city, coordinates etc)
  area?: string;
  units?: string;
  fields: Field[];
}

export interface Field {
  id: string;
  name: string;
  area: string; // e.g., "10"
  units: string; // e.g., "acres"
  soilType?: string;
  irrigationMethod?: string;
  boundary?: any; // GeoJSON
  coordinates?: any; // Legacy/Frontend prop
  soil?: any; // Backend prop
  irrigation?: any; // Backend prop
  crops: Crop[];
}

export interface Crop {
  id: string;
  name: string;
  variety?: string;
  sowingDate?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface LogoutResponse {
  message: string;
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
