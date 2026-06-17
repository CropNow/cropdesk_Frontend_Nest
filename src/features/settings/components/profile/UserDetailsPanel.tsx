import { useState } from 'react';
import { motion } from 'framer-motion';

export function UserDetailsPanel({ values, onChange, onSave, isSaving, isUpdating }: any) {
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!values.firstName.trim() || !values.lastName.trim() || !values.email.trim()) {
      setError('First name, last name, and email are required.');
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
      <h3 className="mb-4 text-xl font-bold text-textHeading">User Details</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-textLabel">First Name</span>
          <input
            value={values.firstName || ''}
            onChange={(e) => onChange({ firstName: e.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-textLabel">Last Name</span>
          <input
            value={values.lastName || ''}
            onChange={(e) => onChange({ lastName: e.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-textLabel">Email</span>
          <input
            type="email"
            value={values.email || ''}
            onChange={(e) => onChange({ email: e.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-textLabel">Phone</span>
          <input
            value={values.phone || ''}
            onChange={(e) => onChange({ phone: e.target.value })}
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
            onChange={(e) => onChange({ profilePicture: e.target.files?.[0]?.name ?? '' })}
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
        className="rounded-xl border border-accentPrimary/40 bg-accentPrimary/15 px-4 py-2 text-sm font-semibold text-accentPrimary transition disabled:cursor-not-allowed disabled:opacity-60 mt-4"
      >
        {isSaving || isUpdating ? 'Saving...' : 'Save Changes'}
      </motion.button>
    </div>
  );
}
