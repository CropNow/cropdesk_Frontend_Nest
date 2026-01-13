import React, { lazy, Suspense } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import WelcomeBanner from './WelcomeBanner';
import AgricultureNews from './AgricultureNews';

const AIInsights = lazy(() => import('./AIInsights'));
const IOTDashboard = lazy(() => import('./IOTDashboard'));
const WeatherSection = lazy(() => import('./WeatherSection'));

const WidgetLoader = () => (
  <div className="w-full h-48 flex items-center justify-center bg-card/50 rounded-xl border border-border animate-pulse">
    <div className="text-muted-foreground text-sm">Loading widget...</div>
  </div>
);

const Dashboard = () => {
  const [isProfileComplete, setIsProfileComplete] = React.useState(false);
  const [userName, setUserName] = React.useState('Farmer');
  const [activeCropsCount, setActiveCropsCount] = React.useState(0);

  // useAuth provides the reactive user state, synced with the auth provider results
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) {
      try {
        // Prioritize: Farmer Details Name -> Registration First Name -> Username -> Default
        // Note: user.farmerDetails might be populated from the merge in getMe()
        const displayName =
          user.farmerDetails?.name ||
          user.firstName ||
          user.username ||
          'Farmer';
        setUserName(displayName);

        // Check complete profile (farmer, farm, field, crop)
        // Check for presence of details. For strictness, check keys.
        const hasFarmer =
          user.farmerDetails && Object.keys(user.farmerDetails).length > 0;
        const hasFarm =
          user.farmDetails && Object.keys(user.farmDetails).length > 0;
        const hasField =
          user.fieldDetails && Object.keys(user.fieldDetails).length > 0;
        const hasCrop =
          user.cropDetails &&
          (Array.isArray(user.cropDetails)
            ? user.cropDetails.length > 0
            : Object.keys(user.cropDetails).length > 0);

        // Trust the explicit flag if present, otherwise fallback to checking data presence
        if (
          user.isOnboardingComplete ||
          (hasFarmer && hasFarm && hasField && hasCrop)
        ) {
          setIsProfileComplete(true);
          // If cropDetails is array, use length, else 1 if object exists
          const count = Array.isArray(user.cropDetails)
            ? user.cropDetails.length
            : user.cropDetails
              ? 1
              : 0;
          setActiveCropsCount(count);
        } else {
          setIsProfileComplete(false);
          setActiveCropsCount(0);
        }
      } catch (e) {
        console.error('Error parsing user data in dashboard', e);
      }
    }
  }, [user]);

  return (
    <main className="min-h-screen bg-background text-foreground pb-20 pt-16 md:pt-0">
      <div className="px-4 lg:px-6 mt-4 flex flex-col gap-4">
        {/* Top Row: Welcome & Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 items-stretch">
          <WelcomeBanner
            name={userName}
            university="CropDesk User"
            activeCrops={activeCropsCount}
          />
          <AgricultureNews />
          <Suspense fallback={<WidgetLoader />}>
            <WeatherSection showEmptyState={!isProfileComplete} />
          </Suspense>
        </div>

        {/* Bottom Row: IOT & AI */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <Suspense fallback={<WidgetLoader />}>
            <IOTDashboard showEmptyState={!isProfileComplete} />
          </Suspense>
          <Suspense fallback={<WidgetLoader />}>
            <AIInsights showEmptyState={!isProfileComplete} />
          </Suspense>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
