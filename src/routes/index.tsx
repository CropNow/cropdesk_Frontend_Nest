/**
 * Router configuration
 * This is the root router definition - combine all route subroutes here
 */

import { createBrowserRouter, Outlet, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routeConstants';

// Import your page components
import DashboardPage from '../pages/dashboard/DashboardPage';
// import LoginPage from '../pages/auth/LoginPage';
import NotFoundPage from '../pages/errors/NotFoundPage';

// Layout component
const RootLayout = () => (
  <div>
    {/* Sidebar, Header, etc. */}
    <Outlet />
  </div>
);

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to={ROUTES.DASHBOARD.HOME} replace />,
      },
      // Dashboard routes
      {
        path: ROUTES.DASHBOARD.HOME,
        element: <DashboardPage />,
      },

      // Device routes
      {
        path: ROUTES.DEVICES.LIST,
        // element: <DevicesPage />,
      },

      // Settings routes
      {
        path: ROUTES.SETTINGS.ROOT,
        // element: <SettingsPage />,
      },
      // Error routes
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },

  // Auth routes (outside main layout)
  {
    path: ROUTES.AUTH.LOGIN,
    // element: <LoginPage />,
  },
]);

export default router;
