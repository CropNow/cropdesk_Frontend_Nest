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

// ─── Notification-specific API ──────────────────────────────────────────────

export const notificationsAPI = {
  /**
   * GET /api/v1/notifications/preferences
   * Fetch the current user's notification preferences.
   */
  getPreferences: () => apiClient.get('/notifications/preferences'),

  /**
   * PUT /api/v1/notifications/preferences
   * Update alertTypes and/or channels (partial updates supported).
   */
  updatePreferences: (data: {
    alertTypes?: Partial<Record<'pest' | 'fungal' | 'irrigation' | 'weather', boolean>>;
    channels?: Partial<Record<'sms' | 'email' | 'push', boolean>>;
  }) => apiClient.put('/notifications/preferences', data),

  /**
   * POST /api/v1/notifications/device-token
   * Register a mobile/web push notification token for the current user.
   */
  registerDeviceToken: (token: string) =>
    apiClient.post('/notifications/device-token', { token }),

  /**
   * POST /api/v1/notifications/test
   * Trigger a test notification to verify delivery channels.
   */
  sendTestNotification: () => apiClient.post('/notifications/test', {}),
};

