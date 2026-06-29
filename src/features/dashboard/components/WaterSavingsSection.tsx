import React from "react";
import { motion } from "framer-motion";
import { StatusBadge } from "@shared/components/StatusBadge";

/**
 * WaterSavingsSection - Displays water savings metrics
 */
export function WaterSavingsSection({ data }: { data?: any }) {
  const percent = data?.percentage !== undefined ? `${data.percentage}%` : (data?.percent || "0.0%");
  const total = data?.totalSaved !== undefined ? `${data.totalSaved} L` : (data?.total || "0 L");
  const daily = data?.dailyAverage !== undefined ? `${data.dailyAverage} L` : (data?.daily || "0 L");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22 }}
      className="card shadow-card p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-scale-section font-bold text-textHeading">Water Savings</h3>
        <StatusBadge
          label={percent}
          variant="success"
          size="md"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div className="rounded-lg border border-borderColor bg-bgInput p-5 shadow-sm">
          <p className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">Total Saved</p>
          <p className="mt-2 text-scale-metric font-bold text-textHeading">{total}</p>
          <p className="text-scale-helper font-medium text-textSecondary">This Month</p>
        </div>

        <div className="rounded-lg border border-borderColor bg-bgInput p-5 shadow-sm">
          <p className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">Daily Average</p>
          <p className="mt-2 text-scale-metric font-bold text-textHeading">{daily}</p>
          <p className="text-scale-helper font-medium text-textSecondary">Per Day</p>
        </div>
      </div>
    </motion.div>
  );
}
