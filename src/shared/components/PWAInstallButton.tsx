import React, { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto z-[100]"
      >
        <div className="flex items-center gap-3 sm:gap-4 rounded-2xl border border-borderColor/50 bg-bgCard/90 p-3 sm:p-4 shadow-lg backdrop-blur-xl max-w-md mx-auto sm:mx-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accentPrimary/20 text-accentPrimary">
            <Download className="h-5 w-5" />
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-bold text-textPrimary truncate">Install CropDesk</p>
            <p className="text-[0.6rem] sm:text-[0.65rem] font-medium text-textSecondary truncate sm:whitespace-normal">
              Add to home screen for quick access
            </p>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="rounded-lg bg-accentPrimary px-3 py-1.5 sm:px-4 text-xs font-bold text-black dark:text-black transition hover:bg-accentSecondary active:scale-95"
            >
              Install
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="rounded-lg p-1.5 text-textSecondary transition hover:bg-black/5 dark:hover:bg-white/5 hover:text-textPrimary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
