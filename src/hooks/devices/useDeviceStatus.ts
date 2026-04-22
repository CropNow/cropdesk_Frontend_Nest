/**
 * Device Status hook - monitors device status in real-time
 */

import { useState, useEffect } from 'react';
import { devicesAPI } from '../../api/devices.api';
import { DeviceStatus } from '../../types/device.types';

export const useDeviceStatus = (deviceId?: string) => {
  const [status, setStatus] = useState<DeviceStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!deviceId) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await devicesAPI.getDeviceStatus(deviceId);
        setStatus(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch device status');
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Poll every 10 seconds
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, [deviceId]);

  return { status, isLoading, error };
};
