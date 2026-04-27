import React from 'react';
import { motion } from 'framer-motion';
import { FarmStatusMetric } from '../../constants/deviceConstants';

/**
 * FarmStatusCard - Displays individual farm metrics with icons
 */
interface FarmStatusCardProps {
  metric: FarmStatusMetric;
}

export function FarmStatusCard({ metric }: FarmStatusCardProps) {
  const icon = React.isValidElement(metric.icon)
    ? React.cloneElement(metric.icon as React.ReactElement, { className: 'h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6' })
    : metric.icon;

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      className="flex flex-col items-center justify-center rounded-lg border border-cardBorder bg-cardBg/30 p-2 text-center transition sm:rounded-xl sm:p-3 lg:p-4"
    >
      <div className="mb-1 text-textLabel sm:mb-2">{icon}</div>
      <div className="mb-0.5 flex items-baseline justify-center gap-0.5">
        <span className="text-lg font-bold tracking-tight text-textHeading sm:text-lg lg:text-2xl">{metric.value}</span>
        {metric.unit && <span className="text-[13px] font-medium text-textMuted sm:text-sm">{metric.unit}</span>}
      </div>
      <p className="text-xs font-medium text-textHint sm:text-xs">{metric.label}</p>
    </motion.div>
  );
}
