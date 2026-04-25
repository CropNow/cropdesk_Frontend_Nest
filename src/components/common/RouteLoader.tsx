export function RouteLoader() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bgMain px-6 text-textPrimary">
      <div className="glass-panel flex min-w-[220px] items-center gap-4 rounded-2xl px-6 py-5">
        <span className="h-3 w-3 animate-pulse rounded-full bg-accentPrimary" />
        <div>
          <p className="text-sm font-semibold text-textHeading">Loading view</p>
          <p className="text-xs text-textSecondary">Fetching route assets...</p>
        </div>
      </div>
    </main>
  );
}
