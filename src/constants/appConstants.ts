/**
 * Application constants
 */

export const APP_CONFIG = {
  APP_NAME: 'CropDesk',
  APP_VERSION: '3.0.0',
  APP_DESCRIPTION: 'Smart Farm Management Platform',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  API_TIMEOUT: 30000,
};

export const FEATURE_FLAGS = {
  ENABLE_AI_INSIGHTS: true,
  ENABLE_FIS_ALERTS: true,
  ENABLE_WATER_SAVINGS: true,
  ENABLE_DEVICE_MANAGEMENT: true,
  ENABLE_USER_SETTINGS: true,
  ENABLE_INTEGRATIONS: true,
  ENABLE_ADVANCED_ANALYTICS: false,
  ENABLE_REAL_TIME_SYNC: true,
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  SIZES: [10, 25, 50, 100],
};

export const TIME_CONSTANTS = {
  SENSOR_POLL_INTERVAL: 15000, // 15 seconds
  DEVICE_STATUS_POLL_INTERVAL: 10000, // 10 seconds
  ALERT_REFRESH_INTERVAL: 30000, // 30 seconds
  SESSION_TIMEOUT: 1800000, // 30 minutes
};

export const DEVICE_TYPES = {
  WEATHER_STATION: 'weather_station',
  SOIL_SENSOR: 'soil_sensor',
  CAMERA: 'camera',
  IRRIGATION_CONTROLLER: 'irrigation_controller',
};

export const ALERT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const ALERT_TYPES = {
  SENSOR_ANOMALY: 'sensor_anomaly',
  DEVICE_OFFLINE: 'device_offline',
  WEATHER_WARNING: 'weather_warning',
  FIS_ALERT: 'fis_alert',
  CUSTOM: 'custom',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  FARMER: 'farmer',
  TECHNICIAN: 'technician',
};
