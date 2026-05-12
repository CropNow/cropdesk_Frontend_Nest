import { lazy, Suspense } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/auth/LoginPage';
import { useAuth } from './contexts/AuthContext';
import { PWAInstallButton } from './components/common/PWAInstallButton';
import { LoadingSkeleton } from './components/common/LoadingSkeleton';

// Lazy-load non-critical routes to shrink the initial bundle. The dashboard is the
// post-login landing page, so split it so it loads in parallel with auth/login chunks
// rather than blocking initial paint.
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const OTPVerifyPage = lazy(() => import('./pages/auth/OTPVerifyPage').then(m => ({ default: m.OTPVerifyPage })));
const AITrendsPage = lazy(() => import('./pages/AITrendsPage').then(m => ({ default: m.AITrendsPage })));
const ChatbotPage = lazy(() => import('./pages/ChatbotPage').then(m => ({ default: m.ChatbotPage })));
const SupportPage = lazy(() => import('./pages/SupportPage').then(m => ({ default: m.SupportPage })));
const NotFoundPage = lazy(() => import('./pages/errors/NotFoundPage'));

export function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen w-full bg-bgMain text-textPrimary font-sans transition-colors duration-300">
      <Suspense fallback={<LoadingSkeleton />}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<OTPVerifyPage />} />

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected routes (sidebar + content) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />

            <Route path="/ai-trends" element={<AITrendsPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/support" element={<SupportPage />} />
          </Route>

          {/* Global wildcard catch-all for invalid URLs */}
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <ProtectedRoute>
                  <NotFoundPage />
                </ProtectedRoute>
              ) : (
                <NotFoundPage />
              )
            }
          />
        </Routes>
      </Suspense>
      <PWAInstallButton />
    </div>
  );
}
