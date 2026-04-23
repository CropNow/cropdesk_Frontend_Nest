import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../api/dashboard.api';

export const useFarms = () => {
  const [farms, setFarms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        setIsLoading(true);
        const response = await dashboardAPI.getFarms();
        // Adjust based on actual API response structure
        const data = response.data?.data || response.data || [];
        setFarms(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch farms');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFarms();
  }, []);

  return { farms, isLoading, error };
};
