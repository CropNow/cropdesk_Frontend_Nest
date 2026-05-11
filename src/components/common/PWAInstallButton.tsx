import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0"
      >
        <div className="flex items-center gap-4 rounded-2xl border border-[#00FF9C]/30 bg-[#0A0E14]/90 p-4 shadow-[0_0_30px_rgba(0,255,156,0.15)] backdrop-blur-xl">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00FF9C]/20 text-[#00FF9C]">
            <Download className="h-5 w-5" />
          </div>
          
          <div className="flex flex-col">
            <p className="text-sm font-bold text-white">Install CropDesk</p>
            <p className="text-[0.65rem] font-medium text-white/50">Add to home screen for quick access</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="rounded-lg bg-[#00FF9C] px-4 py-1.5 text-xs font-bold text-black transition hover:bg-[#00e68d] active:scale-95"
            >
              Install
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="rounded-lg p-1.5 text-white/30 transition hover:bg-white/5 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
