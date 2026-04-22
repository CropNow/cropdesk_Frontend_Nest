/**
 * Alerts hook - fetches and manages alerts
 */

import { useState, useEffect } from 'react';
import { alertsAPI } from '../../api/alerts.api';
import { Alert } from '../../types/alert.types';

export const useAlerts = (farmId?: string) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
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
        const response = await alertsAPI.getFarmAlerts(farmId);
        setAlerts(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch alerts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Refresh alerts every 30 seconds
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, [farmId]);

  const markAsRead = async (alertId: string) => {
    try {
      await alertsAPI.markAlertAsRead(alertId);
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, status: 'read' as any } : alert
        )
      );
    } catch (err) {
      console.error('Failed to mark alert as read', err);
    }
  };

  const markAsResolved = async (alertId: string) => {
    try {
      await alertsAPI.markAlertAsResolved(alertId);
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, status: 'resolved' } : alert
        )
      );
    } catch (err) {
      console.error('Failed to mark alert as resolved', err);
    }
  };

  return { alerts, isLoading, error, markAsRead, markAsResolved };
};
