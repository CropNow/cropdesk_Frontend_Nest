import { Routes, Route, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { PublicRoute } from '@/features/auth/PublicRoute';
import NotFound from '@/features/common/NotFound';
import Loader from '@/components/common/Loader';

// Lazy loaded auth pages
const Welcome = lazy(() => import('@/features/auth/Welcome'));
const Login = lazy(() => import('@/features/auth/Login'));
const Register = lazy(() => import('@/features/auth/Register'));
const FarmerDetails = lazy(() => import('@/features/auth/FarmerDetails'));
const FarmDetails = lazy(() => import('@/features/auth/FarmDetails'));
const FieldDetails = lazy(() => import('@/features/auth/FieldDetails'));
const CropDetails = lazy(() => import('@/features/auth/CropDetails'));
const ForgetPassword = lazy(() => import('@/features/auth/ForgetPassword'));
const ResetPassword = lazy(() => import('@/features/auth/ResetPassword'));

// Lazy loaded protected pages
const Dashboard = lazy(() => import('@/features/user/dashboard/Dashboard'));
const Profile = lazy(() => import('@/features/user/profile/Profile'));
const SmartInfo = lazy(() => import('@/features/user/smart-info/SmartInfo'));
const SensorDetails = lazy(
  () => import('@/features/user/dashboard/SensorDetails')
);

export const AppRouter = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* ==================== Public Routes ==================== */}
        <Route
          element={
            <PublicRoute>
              <Outlet />
            </PublicRoute>
          }
        >
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* ==================== Protected Routes ==================== */}
        <Route
          element={
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          }
        >
          {/* Onboarding Flow */}
          <Route path="/register/farmer-details" element={<FarmerDetails />} />
          <Route path="/register/farm-details" element={<FarmDetails />} />
          <Route path="/register/field-details" element={<FieldDetails />} />
          <Route path="/register/crop-details" element={<CropDetails />} />

          {/* Main App */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/smart-info" element={<SmartInfo />} />
          <Route path="/sensor-details" element={<SensorDetails />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
