import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dashboardAPI } from '../../../api/dashboard.api';
import { fieldsAPI } from '../../../api/fields.api';

export function FieldDetailsPanel() {
  const [farms, setFarms] = useState<any[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  
  const [fields, setFields] = useState<any[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    area: '',
    boundaryType: 'Polygon',
    soilType: 'Loamy',
    irrigationType: 'Drip',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Fetch farms
  useEffect(() => {
    const fetchFarms = async () => {
      try {
        setIsLoading(true);
        const res = await dashboardAPI.getFarms();
        const data = res.data?.data?.farms || res.data?.data || res.data || [];
        const farmsList = Array.isArray(data) ? data : [];
        setFarms(farmsList);
        if (farmsList.length > 0) {
          setSelectedFarmId(farmsList[0].id || farmsList[0]._id);
        }
      } catch (err: any) {
        setError('Failed to fetch farms');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFarms();
  }, []);

  // 2. Fetch fields (via devices) when farm changes
  useEffect(() => {
    if (!selectedFarmId) return;
    const fetchFields = async () => {
      try {
        const res = await dashboardAPI.getFarmDevices(selectedFarmId);
        const data = res.data?.data || res.data?.devices || (Array.isArray(res.data) ? res.data : []);
        const extractedFields: any[] = [];
        if (Array.isArray(data)) {
          data.forEach(d => {
            if (d.field && !extractedFields.some(f => (f.id || f._id) === (d.field.id || d.field._id))) {
              extractedFields.push(d.field);
            }
          });
        }
        setFields(extractedFields);
        if (extractedFields.length > 0) {
          handleSelectField(extractedFields[0]);
        } else {
          setSelectedFieldId(null);
        }
      } catch (err) {
        console.error('Failed to fetch fields', err);
      }
    };
    fetchFields();
  }, [selectedFarmId]);

  const handleSelectField = (field: any) => {
    setSelectedFieldId(field.id || field._id);
    setFormData({
      name: field.name || '',
      area: field.area || '',
      boundaryType: field.boundary?.type || 'Polygon',
      soilType: field.soilType || field.soil?.type || 'Loamy',
      irrigationType: field.irrigationType || field.irrigation?.type || 'Drip',
    });
    setError('');
    setSuccessMsg('');
  };

  const handleSave = async () => {
    if (!selectedFieldId) return;
    try {
      setIsSaving(true);
      setError('');
      setSuccessMsg('');
      await fieldsAPI.updateField(selectedFieldId, {
        name: formData.name,
        area: parseFloat(formData.area) || 0,
        soil: { type: formData.soilType.toLowerCase() },
        irrigation: { type: formData.irrigationType.toLowerCase() },
      });
      setSuccessMsg('Field details updated successfully.');
      setFields(fields.map(f => (f.id === selectedFieldId || f._id === selectedFieldId) ? { ...f, name: formData.name, area: formData.area, soilType: formData.soilType, irrigationType: formData.irrigationType } : f));
    } catch (err: any) {
      setError('Failed to update field details.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-4 text-textSecondary">Loading...</div>;

  return (
    <div className="space-y-6">
      <h3 className="mb-4 text-xl font-bold text-textHeading">Field Details</h3>
      
      {farms.length > 0 && (
        <label className="space-y-2 block">
          <span className="text-sm font-semibold text-textMuted uppercase">Select Farm</span>
          <select
            value={selectedFarmId || ''}
            onChange={(e) => setSelectedFarmId(e.target.value)}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
          >
            {farms.map(farm => (
              <option key={farm.id || farm._id} value={farm.id || farm._id}>{farm.name}</option>
            ))}
          </select>
        </label>
      )}

      {fields.length > 0 ? (
        <div className="space-y-4 pt-4 border-t border-cardBorder">
          <label className="space-y-2 block">
            <span className="text-sm font-semibold text-textMuted uppercase">Select Field</span>
            <select
              value={selectedFieldId || ''}
              onChange={(e) => {
                const field = fields.find(f => (f.id || f._id) === e.target.value);
                if (field) handleSelectField(field);
              }}
              className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
            >
              {fields.map(field => (
                <option key={field.id || field._id} value={field.id || field._id}>{field.name || `Field ${field.id || field._id}`}</option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-1">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-textMuted uppercase">Field Name *</span>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-textMuted uppercase">Area *</span>
              <input
                placeholder="Area (e.g. 5)"
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-textMuted uppercase">Boundary Type *</span>
              <select
                value={formData.boundaryType}
                onChange={(e) => setFormData({ ...formData, boundaryType: e.target.value })}
                className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
              >
                <option value="Polygon">Polygon</option>
                <option value="Circle">Circle</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-1">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-textMuted uppercase">Field Location (Draw Shape) *</span>
              <div className="h-64 w-full rounded-xl border border-cardBorder bg-cardBg/50 flex items-center justify-center text-textSecondary text-sm">
                Map View: Field boundaries are edited in the main Dashboard map view.
              </div>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-textMuted uppercase">Soil Type *</span>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
              >
                <option value="Loamy">Loamy</option>
                <option value="Sandy">Sandy</option>
                <option value="Clay">Clay</option>
                <option value="Silt">Silt</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-textMuted uppercase">Irrigation Type *</span>
              <select
                value={formData.irrigationType}
                onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
                className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
              >
                <option value="Drip">Drip</option>
                <option value="Sprinkler">Sprinkler</option>
                <option value="Flood">Flood</option>
                <option value="Rainfed">Rainfed</option>
              </select>
            </label>
          </div>

          {error && <p className="text-sm text-rose-300">{error}</p>}
          {successMsg && <p className="text-sm text-emerald-400">{successMsg}</p>}

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl border border-accentPrimary/40 bg-accentPrimary/15 px-4 py-2 text-sm font-semibold text-accentPrimary transition disabled:cursor-not-allowed disabled:opacity-60 mt-4"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </div>
      ) : (
        <p className="text-textSecondary text-sm pt-4 border-t border-cardBorder">No fields found for this farm.</p>
      )}
    </div>
  );
}
