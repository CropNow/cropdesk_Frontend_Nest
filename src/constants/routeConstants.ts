/**
 * Route path constants
 */

export const ROUTES = {
  // Auth routes
  AUTH: {
    ROOT: '/auth',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY_OTP: '/verify-otp',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password/:token',
  },

  // Dashboard routes
  DASHBOARD: {
    ROOT: '/',
    HOME: '/dashboard',
  },

  // Devices routes
  DEVICES: {
    ROOT: '/devices',
    LIST: '/devices',
    DETAIL: '/devices/:deviceId',
    EDIT: '/devices/:deviceId/edit',
  },

  // Settings routes
  SETTINGS: {
    ROOT: '/settings',
    PROFILE: '/settings/profile',
    APPEARANCE: '/settings/appearance',
    NOTIFICATIONS: '/settings/notifications',
    SECURITY: '/settings/security',
    INTEGRATIONS: '/settings/integrations',
    FARM: '/settings/farm',
    DEVICE: '/settings/device',
    AI: '/settings/ai',
    SYSTEM: '/settings/system',
  },

  // Error routes
  ERRORS: {
    NOT_FOUND: '/404',
    UNAUTHORIZED: '/unauthorized',
    SERVER_ERROR: '/500',
  },
  SUPPORT: '/support',
};

export default ROUTES;
