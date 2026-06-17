/**
 * Settings types
 */

export interface UserSettings {
  userId: string;
  notifications: NotificationSettings;
  appearance: AppearanceSettings;
  security: SecuritySettings;
  integrations: IntegrationSettings;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  alertFrequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  criticalOnly: boolean;
  notificationTypes: {
    sensors: boolean;
    devices: boolean;
    alerts: boolean;
    aiInsights: boolean;
    systemUpdates: boolean;
  };
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  densityMode: 'compact' | 'normal' | 'spacious';
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod: 'email' | 'sms' | 'authenticator';
  sessionTimeout: number; // minutes
  loginAlerts: boolean;
  deviceVerification: boolean;
  ipWhitelist?: string[];
}

export interface IntegrationSettings {
  [key: string]: {
    connected: boolean;
    connectedAt?: string;
    accountId?: string;
    settings?: Record<string, any>;
  };
}

export interface ProfileSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
}

export interface FarmSettings {
  farmId: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  size: number; // hectares
  cropType: string[];
  soilType?: string;
  irrigationType?: string;
}
