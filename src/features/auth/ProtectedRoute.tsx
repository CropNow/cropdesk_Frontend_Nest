import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import Loader from '@/components/common/Loader';
import { useAuth } from './useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // During auth loading, render nothing or a loader
  if (loading) {
    return <Loader />;
  }

  // If there's no user but we aren't loading, they aren't authenticated for a protected route.
  if (!user && !localStorage.getItem('user')) {
    console.log('[ProtectedRoute] No User detected. Redirecting to login!');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
