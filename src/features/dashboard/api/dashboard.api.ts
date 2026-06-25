/**
 * Dashboard API endpoints
 * Farm health, sensor data, alerts, water savings
 */

import apiClient from "@services/api/apiClient";

export const dashboardAPI = {
  /**
   * Fetch dashboard overview (summary of all user farms and sensors)
   */
  getDashboardOverview: () => apiClient.get("/dashboard/overview"),

  /**
   * Fetch dashboard analytics
   */
  getDashboardAnalytics: (params?: { farmId?: string; deviceId?: string; range?: string }) =>
    apiClient.get("/dashboard/analytics", { params }),

  /**
   * Fetch all farms for the user
   */
  getFarms: () => apiClient.get("/farms"),

  /**
   * Fetch farm statistics
   */
  getFarmStatistics: (farmId: string) => apiClient.get(`/farms/${farmId}/statistics`),

  /**
   * Fetch farm devices
   */
  getFarmDevices: (farmId: string) => apiClient.get(`/farms/${farmId}/devices`),

  /**
   * Fetch all alerts for the user
   */
  getAlerts: (limit?: number) => apiClient.get("/alerts", { params: { limit } }),

  /**
   * Fetch AI insights/predictions for a farm and optionally specific device
   */
  getAIInsights: (farmId: string, deviceId?: string) =>
    apiClient.get(`/predictions/farms/${farmId}`, { params: { deviceId } }),

  /**
   * Export predictions data as CSV
   */
  exportPredictions: (params?: {
    farmId?: string;
    sensorId?: string;
    startDate?: string;
    endDate?: string;
    range?: string;
  }) =>
    apiClient.get("/predictions/export", {
      params,
      responseType: "blob",
    }),

  /**
   * Email predictions data as CSV
   */
  emailPredictions: (params?: {
    farmId?: string;
    sensorId?: string;
    startDate?: string;
    endDate?: string;
    range?: string;
  }) =>
    apiClient.get("/predictions/export", {
      params: { ...params, email: true },
    }),

  /**
   * Fetch specific sensor dashboard context
   */
  getSensorDashboardContext: (sensorId: string) =>
    apiClient.get(`/sensors/${sensorId}/dashboard-context`),

  /**
   * Export predictions CSV and optionally email it to the user
   */
  exportPredictions: (params: {
    range: string;
    email?: boolean;
    farmId?: string;
    sensorId?: string;
  }) => apiClient.get("/predictions/export", { params }),
};
