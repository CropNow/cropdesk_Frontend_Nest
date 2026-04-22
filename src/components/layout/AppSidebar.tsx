import { useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  CircleHelp,
  LayoutDashboard,
  LogOut,
  Menu,
  ScanLine,
  Settings,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

type DeviceLink = {
  label: string;
  to: string;
};

const deviceLinks: DeviceLink[] = [
  { label: 'NEST', to: '/dashboard?device=nest' },
  { label: 'Seed', to: '/dashboard?device=seed' },
  { label: 'Aero Drone', to: '/dashboard?device=aero' },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const [isDockedOpen, setIsDockedOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    logout();
    addToast({ message: 'Logged out successfully', type: 'success' });
    navigate('/login');
  };

  const isDevicesSectionActive = useMemo(() => {
    return location.pathname === '/dashboard' && location.search.includes('device=');
  }, [location.pathname, location.search]);

  const isExpanded = isMobileOpen || isDockedOpen;

  const closeMobile = () => setIsMobileOpen(false);
  const handleDesktopHoverIn = () => {
    if (window.innerWidth >= 1024) {
      setIsDockedOpen(true);
    }
  };

  const handleDesktopHoverOut = () => {
    if (window.innerWidth >= 1024) {
      setIsDockedOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed left-3 top-3 z-40 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-cardBorder bg-bgSidebar text-textHeading shadow-lg shadow-black/10 dark:shadow-black/20 sm:left-4 sm:top-4 sm:h-10 sm:w-10 sm:rounded-xl"
        aria-label="Open navigation"
      >
        <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      {isMobileOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/40 dark:bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      ) : null}

      <aside
        className={[
          'sidebar-shell fixed inset-y-0 left-0 z-50 border-r border-borderSubtle bg-bgSidebar backdrop-blur-2xl transition-all duration-300 lg:bottom-4 lg:left-4 lg:top-4 lg:rounded-[28px] lg:border lg:border-borderSubtle',
          isExpanded ? 'w-[280px]' : 'w-[72px] sm:w-[84px]',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
        onMouseEnter={handleDesktopHoverIn}
        onMouseLeave={handleDesktopHoverOut}
        aria-label="Sidebar"
      >
        <div className="relative flex h-full flex-col px-3 py-4 sm:px-4 sm:py-5">
          <div className="mb-5 flex items-center justify-between sm:mb-7">
<Link
              to="/dashboard"
              className={[
                'group flex items-center rounded-2xl transition-all duration-200',
                isExpanded ? 'gap-3 px-3 py-2' : 'justify-center w-full py-2',
              ].join(' ')}
            >
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-accentPrimary/10 border border-accentPrimary/20">
                <img src="/CropNow_Logo_1-D3AGwrH0.png" alt="CropNow Logo" className="h-6 w-6 object-contain" />
              </span>
              {isExpanded ? (
                <span className="text-lg font-bold tracking-tight text-textHeading">CROPNOW</span>
              ) : null}
            </Link>

            <button
              type="button"
              onClick={closeMobile}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-cardBorder text-textMuted hover:text-textHeading hover:bg-cardBg lg:hidden"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex-1 space-y-1" aria-label="Primary">
            <NavLink
              to="/dashboard"
              onClick={closeMobile}
              className={({ isActive }) =>
                [
                  'sidebar-item flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-accentPrimary/10 text-accentPrimary border border-accentPrimary/20'
                    : 'text-textSecondary hover:bg-cardBg hover:text-textHeading',
                  isExpanded ? 'justify-start gap-3' : 'justify-center',
                ].join(' ')
              }
            >
              <LayoutDashboard className="h-4.5 w-4.5 shrink-0" />
              {isExpanded ? <span>Dashboard</span> : null}
            </NavLink>

            <div
              className={[
                'rounded-2xl',
                isDevicesSectionActive ? 'bg-black/[0.03] dark:bg-white/[0.06]' : '',
              ].join(' ')}
            >
              <div
                className={[
                  'sidebar-item flex items-center rounded-2xl px-3 py-2.5 text-sm font-semibold text-textPrimary',
                  isExpanded ? 'justify-between' : 'justify-center',
                ].join(' ')}
              >
                <div className={['flex items-center', isExpanded ? 'gap-3' : 'justify-center'].join(' ')}>
                  <ScanLine className="h-4.5 w-4.5 shrink-0" />
                  {isExpanded ? <span>Devices</span> : null}
                </div>
                {isExpanded ? <ChevronDown className="h-4 w-4 text-textSecondary" /> : null}
              </div>

              {isExpanded ? (
                <div className="ml-6 border-l border-borderColor/90 pl-4 pb-2">
                  {deviceLinks.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={closeMobile}
                      className={({ isActive }) =>
                        [
                          'my-1 block rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-black text-white dark:bg-white dark:text-black'
                            : 'text-textSecondary hover:bg-black/5 hover:text-textPrimary dark:hover:bg-white/10 dark:hover:text-textPrimary',
                        ].join(' ')
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              ) : null}
            </div>
          </nav>

          <div className="mt-4 border-t border-borderColor pt-4">
            <NavLink
              to="/settings"
              onClick={closeMobile}
              className={({ isActive }) =>
                [
                  'sidebar-item mb-2 flex w-full items-center rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors',
                  isActive
                    ? 'bg-accentPrimary/10 text-accentPrimary border border-accentPrimary/20'
                    : 'text-textPrimary hover:bg-black/5 dark:hover:bg-white/10',
                  isExpanded ? 'justify-start gap-3' : 'justify-center',
                ].join(' ')
              }
            >
              <Settings className="h-4.5 w-4.5 shrink-0" />
              {isExpanded ? <span>Settings</span> : null}
            </NavLink>

            <button
              type="button"
              className={[
                'sidebar-item mb-2 flex w-full items-center rounded-2xl px-3 py-2.5 text-sm font-semibold text-textPrimary transition-colors hover:bg-black/5 dark:hover:bg-white/10',
                isExpanded ? 'justify-start gap-3' : 'justify-center',
              ].join(' ')}
            >
              <CircleHelp className="h-4.5 w-4.5 shrink-0" />
              {isExpanded ? <span>Support</span> : null}
            </button>

            {/* User profile with hover logout */}
            <div
              className="relative"
              onMouseEnter={() => setShowLogout(true)}
              onMouseLeave={() => setShowLogout(false)}
            >
              {/* Logout popup */}
              <AnimatePresence>
                {showLogout && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className={[
                      'absolute z-10 rounded-xl border border-cardBorder bg-bgCard p-1.5 shadow-xl shadow-black/20 dark:shadow-black/40',
                      isExpanded ? 'bottom-full left-0 right-0 mb-2' : 'bottom-0 left-full mb-0 ml-3',
                    ].join(' ')}
                  >
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={() => setShowLogout((p) => !p)}
                className={[
                  'sidebar-item flex w-full items-center rounded-2xl px-2 py-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10',
                  isExpanded ? 'justify-start gap-3' : 'justify-center',
                ].join(' ')}
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                  {user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
                </span>
                {isExpanded ? (
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-textPrimary">
                      {user ? `${user.firstName} ${user.lastName}` : 'User'}
                    </span>
                    <span className="block truncate text-xs text-textSecondary">{user?.role ?? ''}</span>
                  </span>
                ) : null}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
