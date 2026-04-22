import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { AppearanceSettingsState } from './SettingsLayout';

interface AppearanceSettingsProps {
  values: AppearanceSettingsState;
  onChange: (patch: Partial<AppearanceSettingsState>) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function AppearanceSettings({ values, onChange, onSave, isSaving }: AppearanceSettingsProps) {
  const { setTheme } = useTheme();

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as AppearanceSettingsState['theme'];
    onChange({ theme: value });
    setTheme(value === 'Light' ? 'light' : 'dark');
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-textLabel">Theme</span>
          <select
            value={values.theme}
            onChange={handleThemeChange}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textPrimary outline-none"
          >
            <option value="Dark">Dark</option>
            <option value="Light">Light</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm text-textLabel">UI Density</span>
          <select
            value={values.density}
            onChange={(event) =>
              onChange({ density: event.target.value as AppearanceSettingsState['density'] })
            }
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textPrimary outline-none"
          >
            <option value="Compact">Compact</option>
            <option value="Comfortable">Comfortable</option>
          </select>
        </label>
      </div>

      <label className="space-y-2">
        <span className="text-sm text-textLabel">Accent Color</span>
        <div className="flex items-center gap-3 rounded-xl border border-cardBorder bg-bgInput px-3 py-2">
          <input
            type="color"
            value={values.accentColor}
            onChange={(event) => onChange({ accentColor: event.target.value })}
            className="h-8 w-12 cursor-pointer rounded border border-cardBorder bg-transparent"
          />
          <span className="text-sm text-textPrimary/75">{values.accentColor}</span>
        </div>
      </label>

      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onSave}
        disabled={isSaving}
        className="rounded-xl border border-[#00FF9C]/40 bg-[#00FF9C]/15 px-4 py-2 text-sm font-semibold text-[#9BFFD7] transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </motion.button>
    </div>
  );
}
