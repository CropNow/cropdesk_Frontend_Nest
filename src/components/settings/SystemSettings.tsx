import { motion } from 'framer-motion';
import { SystemSettingsState } from './SettingsLayout';

interface SystemSettingsProps {
  values: SystemSettingsState;
  onChange: (patch: Partial<SystemSettingsState>) => void;
  onReset: () => void;
  onSave: () => void;
  isSaving: boolean;
}

const LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu'];
const TIME_ZONES = ['Asia/Kolkata', 'UTC', 'America/New_York', 'Europe/London'];

export function SystemSettings({ values, onChange, onReset, onSave, isSaving }: SystemSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm text-textLabel">Units</span>
          <select
            value={values.units}
            onChange={(event) => onChange({ units: event.target.value as SystemSettingsState['units'] })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none"
          >
            <option value="Metric">Metric</option>
            <option value="Imperial">Imperial</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm text-textLabel">Language</span>
          <select
            value={values.language}
            onChange={(event) => onChange({ language: event.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none"
          >
            {LANGUAGES.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm text-textLabel">Time Zone</span>
          <select
            value={values.timeZone}
            onChange={(event) => onChange({ timeZone: event.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none"
          >
            {TIME_ZONES.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-200"
        >
          Reset system settings
        </button>

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
    </div>
  );
}
