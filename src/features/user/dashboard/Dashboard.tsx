import React, { lazy, Suspense } from 'react';
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

  React.useEffect(() => {
    const userStr = localStorage.getItem('registeredUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Prioritize: Farmer Details Name -> Registration First Name -> Username -> Default
        const displayName =
          user.farmerDetails?.name ||
          user.firstName ||
          user.username ||
          'Farmer';
        setUserName(displayName);

        // Check complete profile (farmer, farm, field, crop)
        if (
          user.farmerDetails &&
          user.farmDetails &&
          user.fieldDetails &&
          user.cropDetails
        ) {
          setIsProfileComplete(true);
          // If cropDetails is an object (single crop), count is 1. If array support added later, check length.
          setActiveCropsCount(user.cropDetails ? 1 : 0);
        } else {
          setIsProfileComplete(false);
          setActiveCropsCount(0);
        }
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
  }, []);

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
