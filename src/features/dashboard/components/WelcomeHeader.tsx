import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Sun, Moon, LogOut, ChevronDown, RotateCcw, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@app/providers/ThemeContext";
import { useAuth } from "@app/providers/AuthContext";
import { useToast } from "@app/providers/ToastContext";

/**
 * WelcomeHeader - Top welcome section with time and weather
 */
interface WelcomeHeaderProps {
  currentTime: Date;
  userName?: string;
}

export function WelcomeHeader({ currentTime, userName = "User" }: WelcomeHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const trayRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  const { logout } = useAuth();
  const { addToast } = useToast();

  const [fontScale, setFontScale] = useState(() => {
    const saved = localStorage.getItem("font-scale");
    return saved ? parseFloat(saved) : 1;
  });

  useEffect(() => {
    document.documentElement.style.setProperty("--font-scale", fontScale.toString());
    localStorage.setItem("font-scale", fontScale.toString());
    window.dispatchEvent(new Event("font-scale-change"));
  }, [fontScale]);

  const handleLogout = () => {
    logout();
    addToast({ message: "Logged out successfully", type: "success" });
    navigate("/login");
  };

  interface NotificationItem {
    id: string | number;
    title: string;
    time: string;
    description: string;
    unread: boolean;
  }

  const notifications = useMemo<NotificationItem[]>(() => [], []);

  const unreadCount = notifications.filter((item) => item.unread).length;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!trayRef.current) return;
      if (!trayRef.current.contains(event.target as Node)) {
        setIsTrayOpen(false);
      }
    };

    if (isTrayOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isTrayOpen]);

  return (
    <motion.section
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative z-30 rounded-card border border-cardBorder bg-cardBg p-5 backdrop-blur-xl transition-all duration-300"
    >
      {/* Mobile Layout (Visible only on < lg screens) */}
      <div className="flex flex-col gap-4 lg:hidden">
        {/* Top Row: Menu Toggle & Notifications Bell */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-sidebar"))}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-cardBorder bg-bgSidebar text-textHeading shadow-sm transition hover:bg-bgCardHover hover:text-accentPrimary focus:outline-none"
            aria-label="Open navigation"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="relative" ref={trayRef}>
            <button
              type="button"
              onClick={() => setIsTrayOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-cardBorder bg-bgSidebar text-textHeading shadow-sm transition hover:bg-bgCardHover hover:text-accentPrimary focus:outline-none"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accentPrimary px-1 text-[9px] font-bold text-black">
                  {unreadCount}
                </span>
              ) : null}
            </button>

            {/* Mobile Notification Tray Dropdown */}
            {isTrayOpen ? (
              <div className="absolute right-0 top-11 z-50 w-[280px] rounded-card border border-cardBorder bg-bgSidebar p-3 shadow-elevated">
                <div className="mb-2 flex items-center justify-between border-b border-cardBorder pb-2">
                  <p className="text-scale-body font-semibold text-textHeading">Notifications</p>
                  <span className="rounded-full bg-accentPrimary/20 px-2 py-0.5 text-scale-caption font-semibold text-accentPrimary">
                    {unreadCount} new
                  </span>
                </div>
                <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
                  {notifications.length > 0 ? (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-btn border border-cardBorder bg-cardBg p-2.5 transition hover:border-accentPrimary/30"
                      >
                        <div className="mb-1 flex items-start justify-between gap-2">
                          <p className="text-scale-caption font-semibold text-textHeading">{item.title}</p>
                          <span className="shrink-0 text-scale-caption text-textHint">{item.time}</span>
                        </div>
                        <p className="text-scale-caption text-textSecondary">{item.description}</p>
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

        {/* Middle Section: Welcome Heading */}
        <div className="py-1">
          <h1 className="text-scale-card font-bold tracking-tight text-textHeading">
            Welcome back, {userName}
          </h1>
        </div>

        {/* Bottom Section: Integrated Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Font Scale select dropdown */}
          <div className="relative">
            <select
              value={fontScale}
              onChange={(e) => setFontScale(parseFloat(e.target.value))}
              className="inline-flex h-9 appearance-none items-center justify-center rounded-lg border border-cardBorder bg-bgSidebar pl-3 pr-8 text-scale-caption font-bold text-textSecondary transition hover:border-accentPrimary/40 hover:text-accentPrimary focus:outline-none"
              aria-label="Font scale selector"
            >
              <option value="1" className="bg-bgCard text-textPrimary">100%</option>
              <option value="1.25" className="bg-bgCard text-textPrimary">125%</option>
              <option value="1.5" className="bg-bgCard text-textPrimary">150%</option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-textSecondary">
              <ChevronDown className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Reset Font Scale */}
          <button
            type="button"
            onClick={() => {
              setFontScale(1);
              addToast({ message: "Scale reset to 100%", type: "success" });
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-cardBorder bg-bgSidebar text-textSecondary transition hover:border-accentPrimary/40 hover:text-accentPrimary focus:outline-none"
            aria-label="Reset font scale"
            title="Reset font scale"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-cardBorder bg-bgSidebar text-textSecondary transition hover:border-accentPrimary/40 hover:text-accentPrimary focus:outline-none"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-cardBorder bg-bgSidebar text-red-500 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 focus:outline-none"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Desktop Layout (Visible only on >= lg screens) */}
      <div className="hidden lg:flex lg:flex-row lg:items-center lg:justify-between lg:w-full">
        <div>
          <h1 className="text-scale-card font-bold tracking-tight text-textHeading sm:text-scale-section lg:text-scale-metric-sm">
            Welcome back, {userName}
          </h1>
          <p className="mt-1 text-scale-caption font-medium text-textLabel sm:mt-2 sm:text-scale-helper">
            <span>
              {currentTime.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="text-textHint"> • </span>
            <span>
              {currentTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Font Scale select dropdown */}
          <div className="relative">
            <select
              value={fontScale}
              onChange={(e) => setFontScale(parseFloat(e.target.value))}
              className="inline-flex h-9 appearance-none items-center justify-center rounded-btn border border-cardBorder bg-bgCard pl-3 pr-8 text-scale-caption font-bold text-textSecondary transition hover:border-accentPrimary/40 hover:text-accentPrimary focus:outline-none"
              aria-label="Font scale selector"
            >
              <option value="1" className="bg-bgCard text-textPrimary">100%</option>
              <option value="1.25" className="bg-bgCard text-textPrimary">125%</option>
              <option value="1.5" className="bg-bgCard text-textPrimary">150%</option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-textSecondary">
              <ChevronDown className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Reset Font Scale */}
          <button
            type="button"
            onClick={() => {
              setFontScale(1);
              addToast({ message: "Scale reset to 100%", type: "success" });
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-btn border border-cardBorder bg-cardBg text-textSecondary transition hover:border-accentPrimary/40 hover:text-accentPrimary focus:outline-none"
            aria-label="Reset font scale"
            title="Reset font scale"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-9 w-9 items-center justify-center rounded-btn border border-cardBorder bg-cardBg text-textSecondary transition hover:border-accentPrimary/40 hover:text-accentPrimary focus:outline-none"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Notifications Trigger */}
          <div className="relative" ref={trayRef}>
            <button
              type="button"
              onClick={() => setIsTrayOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-btn border border-cardBorder bg-cardBg text-textSecondary transition hover:border-accentPrimary/40 hover:text-accentPrimary focus:outline-none"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 ? (
                <span className="absolute right-0 top-0 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accentPrimary px-1 text-scale-caption font-bold text-black">
                  {unreadCount}
                </span>
              ) : null}
            </button>

            {isTrayOpen ? (
              <div className="absolute right-0 top-12 z-50 w-[320px] rounded-card border border-cardBorder bg-bgSidebar p-3 shadow-elevated">
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
                        className="rounded-btn border border-cardBorder bg-cardBg p-2.5 transition hover:border-accentPrimary/30"
                      >
                        <div className="mb-1 flex items-start justify-between gap-2">
                          <p className="text-scale-caption font-semibold text-textHeading">{item.title}</p>
                          <span className="shrink-0 text-scale-caption text-textHint">{item.time}</span>
                        </div>
                        <p className="text-scale-caption text-textSecondary">{item.description}</p>
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

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-9 w-9 items-center justify-center rounded-btn border border-cardBorder bg-cardBg text-red-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 focus:outline-none"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.section>
  );
}
