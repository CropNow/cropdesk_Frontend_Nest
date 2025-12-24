import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import Loader from '@/components/common/Loader';
import { useAuth } from './useAuth';

interface PublicRouteProps {
  children: ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (user) return <Navigate to="/" replace />;

  return <>{children}</>;
};
