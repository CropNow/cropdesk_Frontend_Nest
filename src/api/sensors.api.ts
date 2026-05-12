/**
 * Sensors API endpoints
 */

import apiClient from './client';

export const sensorsAPI = {
  /**
   * Get all sensors
   */
  getSensors: (params?: any) => apiClient.get('/sensors', { params }),

  /**
   * Get all sensors
   */
  getSensorCategories: () =>
    apiClient.get('/sensors/categories'),

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
   * Update sensor calibration
   */
  updateSensorCalibration: (deviceId: string, data: any) =>
    apiClient.patch(`/sensors/${deviceId}/calibration`, data),

  /**
   * Create a new sensor
   */
  createSensor: (data: any) => apiClient.post('/sensors', data),

  /**
   * Export sensor data
   */
  exportData: (params: any) => apiClient.get('/sensor-data/export', { params }),

  /**
   * Update a sensor
   */
  updateSensor: (sensorId: string, data: any) =>
    apiClient.patch(`/sensors/${sensorId}`, data),

  /**
   * Delete a sensor
   */
  deleteSensor: (sensorId: string) =>
    apiClient.delete(`/sensors/${sensorId}`),

  /**
   * Get Nest device data for a specific deviceId and date
   * @param deviceId - Device serial number e.g. "01"
   * @param date - Date in YYYY/MM/DD format e.g. "2026/05/06"
   */
  getNestDeviceData: (deviceId: string, date: string) =>
    apiClient.get('/nest-device/data', { params: { deviceId, date } }),
};


