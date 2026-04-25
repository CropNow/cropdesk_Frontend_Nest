import { Suspense, lazy } from 'react';
import type { ReactNode } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RouteLoader } from './components/common/RouteLoader';

const DashboardPage = lazy(() =>
  import('./pages/dashboard/DashboardPage').then(module => ({ default: module.DashboardPage }))
);
const DashboardV2Page = lazy(() =>
  import('./pages/dashboard/DashboardV2Page').then(module => ({ default: module.DashboardV2Page }))
);
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then(module => ({ default: module.SettingsPage }))
);
const LoginPage = lazy(() =>
  import('./pages/auth/LoginPage').then(module => ({ default: module.LoginPage }))
);
const RegisterPage = lazy(() =>
  import('./pages/auth/RegisterPage').then(module => ({ default: module.RegisterPage }))
);
const OTPVerifyPage = lazy(() =>
  import('./pages/auth/OTPVerifyPage').then(module => ({ default: module.OTPVerifyPage }))
);

function withRouteLoader(element: ReactNode) {
  return <Suspense fallback={<RouteLoader />}>{element}</Suspense>;
}

export function App() {
  return (
    <div className="min-h-screen w-full bg-bgMain text-textPrimary font-sans transition-colors duration-300">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={withRouteLoader(<LoginPage />)} />
        <Route path="/register" element={withRouteLoader(<RegisterPage />)} />
        <Route path="/verify-otp" element={withRouteLoader(<OTPVerifyPage />)} />

        {/* Protected routes (sidebar + content) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={withRouteLoader(<DashboardPage />)} />
          <Route path="/dashboard2" element={withRouteLoader(<DashboardV2Page />)} />
          <Route path="/settings" element={withRouteLoader(<SettingsPage />)} />
        </Route>
      </Routes>
    </div>
  );
}
