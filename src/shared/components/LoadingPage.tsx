import { motion } from "framer-motion";

export function LoadingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bgMain overflow-hidden"
    >
      {/* Very soft, clean radial gradient background for depth without chaos */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--accent-primary)_0%,_transparent_70%)] opacity-[0.03] dark:opacity-[0.05] pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-[90%]">
        {/* Breathing Logo */}
        <motion.div
          animate={{ scale: [0.98, 1.02, 0.98], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="mb-12 w-56 h-auto flex items-center justify-center"
        >
          {/* Using the actual CropNow logo */}
          <img
            src="/CropNow_Logo_1-D3AGwrH0.png"
            alt="CropNow Logo"
            className="w-full h-auto object-contain drop-shadow-sm dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          />
        </motion.div>

        {/* Elegant Minimalist Loader Line */}
        <div className="w-48 h-[2px] bg-[var(--border-color)] dark:bg-[var(--border-subtle)] rounded-full overflow-hidden relative">
          <motion.div
            className="absolute top-0 bottom-0 left-0 bg-[var(--accent-primary)] rounded-full w-[40%]"
            animate={{
              x: ["-100%", "250%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Minimal Text Fade */}
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-6 text-xs font-medium text-textSecondary tracking-[0.2em] uppercase"
        >
          Loading CropDesk
        </motion.p>
      </div>
    </motion.div>
  );
}
