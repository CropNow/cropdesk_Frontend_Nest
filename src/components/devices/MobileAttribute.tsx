import React from 'react';

interface MobileAttributeProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}

export function MobileAttribute({ label, value, icon }: MobileAttributeProps) {
  return (
    <div className="flex flex-col items-start gap-1">
      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#00FF9C]/90">
        {icon}
        <span className="text-textSecondary">{label}</span>
      </span>
      <span className="text-sm font-medium text-textBody leading-snug">{value}</span>
    </div>
  );
}
