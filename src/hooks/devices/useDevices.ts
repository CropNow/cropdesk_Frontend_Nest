/**
 * Devices hook - fetches devices
 */

import { useState, useEffect } from 'react';
import { sensorsAPI } from '../../api/sensors.api';

export const useDevices = () => {
  const [devices, setDevices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = async (fieldId?: string) => {
    try {
      setIsLoading(true);
      const params = fieldId ? { fieldId } : undefined;
      const response = await sensorsAPI.getSensors(params);
      setDevices(response.data.data);
      setError(null);
      return response.data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch devices');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const removeDevice = (deviceId: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== deviceId));
  };

  return { devices, isLoading, error, fetchDevices, removeDevice };
};
