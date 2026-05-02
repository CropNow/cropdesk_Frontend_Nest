import { useMemo } from 'react';
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
      className="relative z-30 rounded-xl border border-cardBorder bg-cardBg/50 py-2 px-3 backdrop-blur-sm sm:py-3 sm:px-5"
    >
      <div className="relative flex flex-col gap-2 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col">
          <div className="flex items-center justify-between sm:block">
            {/* Mobile Welcome Text */}
            <span className="text-xs font-bold uppercase tracking-wider text-textLabel sm:hidden mb-0.5 opacity-80">
              Welcome back,
            </span>
            
            {/* Mobile Weather - Placed on the right of Welcome back */}
            <div className="flex items-center gap-1.5 sm:hidden">
              <p className="text-base font-bold text-textHeading">
                {displayWeather.temp.split(' ')[0]}°
              </p>
              <p className="text-xs font-semibold text-textSecondary uppercase tracking-wider">
                {displayWeather.condition}
              </p>
            </div>
          </div>
          
          <h1 className="text-xl font-extrabold tracking-tight text-textHeading sm:text-2xl lg:text-3xl">
            <span className="hidden sm:inline">Welcome back, </span>
            {userName}
          </h1>

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

        <div className="flex flex-col items-end justify-center">
          {/* Web View Controls - Hidden on mobile/tablet */}
          <div className="hidden lg:flex items-center gap-2 mb-1.5">
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-cardBorder bg-cardBg/50 text-textSecondary transition-all hover:border-accentPrimary/40 hover:text-accentPrimary hover:bg-cardBg shadow-sm"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-cardBorder bg-cardBg/50 text-textSecondary transition-all hover:border-accentPrimary/40 hover:text-accentPrimary hover:bg-cardBg shadow-sm"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          <div className="hidden sm:flex items-baseline gap-2 sm:gap-3">
            <p className="text-2xl font-extrabold tracking-tighter text-textHeading sm:text-3xl lg:text-4xl leading-none">
              {displayWeather.temp.split(' ')[0]}
              <span className="text-lg text-textMuted sm:text-xl lg:text-2xl">°C</span>
            </p>
            <p className="text-xs font-medium text-textSecondary sm:text-base lg:text-lg">{displayWeather.condition}</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
