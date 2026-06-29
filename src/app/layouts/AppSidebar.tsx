import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronsUpDown,
  CircleHelp,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Bell,
  Search,
  ScanLine,
  Settings,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@app/providers/AuthContext";
import { useToast } from "@app/providers/ToastContext";

type DeviceLink = {
  label: string;
  to: string;
};

const deviceLinks: DeviceLink[] = [
  { label: "NEST", to: "/dashboard?device=nest" },
  { label: "Seed", to: "/dashboard?device=seed" },
  { label: "Aero Drone", to: "/dashboard?device=aero" },
  { label: "Device Logs", to: "/device-logs" },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const [isMobileOpen, setIsMobileOpen] =  useState(false);

  useEffect(() => {
    const handleOpen = () => setIsMobileOpen(true);
    window.addEventListener("open-sidebar", handleOpen);
    return () => window.removeEventListener("open-sidebar", handleOpen);
  }, []);

  const [isDevicesOpen, setIsDevicesOpen] = useState(true);
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    logout();
    addToast({ message: "Logged out successfully", type: "success" });
    navigate("/login");
  };

  const isDevicesSectionActive = useMemo(() => {
    return (
      (location.pathname === "/dashboard" && location.search.includes("device=")) ||
      location.pathname === "/device-logs"
    );
  }, [location.pathname, location.search]);

  const closeMobile = () => setIsMobileOpen(false);

  /* Nav item styles matching Vercel style backing variables for light/dark theme support */
  const navItemBase =
    "group flex w-full items-center rounded-lg px-3 py-2 text-scale-caption font-semibold transition-all duration-200 gap-3 border border-transparent";
  const navItemActive = "bg-bgCardHover text-textHeading border-borderColor/50 shadow-sm";
  const navItemInactive = "text-textSecondary hover:bg-bgCardHover hover:text-textHeading";

  const subItemBase = "block rounded-md pl-9 pr-3 py-1.5 text-scale-caption font-semibold transition-colors";
  const subItemActive = "bg-bgCardHover/50 text-textHeading font-bold";
  const subItemInactive = "text-textMuted hover:text-textHeading hover:bg-bgCardHover/20";

  return (
    <>
      {/* Mobile hamburger menu toggle */}
      {location.pathname !== "/dashboard" && (
        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden fixed left-3 top-3 z-40 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-cardBorder bg-bgSidebar text-textHeading shadow-lg shadow-black/10 dark:shadow-black/20 sm:left-4 sm:top-4 sm:h-10 sm:w-10 sm:rounded-xl"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      )}

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={closeMobile}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 border-r border-borderColor bg-bgSidebar w-[260px] flex flex-col transition-all duration-300 lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        style={{ width: "var(--sidebar-width)" }}
        aria-label="Sidebar"
      >
        <div className="flex h-full flex-col px-3 py-4">
          {/* Workspace selector at the top */}
          <div className="mb-3 flex items-center justify-between px-2">
            <div className="flex-1">
              <button
                type="button"
                className="group flex w-full items-center justify-between rounded-lg p-1.5 transition-colors hover:bg-bgCardHover active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#7c3aed] text-scale-caption font-bold text-white shadow-sm ring-1 ring-white/10">
                    CN
                  </span>
                  <span className="truncate text-scale-caption font-bold text-textHeading">
                    {user ? `${user.firstName}'s Farm` : "CropNow Farm"}
                  </span>
                  <span className="rounded-full border border-borderColor bg-bgInput px-2 py-0.5 text-scale-caption font-semibold text-textSecondary">
                    Hobby
                  </span>
                </div>
                <ChevronsUpDown className="h-4 w-4 text-textMuted group-hover:text-textHeading transition-colors" />
              </button>
            </div>
          </div>

          {/* Search bar matching Vercel search */}
          <div className="mb-5 px-2">
            <div className="relative flex items-center w-full gap-2 rounded-lg border border-borderColor bg-bgInput px-3 py-1.5 text-textSecondary transition-colors focus-within:border-accentPrimary hover:border-borderColor/80">
              <Search className="h-4 w-4 text-textMuted shrink-0" />
              <input
                type="text"
                placeholder="Find..."
                className="w-full bg-transparent p-0 text-scale-caption text-textHeading placeholder-textMuted focus:outline-none focus:ring-0 border-none outline-none ring-0"
              />
              <span className="rounded border border-borderColor bg-bgSidebar px-1.5 py-0.5 text-scale-caption font-bold text-textMuted shrink-0">
                F
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1.5 px-1 overflow-y-auto" aria-label="Primary">
            <NavLink
              to="/dashboard"
              onClick={closeMobile}
              className={({ isActive }) =>
                [
                  navItemBase,
                  isActive && !isDevicesSectionActive ? navItemActive : navItemInactive,
                ].join(" ")
              }
            >
              <LayoutDashboard className="h-[18px] w-[18px] shrink-0" />
              <span>Dashboard</span>
            </NavLink>

            {/* Devices section */}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setIsDevicesOpen((v) => !v)}
                className={[
                  navItemBase,
                  isDevicesSectionActive ? navItemActive : navItemInactive,
                  "justify-between",
                ].join(" ")}
              >
                <span className="flex items-center gap-3">
                  <ScanLine className="h-[18px] w-[18px] shrink-0" />
                  <span>Devices</span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-textMuted transition-transform duration-200 ${isDevicesOpen ? "" : "-rotate-90"}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isDevicesOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-1 py-1">
                      {deviceLinks.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={closeMobile}
                          className={({ isActive }) =>
                            [subItemBase, isActive ? subItemActive : subItemInactive].join(" ")
                          }
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink
              to="/ai-trends"
              onClick={closeMobile}
              className={({ isActive }) =>
                [navItemBase, isActive ? navItemActive : navItemInactive].join(" ")
              }
            >
              <TrendingUp className="h-[18px] w-[18px] shrink-0" />
              <span>AI Trends</span>
            </NavLink>

            <NavLink
              to="/chatbot"
              onClick={closeMobile}
              className={({ isActive }) =>
                [navItemBase, isActive ? navItemActive : navItemInactive].join(" ")
              }
            >
              <MessageSquare className="h-[18px] w-[18px] shrink-0" />
              <span>Chatbot</span>
            </NavLink>

            {/* Separator line */}
            <div className="border-t border-borderColor my-4" />

            <NavLink
              to="/settings"
              onClick={closeMobile}
              className={({ isActive }) =>
                [navItemBase, isActive ? navItemActive : navItemInactive].join(" ")
              }
            >
              <Settings className="h-[18px] w-[18px] shrink-0" />
              <span>Settings</span>
            </NavLink>

            <NavLink
              to="/support"
              onClick={closeMobile}
              className={({ isActive }) =>
                [navItemBase, isActive ? navItemActive : navItemInactive].join(" ")
              }
            >
              <CircleHelp className="h-[18px] w-[18px] shrink-0" />
              <span>Support</span>
            </NavLink>
          </nav>

          {/* Bottom user profile container */}
          <div className="mt-auto border-t border-borderColor pt-4 px-2">
            <div className="relative">
              {/* Logout option bubble */}
              <AnimatePresence>
                {showLogout && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-full left-0 right-0 z-50 mb-2 rounded-lg border border-borderColor bg-bgCard p-1.5 shadow-2xl"
                  >
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-scale-caption font-bold text-red-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* User Profile bar */}
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#10b981]/25 text-[#10b981] text-scale-caption font-bold shadow-inner">
                    {user ? `${user.firstName[0]}${user.lastName[0]}` : "F"}
                  </span>
                  <span className="truncate text-scale-caption font-bold text-textHeading max-w-[100px]">
                    {user ? `${user.firstName} ${user.lastName}` : "Farmer"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowLogout((p) => !p)}
                    className="p-1.5 rounded hover:bg-bgCardHover text-textSecondary hover:text-textHeading transition-colors active:scale-95"
                    aria-label="User options"
                  >
                    <MoreHorizontal className="h-4.5 w-4.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/settings?tab=notifications")}
                    className="p-1.5 rounded hover:bg-bgCardHover text-[#71717a] hover:text-textHeading transition-colors active:scale-95"
                    aria-label="Notifications"
                  >
                    <Bell className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
