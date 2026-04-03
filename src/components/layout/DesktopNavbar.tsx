import { LogOut, Moon, Sun } from 'lucide-react';
import React, { Suspense } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
const AlertDialog = React.lazy(() =>
  import('@/components/ui/alert-dialog').then((m) => ({
    default: m.AlertDialog,
  }))
);
const AlertDialogAction = React.lazy(() =>
  import('@/components/ui/alert-dialog').then((m) => ({
    default: m.AlertDialogAction,
  }))
);
const AlertDialogCancel = React.lazy(() =>
  import('@/components/ui/alert-dialog').then((m) => ({
    default: m.AlertDialogCancel,
  }))
);
const AlertDialogContent = React.lazy(() =>
  import('@/components/ui/alert-dialog').then((m) => ({
    default: m.AlertDialogContent,
  }))
);
const AlertDialogDescription = React.lazy(() =>
  import('@/components/ui/alert-dialog').then((m) => ({
    default: m.AlertDialogDescription,
  }))
);
const AlertDialogFooter = React.lazy(() =>
  import('@/components/ui/alert-dialog').then((m) => ({
    default: m.AlertDialogFooter,
  }))
);
const AlertDialogHeader = React.lazy(() =>
  import('@/components/ui/alert-dialog').then((m) => ({
    default: m.AlertDialogHeader,
  }))
);
const AlertDialogTitle = React.lazy(() =>
  import('@/components/ui/alert-dialog').then((m) => ({
    default: m.AlertDialogTitle,
  }))
);
const AlertDialogTrigger = React.lazy(() =>
  import('@/components/ui/alert-dialog').then((m) => ({
    default: m.AlertDialogTrigger,
  }))
);
import { logout } from '@/features/auth/auth.api';
import { useAuth } from '@/features/auth/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useAccess } from '@/hooks/useAccess';
import ProductSwitcher from '@/components/common/ProductSwitcher';

const DesktopNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { activeProduct } = useAccess();

  return (
    <header className="hidden md:flex items-center justify-between px-6 py-4 bg-background/50 backdrop-blur-md sticky top-0 z-50 border-b border-border w-full">
      <Link to="/" className="flex flex-col">
        <img
          src="/CropNow_Logo_1-D3AGwrH0.png"
          alt="CropNow Logo"
          className="h-10 w-auto object-contain"
        />
      </Link>

      <nav className="flex items-center gap-8">
        {activeProduct === 'nest' ? (
          <>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-6 py-2 rounded-full transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/smart-info"
              className={({ isActive }) =>
                `px-6 py-2 rounded-full transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              Smart Info
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `px-6 py-2 rounded-full transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              User
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/seed/dashboard"
              className={({ isActive }) =>
                `px-6 py-2 rounded-full transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/seed/sensors"
              className={({ isActive }) =>
                `px-6 py-2 rounded-full transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              Sensors
            </NavLink>
            <NavLink
              to="/seed/disease"
              className={({ isActive }) =>
                `px-6 py-2 rounded-full transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              Disease
            </NavLink>
            <NavLink
              to="/seed/pests"
              className={({ isActive }) =>
                `px-6 py-2 rounded-full transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              Pests
            </NavLink>
            <NavLink
              to="/seed/weeds"
              className={({ isActive }) =>
                `px-6 py-2 rounded-full transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              Weeds
            </NavLink>

            <NavLink
              to="/seed/profile"
              className={({ isActive }) =>
                `px-6 py-2 rounded-full transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              Fleet
            </NavLink>
          </>
        )}
      </nav>

      <div className="flex items-center gap-2">
        <ProductSwitcher />
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all active:scale-95"
          title="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <Suspense fallback={null}>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="p-2 rounded-lg bg-card border border-border text-red-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all active:scale-95"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to logout?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  You will be redirected to the login page.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={async () => {
                    try {
                      await logout();
                    } catch (error) {
                      console.error('Logout failed', error);
                    } finally {
                      // Always clear local state and redirect
                      localStorage.removeItem('accessToken');
                      localStorage.removeItem('refreshToken');
                      localStorage.removeItem('user');
                      localStorage.removeItem('isAuthenticated');
                      // Clear device data to prevent state leakage to next user
                      localStorage.removeItem('connected_devices');
                      localStorage.removeItem('iot_device_data');
                      setUser(null);

                      navigate('/login?logout=success');
                    }
                  }}
                >
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Suspense>
      </div>
    </header>
  );
};

export default DesktopNavbar;
