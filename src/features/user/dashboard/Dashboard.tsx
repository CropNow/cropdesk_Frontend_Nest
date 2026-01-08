import React from 'react';
import AIInsights from './AIInsights';
import IOTDashboard from './IOTDashboard';
import WelcomeBanner from './WelcomeBanner';
import WeatherSection from './WeatherSection';

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          <WelcomeBanner
            name={userName}
            university="CropDesk User"
            activeCrops={activeCropsCount}
          />
          <WeatherSection showEmptyState={!isProfileComplete} />
        </div>

        {/* Bottom Row: IOT & AI */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          <IOTDashboard showEmptyState={!isProfileComplete} />
          <AIInsights showEmptyState={!isProfileComplete} />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
