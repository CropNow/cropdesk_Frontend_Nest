import { Database, Clock } from "lucide-react";

interface CachedDataBadgeProps {
  lastSyncTime: Date | null;
}

export function CachedDataBadge({ lastSyncTime }: CachedDataBadgeProps) {
  const formattedTime = lastSyncTime
    ? lastSyncTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "Never";
  const formattedDate = lastSyncTime
    ? lastSyncTime.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : "";

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-2.5 text-xs font-semibold text-amber-500 backdrop-blur-xl md:text-sm">
      <div className="flex items-center gap-1.5">
        <Database className="h-4 w-4 animate-pulse" />
        <span>Cached Data Mode</span>
      </div>
      <span className="hidden md:inline text-amber-500/40">•</span>
      <div className="flex items-center gap-1.5 text-amber-500/80">
        <Clock className="h-3.5 w-3.5" />
        <span>
          Last synced: {formattedDate} {formattedTime}
        </span>
      </div>
    </div>
  );
}
