import { Loader2 } from 'lucide-react';

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full gap-4 bg-black">
      <div className="relative">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
        <div className="absolute inset-0 h-12 w-12 animate-pulse rounded-full bg-green-500/20 blur-xl" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-lg text-white font-semibold text-foreground tracking-tight">
          CropDesk
        </p>
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading your agricultural insights...
        </p>
      </div>
    </div>
  );
}
