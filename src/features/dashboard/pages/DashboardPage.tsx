import { lazy, Suspense } from "react";
import { useDashboardState } from "@features/dashboard/hooks/useDashboardState";
import { LoadingSkeleton } from "@shared/components/LoadingSkeleton";
import { DashboardLayout } from "@app/layouts/DashboardLayout";
import { WelcomeHeader } from "@features/dashboard/components/WelcomeHeader";
import { DeviceSection } from "@features/dashboard/components/DeviceSection";
import { FarmHealthSection } from "@features/dashboard/components/FarmHealthSection";
import { EmptyDashboard } from "@features/dashboard/components/EmptyDashboard";
import { CachedDataBadge } from "@shared/components/CachedDataBadge";

// Defer below-the-fold sections so above-the-fold (Welcome + Device + FarmHealth)
// can paint without waiting for these chunks.
const SensorCategoriesSection = lazy(() =>
  import("@features/dashboard/components/SensorCategoriesSection").then((m) => ({
    default: m.SensorCategoriesSection,
  })),
);
const FISAlertSection = lazy(() =>
  import("@features/dashboard/components/FISAlertSection").then((m) => ({
    default: m.FISAlertSection,
  })),
);
const AIInsightsSection = lazy(() =>
  import("@features/dashboard/components/AIInsightsSection").then((m) => ({
    default: m.AIInsightsSection,
  })),
);
const WaterSavingsSection = lazy(() =>
  import("@features/dashboard/components/WaterSavingsSection").then((m) => ({
    default: m.WaterSavingsSection,
  })),
);

import { useAuth } from "@app/providers/AuthContext";

const SectionFallback = () => (
  <div className="h-48 rounded-3xl border border-cardBorder bg-cardBg" />
);

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
    farms,
    backendDevices,
    lastFetchTime,
    isCached,
    selectedFarmId,
  } = useDashboardState();

  const showEmptyDashboard = !isLoading && (!farms?.length || !backendDevices?.length);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (showEmptyDashboard) {
    return <EmptyDashboard currentTime={currentTime} />;
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

  return (
    <DashboardLayout>
      <WelcomeHeader
        currentTime={currentTime}
        userName={user ? `${user.firstName} ${user.lastName}` : "Farmer"}
      />

      {isCached && <CachedDataBadge lastSyncTime={lastFetchTime} />}

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <DeviceSection
          device={currentDevice!}
          selectedDeviceType={selectedDeviceType}
          currentDeviceIndex={currentDeviceIndex}
          cycleDevice={cycleDevice}
        />
        <FarmHealthSection data={dashboardData?.health} />
      </div>

      <section className="grid gap-6 xl:grid-cols-5">
        <Suspense fallback={<SectionFallback />}>
          <SensorCategoriesSection data={dashboardData?.sensors} lastFetchTime={lastFetchTime} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <FISAlertSection
            data={dashboardData?.alerts}
            farmId={selectedFarmId || undefined}
            sensorId={
              dashboardData?.sensors?.sensorId ||
              currentDevice?.id ||
              currentDevice?._id ||
              undefined
            }
          />
        </Suspense>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Suspense fallback={<SectionFallback />}>
          <AIInsightsSection data={dashboardData?.aiInsights} />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <WaterSavingsSection data={dashboardData?.waterSavings} />
        </Suspense>
      </section>
    </DashboardLayout>
  );
}

export default DashboardPage;
