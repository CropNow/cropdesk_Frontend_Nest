/**
 * Farm Health hook - fetches and manages farm health data
 */

import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../api/dashboard.api';
import { FarmHealth } from '../../types/dashboard.types';

export const useFarmHealth = (farmId?: string) => {
  const [data, setData] = useState<FarmHealth | null>(null);
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
        const response = await dashboardAPI.getFarmHealth(farmId);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch farm health');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [farmId]);

  return { data, isLoading, error };
};
