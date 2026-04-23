/**
 * Dashboard API endpoints
 * Farm health, sensor data, alerts, water savings
 */

import apiClient from './client';

export const dashboardAPI = {
  /**
   * Fetch farm health metrics
   */
  getFarmHealth: (farmId: string) =>
    apiClient.get(`/dashboard/farm-health/${farmId}`),

  /**
   * Fetch sensor data summary
   */
  getSensorDataSummary: (farmId: string) =>
    apiClient.get(`/dashboard/sensors/${farmId}`),

  /**
   * Fetch alerts overview
   */
  getAlerts: (farmId: string, limit?: number) =>
    apiClient.get(`/dashboard/alerts/${farmId}`, { params: { limit } }),

  /**
   * Fetch water savings data
   */
  getWaterSavings: (farmId: string, period?: 'day' | 'week' | 'month') =>
    apiClient.get(`/dashboard/water-savings/${farmId}`, { params: { period } }),

  /**
   * Fetch AI insights summary
   */
  getAIInsightsSummary: (farmId: string) =>
    apiClient.get(`/dashboard/ai-insights/${farmId}`),

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
   * Fetch farm devices context
   */
  getFarmDevices: (farmId: string) =>
    apiClient.get(`/farms/${farmId}/devices`),

  /**
   * Fetch dashboard context (all sensors, fields, farms, crops)
   */
  getDashboardContext: (sensorId: string) =>
    apiClient.get(`/sensors/${sensorId}/dashboard-context`),
};
