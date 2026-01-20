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
    const fetchDashboardData = async () => {
      if (user) {
        try {
          // 1. Set Display Name
          const displayName = user.firstName || user.username || 'Farmer';
          setUserName(displayName);

          // 2. Fetch Real Backend Data
          // We need to find the user's farm to show stats.
          // Strategy: Get All Farmers -> Get First Farmer -> Get First Farm -> Get Stats
          const { getAllFarmers } =
            await import('@/features/auth/api/farmer.api');
          const farmers = await getAllFarmers();

          if (farmers && farmers.length > 0) {
            // Filter to find the farmer belonging to THIS user
            const firstFarmer = farmers.find((f: any) => {
              const fUserId =
                f.userId && typeof f.userId === 'object'
                  ? f.userId._id
                  : f.userId;
              return (
                String(fUserId) === String(user.id) ||
                String(f.farmerUserId) === String(user.id)
              );
            });

            if (firstFarmer) {
              console.log('Dashboard: Found matching farmer:', firstFarmer);

              let farms = firstFarmer?.farms || [];

              // Fallback: If farms not populated, fetch explicity
              if (!farms || farms.length === 0) {
                console.log(
                  'Dashboard: No farms in farmer object, fetching explicitly...'
                );
                try {
                  const { getFarms } =
                    await import('@/features/auth/api/farm.api');
                  const farmsResponse = await getFarms(1, 100);
                  if (farmsResponse && farmsResponse.farms) {
                    // Filter by farmer ID using robust string comparison
                    farms = farmsResponse.farms.filter((f: any) => {
                      const fFarmerId =
                        f.farmerId && typeof f.farmerId === 'object'
                          ? f.farmerId._id
                          : f.farmerId;
                      const targetFarmerId =
                        firstFarmer.id || (firstFarmer as any)._id;
                      return String(fFarmerId) === String(targetFarmerId);
                    });
                    console.log(
                      'Dashboard: Explicitly fetched farms for farmer:',
                      farms
                    );
                  }
                } catch (err) {
                  console.error(
                    'Dashboard: Failed to fetch farms explicitly',
                    err
                  );
                }
              }

              if (farms.length > 0) {
                const firstFarm = farms[0];
                if (!firstFarm) return; // Safety check
                const farmId = firstFarm.id || (firstFarm as any)._id; // Handle _id vs id

                if (farmId) {
                  const { getFarmStatistics } =
                    await import('@/features/auth/api/farm.api'); // Use correct import path from file tree
                  const stats = await getFarmStatistics(farmId);
                  console.log('Dashboard: Farm Stats:', stats);

                  if (stats && stats.overview) {
                    setActiveCropsCount(stats.overview.totalCrops || 0);
                    // Could also set totalArea if we had a state for it
                  }
                  setIsProfileComplete(true); // If we found farm and stats, consider active
                }
              } else {
                // No farms found
                setIsProfileComplete(false);
                setActiveCropsCount(0);
              }
            } else {
              // No matching farmer found for user
              console.warn(
                'Dashboard: No matching farmer found for current user.'
              );
              setIsProfileComplete(false);
              setActiveCropsCount(0);
            }
          } else {
            // No farmers returned at all
            setIsProfileComplete(false);
            setActiveCropsCount(0);
          }
        } catch (e) {
          console.error('Error fetching dashboard data', e);
          // Fallback to basic user object check if API fails
          const hasFarmer =
            user.farmerDetails && Object.keys(user.farmerDetails).length > 0;
          if (hasFarmer) setIsProfileComplete(true);
        }
      }
    };

    fetchDashboardData();
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
