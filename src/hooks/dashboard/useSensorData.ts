/**
 * Sensor Data hook - fetches current sensor readings
 */

import { useState, useEffect } from 'react';
import { sensorsAPI } from '../../api/sensors.api';
import { SensorReading } from '../../types/sensor.types';

export const useSensorData = (deviceId?: string) => {
  const [readings, setReadings] = useState<SensorReading[]>([]);
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
        const response = await sensorsAPI.getSensorReadings(deviceId);
        setReadings(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch sensor data');
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch on mount
    fetchData();

    // Set up polling interval (15 seconds)
    const interval = setInterval(fetchData, 15000);

    return () => clearInterval(interval);
  }, [deviceId]);

  return { readings, isLoading, error };
};
