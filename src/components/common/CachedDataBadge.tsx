import { motion } from 'framer-motion';
import { AlertTriangle, Clock } from 'lucide-react';
import { formatSyncTime } from '../../utils/dashboardCache';

interface CachedDataBadgeProps {
  lastSyncTime: Date | null;
}

/**
 * Displays a premium glassmorphic warning badge when the dashboard
 * is rendering offline-cached data after a page refresh.
 */
export function CachedDataBadge({ lastSyncTime }: CachedDataBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex items-center gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/8 px-4 py-3 backdrop-blur-md"
      role="status"
      aria-label="Viewing cached dashboard data"
    >
      {/* Icon */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400">
        <AlertTriangle className="h-4 w-4" />
      </div>

      {/* Text */}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-amber-400">
          ⚠ Viewing cached data
        </p>
        {lastSyncTime && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-amber-400/70">
            <Clock className="h-3 w-3 shrink-0" />
            Last synced:&nbsp;
            <span className="font-medium">{formatSyncTime(lastSyncTime)}</span>
          </p>
        )}
      </div>

      {/* Subtle animated pulse dot */}
      <div className="ml-auto flex shrink-0 items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-50" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/70">
          Offline
        </span>
      </div>
    </motion.div>
  );
}
