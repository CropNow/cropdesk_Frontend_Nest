import { useState, useRef, useEffect, useMemo } from 'react';
import { Menu, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface MobileHeaderProps {
  onOpenSidebar: () => void;
  isSidebarOpen?: boolean;
}

export function MobileHeader({ onOpenSidebar, isSidebarOpen = false }: MobileHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const trayRef = useRef<HTMLDivElement | null>(null);

  // Monitor body scroll lock to detect modals
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsModalOpen(document.body.style.overflow === 'hidden');
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
    
    // Initial check
    setIsModalOpen(document.body.style.overflow === 'hidden');

    return () => observer.disconnect();
  }, []);

  // Handle scroll to show/hide header
  useEffect(() => {
    if (isModalOpen) return; // Don't track scroll if modal is open

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Mock notifications - can be expanded later
  const notifications = useMemo(() => [], []);
  const unreadCount = notifications.filter((item: any) => item.unread).length;

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
    <header 
      className={`lg:hidden fixed top-0 left-0 right-0 z-30 h-16 border-b border-cardBorder bg-bgSidebar/80 backdrop-blur-md px-4 flex items-center justify-between transition-transform duration-300 ${ (isVisible || isSidebarOpen) && !isModalOpen ? 'translate-y-0' : '-translate-y-full'}`}
    >
      {/* Left: Hamburger */}
      <button
        type="button"
        onClick={onOpenSidebar}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cardBorder bg-cardBg/50 text-textHeading shadow-sm transition-all hover:bg-cardBg"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Middle: Logo */}
      <div className="flex items-center gap-2">
        <img src="/CropNow_Logo_1-D3AGwrH0.png" alt="CropNow Logo" className="h-7 w-7 object-contain" />
        <span className="text-base font-bold tracking-tight text-textHeading uppercase">CROPNOW</span>
      </div>

      {/* Right: Notification and Theme Toggle */}
      <div className="flex items-center gap-2">
        <div className="relative" ref={trayRef}>
          <button
            type="button"
            onClick={() => setIsTrayOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cardBorder bg-cardBg/50 text-textSecondary transition-all hover:border-accentPrimary/40 hover:text-accentPrimary"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-0 top-0 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accentPrimary px-1 text-[10px] font-bold text-black border-2 border-bgSidebar">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Tray (Mobile Optimized) */}
          {isTrayOpen && (
            <div className="absolute right-0 top-12 z-50 w-[280px] rounded-2xl border border-cardBorder bg-bgSidebar p-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="mb-2 flex items-center justify-between border-b border-cardBorder pb-2">
                <p className="text-sm font-semibold text-textHeading">Notifications</p>
                <span className="rounded-full bg-accentPrimary/20 px-2 py-0.5 text-[11px] font-semibold text-accentPrimary">
                  {unreadCount} new
                </span>
              </div>
              <div className="max-h-60 overflow-y-auto py-4 text-center">
                <p className="text-xs font-medium text-textHint">All caught up!</p>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cardBorder bg-cardBg/50 text-textSecondary transition-all hover:border-accentPrimary/40 hover:text-accentPrimary"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
}
