/**
 * DashboardPage - Classic Dashboard View (v1)
 * Section-based modular layout with organized components
 */

import React, { useEffect, useState } from 'react';
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

  // Simulate loading state
  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 900);
    return () => window.clearTimeout(timer);
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

  const deviceList = DEVICE_LIBRARY[selectedDeviceType];
  const currentDevice = deviceList[currentDeviceIndex % deviceList.length];

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
        <WelcomeHeader currentTime={currentTime} />

        {/* Device & Farm Health Section */}
        <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
          <DeviceSection
            device={currentDevice}
            selectedDeviceType={selectedDeviceType}
            currentDeviceIndex={currentDeviceIndex}
            cycleDevice={cycleDevice}
          />
          <FarmHealthSection />
        </div>

        {/* Sensors & FIS Alerts Section */}
        <section className="grid gap-6 xl:grid-cols-5">
          <SensorCategoriesSection />
          <FISAlertSection />
        </section>

        {/* Insights & Water Savings Section */}
        <section className="grid gap-6 lg:grid-cols-3">
          <AIInsightsSection />
          <WaterSavingsSection />
        </section>
      </div>
    </main>
  );
}

export default DashboardPage;
