import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { PublicRoute } from '@/features/auth/PublicRoute';
import NotFound from '@/features/common/NotFound';
import Loader from '@/components/common/Loader';
import { ProfileProvider } from '@/features/user/profile/context/ProfileProvider';

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

import { useAccess } from '@/hooks/useAccess';
import LockedScreen from '@/components/common/LockedScreen';

const ProductGuard = ({
  product,
  children,
}: {
  product: 'nest' | 'seed';
  children: React.ReactNode;
}) => {
  const { hasAccess, authLoading } = useAccess();

  if (authLoading) return <Loader />; // prevent locked screen from flashing

  const access = hasAccess(product);
  console.log(
    `[ProductGuard] Evaluating access for product: ${product}. hasAccess: ${access}`
  );
  if (!access) return <LockedScreen product={product} />;
  return <>{children}</>;
};

// Lazy loaded seed pages
const SeedDashboard = lazy(
  () => import('@/features/seed/dashboard/SeedDashboard')
);
const SeedSensors = lazy(() => import('@/features/seed/sensors/SeedSensors'));

const SeedProfile = lazy(() => import('@/features/seed/profile/SeedProfile'));
const SeedDisease = lazy(() => import('@/features/seed/disease/SeedDisease'));
const SeedPests = lazy(() => import('@/features/seed/pests/SeedPests'));
const SeedWeeds = lazy(() => import('@/features/seed/weeds/SeedWeeds'));
const SeedInsights = lazy(
  () => import('@/features/seed/insights/SeedInsights')
);

// Lazy loaded protected pages
const Dashboard = lazy(() => import('@/features/user/dashboard/Dashboard'));
const Profile = lazy(() => import('@/features/user/profile/Profile'));
const SmartInfo = lazy(() => import('@/features/user/smart-info/SmartInfo'));
const SensorDetails = lazy(
  () => import('@/features/user/dashboard/SensorDetails')
);
const Subscription = lazy(
  () => import('@/features/user/subscription/Subscription')
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
              <ProfileProvider>
                <Outlet />
              </ProfileProvider>
            </ProtectedRoute>
          }
        >
          {/* Onboarding Flow */}
          <Route path="/register/farmer-details" element={<FarmerDetails />} />
          <Route path="/register/farm-details" element={<FarmDetails />} />
          <Route path="/register/field-details" element={<FieldDetails />} />
          <Route path="/register/crop-details" element={<CropDetails />} />

          {/* Main App */}
          <Route
            path="/"
            element={
              <ProductGuard product="nest">
                <Dashboard />
              </ProductGuard>
            }
          />
          <Route
            path="/profile"
            element={
              <ProductGuard product="nest">
                <Profile />
              </ProductGuard>
            }
          />
          <Route
            path="/smart-info"
            element={
              <ProductGuard product="nest">
                <SmartInfo />
              </ProductGuard>
            }
          />
          <Route
            path="/sensor-details"
            element={
              <ProductGuard product="nest">
                <SensorDetails />
              </ProductGuard>
            }
          />
          <Route path="/subscription" element={<Subscription />} />

          {/* Seed App */}
          <Route
            path="/seed/dashboard"
            element={
              <ProductGuard product="seed">
                <SeedDashboard />
              </ProductGuard>
            }
          />
          <Route
            path="/seed/sensors"
            element={
              <ProductGuard product="seed">
                <SeedSensors />
              </ProductGuard>
            }
          />
          <Route
            path="/seed/disease"
            element={
              <ProductGuard product="seed">
                <SeedDisease />
              </ProductGuard>
            }
          />
          <Route
            path="/seed/pests"
            element={
              <ProductGuard product="seed">
                <SeedPests />
              </ProductGuard>
            }
          />
          <Route
            path="/seed/weeds"
            element={
              <ProductGuard product="seed">
                <SeedWeeds />
              </ProductGuard>
            }
          />
          <Route
            path="/seed/insights"
            element={
              <ProductGuard product="seed">
                <SeedInsights />
              </ProductGuard>
            }
          />

          <Route
            path="/seed/profile"
            element={
              <ProductGuard product="seed">
                <SeedProfile />
              </ProductGuard>
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
