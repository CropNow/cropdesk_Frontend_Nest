/**
 * Settings API endpoints
 * User preferences, notifications, security, appearance
 */

import apiClient from './client';

export const settingsAPI = {
  /**
   * Get user settings
   */
  getUserSettings: () => apiClient.get('/settings/user'),

  /**
   * Update notification preferences
   */
  updateNotificationSettings: (data: any) =>
    apiClient.patch('/settings/notifications', data),

  /**
   * Get notification settings
   */
  getNotificationSettings: () => apiClient.get('/settings/notifications'),

  /**
   * Update appearance settings (theme, language, etc.)
   */
  updateAppearanceSettings: (data: any) =>
    apiClient.patch('/settings/appearance', data),

  /**
   * Get appearance settings
   */
  getAppearanceSettings: () => apiClient.get('/settings/appearance'),

  /**
   * Update security settings
   */
  updateSecuritySettings: (data: any) =>
    apiClient.patch('/settings/security', data),

  /**
   * Get security settings
   */
  getSecuritySettings: () => apiClient.get('/settings/security'),

  /**
   * Get integration settings
   */
  getIntegrationSettings: () => apiClient.get('/settings/integrations'),

  /**
   * Connect external integration
   */
  connectIntegration: (integrationType: string, credentials: any) =>
    apiClient.post(`/settings/integrations/${integrationType}`, credentials),

  /**
   * Disconnect external integration
   */
  disconnectIntegration: (integrationType: string) =>
    apiClient.delete(`/settings/integrations/${integrationType}`),
};
