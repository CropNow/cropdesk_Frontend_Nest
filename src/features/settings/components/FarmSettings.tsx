import { useState } from 'react';
import { motion } from 'framer-motion';
import { FarmSettingsState } from './SettingsLayout';

interface FarmSettingsProps {
  values: FarmSettingsState;
  onChange: (patch: Partial<FarmSettingsState>) => void;
  onSave: () => void;
  isSaving: boolean;
}

const CROP_OPTIONS = ['Tomato', 'Onion', 'Chili', 'Corn', 'Wheat', 'Cotton', 'Millet'];
const SOIL_OPTIONS = ['Loamy', 'Sandy Loam', 'Clay Loam', 'Silt Loam'];
const IRRIGATION_OPTIONS = ['Drip', 'Sprinkler', 'Furrow', 'Pivot'];

export function FarmSettings({ values, onChange, onSave, isSaving }: FarmSettingsProps) {
  const [error, setError] = useState('');

  const handleCropToggle = (crop: string) => {
    const nextCrops = values.cropTypes.includes(crop)
      ? values.cropTypes.filter((item) => item !== crop)
      : [...values.cropTypes, crop];

    onChange({ cropTypes: nextCrops });
  };

  const handleSave = () => {
    if (!values.farmName.trim() || !values.location.trim()) {
      setError('Farm name and location are required.');
      return;
    }

    if (Number(values.areaAcres) <= 0 || Number.isNaN(Number(values.areaAcres))) {
      setError('Area must be a valid number greater than zero.');
      return;
    }

    if (values.cropTypes.length === 0) {
      setError('Select at least one crop type.');
      return;
    }

    setError('');
    onSave();
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-textLabel">Farm Name</span>
          <input
            value={values.farmName}
            onChange={(event) => onChange({ farmName: event.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-textLabel">Location</span>
          <input
            value={values.location}
            onChange={(event) => onChange({ location: event.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm text-textLabel">Area (acres)</span>
          <input
            value={values.areaAcres}
            onChange={(event) => onChange({ areaAcres: event.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-textLabel">Soil Type</span>
          <select
            value={values.soilType}
            onChange={(event) => onChange({ soilType: event.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none"
          >
            {SOIL_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm text-textLabel">Irrigation Type</span>
          <select
            value={values.irrigationType}
            onChange={(event) => onChange({ irrigationType: event.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none"
          >
            {IRRIGATION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <p className="mb-2 text-sm text-textLabel">Crop Types</p>
        <div className="flex flex-wrap gap-2">
          {CROP_OPTIONS.map((crop) => {
            const selected = values.cropTypes.includes(crop);

            return (
              <button
                key={crop}
                type="button"
                onClick={() => handleCropToggle(crop)}
                className={[
                  'rounded-full border px-3 py-1 text-xs font-semibold transition',
                  selected
                    ? 'border-accentPrimary/50 bg-accentPrimary/18 text-accentPrimary'
                    : 'border-cardBorder bg-cardBg text-textLabel hover:border-cardBorder',
                ].join(' ')}
              >
                {crop}
              </button>
            );
          })}
        </div>
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
