import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  className?: string;
  text?: string;
  subText?: string;
}

export default function Loader({
  className,
  text = 'CropDesk',
  subText = 'Loading your agricultural insights...',
}: LoaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-screen w-full gap-4 bg-black',
        className
      )}
    >
      <div className="relative">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
        <div className="absolute inset-0 h-12 w-12 animate-pulse rounded-full bg-green-500/20 blur-xl" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <img
          src="/CropNow_Logo_1-D3AGwrH0.png"
          alt="CropNow Logo"
          className="h-12 w-auto object-contain mb-2"
        />
        <p className="text-sm text-muted-foreground animate-pulse">{subText}</p>
      </div>
    </div>
  );
}
