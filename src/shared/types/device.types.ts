/**
 * Device types
 */

export interface Device {
  id: string;
  farmId: string;
  name: string;
  type: 'weather_station' | 'soil_sensor' | 'camera' | 'irrigation_controller';
  status: 'active' | 'inactive' | 'error';
  location: {
    latitude: number;
    longitude: number;
    name?: string;
  };
  lastSyncAt: string;
  batteryLevel?: number;
  signalStrength?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DeviceStatus {
  deviceId: string;
  status: 'online' | 'offline';
  lastSync: string;
  batteryLevel?: number;
  signalStrength?: number;
  errorMessage?: string;
}

export interface DeviceConfig {
  id: string;
  deviceId: string;
  samplingInterval: number; // minutes
  reportingInterval: number; // minutes
  alertThresholds: Record<string, { min: number; max: number }>;
  customSettings?: Record<string, any>;
}
