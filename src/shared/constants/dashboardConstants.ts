/**
 * Utility to help switch between dashboards
 * Use in navigation or sidebar to switch views
 */

export const DASHBOARD_VIEWS = {
  CLASSIC: {
    id: 'classic',
    name: 'Dashboard Classic',
    description: 'Section-based view with modular components',
    path: '/dashboard',
    version: 'v1',
  },
};

export const getDashboardViews = () => Object.values(DASHBOARD_VIEWS);

export const getCurrentDashboardView = (pathname: string) => {
  return DASHBOARD_VIEWS.CLASSIC;
};
