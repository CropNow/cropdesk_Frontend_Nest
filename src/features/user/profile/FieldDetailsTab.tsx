import React, { useState, useEffect } from 'react';
import { Layers, Droplets, FlaskConical, ChevronDown } from 'lucide-react';

const FieldDetailsTab = ({
  field,
  fields,
  selectedFieldId,
  onSelectField,
  onUpdate,
  onDelete,
}: {
  field: any;
  fields?: any[];
  selectedFieldId?: string;
  onSelectField?: (id: string) => void;
  onUpdate: (data: any) => void;
  onDelete: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fieldData, setFieldData] = useState({
    name: '',
    description: '',
    area: '',
    units: '',
    boundaryType: '',
    soilType: '',
    phLevel: '',
    irrigationMethod: '',
  });

  useEffect(() => {
    if (field) {
      setFieldData({
        name: field.name || field.fieldName || '',
        description: field.description || '',
        area: field.area || '',
        units: field.units || '',
        boundaryType: field.boundaryType || '',
        soilType: field.soilType || '',
        phLevel: field.phLevel || '',
        irrigationMethod: field.irrigationMethod || '',
      });
    }
  }, [field]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFieldData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (isEditing) {
      onUpdate({ ...field, ...fieldData });
    }
    setIsEditing(!isEditing);
  };

  if (!field) {
    return (
      <div className="bg-card border border-border rounded-3xl p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No field selected.</p>
          <button
            className="px-4 py-2 bg-green-500 text-black rounded-xl font-bold hover:bg-green-400"
            onClick={() => window.location.reload()}
          >
            Reload Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-bold text-foreground">Field Details</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Specific field information
          </p>
        </div>

        {/* Field Selection Dropdown */}
        {fields && fields.length > 0 && onSelectField && (
          <div className="relative">
            <select
              value={selectedFieldId}
              onChange={(e) => onSelectField(e.target.value)}
              className="appearance-none bg-secondary/50 border border-border rounded-xl px-4 py-2 pr-10 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 cursor-pointer min-w-[200px]"
            >
              {fields.map((f) => (
                <option
                  key={f.id}
                  value={f.id}
                  className="bg-card text-foreground"
                >
                  {f.name || f.fieldName || 'Unnamed Field'}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
          </div>
        )}
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Name */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
            Field Name
          </label>
          <input
            type="text"
            name="name"
            value={fieldData.name || ''}
            readOnly={!isEditing}
            onChange={handleChange}
            className={`w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : 'focus:ring-2 focus:ring-green-500/50'}`}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Area */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              Area
            </label>
            <input
              type="text"
              name="area"
              value={fieldData.area || ''}
              readOnly={!isEditing}
              onChange={handleChange}
              placeholder={!isEditing ? '' : 'Area'}
              className={`w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : 'focus:ring-2 focus:ring-green-500/50'}`}
            />
          </div>
          {/* Boundary */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              Boundary Type
            </label>
            <input
              type="text"
              name="boundaryType"
              value={fieldData.boundaryType || ''}
              readOnly={!isEditing}
              onChange={handleChange}
              className={`w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : 'focus:ring-2 focus:ring-green-500/50'}`}
            />
          </div>
        </div>

        <hr className="border-border my-2" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Soil Type */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              Soil Type
            </label>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-muted rounded-xl">
                <Layers size={18} className="text-foreground" />
              </div>
              <input
                type="text"
                name="soilType"
                value={fieldData.soilType || ''}
                readOnly={!isEditing}
                onChange={handleChange}
                className={`w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : 'focus:ring-2 focus:ring-green-500/50'}`}
              />
            </div>
          </div>

          {/* pH Level */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              Soil pH
            </label>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-muted rounded-xl">
                <FlaskConical size={18} className="text-foreground" />
              </div>
              <input
                type="text"
                name="phLevel"
                value={fieldData.phLevel || ''}
                readOnly={!isEditing}
                onChange={handleChange}
                className={`w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : 'focus:ring-2 focus:ring-green-500/50'}`}
              />
            </div>
          </div>

          {/* Irrigation */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              Irrigation
            </label>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-muted rounded-xl">
                <Droplets size={18} className="text-foreground" />
              </div>
              <input
                type="text"
                name="irrigationMethod"
                value={fieldData.irrigationMethod || ''}
                readOnly={!isEditing}
                onChange={handleChange}
                className={`w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : 'focus:ring-2 focus:ring-green-500/50'}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions for Field Tab */}
      <div className="flex gap-3 mt-8 border-t border-border pt-6">
        <button
          onClick={handleSave}
          className={`w-fit px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            isEditing
              ? 'bg-green-500 text-black border-transparent hover:bg-green-400'
              : 'bg-secondary text-foreground hover:bg-muted border-transparent'
          }`}
        >
          {isEditing ? 'Save Details' : 'Edit Details'}
        </button>
        <button
          onClick={onDelete}
          className="w-fit px-4 py-2 bg-[#ffe4e6] text-[#e11d48] border border-transparent rounded-xl text-xs font-bold hover:bg-[#ffced4] transition-all"
        >
          Delete Field
        </button>
      </div>
    </div>
  );
};

export default FieldDetailsTab;
