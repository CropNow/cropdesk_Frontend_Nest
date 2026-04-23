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

export function DashboardPage() {
  const {
    isLoading,
    currentTime,
    currentDevice,
    selectedDeviceType,
    currentDeviceIndex,
    cycleDevice,
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

  const weatherSummary = dashboardData?.weather ? {
    temp: `${dashboardData.weather.temperature} C`,
    condition: dashboardData.weather.condition,
    city: `${dashboardData.weather.city}, ${dashboardData.weather.country}`
  } : undefined;

  return (
    <DashboardLayout>
      <WelcomeHeader currentTime={currentTime} />

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <DeviceSection
          variant="v1"
          device={currentDevice}
          selectedDeviceType={selectedDeviceType}
          currentDeviceIndex={currentDeviceIndex}
          cycleDevice={cycleDevice}
        />
        <FarmHealthSection />
      </div>

      <section className="grid gap-6 xl:grid-cols-5">
        <SensorCategoriesSection />
        <FISAlertSection />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <AIInsightsSection />
        <WaterSavingsSection />
      </section>
    </DashboardLayout>
  );
}

export default DashboardPage;
