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
  ADVANCED: {
    id: 'advanced',
    name: 'Dashboard Advanced',
    description: 'Inline optimized view with detailed metrics',
    path: '/dashboard-v2',
    version: 'v2',
  },
};

export const getDashboardViews = () => Object.values(DASHBOARD_VIEWS);

export const getCurrentDashboardView = (pathname: string) => {
  if (pathname === '/dashboard-v2') return DASHBOARD_VIEWS.ADVANCED;
  return DASHBOARD_VIEWS.CLASSIC;
};
