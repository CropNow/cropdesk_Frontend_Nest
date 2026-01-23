import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type ParaLevel = 'p' | 'span' | 'div';

interface ParaProps extends HTMLAttributes<HTMLElement> {
  level?: ParaLevel;
  children: ReactNode;
  className?: string;
}

export function Para({
  level = 'p',
  children,
  className,
  ...props
}: ParaProps) {
  const Tag = level as ElementType;

  return (
    <Tag
      className={cn('text-foreground text-base md:text-lg', className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
