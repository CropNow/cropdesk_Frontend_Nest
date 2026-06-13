import { motion } from 'framer-motion';
import { WifiOff, RotateCw } from 'lucide-react';

interface OfflineFallbackProps {
  title?: string;
  description?: string;
  showRetry?: boolean;
}

export function OfflineFallback({
  title = 'Feature Unavailable Offline',
  description = 'This page requires an active internet connection to load live data.',
  showRetry = true,
}: OfflineFallbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-borderColor bg-bgCard/40 p-10 text-center backdrop-blur-sm"
    >
      {/* Icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 animate-ping rounded-full bg-red-500/20" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400">
          <WifiOff className="h-7 w-7" />
        </div>
      </div>

      {/* Text */}
      <h2 className="mb-2 text-xl font-bold text-textHeading sm:text-2xl">{title}</h2>
      <p className="mb-8 max-w-sm text-sm leading-relaxed text-textSecondary sm:text-base">
        {description}
      </p>

      {/* Retry Button */}
      {showRetry && (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 rounded-xl border border-accentPrimary/30 bg-accentPrimary/10 px-6 py-2.5 text-sm font-semibold text-accentPrimary transition hover:bg-accentPrimary hover:text-black active:scale-95"
        >
          <RotateCw className="h-4 w-4" />
          Retry Connection
        </button>
      )}

      {/* Subtle hint */}
      <p className="mt-6 text-xs text-textHint">
        Previously cached data may still be visible on the dashboard.
      </p>
    </motion.div>
  );
}
