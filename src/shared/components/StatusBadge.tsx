import React from 'react';

/**
 * StatusBadge - Displays status indicators with color variants
 */
interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info';
}

export function StatusBadge({ children, variant = 'success' }: StatusBadgeProps) {
  const variants = {
    success: 'bg-[#00FF9C]/10 border-[#00FF9C]/30 text-[#00FF9C]',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    danger: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    info: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:px-2.5 sm:text-xs ${variants[variant]}`}>
      {children}
    </span>
  );
}
