/**
 * DashboardSwitcher Component
 * Allows users to toggle between Dashboard Classic and Dashboard Advanced
 * Usage: Add to navigation/sidebar
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DASHBOARD_VIEWS, getCurrentDashboardView } from '../../constants/dashboardConstants';

interface DashboardSwitcherProps {
  className?: string;
  label?: boolean;
}

export const DashboardSwitcher: React.FC<DashboardSwitcherProps> = ({ 
  className = '',
  label = true 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentView = getCurrentDashboardView(location.pathname);

  const switchDashboard = (viewId: string) => {
    const view = DASHBOARD_VIEWS[viewId as keyof typeof DASHBOARD_VIEWS];
    if (view && view.path !== location.pathname) {
      navigate(view.path);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && <span className="text-sm font-medium text-gray-600">Dashboard:</span>}
      <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
        {Object.values(DASHBOARD_VIEWS).map((view) => (
          <button
            key={view.id}
            onClick={() => switchDashboard(view.id)}
            title={view.description}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              currentView.id === view.id
                ? 'bg-green-500 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }`}
          >
            {view.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardSwitcher;
