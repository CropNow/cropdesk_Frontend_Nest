/**
 * Notification Settings hook
 */

import { useState, useEffect } from 'react';
import { settingsAPI } from '../../api/settings.api';
import { NotificationSettings } from '../../types/settings.types';

export const useNotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await settingsAPI.getNotificationSettings();
        setSettings(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch notification settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = async (data: Partial<NotificationSettings>) => {
    try {
      setIsLoading(true);
      const response = await settingsAPI.updateNotificationSettings(data);
      setSettings(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { settings, isLoading, error, updateSettings };
};
