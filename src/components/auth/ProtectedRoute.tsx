import { Suspense, lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AppSidebar = lazy(() =>
  import('../layout/AppSidebar').then(module => ({ default: module.AppSidebar }))
);

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

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
