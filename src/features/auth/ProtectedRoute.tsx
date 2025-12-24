import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import Loader from '@/components/common/Loader';
import { useAuth } from './useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};
