/**
 * Devices hook - fetches devices for a farm
 */

import { useState, useEffect } from 'react';
import { devicesAPI } from '../../api/devices.api';
import { Device } from '../../types/device.types';

export const useDevices = (farmId?: string) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!farmId) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await devicesAPI.getDevices(farmId);
        setDevices(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch devices');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [farmId]);

  const removeDevice = (deviceId: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== deviceId));
  };

  return { devices, isLoading, error, removeDevice };
};
