import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  /** Apply hover elevation effect. Default: false */
  hoverable?: boolean;
  /** Use flat variant (no shadow, just border). Default: false */
  flat?: boolean;
  /** Use inner/nested variant (bg-input). Default: false */
  inner?: boolean;
  /** Additional className */
  className?: string;
  /** onClick handler */
  onClick?: () => void;
}

/**
 * Card — reusable surface component for the CropDesk design system.
 *
 * Variants:
 *   - Default: bg-card, card-border, shadow-card
 *   - `flat`: no shadow, just border
 *   - `inner`: bg-input, subtle border (for nested cards inside a card)
 *   - `hoverable`: elevate shadow + accent border on hover
 */
export function Card({ children, hoverable = false, flat = false, inner = false, className = '', onClick }: CardProps) {
  if (inner) {
    return (
      <div className={`card-inner ${className}`} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <div className={`${flat ? 'card-flat' : 'card'} ${hoverable ? '' : '[&]:hover:border-[var(--card-border)] [&]:hover:shadow-[var(--shadow-card)] [&]:hover:translate-y-0'} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}
