import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ProfileSettingsState } from './SettingsLayout';
import { useProfileSettings } from '../../hooks/settings/useProfileSettings';

interface ProfileSettingsProps {
  values: ProfileSettingsState;
  onChange: (patch: Partial<ProfileSettingsState>) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function ProfileSettings({ values, onChange, onSave, isSaving }: ProfileSettingsProps) {
  const [error, setError] = useState('');
  const { fetchProfile, updateProfile, isLoading: isUpdating } = useProfileSettings();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchProfile();
        if (profile) {
          onChange({
            firstName: profile.firstName || values.firstName,
            lastName: profile.lastName || values.lastName,
            email: profile.email || values.email,
            phone: profile.phone || values.phone,
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!values.firstName.trim() || !values.lastName.trim() || !values.email.trim()) {
      setError('First name, last name, and email are required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setError('');
      await updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
      });
      onSave(); // Still call parent onSave to show toast/manage layout state
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-textLabel">First Name</span>
          <input
            value={values.firstName}
            onChange={(event) => onChange({ firstName: event.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-textLabel">Last Name</span>
          <input
            value={values.lastName}
            onChange={(event) => onChange({ lastName: event.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-textLabel">Email</span>
          <input
            type="email"
            value={values.email}
            onChange={(event) => onChange({ email: event.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-textLabel">Phone</span>
          <input
            value={values.phone}
            onChange={(event) => onChange({ phone: event.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-textLabel">Profile Picture Upload</span>
          <input
            type="file"
            accept="image/*"
            onChange={(event) =>
              onChange({ profilePicture: event.target.files?.[0]?.name ?? '' })
            }
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading file:mr-3 file:rounded-lg file:border-0 file:bg-accentPrimary/20 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-accentPrimary"
          />
        </label>
      </div>

      {values.profilePicture ? (
        <p className="text-xs text-textSecondary">Selected: {values.profilePicture}</p>
      ) : null}

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        disabled={isSaving || isUpdating}
        className="rounded-xl border border-accentPrimary/40 bg-accentPrimary/15 px-4 py-2 text-sm font-semibold text-accentPrimary transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving || isUpdating ? 'Saving...' : 'Save Changes'}
      </motion.button>
    </div>
  );
}
