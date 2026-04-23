import React from 'react';
import { motion } from 'framer-motion';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-bgMain px-4 pb-10 pt-8 text-textHeading sm:px-6 lg:pl-28 lg:pr-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-20 top-24 h-64 w-64 rounded-full bg-[#00FF9C]/10 blur-3xl" />
        <div className="absolute right-10 top-56 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-[1500px] space-y-6">
        {children}
      </div>
    </main>
  );
}
