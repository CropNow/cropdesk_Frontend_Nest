import { useState } from 'react';
import { motion } from 'framer-motion';
import { ProfileSettingsState } from './SettingsLayout';

interface ProfileSettingsProps {
  values: ProfileSettingsState;
  onChange: (patch: Partial<ProfileSettingsState>) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function ProfileSettings({ values, onChange, onSave, isSaving }: ProfileSettingsProps) {
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!values.name.trim() || !values.email.trim()) {
      setError('Name and email are required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    onSave();
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-textLabel">Name</span>
          <input
            value={values.name}
            onChange={(event) => onChange({ name: event.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-textLabel">Email</span>
          <input
            type="email"
            value={values.email}
            onChange={(event) => onChange({ email: event.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-textLabel">Phone</span>
          <input
            value={values.phone}
            onChange={(event) => onChange({ phone: event.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
          />
        </label>

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
        disabled={isSaving}
        className="rounded-xl border border-accentPrimary/40 bg-accentPrimary/15 px-4 py-2 text-sm font-semibold text-accentPrimary transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </motion.button>
    </div>
  );
}
