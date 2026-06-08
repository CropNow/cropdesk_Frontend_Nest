import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('cropdesk_pwa_dismissed') === 'true';
    
    const handler = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      if (!isDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismissClick = () => {
    try {
      localStorage.setItem('cropdesk_pwa_dismissed', 'true');
    } catch (err) {
      console.error(err);
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0"
      >
        <div className="flex flex-col gap-3 rounded-xl border border-cardBorder bg-cardBg p-4 shadow-elevated w-[320px] sm:w-[360px]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accentPrimary/10 text-accentPrimary">
              <Download className="h-5 w-5" />
            </div>
            
            <div className="flex flex-col">
              <p className="text-scale-body font-bold text-textHeading">Install CropDesk App</p>
              <p className="text-scale-caption font-medium text-textSecondary">Add to home screen for faster, offline access.</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 mt-1">
            <button
              onClick={handleDismissClick}
              className="rounded-lg border border-cardBorder bg-bgInput px-3.5 py-1.5 text-scale-caption font-semibold text-textSecondary transition hover:bg-cardBorder active:scale-95"
            >
              Do it later
            </button>
            <button
              onClick={handleInstallClick}
              className="rounded-lg bg-accentPrimary px-4 py-1.5 text-scale-caption font-bold text-white transition hover:bg-accentHover active:scale-95 shadow-sm"
            >
              Install Now
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

