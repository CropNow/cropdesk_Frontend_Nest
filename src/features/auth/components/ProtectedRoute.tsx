import { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@app/providers/AuthContext";
import { AppSidebar } from "@app/layouts/AppSidebar";

export function ProtectedRoute({ children }: { children?: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <AppSidebar />
      {children || <Outlet />}
    </>
  );
}
