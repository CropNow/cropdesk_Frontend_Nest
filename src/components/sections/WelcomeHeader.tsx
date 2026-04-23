import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * WelcomeHeader - Top welcome section with time and weather
 */
interface WelcomeHeaderProps {
  currentTime: Date;
  userName?: string;
  weather?: {
    temp: string;
    condition: string;
    city?: string;
  };
}

export function WelcomeHeader({ currentTime, userName = 'User', weather }: WelcomeHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [isTrayOpen, setIsTrayOpen] = useState(false);
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

  const displayWeather = useMemo(() => {
    if (weather) return weather;
    return {
      temp: '30 C',
      condition: 'Partly cloudy',
      city: 'Green Valley Farm, Kallakurichi',
    };
  }, [weather]);

  return (
    <motion.section
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative z-30 rounded-xl border border-cardBorder bg-cardBg/50 p-3 backdrop-blur-sm sm:p-5"
    >
      <div className="relative flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col">
          {/* Mobile Welcome Text */}
          <span className="text-[11px] font-semibold uppercase tracking-wider text-textLabel sm:hidden mb-0.5">
            Welcome back,
          </span>
          
          <h1 className="text-xl font-bold tracking-tight text-textHeading sm:text-3xl lg:text-4xl">
            <span className="hidden sm:inline">Welcome back, </span>
            {userName}
          </h1>

          {/* Mobile Weather - Placed below user name */}
          <div className="mt-1.5 flex items-center gap-2 sm:hidden">
            <p className="text-sm font-bold text-textHeading">
              {displayWeather.temp.split(' ')[0]}°
            </p>
            <p className="text-[11px] font-medium text-textSecondary">
              {displayWeather.condition}
            </p>
          </div>

          <p className="mt-1 hidden sm:block text-xs font-medium text-textLabel sm:mt-2 sm:text-sm">
            <span className="block sm:inline">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
            <span className="hidden sm:inline text-textHint"> • </span>
            <span className="block sm:inline">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="hidden md:inline text-textHint"> • </span>
            <span className="block md:inline mt-1 md:mt-0 text-textSecondary">
              {displayWeather.city || 'Green Valley Farm, Kallakurichi'} - Smart Block A
            </span>
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 sm:gap-3 lg:items-end">
          <div className="flex w-full items-center justify-end gap-2 lg:justify-end">
            <div className="absolute right-0 top-0 sm:relative flex items-center gap-2" ref={trayRef}>
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-cardBorder bg-cardBg text-textSecondary transition hover:border-accentPrimary/40 hover:text-accentPrimary"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsTrayOpen((prev) => !prev)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-cardBorder bg-cardBg text-textSecondary transition hover:border-accentPrimary/40 hover:text-accentPrimary"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 ? (
                  <span className="absolute right-0 top-0 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accentPrimary px-1 text-[10px] font-bold text-black">
                    {unreadCount}
                  </span>
                ) : null}
              </button>

              {isTrayOpen ? (
                <div className="absolute right-0 top-12 z-50 w-[300px] sm:w-[320px] rounded-2xl border border-cardBorder bg-bgSidebar p-3 shadow-2xl">
                  <div className="mb-2 flex items-center justify-between border-b border-cardBorder pb-2">
                    <p className="text-sm font-semibold text-textHeading">Notifications</p>
                    <span className="rounded-full bg-accentPrimary/20 px-2 py-0.5 text-[11px] font-semibold text-accentPrimary">
                      {unreadCount} new
                    </span>
                  </div>

                  <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                    {notifications.length > 0 ? (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-xl border border-cardBorder bg-cardBg p-2.5 transition hover:border-accentPrimary/30"
                        >
                          <div className="mb-1 flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-textHeading">{item.title}</p>
                            <span className="shrink-0 text-[10px] text-textHint">{item.time}</span>
                          </div>
                          <p className="text-[11px] text-textSecondary">{item.description}</p>
                          {item.unread ? (
                            <span className="mt-1 block text-[10px] font-semibold text-accentPrimary">
                              New notification
                            </span>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-xs font-medium text-textHint">All caught up!</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-1 hidden sm:flex items-baseline gap-2 sm:gap-3">
            <p className="text-2xl font-extrabold tracking-tighter text-textHeading sm:text-3xl lg:text-4xl">
              {displayWeather.temp.split(' ')[0]}
              <span className="text-lg text-textMuted sm:text-xl lg:text-3xl">°C</span>
            </p>
            <p className="text-xs font-medium text-textSecondary sm:text-lg">{displayWeather.condition}</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
