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

export function DashboardV2Page() {
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

  return (
    <DashboardLayout>
      <WelcomeHeader currentTime={currentTime} />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <DeviceSection
          variant="v2"
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

export default DashboardV2Page;
