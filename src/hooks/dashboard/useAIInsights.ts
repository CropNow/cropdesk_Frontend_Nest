/**
 * AI Insights hook - fetches AI insights
 */

import { useState, useEffect } from 'react';
import { aiAPI } from '../../api/ai.api';
import { AIInsight } from '../../types/dashboard.types';

export const useAIInsights = (farmId?: string) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
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
        const response = await aiAPI.getInsights(farmId);
        setInsights(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch AI insights');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [farmId]);

  return { insights, isLoading, error };
};
