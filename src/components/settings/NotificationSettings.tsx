import { motion } from 'framer-motion';
import { NotificationSettingsState } from './SettingsLayout';

interface NotificationSettingsProps {
  values: NotificationSettingsState;
  onChange: (patch: Partial<NotificationSettingsState>) => void;
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
        'relative h-6 w-14 rounded-full border transition',
        checked
          ? 'border-accentPrimary/50 bg-accentPrimary/20'
          : 'border-cardBorder bg-cardBg',
      ].join(' ')}
    >
      {/* ON/OFF text */}
      <span
        className={`absolute top-[4px] text-[10px] font-extrabold tracking-wide ${
          checked ? 'left-[8px] text-accentPrimary' : 'right-[6px] text-textSecondary'
        }`}
      >
        {checked ? 'ON' : 'OFF'}
      </span>
      
      {/* Knob */}
      <motion.span
        animate={{ x: checked ? 36 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        className="absolute top-[2px] block h-4.5 w-4.5 rounded-full bg-white shadow-sm"
      />
    </button>
  );
}

export function NotificationSettings({ values, onChange, onSave, isSaving }: NotificationSettingsProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-3 rounded-2xl border border-cardBorder bg-bgInput p-4">
        <p className="text-sm font-semibold text-textBody">Alert Types</p>

        {[
          ['pestAlerts', 'Pest alerts'],
          ['fungalAlerts', 'Fungal alerts'],
          ['irrigationAlerts', 'Irrigation alerts'],
          ['weatherAlerts', 'Weather alerts'],
        ].map(([key, label]) => (
          <div key={key} className="flex items-center justify-between rounded-xl border border-cardBorder bg-cardBg px-3 py-2">
            <span className="text-sm text-textBody">{label}</span>
            <ToggleSwitch
              checked={values[key as keyof NotificationSettingsState] as boolean}
              onToggle={() =>
                onChange({
                  [key]: !(values[key as keyof NotificationSettingsState] as boolean),
                })
              }
            />
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-2xl border border-cardBorder bg-bgInput p-4">
        <p className="text-sm font-semibold text-textBody">Notification Channels</p>

        {[
          ['sms', 'SMS'],
          ['email', 'Email'],
          ['push', 'Push'],
        ].map(([key, label]) => (
          <div key={key} className="flex items-center justify-between rounded-xl border border-cardBorder bg-cardBg px-3 py-2">
            <span className="text-sm text-textBody">{label}</span>
            <ToggleSwitch
              checked={values[key as keyof NotificationSettingsState] as boolean}
              onToggle={() =>
                onChange({
                  [key]: !(values[key as keyof NotificationSettingsState] as boolean),
                })
              }
            />
          </div>
        ))}
      </div>

      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSave}
        disabled={isSaving}
        className="rounded-xl border border-accentPrimary/40 bg-accentPrimary/15 px-4 py-2 text-sm font-semibold text-accentPrimary transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </motion.button>
    </div>
  );
}
