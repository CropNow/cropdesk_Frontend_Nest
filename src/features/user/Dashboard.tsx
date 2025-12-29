import React from 'react';
import WelcomeBanner from './components/WelcomeBanner';
import WeatherSection from './components/WeatherSection';
import IOTDashboard from './components/IOTDashboard';

const Dashboard = () => {
  return (
    <main className="min-h-screen bg-background text-foreground pb-20 pt-16 md:pt-0">
      <WelcomeBanner
        name="Team CropNow"
        university="REVA University"
        activeCrops={12}
      />

      <div className="px-4 lg:px-6 mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeatherSection />
        <IOTDashboard />
      </div>
    </main>
  );
};

export default Dashboard;
