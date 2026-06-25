/**
 * Sensors API endpoints
 */

import apiClient from "@services/api/apiClient";
import type { SensorCalibration } from "@shared/types/sensor.types";

export interface GetSensorsParams {
  fieldId?: string;
}

export interface HistoricalDataParams {
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

export interface AggregatedDataParams {
  range?: string;
  aggregation?: string;
  metric?: string;
}

export interface CreateSensorData {
  name: string;
  type: string;
  fieldId: string;
  unit: string;
  serialNumber: string;
  manufacturer?: string;
}

export type UpdateSensorData = Partial<
  Pick<CreateSensorData, "name" | "type" | "unit" | "serialNumber" | "manufacturer">
>;

export type UpdateCalibrationData = Partial<Pick<SensorCalibration, "offset" | "scale" | "notes">>;

export interface ExportDataParams {
  sensorId: string;
  format: string;
  range?: string;
  email?: boolean;
}

export const sensorsAPI = {
  /**
   * Get all sensors
   */
  getSensors: (params?: GetSensorsParams) => apiClient.get("/sensors", { params }),

  /**
   * Get all sensors
   */
  getSensorCategories: () => apiClient.get("/sensors/categories"),

  /**
   * Get sensor details
   */
  getSensor: (sensorId: string) => apiClient.get(`/sensors/${sensorId}`),

  /**
   * Get dashboard context for a sensor
   */
  getSensorDashboardContext: (sensorId: string) =>
    apiClient.get(`/sensors/${sensorId}/dashboard-context`),

  /**
   * Get historical readings (supports filters)
   */
  getHistoricalData: (params?: HistoricalDataParams) => apiClient.get("/sensor-data", { params }),

  /**
   * Get the most recent reading for all sensors
   */
  getLatestForAll: () => apiClient.get("/sensor-data/latest"),

  /**
   * Get historical data for a specific sensor
   */
  getSensorData: (sensorId: string, params?: HistoricalDataParams) =>
    apiClient.get(`/sensor-data/sensors/${sensorId}`, { params }),

  /**
   * Get the latest reading for a specific sensor
   */
  getLatestReading: (sensorId: string) => apiClient.get(`/sensor-data/sensors/${sensorId}/latest`),

  /**
   * Get min/max/avg over time
   */
  getAggregatedData: (sensorId: string, params?: AggregatedDataParams) =>
    apiClient.get(`/sensor-data/sensors/${sensorId}/aggregate`, { params }),

  /**
   * Get device logs
   */
  getDeviceLogs: (sensorId: string) => apiClient.get(`/sensors/${sensorId}/device-logs`),

  /**
   * Update sensor calibration
   */
  updateSensorCalibration: (deviceId: string, data: UpdateCalibrationData) =>
    apiClient.patch(`/sensors/${deviceId}/calibration`, data),

  /**
   * Create a new sensor
   */
  createSensor: (data: CreateSensorData) => apiClient.post("/sensors", data),

  /**
   * Export sensor data
   */
  exportData: (params: ExportDataParams) => apiClient.get("/sensor-data/export", { params }),

  /**
   * Update a sensor
   */
  updateSensor: (sensorId: string, data: UpdateSensorData) =>
    apiClient.patch(`/sensors/${sensorId}`, data),

  /**
   * Delete a sensor
   */
  deleteSensor: (sensorId: string) => apiClient.delete(`/sensors/${sensorId}`),

  /**
   * Get Nest device data for a specific deviceId and date
   * @param deviceId - Device serial number e.g. "01"
   * @param date - Date in YYYY/MM/DD format e.g. "2026/05/06"
   */
  getNestDeviceData: (deviceId: string, date: string) =>
    apiClient.get("/nest-device/data", { params: { deviceId, date } }),
};
