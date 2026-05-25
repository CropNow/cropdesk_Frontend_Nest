import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SecuritySettingsState, SessionState } from './SettingsLayout';
import { authAPI } from '../../api/auth.api';
import { parseUserAgent, formatTimeAgo } from '../../utils/formatUtils';

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
  const [success, setSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [sessions, setSessions] = useState<SessionState[]>(values.activeSessions || []);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoadingSessions(true);
        const response = await authAPI.getSessions();
        const data = response.data?.data || response.data;
        if (Array.isArray(data)) {
          setSessions(data);
        }
      } catch (err) {
        console.error('Failed to fetch active sessions:', err);
      } finally {
        setIsLoadingSessions(false);
      }
    };
    fetchSessions();
  }, []);

  const handleSave = async () => {
    setError('');
    setSuccess('');

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

      try {
        setIsChangingPassword(true);
        await authAPI.changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        
        setSuccess('Password changed successfully.');
        onChange({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to change password. Please try again.');
        return; // Return early so we don't show generic success toast if this failed
      } finally {
        setIsChangingPassword(false);
      }
    }

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

        {isLoadingSessions ? (
          <p className="text-sm text-textMuted">Loading active sessions...</p>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-textMuted">No active sessions.</p>
        ) : (
          <div className="space-y-2">
            {sessions.map((session: any) => (
              <div
                key={session._id || session.id}
                className="rounded-xl border border-cardBorder bg-cardBg px-3 py-2"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-textBody">
                      {session.device || session.deviceName || 'Unknown Device'}
                    </p>
                    <p className="text-xs text-textMuted">
                      {session.location || session.ip || 'Unknown Location'} • {formatTimeAgo(session.lastActive || session.createdAt || '')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-400">{success}</p> : null}

      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        disabled={isSaving || isChangingPassword}
        className="rounded-xl border border-accentPrimary/40 bg-accentPrimary/15 px-4 py-2 text-sm font-semibold text-accentPrimary transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving || isChangingPassword ? 'Saving...' : 'Save Changes'}
      </motion.button>
    </div>
  );
}
