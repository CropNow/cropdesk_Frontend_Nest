import React from 'react';
import { cn } from '@/lib/utils';

interface ListBoxProps {
  items: { id: string; label: string; subLabel?: string }[];
  selectedId?: string;
  onSelect: (id: string) => void;
  className?: string;
  height?: string;
}

export const ListBox = ({
  items,
  selectedId,
  onSelect,
  className,
  height = 'h-[240px]', // Approx 6 items (40px each)
}: ListBoxProps) => {
  return (
    <div
      className={cn(
        'border border-border rounded-xl bg-card overflow-hidden',
        className
      )}
    >
      <div className={cn('overflow-y-auto', height)}>
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={cn(
              'px-4 py-3 text-lg cursor-pointer transition-colors border-b border-border last:border-0',
              selectedId === item.id
                ? 'bg-primary/20 text-primary-foreground font-medium'
                : 'text-foreground hover:bg-muted/50'
            )}
          >
            <div className="font-medium">{item.label}</div>
            {item.subLabel && (
              <div className="text-sm text-muted-foreground mt-0.5 opacity-80">
                {item.subLabel}
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No items found
          </div>
        )}
      </div>
    </div>
  );
};
