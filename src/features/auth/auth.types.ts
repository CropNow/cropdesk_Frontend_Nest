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
  onboarding?: {
    isComplete: boolean;
    hasSensor: boolean;
  };

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
  description?: string;
  farmerId?: string; // Relation ID
  location?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  area?: number;
  unit?: string;
  soilType?: string;
  irrigationType?: string;
  farmingType?: string;
  fields: Field[];
}

export interface Field {
  id: string;
  name: string;
  description?: string;
  area: number;
  unit: string; // 'acres', 'hectares', 'sqft', 'sqm'
  soil?: {
    type: string; // 'clay', 'sandy', 'loamy', etc.
    ph?: number;
    organicCarbon?: number;
    nitrogen?: number;
    phosphorus?: number;
    potassium?: number;
  };
  irrigation?: {
    type?: string;
    waterSource?: string;
  };
  boundary: {
    type: string; // 'Polygon'
    coordinates: number[][][];
  }; // GeoJSON Polygon
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  }; // GeoJSON Point (Centroid)
  crops: Crop[];
  // Frontend helpers
  soilType?: string;
  irrigationMethod?: string;
  boundaryType?: string;
  coordinates?: any;
}

export interface Crop {
  id: string;
  name: string;
  variety?: string;
  sowingDate?: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  accessToken: string;
  refreshToken?: string;
  data: {
    user: User;
    onboarding: {
      isComplete: boolean;
      hasSensor: boolean;
    };
  };
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
