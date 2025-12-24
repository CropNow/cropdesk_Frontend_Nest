import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { PublicRoute } from '@/features/auth/PublicRoute';
import NotFound from '@/features/common/NotFound';
import Loader from '@/components/common/Loader';

// Lazy loaded auth pages
const Login = lazy(() => import('@/features/auth/Login'));
const Register = lazy(() => import('@/features/auth/Register'));
const ForgetPassword = lazy(() => import('@/features/auth/ForgetPassword'));
const ResetPassword = lazy(() => import('@/features/auth/ResetPassword'));

// Lazy loaded protected pages
const Dashboard = lazy(() => import('@/features/user/Dashboard'));
const Profile = lazy(() => import('@/features/user/Profile'));
const SmartInfo = lazy(() => import('@/features/user/SmartInfo'));

export const AppRouter = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgetPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/smart-info"
          element={
            <ProtectedRoute>
              <SmartInfo />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
