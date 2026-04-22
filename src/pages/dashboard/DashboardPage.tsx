/**
 * DashboardPage - Classic Dashboard View (v1)
 * Section-based modular layout with organized components
 */

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { DEVICE_LIBRARY, DeviceType } from '../../constants/deviceConstants';
import { isDeviceType } from '../../utils/deviceUtils';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { WelcomeHeader } from '../../components/sections/WelcomeHeader';
import { DeviceSection } from '../../components/sections/DeviceSection';
import { FarmHealthSection } from '../../components/sections/FarmHealthSection';
import { SensorCategoriesSection } from '../../components/sections/SensorCategoriesSection';
import { FISAlertSection } from '../../components/sections/FISAlertSection';
import { AIInsightsSection } from '../../components/sections/AIInsightsSection';
import { WaterSavingsSection } from '../../components/sections/WaterSavingsSection';

import { useAuth } from '../../contexts/AuthContext';
import { dashboardAPI } from '../../api/dashboard.api';

/**
 * Dashboard Classic View
 * Uses modular section components organized in a responsive grid
 * Best for: Complete overview with organized metrics
 */
export function DashboardPage() {
  const [searchParams] = useSearchParams();
  const deviceFromQuery = searchParams.get('device');
  const initialType: DeviceType = isDeviceType(deviceFromQuery) ? deviceFromQuery : 'nest';

  const [selectedDeviceType, setSelectedDeviceType] = useState<DeviceType>(initialType);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const { user: authUser } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper to map Open-Meteo codes to conditions
  const mapWeatherCode = (code: number) => {
    if (code === 0) return 'Clear sky';
    if (code <= 3) return 'Partly cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 55) return 'Drizzle';
    if (code <= 67) return 'Rainy';
    if (code <= 77) return 'Snowy';
    if (code <= 82) return 'Rain showers';
    if (code <= 99) return 'Thunderstorm';
    return 'Cloudy';
  };

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
      const data = await res.json();
      return {
        temperature: data.current_weather.temperature,
        condition: mapWeatherCode(data.current_weather.weathercode),
      };
    } catch (err) {
      console.error('Weather fetch failed:', err);
      return { temperature: 30, condition: 'Clear' };
    }
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log('📊 [Dashboard] Fetching farms...');
        const farmRes = await dashboardAPI.getFarms();
        const farms = farmRes.data.data.farms;

        if (farms && farms.length > 0) {
          const farmId = farms[0]._id;
          console.log(`✅ [Dashboard] Found farm: ${farmId}. Fetching stats and devices...`);
          
          const [statsRes, devicesRes] = await Promise.all([
            dashboardAPI.getFarmStatistics(farmId),
            dashboardAPI.getFarmDevices(farmId)
          ]);

          console.log('✅ [Dashboard] Stats Received:', statsRes.data);
          console.log('✅ [Dashboard] Devices Received:', devicesRes.data);

          // Get location from farm
          let lat = 11.75; // Default Kallakurichi
          let lon = 78.96;
          let cityName = 'Green Valley Farm';

          if (farms[0].location?.coordinates) {
            const coords = farms[0].location.coordinates;
            // Handle both {lat, lng} and [lng, lat] structures
            lat = coords.lat || coords[1] || lat;
            lon = coords.lng || coords[0] || lon;
            cityName = farms[0].name || farms[0].location.name || cityName;
          }

          console.log(`🌍 [Dashboard] Fetching weather for: ${cityName} (${lat}, ${lon})`);
          const weatherData = await fetchWeather(lat, lon);

          // Build a context object compatible with existing state
          setDashboardData({
            health: statsRes.data.data,
            devices: devicesRes.data.data,
            weather: { 
              city: cityName, 
              country: 'IN', 
              temperature: weatherData.temperature, 
              condition: weatherData.condition 
            }
          });
        } else {
          console.warn('⚠️ [Dashboard] No farms found for this user.');
          setError('No farms registered. Please add a farm first.');
        }
      } catch (err: any) {
        console.error('❌ [Dashboard] Fetch Failed:', err.response?.data || err.message);
        setError('Could not load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  // Sync device type from URL query params
  useEffect(() => {
    const value = searchParams.get('device');
    if (isDeviceType(value) && value !== selectedDeviceType) {
      setSelectedDeviceType(value);
      setCurrentDeviceIndex(0);
    }
  }, [searchParams, selectedDeviceType]);

  const deviceList = useMemo(() => {
    if (dashboardData?.devices) {
      return dashboardData.devices;
    }
    return DEVICE_LIBRARY[selectedDeviceType];
  }, [dashboardData, selectedDeviceType]);

  const currentDevice = deviceList[currentDeviceIndex % deviceList.length] || DEVICE_LIBRARY[selectedDeviceType][0];

  const cycleDevice = (direction: 1 | -1) => {
    setCurrentDeviceIndex((prev) => {
      const next = prev + direction;
      if (next < 0) return deviceList.length - 1;
      if (next >= deviceList.length) return 0;
      return next;
    });
  };

  if (isLoading) {
    return <LoadingSkeleton />;
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

  const weatherSummary = dashboardData?.weather ? {
    temp: `${dashboardData.weather.temperature} C`,
    condition: dashboardData.weather.condition,
    city: `${dashboardData.weather.city}, ${dashboardData.weather.country}`
  } : undefined;

  return (
    <main className="relative min-h-screen overflow-hidden bg-bgMain px-4 pb-10 pt-8 text-textPrimary sm:px-6 lg:pl-28 lg:pr-10">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-grid-pattern" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#00FF9C]/8 blur-[120px]" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-cyan-500/6 blur-[100px]" />
        <div className="absolute bottom-20 left-1/4 h-64 w-64 rounded-full bg-emerald-500/6 blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/4 blur-[60px]" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1600px] space-y-6">
        {/* Header Section */}
        <WelcomeHeader 
          currentTime={currentTime} 
          userName={authUser?.firstName} 
          weather={weatherSummary}
        />

        {/* Device & Farm Health Section */}
        <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
          <DeviceSection
            device={currentDevice}
            selectedDeviceType={selectedDeviceType}
            currentDeviceIndex={currentDeviceIndex}
            cycleDevice={cycleDevice}
          />
          <FarmHealthSection data={dashboardData?.health} />
        </div>

        {/* Sensors & FIS Alerts Section */}
        <section className="grid gap-6 xl:grid-cols-5">
          <SensorCategoriesSection data={dashboardData?.sensors} sensorId={currentDevice?._id} />
          <FISAlertSection data={dashboardData?.alerts} />
        </section>

        {/* Insights & Water Savings Section */}
        <section className="grid gap-6 lg:grid-cols-3">
          <AIInsightsSection data={dashboardData?.aiInsights} />
          <WaterSavingsSection data={dashboardData?.waterSavings} />
        </section>
      </div>
    </main>
  );
}

export default DashboardPage;
