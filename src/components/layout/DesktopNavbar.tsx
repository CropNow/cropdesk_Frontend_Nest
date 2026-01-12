import { LogOut, Moon, Sun } from 'lucide-react';
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { logout } from '@/features/auth/auth.api';
import { useAuth } from '@/features/auth/useAuth';
import { useTheme } from '@/hooks/useTheme';

const DesktopNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  return (
    <header className="hidden md:flex items-center justify-between px-6 py-4 bg-background/50 backdrop-blur-md sticky top-0 z-50 border-b border-border w-full">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          CropDesk
        </h1>
      </div>

      <nav className="flex items-center gap-8">
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
      </nav>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all active:scale-95"
          title="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

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
      </div>
    </header>
  );
};

export default DesktopNavbar;
