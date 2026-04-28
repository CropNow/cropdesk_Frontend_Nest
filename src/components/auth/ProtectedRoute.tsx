import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RouteLoader } from '../common/RouteLoader';

const AppSidebar = lazy(() =>
  import('../layout/AppSidebar').then(module => ({ default: module.AppSidebar }))
);

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <RouteLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Suspense fallback={null}>
        <AppSidebar />
      </Suspense>
      <Outlet />
    </>
  );
}
