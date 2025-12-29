import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const DesktopNavbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="hidden md:flex items-center justify-between px-6 py-4 bg-background/50 backdrop-blur-md sticky top-0 z-50 border-b border-border w-full">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          CropDesk
        </h1>
        <p className="text-xs text-muted-foreground">Real-time Monitoring</p>
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
            `transition-colors ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'}`
          }
        >
          Smart Info
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `transition-colors ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'}`
          }
        >
          User
        </NavLink>
      </nav>

      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all active:scale-95"
      >
        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    </header>
  );
};

export default DesktopNavbar;
