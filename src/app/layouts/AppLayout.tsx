/**
 * Layout component - main app shell
 */

import React from 'react';
import { Outlet } from 'react-router-dom';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar will be here */}
      <aside className="w-64 bg-white shadow-lg">
        {/* Sidebar content */}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Header will be here */}
        <header className="bg-white shadow-sm p-4">
          {/* Header content */}
        </header>

        {/* Page content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
