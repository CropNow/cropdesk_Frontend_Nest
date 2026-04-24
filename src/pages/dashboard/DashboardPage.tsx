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
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 backdrop-blur-xl">
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
      <BentoGrid className="space-y-4 sm:space-y-6">
        <BentoCard className="rounded-xl" enableBorderGlow clickEffect>
          <WelcomeHeader
            currentTime={currentTime}
            weather={displayWeather}
            userName={user ? `${user.firstName} ${user.lastName}` : 'Farmer'}
          />
        </BentoCard>

        <div className="grid gap-4 sm:gap-6 xl:grid-cols-[1fr_1.2fr]">
          <BentoCard className="rounded-xl" enableBorderGlow clickEffect>
            <DeviceSection
              variant="v1"
              device={dashboardData?.currentDevice || currentDevice}
              selectedDeviceType={selectedDeviceType}
              currentDeviceIndex={currentDeviceIndex}
              cycleDevice={cycleDevice}
            />
          </BentoCard>
          <BentoCard className="rounded-xl" enableBorderGlow clickEffect>
            <FarmHealthSection data={dashboardData?.health} />
          </BentoCard>
        </div>

        <section className="grid gap-4 sm:gap-6 xl:grid-cols-5">
          <BentoCard className="rounded-xl xl:col-span-2" enableBorderGlow clickEffect>
            <SensorCategoriesSection data={dashboardData?.sensors} />
          </BentoCard>
          <BentoCard className="rounded-xl xl:col-span-3" enableBorderGlow clickEffect>
            <FISAlertSection data={dashboardData?.alerts} />
          </BentoCard>
        </section>

        <section className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          <BentoCard className="rounded-xl lg:col-span-2" enableBorderGlow clickEffect>
            <AIInsightsSection data={dashboardData?.aiInsights} />
          </BentoCard>
          <BentoCard className="rounded-xl" enableBorderGlow clickEffect>
            <WaterSavingsSection data={dashboardData?.waterSavings} />
          </BentoCard>
        </section>
      </BentoGrid>
    </DashboardLayout>
  );
}

export default DashboardPage;
