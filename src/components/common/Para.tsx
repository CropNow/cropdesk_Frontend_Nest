import type { ReactNode, ElementType } from 'react';

type ParaLevel = 'p' | 'span' | 'div';

interface ParaProps {
  level?: ParaLevel;
  children: ReactNode;
  className?: string;
}

export function Para({ level = 'p', children, className = '' }: ParaProps) {
  const baseStyles = 'text-foreground';

  const styles = {
    default: 'text-base md:text-lg',
  };

  const Tag = level as ElementType;

  return (
    <Tag className={`${baseStyles} ${styles.default} ${className}`}>
      {children}
    </Tag>
  );
}
