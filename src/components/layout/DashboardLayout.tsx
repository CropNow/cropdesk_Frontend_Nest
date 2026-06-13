import type { ReactNode } from 'react';
import { useSidebar } from '../../contexts/SidebarContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * DashboardLayout — Main content wrapper.
 * Provides consistent padding, max-width, and section gaps.
 * Sidebar is 260px wide on desktop, 80px when collapsed.
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isCollapsed } = useSidebar();

  return (
    <main className={`min-h-screen bg-bgMain px-4 pb-10 pt-20 text-textHeading sm:px-6 lg:pr-8 lg:pt-8 transition-all duration-300 ${
      isCollapsed ? 'lg:pl-[104px]' : 'lg:pl-[284px]'
    }`}>
      <div className="mx-auto max-w-[1400px] space-y-6">
        {children}
      </div>
    </main>
  );
}
