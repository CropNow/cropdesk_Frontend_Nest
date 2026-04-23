import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEVICE_LIBRARY, DeviceType } from '../../constants/deviceConstants';
import { isDeviceType } from '../../utils/deviceUtils';

export function useDashboardState() {
  const [searchParams, setSearchParams] = useSearchParams();
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

  const onTypeChange = (type: DeviceType) => {
    setSelectedDeviceType(type);
    setCurrentDeviceIndex(0);
    setSearchParams({ device: type });
  };

  const weatherSummary = useMemo(() => {
    return {
      city: 'Kallakurichi, IN',
      temp: '30 C',
      condition: 'Partly cloudy',
    };
  }, []);

  return {
    selectedDeviceType,
    currentDeviceIndex,
    isLoading,
    currentTime,
    currentDevice,
    deviceList,
    cycleDevice,
    onTypeChange,
    weatherSummary,
  };
}
