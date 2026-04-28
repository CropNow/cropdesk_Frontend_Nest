import { AISettingsState } from './SettingsLayout';
import { ToggleSwitch } from '../common/ToggleSwitch';

interface AISettingsProps {
  values: AISettingsState;
  onChange: (patch: Partial<AISettingsState>) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function AISettings({ values, onChange, onSave, isSaving }: AISettingsProps) {
  return (
    <div className="space-y-4">
      <label className="space-y-2">
        <span className="text-sm text-textLabel">Sensitivity Level</span>
        <select
          value={values.sensitivity}
          onChange={(event) =>
            onChange({ sensitivity: event.target.value as AISettingsState['sensitivity'] })
          }
          className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </label>

      <div className="rounded-2xl border border-cardBorder bg-bgInput p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-textBody">Auto-suggestions</span>
          <ToggleSwitch
            checked={values.autoSuggestions}
            onToggle={() => onChange({ autoSuggestions: !values.autoSuggestions })}
          />
        </div>

        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between text-sm text-textBody">
            <span>Confidence threshold</span>
            <span>{values.confidenceThreshold}%</span>
          </div>
          <input
            type="range"
            min={50}
            max={100}
            value={values.confidenceThreshold}
            onChange={(event) =>
              onChange({ confidenceThreshold: Number(event.target.value) })
            }
            className="w-full accent-accentPrimary"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-textBody">Enable AI recommendations</span>
          <ToggleSwitch
            checked={values.enableRecommendations}
            onToggle={() =>
              onChange({ enableRecommendations: !values.enableRecommendations })
            }
          />
        </div>
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
