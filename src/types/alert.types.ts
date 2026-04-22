/**
 * Alert types
 */

export interface Alert {
  id: string;
  farmId: string;
  deviceId?: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'resolved' | 'dismissed';
  type: 'sensor_anomaly' | 'device_offline' | 'weather_warning' | 'fis_alert' | 'custom';
  actionRequired?: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  resolvedAt?: string;
  updatedAt: string;
}

export interface FISAlert {
  id: string;
  farmId: string;
  cropType: string;
  disease: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  weatherData: Record<string, any>;
  createdAt: string;
}

export interface AlertStats {
  total: number;
  pending: number;
  resolved: number;
  bySeverity: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}
