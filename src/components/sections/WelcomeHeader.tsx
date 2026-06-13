import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Sun, Moon, ChevronDown, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useFontScale } from '../../contexts/FontScaleContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

/**
 * WelcomeHeader - Top welcome section with time and weather
 */
interface WelcomeHeaderProps {
  currentTime: Date;
  userName?: string;
}

export function WelcomeHeader({ currentTime, userName = 'User' }: WelcomeHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { fontScale, setFontScale } = useFontScale();
  const { logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [isTrayOpen, setIsTrayOpen] = useState(false);

  const handleLogout = () => {
    logout();
    addToast({ message: 'Logged out successfully', type: 'success' });
    navigate('/login');
  };
  const trayRef = useRef<HTMLDivElement | null>(null);

  const notifications = useMemo(
    () => [],
    [],
  );

  const unreadCount = notifications.filter((item) => item.unread).length;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!trayRef.current) return;
      if (!trayRef.current.contains(event.target as Node)) {
        setIsTrayOpen(false);
      }
    };

    if (isTrayOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isTrayOpen]);

  return (
    <motion.section
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative z-30 rounded-xl border border-cardBorder bg-cardBg p-4 shadow-card backdrop-blur-xl sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-scale-page font-bold tracking-tight text-textHeading">
            Welcome back, {userName}
          </h1>
          <p className="mt-1 hidden sm:block text-scale-helper font-medium text-textLabel sm:mt-2">
            <span className="block sm:inline">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
            <span className="hidden sm:inline text-textHint"> • </span>
            <span className="block sm:inline">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 sm:gap-3 lg:items-end">
          <div className="flex w-full items-center justify-between gap-2 lg:justify-end">
            <div className="relative flex items-center gap-2" ref={trayRef}>
              {/* Font Scale Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={fontScale}
                  onChange={(e) => setFontScale(parseFloat(e.target.value))}
                  className="inline-flex h-9 appearance-none items-center justify-center rounded-lg border border-cardBorder bg-cardBg pl-3 pr-8 text-scale-caption font-bold text-textSecondary transition hover:border-accentPrimary/40 hover:text-accentPrimary focus:outline-none"
                  aria-label="Font scale selector"
                >
                  <option value="1" className="bg-bgCard text-textPrimary">100%</option>
                  <option value="1.25" className="bg-bgCard text-textPrimary">125%</option>
                  <option value="1.5" className="bg-bgCard text-textPrimary">150%</option>
                  <option value="1.75" className="bg-bgCard text-textPrimary">175%</option>
                  <option value="2" className="bg-bgCard text-textPrimary">200%</option>
                </select>
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-textSecondary">
                  <ChevronDown className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cardBorder bg-cardBg text-textSecondary transition hover:border-accentPrimary/40 hover:text-accentPrimary"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* Notifications */}
              <button
                type="button"
                onClick={() => setIsTrayOpen((prev) => !prev)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cardBorder bg-cardBg text-textSecondary transition hover:border-accentPrimary/40 hover:text-accentPrimary"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 ? (
                  <span className="absolute right-0 top-0 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accentPrimary px-1 text-scale-caption font-bold text-black">
                    {unreadCount}
                  </span>
                ) : null}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-cardBorder bg-cardBg text-red-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>

              {isTrayOpen ? (
                <div className="absolute right-0 top-12 z-50 w-[320px] rounded-xl border border-cardBorder bg-bgSidebar p-3 shadow-2xl">
                  <div className="mb-2 flex items-center justify-between border-b border-cardBorder pb-2">
                    <p className="text-scale-body font-semibold text-textHeading">Notifications</p>
                    <span className="rounded-full bg-accentPrimary/20 px-2 py-0.5 text-scale-caption font-semibold text-accentPrimary">
                      {unreadCount} new
                    </span>
                  </div>

                  <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                    {notifications.length > 0 ? (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-lg border border-cardBorder bg-cardBg p-2.5 transition hover:border-accentPrimary/30"
                        >
                          <div className="mb-1 flex items-start justify-between gap-2">
                            <p className="text-scale-caption font-semibold text-textHeading">{item.title}</p>
                            <span className="shrink-0 text-scale-caption text-textHint">{item.time}</span>
                          </div>
                          <p className="text-scale-caption text-textSecondary">{item.description}</p>
                          {item.unread ? (
                            <span className="mt-1 block text-scale-caption font-semibold text-accentPrimary">
                              New notification
                            </span>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-scale-caption font-medium text-textHint">All caught up!</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
