import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DeviceType } from "@shared/constants/deviceConstants";
import { isDeviceType } from "@shared/utils/deviceUtils";
import { useOnlineStatus } from "@app/providers/OnlineStatusContext";
import { useFarmData } from "./useFarmData";
import { useWeather } from "./useWeather";
import { useDeviceCarousel } from "./useDeviceCarousel";

export function useDashboardState() {
  const { isOnline } = useOnlineStatus();
  const [searchParams, setSearchParams] = useSearchParams();

  const deviceFromQuery = searchParams.get("device");
  const initialType: DeviceType = isDeviceType(deviceFromQuery)
    ? deviceFromQuery
    : "nest";

  const [selectedDeviceType, setSelectedDeviceType] =
    useState<DeviceType>(initialType);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 1. Fetch Farm/Dashboard Data
  const farmData = useFarmData({
    isOnline,
    selectedDeviceType,
    currentDeviceIndex,
  });

  // 2. Fetch Weather Data
  const weather = useWeather({
    farms: farmData.farms,
    selectedFarmId: farmData.selectedFarmId,
    isOnline,
    isCached: farmData.isCached,
  });

  // 3. Device Carousel controls and mapping
  const carousel = useDeviceCarousel({
    backendDevices: farmData.backendDevices,
    selectedDeviceType,
    setSelectedDeviceType,
    currentDeviceIndex,
    setCurrentDeviceIndex,
    setSearchParams,
    dashboardData: farmData.dashboardData,
  });

  // Time Sync Ticker
  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  // Sync state when URL search params change
  useEffect(() => {
    const value = searchParams.get("device");
    if (isDeviceType(value) && value !== selectedDeviceType) {
      setSelectedDeviceType(value);
      setCurrentDeviceIndex(0);
      setSearchParams({ device: value });
    }
  }, [searchParams, selectedDeviceType, setSearchParams]);

  return {
    selectedDeviceType,
    currentDeviceIndex,
    isLoading: farmData.isLoading,
    currentTime,
    currentDevice: carousel.currentDevice,
    deviceList: carousel.deviceList,
    cycleDevice: carousel.cycleDevice,
    onTypeChange: carousel.onTypeChange,
    weatherSummary: weather.weatherSummary,
    error: farmData.error,
    dashboardData: farmData.dashboardData,
    farms: farmData.farms,
    backendDevices: farmData.backendDevices,
    selectedFarmId: farmData.selectedFarmId,
    setSelectedFarmId: farmData.setSelectedFarmId,
    lastFetchTime: farmData.lastFetchTime,
    isCached: farmData.isCached,
  };
}
