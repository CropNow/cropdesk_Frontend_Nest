import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bug,
  Leaf,
  Droplets,
  CloudRain,
  MessageSquare,
  Mail,
  Bell,
  Smartphone,
  FlaskConical,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useNotificationSettings } from '../../hooks/settings/useNotificationSettings';
import { NotificationPreferences } from '../../types/settings.types';

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function ToggleSwitch({
  checked,
  onToggle,
  disabled = false,
}: {
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onToggle}
      disabled={disabled}
      className={[
        'relative h-6 w-11 flex-shrink-0 rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accentPrimary/40 focus:ring-offset-1 focus:ring-offset-transparent',
        checked
          ? 'border-accentPrimary/60 bg-accentPrimary/25 shadow-[0_0_10px_rgba(0,255,156,0.2)]'
          : 'border-cardBorder bg-cardBg',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      ].join(' ')}
    >
      <motion.span
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={[
          'absolute top-[3px] h-4 w-4 rounded-full transition-colors duration-300',
          checked ? 'bg-accentPrimary shadow-[0_0_6px_rgba(0,255,156,0.5)]' : 'bg-textMuted',
        ].join(' ')}
      />
    </button>
  );
}

// ─── Alert Type Row ───────────────────────────────────────────────────────────

type AlertTypeConfig = {
  key: keyof NotificationPreferences['alertTypes'];
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
};

const ALERT_TYPE_CONFIGS: AlertTypeConfig[] = [
  {
    key: 'pest',
    label: 'Pest Alerts',
    description: 'Notifications when pest activity is detected in your fields',
    icon: <Bug className="h-4 w-4" />,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/20',
  },
  {
    key: 'fungal',
    label: 'Fungal Alerts',
    description: 'Early warnings for fungal disease conditions',
    icon: <Leaf className="h-4 w-4" />,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/20',
  },
  {
    key: 'irrigation',
    label: 'Irrigation Alerts',
    description: 'Alerts for water stress, leaks or irrigation schedule changes',
    icon: <Droplets className="h-4 w-4" />,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    key: 'weather',
    label: 'Weather Alerts',
    description: 'Severe weather events, frost warnings, and storm alerts',
    icon: <CloudRain className="h-4 w-4" />,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10 border-cyan-500/20',
  },
];

// ─── Channel Config ───────────────────────────────────────────────────────────

type ChannelConfig = {
  key: keyof NotificationPreferences['channels'];
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
};

