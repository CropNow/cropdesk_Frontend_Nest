import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dropdown = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { hideArrow?: boolean }
>(({ className, children, hideArrow, ...props }, ref) => {
  return (
    <div className="relative inline-block w-auto">
      <select
        className={cn(
          'flex h-9 appearance-none items-center justify-between rounded-md border border-input bg-white px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus-visible:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      {!hideArrow && (
        <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50 pointer-events-none" />
      )}
    </div>
  );
});
Dropdown.displayName = 'Dropdown';

export { Dropdown };
