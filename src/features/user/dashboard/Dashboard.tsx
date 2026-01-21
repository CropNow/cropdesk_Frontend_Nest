import React, { lazy, Suspense, useEffect } from 'react';
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

const FullScreenLoader = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
    <div className="text-muted-foreground text-sm font-medium">
      Loading Dashboard...
    </div>
  </div>
);

const Dashboard = () => {
  const [isProfileComplete, setIsProfileComplete] = React.useState(false);
  const [userName, setUserName] = React.useState('Farmer');
  const [activeCropsCount, setActiveCropsCount] = React.useState(0);

  // useAuth provides the reactive user state and loading status
  const { user, loading } = useAuth();

  useEffect(() => {
    // If we are still loading authentication state, do not attempt to fetch yet.
    if (loading || !user) return;

    const fetchDashboardData = async () => {
      try {
        console.log('Dashboard: Starting data fetch for user:', user);

        // 1. Set Display Name
        const displayName = user.firstName || user.username || 'Farmer';
        setUserName(displayName);

        // 2. Fetch Real Backend Data
        const { getAllFarmers } =
          await import('@/features/auth/api/farmer.api');
        const farmers = await getAllFarmers();

        if (farmers && farmers.length > 0) {
          // Robust User ID check (handles both id and _id)
          const currentUserId = user.id || (user as any)._id;

          if (!currentUserId) {
            console.warn(
              'Dashboard: User object missing ID. Waiting for valid user data.',
              user
            );
            return;
          }

          // Filter to find the farmer belonging to THIS user
          const firstFarmer = farmers.find((f: any) => {
            const fUserId =
              f.userId && typeof f.userId === 'object'
                ? f.userId._id
                : f.userId;

            // Compare string representations to avoid type mismatches
            return (
              String(fUserId) === String(currentUserId) ||
              String(f.farmerUserId) === String(currentUserId)
            );
          });

          if (firstFarmer) {
            console.log('Dashboard: Found matching farmer:', firstFarmer);

            let farms = firstFarmer?.farms || [];

            // Fallback: If farms not populated, fetch explicitly
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
                  await import('@/features/auth/api/farm.api');
                const stats = await getFarmStatistics(farmId);
                console.log('Dashboard: Farm Stats:', stats);

                if (stats && stats.overview) {
                  setActiveCropsCount(stats.overview.totalCrops || 0);
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
              'Dashboard: No matching farmer found for current user.',
              { currentUserId, farmersSample: farmers.slice(0, 3) } // Log debug info
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
    };

    fetchDashboardData();
  }, [user, loading]); // Re-run when user or loading state changes

  // Block rendering until auth is settled
  if (loading) {
    return <FullScreenLoader />;
  }

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
