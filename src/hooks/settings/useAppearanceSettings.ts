/**
 * Appearance Settings hook
 */

import { useState, useEffect } from 'react';
import { settingsAPI } from '../../api/settings.api';
import { AppearanceSettings } from '../../types/settings.types';

export const useAppearanceSettings = () => {
  const [settings, setSettings] = useState<AppearanceSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await settingsAPI.getAppearanceSettings();
        setSettings(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch appearance settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = async (data: Partial<AppearanceSettings>) => {
    try {
      setIsLoading(true);
      const response = await settingsAPI.updateAppearanceSettings(data);
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