const CHANNEL_CONFIGS: ChannelConfig[] = [
  {
    key: 'sms',
    label: 'SMS',
    description: 'Receive alerts as text messages to your phone',
    icon: <MessageSquare className="h-4 w-4" />,
    color: 'text-green-400',
    bgColor: 'bg-green-500/10 border-green-500/20',
  },
  {
    key: 'email',
    label: 'Email',
    description: 'Receive detailed alert reports in your inbox',
    icon: <Mail className="h-4 w-4" />,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10 border-indigo-500/20',
  },
  {
    key: 'push',
    label: 'Push Notifications',
    description: 'Real-time browser and mobile app notifications',
    icon: <Bell className="h-4 w-4" />,
    color: 'text-accentPrimary',
    bgColor: 'bg-accentPrimary/10 border-accentPrimary/20',
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export function NotificationSettings() {
  const {
    preferences,
    setPreferences,
    status,
    isLoading,
    isSaving,
    isTesting,
    isRegistering,
    error,
    successMessage,
    savePreferences,
    registerDeviceToken,
    sendTestNotification,
  } = useNotificationSettings();

  const [deviceToken, setDeviceToken] = useState('');
  const [tokenInputFocused, setTokenInputFocused] = useState(false);

  const handleAlertTypeToggle = (key: keyof NotificationPreferences['alertTypes']) => {
    setPreferences((prev) => ({
      ...prev,
      alertTypes: { ...prev.alertTypes, [key]: !prev.alertTypes[key] },
    }));
  };

  const handleChannelToggle = (key: keyof NotificationPreferences['channels']) => {
    setPreferences((prev) => ({
      ...prev,
      channels: { ...prev.channels, [key]: !prev.channels[key] },
    }));
  };

  const handleSave = async () => {
    await savePreferences({
      alertTypes: preferences.alertTypes,
      channels: preferences.channels,
    });
  };

  const handleRegisterToken = async () => {
    await registerDeviceToken(deviceToken);
    setDeviceToken('');
  };

  const isAnyBusy = status !== 'idle' && status !== 'loading';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-accentPrimary" />
          <p className="text-sm text-textSecondary">Loading preferences…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Status Banner ─────────────────────────────────────────── */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3"
          >
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-300">{successMessage}</span>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
            <span className="text-sm font-medium text-red-300">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Alert Types ────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-cardBorder bg-bgInput p-5">
        <div className="mb-4">
          <p className="text-sm font-semibold text-textHeading">Alert Types</p>
          <p className="mt-0.5 text-xs text-textMuted">Choose which events trigger notifications for your farm</p>
        </div>
        <div className="space-y-3">
          {ALERT_TYPE_CONFIGS.map((cfg) => (
            <div
              key={cfg.key}
              className="flex items-center gap-4 rounded-xl border border-cardBorder bg-cardBg px-4 py-3 transition-colors hover:border-white/10"
            >
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border ${cfg.bgColor} ${cfg.color}`}>
                {cfg.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-textBody">{cfg.label}</p>
                <p className="text-xs text-textMuted">{cfg.description}</p>
              </div>
              <ToggleSwitch
                checked={preferences.alertTypes[cfg.key]}
                onToggle={() => handleAlertTypeToggle(cfg.key)}
                disabled={isAnyBusy}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Notification Channels ──────────────────────────────────── */}
      <div className="rounded-2xl border border-cardBorder bg-bgInput p-5">
        <div className="mb-4">
          <p className="text-sm font-semibold text-textHeading">Notification Channels</p>
          <p className="mt-0.5 text-xs text-textMuted">Select how you want to receive your alerts</p>
        </div>
        <div className="space-y-3">
          {CHANNEL_CONFIGS.map((cfg) => (
            <div
              key={cfg.key}
              className="flex items-center gap-4 rounded-xl border border-cardBorder bg-cardBg px-4 py-3 transition-colors hover:border-white/10"
            >
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border ${cfg.bgColor} ${cfg.color}`}>
                {cfg.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-textBody">{cfg.label}</p>
                <p className="text-xs text-textMuted">{cfg.description}</p>
              </div>
              <ToggleSwitch
                checked={preferences.channels[cfg.key]}
                onToggle={() => handleChannelToggle(cfg.key)}
                disabled={isAnyBusy}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Push Device Token ──────────────────────────────────────── */}
      <div className="rounded-2xl border border-cardBorder bg-bgInput p-5">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-accentPrimary/20 bg-accentPrimary/10 text-accentPrimary">
            <Smartphone className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-textHeading">Register Device Token</p>
            <p className="mt-0.5 text-xs text-textMuted">
              Register an Expo, FCM, or APNs push token to enable mobile notifications on this device
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <div
            className={[
              'relative flex-1 overflow-hidden rounded-xl border transition-all duration-200',
              tokenInputFocused
                ? 'border-accentPrimary/50 ring-1 ring-accentPrimary/30'
                : 'border-cardBorder',
            ].join(' ')}
          >
            <input
              type="text"
              value={deviceToken}
              onChange={(e) => setDeviceToken(e.target.value)}
              onFocus={() => setTokenInputFocused(true)}
              onBlur={() => setTokenInputFocused(false)}
              placeholder="ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
              className="w-full bg-cardBg px-4 py-2.5 text-sm text-textPrimary placeholder-textMuted outline-none"
            />
          </div>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleRegisterToken}
            disabled={isAnyBusy || !deviceToken.trim()}
            className="flex items-center gap-2 rounded-xl border border-accentPrimary/40 bg-accentPrimary/15 px-4 py-2.5 text-sm font-semibold text-accentPrimary transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRegistering ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            {isRegistering ? 'Registering…' : 'Register'}
          </motion.button>
        </div>

        {/* Registered tokens list */}
        {preferences.pushTokens.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-textMuted">Registered tokens</p>
            {preferences.pushTokens.map((token, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-lg border border-cardBorder bg-cardBg/50 px-3 py-2"
              >
                <div className="h-2 w-2 rounded-full bg-accentPrimary" />
                <span className="truncate font-mono text-xs text-textSecondary">{token}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Actions Row ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Test Notification */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={sendTestNotification}
          disabled={isAnyBusy}
          className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-sm font-semibold text-amber-400 transition hover:border-amber-500/60 hover:bg-amber-500/15 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isTesting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FlaskConical className="h-4 w-4" />
          )}
          {isTesting ? 'Sending…' : 'Send Test Notification'}
        </motion.button>

        {/* Save Changes */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={isAnyBusy}
          className="flex items-center justify-center gap-2 rounded-xl border border-accentPrimary/40 bg-accentPrimary/15 px-5 py-2.5 text-sm font-semibold text-accentPrimary shadow-[0_0_16px_rgba(0,255,156,0.08)] transition hover:border-accentPrimary/60 hover:bg-accentPrimary/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Zap className="h-4 w-4" />
          )}
          {isSaving ? 'Saving…' : 'Save Preferences'}
        </motion.button>
      </div>
    </div>
  );
}
