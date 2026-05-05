/**
 * Alerts API endpoints
 * FIS alerts and alert management
 */

import apiClient from './client';

export const alertsAPI = {
  /**
   * Get all alerts for a farm
   */
  getFarmAlerts: (farmId: string, status?: 'pending' | 'resolved') =>
    apiClient.get(`/alerts/farm/${farmId}`, { params: { status } }),

  /**
   * Get alert by ID
   */
  getAlert: (alertId: string) =>
    apiClient.get(`/alerts/${alertId}`),

  /**
   * Mark alert as read
   */
  markAlertAsRead: (alertId: string) =>
    apiClient.patch(`/alerts/${alertId}/read`),

  /**
   * Mark alert as resolved
   */
  markAlertAsResolved: (alertId: string) =>
    apiClient.patch(`/alerts/${alertId}/resolve`),

  /**
   * Get alert history
   */
  getAlertHistory: (farmId: string, limit?: number, offset?: number) =>
    apiClient.get(`/alerts/farm/${farmId}/history`, { params: { limit, offset } }),

  /**
   * Get FIS-specific alerts
   */
  getFISAlerts: (farmId: string) =>
    apiClient.get(`/alerts/farm/${farmId}/fis`),

  /**
   * Create a new alert (acknowledgment)
   */
  createAlert: (data: { title: string; message: string; type: string; severity: string; status: string }) =>
    apiClient.post('/alerts', data),
};
