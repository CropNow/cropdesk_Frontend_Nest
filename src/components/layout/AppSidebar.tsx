import { useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  ScanLine,
  Settings,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { MobileHeader } from './MobileHeader';
import { useSidebar } from '../../contexts/SidebarContext';

/* ═══════════════════════════════════════════════════════════════════
   Data
   ═══════════════════════════════════════════════════════════════════ */
type DeviceLink = { label: string; to: string };

const deviceLinks: DeviceLink[] = [
  { label: 'NEST', to: '/dashboard?device=nest' },
  { label: 'Seed', to: '/dashboard?device=seed' },
  { label: 'Aero Drone', to: '/dashboard?device=aero' },
  { label: 'Device Logs', to: '/device-logs' },
];

/* ═══════════════════════════════════════════════════════════════════
   Sidebar
   ═══════════════════════════════════════════════════════════════════ */
export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDevicesOpen, setIsDevicesOpen] = useState(true);
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    logout();
    addToast({ message: 'Logged out successfully', type: 'success' });
    navigate('/login');
  };

  const isDevicesSectionActive = useMemo(() => {
    return (
      (location.pathname === '/dashboard' && location.search.includes('device=')) ||
      location.pathname === '/device-logs'
    );
  }, [location.pathname, location.search]);

  const closeMobile = () => setIsMobileOpen(false);

  /* ─── Nav item classes ────────────────────────────────────────── */
  const navItemBase = useMemo(() => {
    return `sidebar-item group flex w-full items-center rounded-lg py-2 text-scale-helper font-medium transition-all duration-300 ${
      isCollapsed ? 'justify-center px-0 gap-0' : 'px-3 gap-3'
    }`;
  }, [isCollapsed]);

  const navItemActive = useMemo(() => {
    return `bg-accentPrimary/10 text-accentPrimary border-l-[3px] border-accentPrimary ${
      isCollapsed ? 'pl-0 pr-[3px]' : 'pl-[9px]'
    }`;
  }, [isCollapsed]);

  const navItemInactive = useMemo(() => {
    return `text-textSecondary hover:bg-bgCardHover hover:text-textHeading border-l-[3px] border-transparent ${
      isCollapsed ? 'pl-0 pr-[3px]' : 'pl-[9px]'
    }`;
  }, [isCollapsed]);

  const subItemBase =
    'block rounded-md px-3 py-1.5 text-scale-caption font-medium transition-colors';
  const subItemActive =
    'bg-accentPrimary/10 text-accentPrimary font-semibold';
  const subItemInactive =
    'text-textMuted hover:bg-bgCardHover hover:text-textHeading';

  return (
    <>
      {/* ── Mobile header (auto-hide on scroll) ────────────────────── */}
      <MobileHeader onMenuClick={() => setIsMobileOpen(true)} />

      {/* ── Mobile overlay ─────────────────────────────────────────── */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar panel ──────────────────────────────────────────── */}
      <aside
        className={[
          'sidebar-shell fixed inset-y-0 left-0 z-50 flex flex-col border-r border-borderColor bg-bgSidebar transition-all duration-300',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isCollapsed ? 'lg:w-[80px]' : 'lg:w-[260px]',
        ].join(' ')}
        aria-label="Sidebar"
      >
        {/* ── Header ───────────────────────────────────────────────── */}
        <div className={`flex h-16 items-center border-b border-borderColor transition-all duration-300 ${isCollapsed ? 'justify-center px-2' : 'justify-between px-5'}`}>
          <Link to="/dashboard" className="flex items-center gap-2.5 overflow-hidden shrink-0">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-accentPrimary/10">
              <img src="/CropNow_Logo_1-D3AGwrH0.png" alt="CropNow Logo" className="h-5 w-5 object-contain" />
            </span>
            {!isCollapsed && (
              <span className="text-[15px] font-bold tracking-tight text-textHeading transition-opacity duration-300">
                CROPNOW
              </span>
            )}
          </Link>
          
          {!isCollapsed && (
            <button
              type="button"
              onClick={toggleSidebar}
              className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg border border-borderColor bg-bgCard text-textSecondary transition hover:border-accentPrimary/40 hover:text-accentPrimary"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          {isCollapsed && (
            <button
              type="button"
              onClick={toggleSidebar}
              className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg border border-borderColor bg-bgCard text-textSecondary transition hover:border-accentPrimary/40 hover:text-accentPrimary"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* ── Navigation ───────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Primary">
          {/* Section label: OVERVIEW */}
          {!isCollapsed && (
            <p className="mb-2 px-3 text-scale-caption font-bold uppercase tracking-[0.1em] text-textHint">
              Overview
            </p>
          )}

          <NavLink
            to="/dashboard"
            end
            onClick={closeMobile}
            className={({ isActive }) => `${navItemBase} ${isActive && !isDevicesSectionActive ? navItemActive : navItemInactive}`}
          >
            <LayoutDashboard className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
            {!isCollapsed && <span>Dashboard</span>}
          </NavLink>

          {/* Section label: DEVICES */}
          {!isCollapsed && (
            <p className="mb-2 mt-6 px-3 text-scale-caption font-bold uppercase tracking-[0.1em] text-textHint">
              Devices
            </p>
          )}

          {/* Expandable Devices group */}
          <button
            type="button"
            onClick={() => {
              if (isCollapsed) {
                toggleSidebar();
              } else {
                setIsDevicesOpen((v) => !v);
              }
            }}
            className={`${navItemBase} ${isDevicesSectionActive ? navItemActive : navItemInactive} ${!isCollapsed ? 'justify-between' : ''}`}
          >
            <span className="flex items-center gap-3">
              <ScanLine className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
              {!isCollapsed && <span>My Devices</span>}
            </span>
            {!isCollapsed && (
              <ChevronDown
                className={`h-4 w-4 text-textMuted transition-transform duration-200 ${isDevicesOpen ? '' : '-rotate-90'}`}
              />
            )}
          </button>

          <AnimatePresence initial={false}>
            {isDevicesOpen && !isCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="ml-[18px] border-l border-borderColor pl-4 py-1">
                  {deviceLinks.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={closeMobile}
                      className={({ isActive }) =>
                        `${subItemBase} ${isActive ? subItemActive : subItemInactive} my-0.5`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section label: INTELLIGENCE */}
          {!isCollapsed && (
            <p className="mb-2 mt-6 px-3 text-scale-caption font-bold uppercase tracking-[0.1em] text-textHint">
              Intelligence
            </p>
          )}

          <NavLink
            to="/ai-trends"
            onClick={closeMobile}
            className={({ isActive }) => `${navItemBase} ${isActive ? navItemActive : navItemInactive}`}
          >
            <TrendingUp className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
            {!isCollapsed && <span>AI Trends</span>}
          </NavLink>

          <NavLink
            to="/chatbot"
            onClick={closeMobile}
            className={({ isActive }) => `${navItemBase} ${isActive ? navItemActive : navItemInactive}`}
          >
            <MessageSquare className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
            {!isCollapsed && <span>Chatbot</span>}
          </NavLink>
        </nav>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <div className="border-t border-borderColor px-3 py-3">
          <NavLink
            to="/settings"
            onClick={closeMobile}
            className={({ isActive }) => `${navItemBase} ${isActive ? navItemActive : navItemInactive}`}
          >
            <Settings className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
            {!isCollapsed && <span>Settings</span>}
          </NavLink>

          <NavLink
            to="/support"
            onClick={closeMobile}
            className={({ isActive }) => `${navItemBase} mt-1 ${isActive ? navItemActive : navItemInactive}`}
          >
            <CircleHelp className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
            {!isCollapsed && <span>Support</span>}
          </NavLink>

          {/* User profile */}
          <div
            className="relative mt-3"
            onMouseEnter={() => setShowLogout(true)}
            onMouseLeave={() => setShowLogout(false)}
          >
            <AnimatePresence>
              {showLogout && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute bottom-full left-0 right-0 mb-1 rounded-lg border border-cardBorder bg-bgCard p-1 shadow-elevated z-50`}
                >
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-scale-caption font-medium text-red-500 transition-colors hover:bg-red-500/8"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    {!isCollapsed && <span>Logout</span>}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setShowLogout((p) => !p)}
              className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-bgCardHover ${isCollapsed ? 'justify-center' : ''}`}
            >
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accentPrimary/15 text-scale-caption font-bold text-accentPrimary">
                {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
              </span>
              {!isCollapsed && (
                <>
                  <span className="min-w-0 text-left">
                    <span className="block truncate text-scale-caption font-semibold text-textHeading">
                      {user ? `${user.firstName} ${user.lastName}` : 'User'}
                    </span>
                    <span className="block truncate text-[11px] text-textMuted">{user?.role ?? ''}</span>
                  </span>
                  <ChevronRight className="ml-auto h-3.5 w-3.5 text-textMuted" />
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
