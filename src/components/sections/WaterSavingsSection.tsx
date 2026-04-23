import React from 'react';
import { motion } from 'framer-motion';

/**
 * WaterSavingsSection - Displays water savings metrics
 */
export function WaterSavingsSection({ data }: { data?: any }) {
  const savings = data || {
    percent: '15.0%',
    total: '0 L',
    daily: '0 L',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22 }}
      className="rounded-3xl border border-cardBorder bg-cardBg p-5 backdrop-blur-xl"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-3xl font-bold">Water Savings</h3>
        <span className="rounded-full border border-accentPrimary/30 bg-accentPrimary/10 px-3 py-1 text-sm font-semibold text-accentPrimary">
          {savings.percent}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/20 to-transparent p-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-200">Total Saved</p>
          <p className="mt-2 text-5xl font-bold text-cyan-300">{savings.total}</p>
          <p className="text-sm text-textLabel">This Month</p>
        </div>

        <div className="rounded-2xl border border-accentPrimary/20 bg-gradient-to-br from-emerald-500/20 to-transparent p-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-accentPrimary">Daily Average</p>
          <p className="mt-2 text-5xl font-bold text-accentPrimary">{savings.daily}</p>
          <p className="text-sm text-textLabel">Per Day</p>
        </div>
      </div>
    </motion.div>
  );
}
