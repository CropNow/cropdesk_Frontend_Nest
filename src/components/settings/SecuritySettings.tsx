import { useState } from 'react';
import { motion } from 'framer-motion';
import { SecuritySettingsState } from './SettingsLayout';

interface SecuritySettingsProps {
  values: SecuritySettingsState;
  onChange: (patch: Partial<SecuritySettingsState>) => void;
  onLogoutAll: () => void;
  onSave: () => void;
  isSaving: boolean;
}

function ToggleSwitch({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onToggle}
      className={[
        'relative h-6 w-11 rounded-full border transition',
        checked
          ? 'border-accentPrimary/50 bg-accentPrimary/20'
          : 'border-cardBorder bg-cardBg',
      ].join(' ')}
    >
      <motion.span
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        className="absolute top-[2px] h-4.5 w-4.5 rounded-full bg-white"
      />
    </button>
  );
}

export function SecuritySettings({ values, onChange, onLogoutAll, onSave, isSaving }: SecuritySettingsProps) {
  const [error, setError] = useState('');

  const handleSave = () => {
    if (values.newPassword || values.confirmPassword || values.currentPassword) {
      if (!values.currentPassword) {
        setError('Current password is required to set a new password.');
        return;
      }

      if (values.newPassword.length < 8) {
        setError('New password must be at least 8 characters.');
        return;
      }

      if (values.newPassword !== values.confirmPassword) {
        setError('New password and confirm password must match.');
        return;
      }
    }

    setError('');
    onSave();
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm text-textLabel">Current Password</span>
          <input
            type="password"
            value={values.currentPassword}
            onChange={(event) => onChange({ currentPassword: event.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-textLabel">New Password</span>
          <input
            type="password"
            value={values.newPassword}
            onChange={(event) => onChange({ newPassword: event.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-textLabel">Confirm Password</span>
          <input
            type="password"
            value={values.confirmPassword}
            onChange={(event) => onChange({ confirmPassword: event.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none"
          />
        </label>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-cardBorder bg-bgInput px-4 py-3">
        <span className="text-sm text-textBody">Two-factor authentication</span>
        <ToggleSwitch
          checked={values.twoFactorEnabled}
          onToggle={() => onChange({ twoFactorEnabled: !values.twoFactorEnabled })}
        />
      </div>

      <div className="rounded-2xl border border-cardBorder bg-bgInput p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-textBody">Active Sessions</p>
          <button
            type="button"
            onClick={onLogoutAll}
            className="rounded-lg border border-rose-400/40 bg-rose-400/10 px-3 py-1 text-xs font-semibold text-rose-200"
          >
            Logout all devices
          </button>
        </div>

        {values.activeSessions.length === 0 ? (
          <p className="text-sm text-textMuted">No active sessions.</p>
        ) : (
          <div className="space-y-2">
            {values.activeSessions.map((session) => (
              <div
                key={session.id}
                className="rounded-xl border border-cardBorder bg-cardBg px-3 py-2"
              >
                <p className="text-sm font-semibold text-textBody">{session.device}</p>
                <p className="text-xs text-textMuted">{session.location} • {session.lastActive}</p>
              </div>
            ))}
          </div>
        )}
      </div>

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
