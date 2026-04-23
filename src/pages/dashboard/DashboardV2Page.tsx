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
import { BentoCard } from '../../components/common/BentoCard';
import { BentoGrid } from '../../components/common/BentoGrid';

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
      <BentoGrid className="space-y-6">
        <BentoCard className="rounded-xl" enableBorderGlow clickEffect>
          <WelcomeHeader currentTime={currentTime} />
        </BentoCard>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <BentoCard className="rounded-xl" enableBorderGlow clickEffect>
            <DeviceSection
              variant="v2"
              device={currentDevice}
              selectedDeviceType={selectedDeviceType}
              currentDeviceIndex={currentDeviceIndex}
              cycleDevice={cycleDevice}
            />
          </BentoCard>
          <BentoCard className="rounded-xl" enableBorderGlow clickEffect>
            <FarmHealthSection />
          </BentoCard>
        </div>

        <section className="grid gap-6 xl:grid-cols-5">
          <BentoCard className="rounded-xl xl:col-span-2" enableBorderGlow clickEffect>
            <SensorCategoriesSection />
          </BentoCard>
          <BentoCard className="rounded-xl xl:col-span-3" enableBorderGlow clickEffect>
            <FISAlertSection />
          </BentoCard>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <BentoCard className="rounded-xl lg:col-span-2" enableBorderGlow clickEffect>
            <AIInsightsSection />
          </BentoCard>
          <BentoCard className="rounded-xl" enableBorderGlow clickEffect>
            <WaterSavingsSection />
          </BentoCard>
        </section>
      </BentoGrid>
    </DashboardLayout>
  );
}

export default DashboardV2Page;
