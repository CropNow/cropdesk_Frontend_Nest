import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Wifi } from "lucide-react";
import { useOnlineStatus } from "@app/providers/OnlineStatusContext";

export function OfflineBanner() {
  const { isOnline } = useOnlineStatus();
  const [showBackOnline, setShowBackOnline] = useState(false);
  const [wasOffline, setWasOffline] = useState(!navigator.onLine);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
      setShowBackOnline(false);
    } else {
      if (wasOffline) {
        setShowBackOnline(true);
        const timer = setTimeout(() => {
          setShowBackOnline(false);
          setWasOffline(false);
        }, 4000); // Hide green banner after 4 seconds
        return () => clearTimeout(timer);
      }
    }
  }, [isOnline, wasOffline]);

  return (
    <div className="fixed left-0 right-0 top-0 z-[9999] flex flex-col items-center pointer-events-none">
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-full bg-red-600 text-white py-2 px-4 shadow-md flex items-center justify-center gap-2 text-sm font-semibold pointer-events-auto"
          >
            <WifiOff className="h-4 w-4 animate-bounce" />
            <span>You are currently offline. Running in offline mode.</span>
          </motion.div>
        )}
        {isOnline && showBackOnline && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-full bg-emerald-600 text-white py-2 px-4 shadow-md flex items-center justify-center gap-2 text-sm font-semibold pointer-events-auto"
          >
            <Wifi className="h-4 w-4" />
            <span>Internet connection restored! Back online.</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
