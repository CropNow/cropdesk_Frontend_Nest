import { WifiOff, RefreshCw } from "lucide-react";

interface OfflineFallbackProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function OfflineFallback({
  title = "Connection Lost",
  description = "You are currently offline. Please check your internet connection and try again.",
  onRetry,
}: OfflineFallbackProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-500 dark:bg-red-500/5 dark:text-red-400">
        <WifiOff className="h-10 w-10" />
        <span className="absolute -right-1 -top-1 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex h-4 w-4 rounded-full bg-red-500"></span>
        </span>
      </div>
      <h3 className="mb-2 text-xl font-bold tracking-tight text-textHeading sm:text-2xl">
        {title}
      </h3>
      <p className="mb-8 max-w-md text-sm text-textSecondary">{description}</p>
      <button
        onClick={handleRetry}
        className="inline-flex items-center gap-2 rounded-xl bg-accentPrimary px-6 py-3 text-sm font-semibold text-black transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
      >
        <RefreshCw className="h-4 w-4" />
        Retry Connection
      </button>
    </div>
  );
}
