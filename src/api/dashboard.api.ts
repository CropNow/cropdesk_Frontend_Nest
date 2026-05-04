/**
 * Dashboard API endpoints
 * Farm health, sensor data, alerts, water savings
 */

import apiClient from './client';

export const dashboardAPI = {
  /**
   * Fetch dashboard overview (summary of all user farms and sensors)
   */
  getDashboardOverview: () =>
    apiClient.get('/dashboard/overview'),

  /**
   * Fetch all farms for the user
   */
  getFarms: () => apiClient.get('/farms'),

  /**
   * Fetch farm statistics
   */
  getFarmStatistics: (farmId: string) =>
    apiClient.get(`/farms/${farmId}/statistics`),

  /**
   * Fetch farm devices
   */
  getFarmDevices: (farmId: string) =>
    apiClient.get(`/farms/${farmId}/devices`),

  /**
   * Fetch all alerts for the user
   */
  getAlerts: (limit?: number) =>
    apiClient.get('/alerts', { params: { limit } }),

  /**
   * Fetch AI insights/predictions for a farm and optionally specific device
   */
  getAIInsights: (farmId: string, deviceId?: string) =>
    apiClient.get(`/predictions/farms/${farmId}`, { params: { deviceId } }),

  /**
   * Fetch specific sensor dashboard context
   */
  getSensorDashboardContext: (sensorId: string) =>
    apiClient.get(`/sensors/${sensorId}/dashboard-context`),
};
