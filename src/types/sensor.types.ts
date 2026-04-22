/**
 * Sensor types
 */

export interface SensorReading {
  id: string;
  sensorId: string;
  deviceId: string;
  type: string;
  value: number;
  unit: string;
  timestamp: string;
  status: 'normal' | 'warning' | 'alert';
}

export interface SensorCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  sensors: Sensor[];
}

export interface Sensor {
  id: string;
  name: string;
  type: string;
  unit: string;
  minValue: number;
  maxValue: number;
  precision: number;
  category: string;
}

export interface SensorHistory {
  timestamp: string;
  value: number;
  status: 'normal' | 'warning' | 'alert';
}

export interface SensorCalibration {
  sensorId: string;
  lastCalibration: string;
  nextCalibration: string;
  offset: number;
  scale: number;
  notes?: string;
}
