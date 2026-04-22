import React from 'react';
import { motion } from 'framer-motion';

/**
 * RadialAttribute - Individual attribute displayed in radial layout around device
 */
interface RadialAttributeProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  posClass: string;
  align: 'left' | 'right' | 'center';
  delay?: number;
}

export function RadialAttribute({ label, value, icon, posClass, align, delay = 0 }: RadialAttributeProps) {
  const textAlign =
    align === 'left' ? 'items-end text-right' : align === 'right' ? 'items-start text-left' : 'items-center text-center';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.08, filter: 'brightness(1.25)' }}
      className={`group absolute z-10 flex flex-col gap-0.5 ${textAlign} ${posClass} cursor-default`}
    >
      <span
        className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-textMuted ${
          align === 'left' ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <span className="text-accentPrimary/70">{icon}</span>
        {label}
      </span>
      <span className="text-sm font-medium text-[#E5E7EB]/90 leading-tight">{value}</span>
    </motion.div>
  );
}
