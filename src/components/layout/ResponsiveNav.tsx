import { useLocation } from 'react-router-dom';
import DesktopNavbar from './DesktopNavbar';
import MobileCTA from './MobileCTA';

const ResponsiveNav = () => {
  const location = useLocation();
  const authRoutes = [
    '/welcome',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ];

  // Check if current path starts with any of the auth routes
  const isAuthPage = authRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  if (isAuthPage) return null;

  return (
    <>
      <DesktopNavbar />
      <MobileCTA />
    </>
  );
};

export default ResponsiveNav;
