import React from 'react';
import { useDashboardState } from '../../hooks/dashboard/useDashboardState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { WelcomeHeader } from '../../components/sections/WelcomeHeader';
import { DeviceSection } from '../../components/sections/DeviceSection';
import { FarmHealthSection } from '../../components/sections/FarmHealthSection';
import { SensorCategoriesSection } from '../../components/sections/SensorCategoriesSection';
import { FISAlertSection } from '../../components/sections/FISAlertSection';
import { AIInsightsSection } from '../../components/sections/AIInsightsSection';
import { WaterSavingsSection } from '../../components/sections/WaterSavingsSection';

import { useAuth } from '../../contexts/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();
  const {
    isLoading,
    currentTime,
    currentDevice,
    selectedDeviceType,
    currentDeviceIndex,
    cycleDevice,
    error,
    dashboardData,
    weatherSummary,
  } = useDashboardState();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bgMain p-10 text-center">
        <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 backdrop-blur-xl">
          <p className="text-xl font-bold text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-red-500/20 px-6 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/30"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Use weather from dashboardData if available, otherwise use from hook
  const displayWeather = dashboardData?.weather ? {
    temp: `${dashboardData.weather.temperature} C`,
    condition: dashboardData.weather.condition,
    city: `${dashboardData.weather.city}, ${dashboardData.weather.country}`
  } : {
    ...weatherSummary,
    city: dashboardData?.farm?.name ? `${dashboardData.farm.name}, ${dashboardData.farm.location?.city || ''}` : weatherSummary.city
  };

  return (
    <DashboardLayout>
      <WelcomeHeader 
        currentTime={currentTime} 
        weather={displayWeather} 
        userName={user ? `${user.firstName} ${user.lastName}` : 'Farmer'}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <DeviceSection
          device={dashboardData?.currentDevice || currentDevice}
          selectedDeviceType={selectedDeviceType}
          currentDeviceIndex={currentDeviceIndex}
          cycleDevice={cycleDevice}
        />
        <FarmHealthSection data={dashboardData?.health} />
      </div>

      <section className="grid gap-6 xl:grid-cols-5">
        <SensorCategoriesSection data={dashboardData?.sensors} />
        <FISAlertSection data={dashboardData?.alerts} />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <AIInsightsSection data={dashboardData?.aiInsights} />
        <WaterSavingsSection data={dashboardData?.waterSavings} />
      </section>
    </DashboardLayout>
  );
}

export default DashboardPage;
