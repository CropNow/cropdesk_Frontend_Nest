import type { ReactNode } from 'react';

interface SectionHeadingProps {
  /** Main heading text */
  title: string;
  /** Optional subtitle or supporting text */
  subtitle?: string;
  /** Optional right-side content (e.g. badge, button) */
  action?: ReactNode;
  /** Additional className */
  className?: string;
}

/**
 * SectionHeading — consistent heading pattern for all dashboard sections.
 * 28px / font-weight 700 heading + 14px subtitle.
 */
export function SectionHeading({ title, subtitle, action, className = '' }: SectionHeadingProps) {
  return (
    <div className={`mb-6 flex items-start justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        <h3 className="text-scale-section font-bold tracking-tight text-textHeading">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-scale-helper font-medium text-textSecondary">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
