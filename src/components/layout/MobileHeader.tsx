import { useEffect, useRef, useState } from 'react';
import { Bell, Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface MobileHeaderProps {
  onMenuClick: () => void;
  userName?: string;
}

/**
 * MobileHeader — Fixed top header for mobile that hides on scroll down
 * and reappears on scroll up. Only visible below lg breakpoint.
 */
export function MobileHeader({ onMenuClick, userName = 'CropDesk' }: MobileHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

        // Show when scrolling up (delta < -5) or at the very top
        if (currentY < 10) {
          setIsVisible(true);
        } else if (delta > 8) {
          setIsVisible(false);
        } else if (delta < -8) {
          setIsVisible(true);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-borderColor bg-bgCard/95 px-4 backdrop-blur-sm transition-transform duration-300 lg:hidden ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Left: Menu trigger */}
      <button
        type="button"
        onClick={onMenuClick}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-cardBorder text-textSecondary transition hover:text-textHeading"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Centre: Brand */}
      <div className="flex items-center gap-2">
        <img src="/CropNow_Logo_1-D3AGwrH0.png" alt="CropNow" className="h-6 w-6" />
        <span className="text-base font-bold tracking-tight text-textHeading">CROPNOW</span>
      </div>

      {/* Right: Quick actions */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-textSecondary transition hover:text-textHeading"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-textSecondary transition hover:text-textHeading"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
        </button>
      </div>
    </header>
  );
}
