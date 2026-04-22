/**
 * Water Savings hook - fetches water savings metrics
 */

import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../api/dashboard.api';
import { WaterSavingsData } from '../../types/dashboard.types';

export const useWaterSavings = (farmId?: string, period: 'day' | 'week' | 'month' = 'day') => {
  const [data, setData] = useState<WaterSavingsData | null>(null);
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
        const response = await dashboardAPI.getWaterSavings(farmId, period);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch water savings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [farmId, period]);

  return { data, isLoading, error };
};
