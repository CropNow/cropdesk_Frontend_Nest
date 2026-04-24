/**
 * Sensors API endpoints
 */

import apiClient from './client';

export const sensorsAPI = {
  /**
   * Get all sensors
   */
  getSensors: () =>
    apiClient.get('/sensors'),

  /**
   * Get sensor details
   */
  getSensor: (sensorId: string) =>
    apiClient.get(`/sensors/${sensorId}`),

  /**
   * Get dashboard context for a sensor
   */
  getSensorDashboardContext: (sensorId: string) =>
    apiClient.get(`/sensors/${sensorId}/dashboard-context`),

  /**
   * Get historical readings (supports filters)
   */
  getHistoricalData: (params?: any) =>
    apiClient.get('/sensor-data', { params }),

  /**
   * Get the most recent reading for all sensors
   */
  getLatestForAll: () =>
    apiClient.get('/sensor-data/latest'),

  /**
   * Get historical data for a specific sensor
   */
  getSensorData: (sensorId: string, params?: any) =>
    apiClient.get(`/sensor-data/sensors/${sensorId}`, { params }),

  /**
   * Get the latest reading for a specific sensor
   */
  getLatestReading: (sensorId: string) =>
    apiClient.get(`/sensor-data/sensors/${sensorId}/latest`),

  /**
   * Get min/max/avg over time
   */
  getAggregatedData: (sensorId: string, params?: any) =>
    apiClient.get(`/sensor-data/sensors/${sensorId}/aggregate`, { params }),
  /**
   * Export sensor data
   */
  exportData: (params: {
    sensorId: string;
    format?: string;
    startDate?: string;
    endDate?: string;
    email?: boolean;
  }) => apiClient.get('/sensor-data/export', { params }),
};

