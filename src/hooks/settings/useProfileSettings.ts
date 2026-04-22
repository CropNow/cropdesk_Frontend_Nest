/**
 * Profile Settings hook
 */

import { useState } from 'react';
import { settingsAPI } from '../../api/settings.api';
import { ProfileSettings } from '../../types/settings.types';

export const useProfileSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = async (data: Partial<ProfileSettings>) => {
    try {
      setIsLoading(true);
      await settingsAPI.updateProfile(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateProfile, isLoading, error };
};
