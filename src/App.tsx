import { Navigate, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { OTPVerifyPage } from './pages/auth/OTPVerifyPage';
import { AITrendsPage } from './pages/AITrendsPage';
import { ChatbotPage } from './pages/ChatbotPage';
import { SupportPage } from './pages/SupportPage';
import NotFoundPage from './pages/errors/NotFoundPage';
import { ROUTES } from './constants/routeConstants';
import { useAuth } from './contexts/AuthContext';
import { PWAInstallButton } from './components/common/PWAInstallButton';

export function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen w-full bg-bgMain text-textPrimary font-sans transition-colors duration-300">
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
      <PWAInstallButton />
    </div>
  );
}
