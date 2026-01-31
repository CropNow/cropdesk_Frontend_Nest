import React, { lazy, Suspense, useEffect } from 'react';
import { useAuth } from '@/features/auth/useAuth';
import { useProfile } from '../profile/context/useProfile';
import WelcomeBanner from './WelcomeBanner';
import AgricultureNews from './AgricultureNews';
import { RegistrationPlaceholder } from '@/components/common/RegistrationPlaceholder';
import { useNavigate } from 'react-router-dom';

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

  // Access Profile Context for shared state
  const { selectedFarm, loading: profileLoading } = useProfile();

  // useAuth provides the reactive user state and loading status
  const { user, loading } = useAuth();

  useEffect(() => {
    // If we are still loading authentication state, do not attempt to fetch yet.
    if (loading || !user) return;

    const fetchDashboardData = async () => {
      try {
        console.log('Dashboard: Starting data fetch for user:', user);

        // 1. Set Display Name
        const fullName = [user.firstName, user.lastName]
          .filter(Boolean)
          .join(' ');
        const displayName = fullName || user.username || 'Farmer';
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
                  // DUPLICATE SOURCE OF TRUTH:
                  // We now derive this from ProfileContext (selectedFarm) to ensure immediate updates.
                  // setActiveCropsCount(stats.overview.totalCrops || 0);
                }
                setIsProfileComplete(true); // If we found farm and stats, consider active
              }
            } else {
              // No farms found
              setIsProfileComplete(false);
              // setActiveCropsCount(0);
            }
          } else {
            // No matching farmer found for user
            console.warn(
              'Dashboard: No matching farmer found for current user.',
              { currentUserId, farmersSample: farmers.slice(0, 3) } // Log debug info
            );
            setIsProfileComplete(false);
            // setActiveCropsCount(0);
          }
        } else {
          // No farmers returned at all
          setIsProfileComplete(false);
          // setActiveCropsCount(0);
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

  // REACTIVE CROP COUNT
  // When ProfileProvider updates 'selectedFarm' (either initially or after user adds a crop),
  // we recalculate this count immediately.
  useEffect(() => {
    if (selectedFarm && selectedFarm.fields) {
      const liveCount = selectedFarm.fields.reduce(
        (acc: number, field: any) => {
          return acc + (field.crops ? field.crops.length : 0);
        },
        0
      );
      setActiveCropsCount(liveCount);
    }
  }, [selectedFarm]);

  // Check for connected devices to determine "Device Added" vs "Registered Only" state
  const [hasDevices, setHasDevices] = React.useState(false);
  const navigate = useNavigate();

  // Check for connected devices and restore if needed (Persistence Logic)
  useEffect(() => {
    const checkDevices = async () => {
      const devicesStr = localStorage.getItem('connected_devices');
      if (devicesStr && JSON.parse(devicesStr).length > 0) {
        setHasDevices(true);
      } else {
        setHasDevices(false);
        // Attempt to restore from backend if we have a field selected (from ProfileContext)
        // This handles the "Fresh Login" or "Clear Cache" scenario
        if (
          selectedFarm &&
          selectedFarm.fields &&
          selectedFarm.fields.length > 0
        ) {
          try {
            // Use the first field by default for restoration check
            // In a multi-field scenario, we might want to check all or rely on selectedField,
            // but we don't have direct access to selectedField ID here easily without props or context hook.
            // Using the first field of the selected farm is a safe bet for MVP restoration.
            const fieldId =
              selectedFarm.fields[0].id || selectedFarm.fields[0]._id;
            if (fieldId) {
              const { getDevicesForField } =
                await import('@/features/user/profile/device.service');
              const fetchedDevices = await getDevicesForField(fieldId);

              if (fetchedDevices && fetchedDevices.length > 0) {
                // Map and Save
                const mapped = fetchedDevices.map((d: any) => ({
                  ...d,
                  serialNumber: d.serialNumber || d.code || d.id,
                  status: d.status || (d.isOnline ? 'Active' : 'Offline'),
                  connectedAt: d.createdAt || new Date().toISOString(),
                }));

                localStorage.setItem(
                  'connected_devices',
                  JSON.stringify(mapped)
                );
                setHasDevices(true);
                // Dispatch event so IOTDashboard knows to wake up
                window.dispatchEvent(new Event('storage'));
                window.dispatchEvent(new Event('items-restored'));
              }
            }
          } catch (restoreErr) {
            console.warn('Failed to restore devices in Dashboard', restoreErr);
          }
        }
      }
    };

    checkDevices();
    // Re-check if profile loads (farm becomes available)
  }, [selectedFarm]);

  // Listen for storage updates
  useEffect(() => {
    const handleStorage = () => {
      const devices = localStorage.getItem('connected_devices');
      setHasDevices(devices && JSON.parse(devices).length > 0 ? true : false);
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('items-restored', handleStorage); // Custom event
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('items-restored', handleStorage);
    };
  }, []);

  // Block rendering until auth is settled
  if (loading) {
    return <FullScreenLoader />;
  }

  const handleNoDeviceClick = () => {
    if (!hasDevices) {
      navigate('/profile');
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground pb-20 pt-16 md:pt-0">
      <div className="px-4 lg:px-6 mt-4 flex flex-col gap-4">
        {/* Top Row: Welcome & Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 items-stretch">
          <WelcomeBanner
            name={userName}
            university="CropNow User"
            activeCrops={activeCropsCount}
          />
          <AgricultureNews />
          <Suspense fallback={<WidgetLoader />}>
            <WeatherSection showEmptyState={!isProfileComplete} />
          </Suspense>
        </div>

        {/* Bottom Row: IOT & AI */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {!isProfileComplete ? (
            // State 1: New User (Unregistered) -> Show Placeholders
            <>
              <RegistrationPlaceholder
                title="Add Farm Details"
                description="Setup your IoT Dashboard"
                route="/register/farmer-details"
                color="green"
                className="h-full min-h-[400px]"
              />
              <RegistrationPlaceholder
                title="Activate AI Insights"
                description="Complete your profile to enable AI features"
                route="/register/farmer-details"
                color="blue"
                className="h-full min-h-[400px]"
              />
            </>
          ) : (
            // State 2 & 3: Registered -> Show Dashboards
            <>
              <div
                className={`relative rounded-xl ${!hasDevices ? 'cursor-pointer' : ''}`}
                onClick={handleNoDeviceClick}
              >
                {/* Overlay to capture clicks when no device */}
                {!hasDevices && (
                  <div
                    className="absolute inset-0 z-50 bg-transparent"
                    title="Add a device to see live data"
                  />
                )}
                <Suspense fallback={<WidgetLoader />}>
                  <IOTDashboard showEmptyState={!hasDevices} />
                </Suspense>
              </div>

              <div
                className={`relative rounded-xl ${!hasDevices ? 'cursor-pointer' : ''}`}
                onClick={handleNoDeviceClick}
              >
                {!hasDevices && (
                  <div
                    className="absolute inset-0 z-50 bg-transparent"
                    title="Add a device to see AI insights"
                  />
                )}

                <Suspense fallback={<WidgetLoader />}>
                  <AIInsights showEmptyState={!hasDevices} />
                </Suspense>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
