import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';
import { useOnlineStatus } from '../../contexts/OnlineStatusContext';

type BannerState = 'offline' | 'restored' | 'hidden';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const [bannerState, setBannerState] = useState<BannerState>('hidden');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (!isOnline) {
      setBannerState('offline');
    } else {
      // Only show "restored" if we were previously offline
      if (bannerState === 'offline') {
        setBannerState('restored');
        timer = setTimeout(() => setBannerState('hidden'), 3000);
      }
    }

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const isVisible = bannerState !== 'hidden';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key={bannerState}
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={[
            'fixed top-4 left-1/2 z-[9999] flex -translate-x-1/2 items-center gap-2.5 rounded-full border px-5 py-2.5 shadow-2xl backdrop-blur-md',
            bannerState === 'offline'
              ? 'border-red-500/30 bg-red-500/90 text-white shadow-red-500/20'
              : 'border-emerald-500/30 bg-emerald-500/90 text-white shadow-emerald-500/20',
          ].join(' ')}
          role="status"
          aria-live="polite"
        >
          {bannerState === 'offline' ? (
            <>
              <WifiOff className="h-4 w-4 animate-pulse" />
              <span className="text-sm font-semibold">
                You're offline — showing cached data
              </span>
            </>
          ) : (
            <>
              <Wifi className="h-4 w-4" />
              <span className="text-sm font-semibold">
                Back online! Syncing farm data...
              </span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
