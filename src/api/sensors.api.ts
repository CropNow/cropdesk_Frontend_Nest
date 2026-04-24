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
   * Get sensor categories
   */
  getSensorCategories: () =>
    apiClient.get('/sensors/categories'),

  /**
   * Get current sensor readings for a device
   */
  getSensorReadings: (deviceId: string) =>
    apiClient.get(`/sensors/device/${deviceId}/readings`),

  /**
   * Get sensor reading history
   */
  getSensorHistory: (
    deviceId: string,
    sensorType: string,
    startDate: string,
    endDate: string
  ) =>
    apiClient.get(`/sensors/device/${deviceId}/history`, {
      params: { sensorType, startDate, endDate },
    }),

  /**
   * Get sensor calibration info
   */
  getSensorCalibration: (deviceId: string) =>
    apiClient.get(`/sensors/${deviceId}/calibration`),

  /**
   * Update sensor calibration
   */
  updateSensorCalibration: (deviceId: string, data: any) =>
    apiClient.patch(`/sensors/${deviceId}/calibration`, data),

  /**
   * Create a new sensor
   */
  createSensor: (data: any) => apiClient.post('/sensors', data),
};
