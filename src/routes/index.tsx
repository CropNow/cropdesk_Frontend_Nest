/**
 * Router configuration
 * This is the root router definition - combine all route subroutes here
 */

import { createBrowserRouter, Outlet } from 'react-router-dom';
import { ROUTES } from '../constants/routeConstants';

// Import your page components
import DashboardPage from '../pages/dashboard/DashboardPage';
// import LoginPage from '../pages/auth/LoginPage';
// import NotFoundPage from '../pages/errors/NotFoundPage';

// Layout component
const RootLayout = () => (
  <div>
    {/* Sidebar, Header, etc. */}
    <Outlet />
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
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
    ],
  },

  // Auth routes (outside main layout)
  {
    path: ROUTES.AUTH.LOGIN,
    // element: <LoginPage />,
  },

  // Error routes
  {
    path: '*',
    // element: <NotFoundPage />,
  },
]);

export default router;
