import type { ReactNode, ElementType } from 'react';

/* =====================================================
 * Shared base props
 * ===================================================== */

interface BaseHeadingProps {
  children: ReactNode;
  className?: string;
}

/* =====================================================
 * CenterHeading
 * ===================================================== */

type CenterHeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

interface CenterHeadingProps extends BaseHeadingProps {
  level?: CenterHeadingLevel;
}

export function CenterHeading({
  level = 'h1',
  children,
  className = '',
}: CenterHeadingProps) {
  const baseStyles = 'tracking-tight text-foreground text-center';

  const styles: Record<CenterHeadingLevel, string> = {
    h1: 'text-2xl md:text-3xl lg:text-4xl leading-none font-semibold',
    h2: 'text-xl md:text-2xl lg:text-3xl leading-tight font-medium',
    h3: 'text-lg md:text-xl lg:text-3xl font-medium',
    h4: 'text-base md:text-lg font-medium',
  };

  const Tag = level as ElementType;

  return (
    <Tag className={`${baseStyles} ${styles[level]} ${className}`}>
      {children}
    </Tag>
  );
}

/* =====================================================
 * MainHeading
 * ===================================================== */

type MainHeadingLevel = 'h1' | 'h2' | 'h3' | 'h4';

interface MainHeadingProps extends BaseHeadingProps {
  level?: MainHeadingLevel;
}

export function MainHeading({
  level = 'h1',
  children,
  className = '',
}: MainHeadingProps) {
  const baseStyles = 'tracking-tight text-foreground';

  const styles: Record<MainHeadingLevel, string> = {
    h1: 'text-2xl md:text-3xl lg:text-4xl font-semibold',
    h2: 'text-xl md:text-2xl lg:text-3xl font-medium',
    h3: 'text-lg md:text-xl lg:text-3xl font-medium',
    h4: 'text-base md:text-lg leading-normal font-medium',
  };

  const Tag = level as ElementType;

  return (
    <Tag className={`${baseStyles} ${styles[level]} ${className}`}>
      {children}
    </Tag>
  );
}

/* =====================================================
 * MainHeadings (advanced variant)
 * ===================================================== */

type MainHeadingsLevel = 'h1' | 'h2' | 'h3' | 'h4';
type Spacing = 'none' | 'tight' | 'snug' | 'normal' | 'relaxed';
type Tracking = 'tight' | 'normal' | 'wide';

interface MainHeadingsProps extends BaseHeadingProps {
  level?: MainHeadingsLevel;
  spacing?: Spacing;
  tracking?: Tracking;
}

export function MainHeadings({
  level = 'h1',
  spacing = 'none',
  tracking = 'tight',
  children,
  className = '',
}: MainHeadingsProps) {
  const baseStyles = 'tracking-tight text-foreground';

  const sizeStyles: Record<MainHeadingsLevel, string> = {
    h1: 'text-2xl md:text-3xl lg:text-4xl font-semibold',
    h2: 'text-xl md:text-2xl lg:text-3xl font-medium',
    h3: 'text-lg md:text-xl lg:text-3xl font-medium',
    h4: 'text-base md:text-lg font-medium',
  };

  const spacingStyles: Record<Spacing, string> = {
    none: 'leading-none',
    tight: 'leading-tight',
    snug: 'leading-snug',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
  };

  const trackingStyles: Record<Tracking, string> = {
    tight: 'tracking-tight',
    normal: 'tracking-normal',
    wide: 'tracking-wide',
  };

  const Tag = level as ElementType;

  return (
    <Tag
      className={`${baseStyles} ${sizeStyles[level]} ${
        spacingStyles[spacing]
      } ${trackingStyles[tracking]} ${className}`}
    >
      {children}
    </Tag>
  );
}

/* =====================================================
 * Subheading
 * ===================================================== */

type SubheadingLevel = 'h2' | 'h3';

interface SubheadingProps extends BaseHeadingProps {
  level?: SubheadingLevel;
}

export function Subheading({
  level = 'h2',
  children,
  className = '',
}: SubheadingProps) {
  const baseStyles = 'tracking-tight text-foreground';

  const styles: Record<SubheadingLevel, string> = {
    h2: 'text-lg md:text-xl font-semibold',
    h3: 'text-base md:text-lg font-medium',
  };

  const Tag = level as ElementType;

  return (
    <Tag className={`${baseStyles} ${styles[level]} ${className}`}>
      {children}
    </Tag>
  );
}

/* =====================================================
 * Boxheading
 * ===================================================== */

type BoxheadingLevel = 'h3' | 'h4';

interface BoxheadingProps extends BaseHeadingProps {
  level?: BoxheadingLevel;
}

export function Boxheading({
  level = 'h3',
  children,
  className = '',
}: BoxheadingProps) {
  const baseStyles = 'tracking-tight text-foreground';

  const styles: Record<BoxheadingLevel, string> = {
    h3: 'text-lg md:text-xl font-medium',
    h4: 'text-base md:text-lg font-medium',
  };

  const Tag = level as ElementType;

  return (
    <Tag className={`${baseStyles} ${styles[level]} ${className}`}>
      {children}
    </Tag>
  );
}

/* =====================================================
 * Sideheading
 * ===================================================== */

type SideheadingLevel = 'h6';

interface SideheadingProps extends BaseHeadingProps {
  level?: SideheadingLevel;
}

export function Sideheading({
  level = 'h6',
  children,
  className = '',
}: SideheadingProps) {
  const baseStyles = 'tracking-tight text-foreground';

  const styles: Record<SideheadingLevel, string> = {
    h6: 'text-base md:text-lg',
  };

  const Tag = level as ElementType;

  return (
    <Tag className={`${baseStyles} ${styles[level]} ${className}`}>
      {children}
    </Tag>
  );
}
