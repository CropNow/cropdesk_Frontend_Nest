import { useSidebar } from '../../contexts/SidebarContext';

/**
 * LoadingSkeleton - Placeholder UI shown while dashboard is loading
 */
export function LoadingSkeleton() {
  const { isCollapsed } = useSidebar();

  return (
    <main className={`min-h-screen bg-bgMain px-4 pb-10 pt-20 text-textHeading sm:px-6 lg:pr-8 lg:pt-8 transition-all duration-300 ${
      isCollapsed ? 'lg:pl-[104px]' : 'lg:pl-[284px]'
    }`}>
      <div className="mx-auto max-w-[1600px] animate-pulse space-y-6">
        <div className="h-28 rounded-3xl bg-cardBg" />
        <div className="h-[400px] rounded-3xl bg-cardBg" />
        <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
          <div className="h-[380px] rounded-3xl bg-cardBg" />
          <div className="h-[380px] rounded-3xl bg-cardBg" />
        </div>
        <div className="grid gap-6 xl:grid-cols-5">
          <div className="h-[360px] rounded-3xl bg-cardBg xl:col-span-2" />
          <div className="h-[360px] rounded-3xl bg-cardBg xl:col-span-3" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-[340px] rounded-3xl bg-cardBg lg:col-span-2" />
          <div className="h-[340px] rounded-3xl bg-cardBg" />
        </div>
      </div>
    </main>
  );
}
