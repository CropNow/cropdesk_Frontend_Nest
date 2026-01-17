import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Sun, Moon, Menu, X, LogOut } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/features/auth/useAuth';
import { logout } from '@/features/auth/auth.api';

const MobileCTA = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await logout();
      } catch (error) {
        console.error('Logout failed', error);
      } finally {
        // Always clear local state and redirect
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('registeredUser'); // Optional: keep if you want to remember registration data? user said "loged out then login page", usually clears session. Let's clear auth tokens primarily.
        // Actually, user said "temporary registration data" in previous conversation, but here standard logout usually clears "user" and tokens.
        // Let's stick to what DesktopNavbar does:
        localStorage.removeItem('isAuthenticated');
        setUser(null);
        navigate('/login');
        setIsMenuOpen(false);
      }
    }
  };

  return (
    <header className="flex md:hidden flex-col fixed top-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-foreground">CropDesk</h1>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-card border border-border text-muted-foreground transition-all active:scale-95"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 transition-all active:scale-95"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="absolute top-16 left-0 right-0 bg-background border-b border-border p-4 flex flex-col gap-2 animate-in slide-in-from-top-4 duration-300 shadow-xl">
          <NavLink
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              `px-4 py-3 rounded-xl transition-all font-medium ${
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
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              `px-4 py-3 rounded-xl transition-all font-medium ${
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
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              `px-4 py-3 rounded-xl transition-all font-medium ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            User
          </NavLink>

          <div className="h-px bg-border my-2"></div>

          <button
            onClick={handleLogout}
            className="px-4 py-3 rounded-xl transition-all font-medium text-red-500 hover:bg-red-500/10 flex items-center gap-2"
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      )}
    </header>
  );
};

export default MobileCTA;
