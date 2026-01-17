import React, { useState, useEffect } from 'react';
import { Layers, Droplets, FlaskConical, Plus } from 'lucide-react';
import LocationPicker from '@/components/common/LocationPicker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const FieldDetailsTab = ({
  field,
  fields,
  onSelectField,
  onAdd,
  onUpdate,
  onDelete,
  parentFarmLocation,
}: {
  field: any;
  fields?: any[];
  onSelectField?: (id: string) => void;
  onAdd: (data: any) => void;
  onUpdate: (data: any) => void;
  onDelete: () => void;
  parentFarmLocation?: { latitude: string; longitude: string };
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [fieldData, setFieldData] = useState({
    name: '',
    description: '',
    area: '',
    units: '',
    boundaryType: '',
    soilType: '',
    phLevel: '',
    irrigationMethod: '',
    coordinates: '',
  });

  useEffect(() => {
    if (isAdding) {
      setFieldData({
        name: '',
        description: '',
        area: '',
        units: '',
        boundaryType: '',
        soilType: '',
        phLevel: '',
        irrigationMethod: '',
        coordinates: '',
      });
      setIsEditing(true);
    } else if (field) {
      setFieldData({
        name: field.name || field.fieldName || '',
        description: field.description || '',
        area: field.area || '',
        units: field.units || '',
        boundaryType: field.boundaryType || '',
        soilType: field.soilType || '',
        phLevel: field.phLevel || '',
        irrigationMethod: field.irrigationMethod || '',
        coordinates: field.coordinates || '',
      });
      setIsEditing(false);
    }
  }, [field, isAdding]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFieldData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (isAdding) {
      onAdd(fieldData);
      setIsAdding(false);
    } else if (isEditing) {
      onUpdate({ ...field, ...fieldData });
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const toggleAddMode = () => {
    if (isAdding) {
      setIsAdding(false);
      setIsEditing(false);
    } else {
      setIsAdding(true);
    }
  };

  if (!field && !isAdding) {
    return (
      <div className="bg-card border border-border rounded-3xl p-8 flex items-center justify-center min-h-[400px] flex-col gap-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No field selected.</p>
          <Button
            className="rounded-xl font-bold flex items-center gap-2 mx-auto"
            onClick={toggleAddMode}
          >
            <Plus size={16} />
            Add New Field
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            {isAdding ? 'Add New Field' : 'Field Details'}
          </h2>
        </div>

        {/* Field Selector */}
        {!isAdding && fields && fields.length > 0 && onSelectField && (
          <div className="flex-1 ml-8">
            <Label className="block text-[10px] uppercase font-bold text-white mb-1">
              Select Field
            </Label>
            <select
              className="w-fit min-w-[200px] bg-zinc-900 text-white border border-zinc-700 rounded-xl font-bold px-4 py-2 text-sm focus:outline-none cursor-pointer"
              value={field?.id || ''}
              onChange={(e) => onSelectField(e.target.value)}
            >
              {fields.map((f) => (
                <option
                  key={f.id}
                  value={f.id}
                  className="bg-zinc-800 text-white"
                >
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {!isAdding && (
          <Button
            onClick={toggleAddMode}
            size="sm"
            className="rounded-xl text-xs font-bold flex items-center gap-2"
          >
            <Plus size={16} />
            Add Field
          </Button>
        )}
        {isAdding && (
          <Button
            onClick={toggleAddMode}
            variant="secondary"
            size="sm"
            className="rounded-xl text-xs font-bold"
          >
            Cancel
          </Button>
        )}
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Name */}
        <div>
          <Label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
            Field Name
          </Label>
          <Input
            type="text"
            name="name"
            value={fieldData.name || ''}
            readOnly={!isEditing}
            onChange={handleChange}
            className={`w-full font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : ''}`}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Area */}
          <div>
            <Label className="block text-xs font-bold text-white uppercase mb-2">
              Area
            </Label>
            <Input
              type="text"
              name="area"
              value={fieldData.area || ''}
              readOnly={!isEditing}
              onChange={handleChange}
              placeholder={!isEditing ? '' : 'Area'}
              className={`w-full font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : ''}`}
            />
          </div>
          {/* Boundary */}
          <div>
            <Label className="block text-xs font-bold text-white uppercase mb-2">
              Boundary Type
            </Label>
            <Input
              type="text"
              name="boundaryType"
              value={fieldData.boundaryType || ''}
              readOnly={!isEditing}
              onChange={handleChange}
              className={`w-full font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : ''}`}
            />
          </div>
        </div>

        {/* Coordinates / Map */}
        <div className="mt-6">
          <Label className="block text-xs font-bold text-white uppercase mb-2">
            Field Location (Draw Shape)
          </Label>
          <LocationPicker
            mode="polygon"
            readOnly={!isEditing}
            value={fieldData.coordinates}
            onChange={(val: any) => {
              setFieldData((prev) => {
                const updates: any = { ...prev, coordinates: val };
                // Auto-detect boundary type
                try {
                  const parsed = JSON.parse(val);
                  if (parsed.type) {
                    if (parsed.type === 'Rectangle')
                      updates.boundaryType = 'Rectangle';
                    else if (parsed.type === 'Circle')
                      updates.boundaryType = 'Circle';
                    else updates.boundaryType = 'Polygon';
                  }
                } catch (e) {}
                return updates;
              });
            }}
            center={
              parentFarmLocation && parentFarmLocation.latitude
                ? [
                    parseFloat(parentFarmLocation.latitude),
                    parseFloat(parentFarmLocation.longitude),
                  ]
                : undefined
            }
            onAreaCalculated={(sqFt) => {
              if (!isEditing) return;
              let val = sqFt;
              if (fieldData.units === 'acres') val = sqFt / 43560;
              else if (fieldData.units === 'hectares') val = sqFt / 107639;

              setFieldData((prev) => ({ ...prev, area: val.toFixed(2) }));
            }}
            height="350px"
          />
        </div>

        <hr className="border-border my-2" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Soil Type */}
          <div>
            <Label className="block text-xs font-bold text-white uppercase mb-2">
              Soil Type
            </Label>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-muted rounded-xl">
                <Layers size={18} className="text-foreground" />
              </div>
              <Input
                type="text"
                name="soilType"
                value={fieldData.soilType || ''}
                readOnly={!isEditing}
                onChange={handleChange}
                className={`w-full font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : ''}`}
              />
            </div>
          </div>

          {/* pH Level */}
          <div>
            <Label className="block text-xs font-bold text-white uppercase mb-2">
              Soil pH
            </Label>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-muted rounded-xl">
                <FlaskConical size={18} className="text-foreground" />
              </div>
              <Input
                type="text"
                name="phLevel"
                value={fieldData.phLevel || ''}
                readOnly={!isEditing}
                onChange={handleChange}
                className={`w-full font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : ''}`}
              />
            </div>
          </div>

          {/* Irrigation */}
          <div>
            <Label className="block text-xs font-bold text-white uppercase mb-2">
              Irrigation
            </Label>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-muted rounded-xl">
                <Droplets size={18} className="text-foreground" />
              </div>
              <Input
                type="text"
                name="irrigationMethod"
                value={fieldData.irrigationMethod || ''}
                readOnly={!isEditing}
                onChange={handleChange}
                className={`w-full font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : ''}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions for Field Tab */}
      <div className="flex gap-3 mt-8 border-t border-border pt-6">
        <Button
          onClick={handleSave}
          variant={isEditing ? 'default' : 'secondary'}
          className="w-fit rounded-xl text-xs font-bold"
        >
          {isAdding
            ? 'Save New Field'
            : isEditing
              ? 'Save Changes'
              : 'Edit Details'}
        </Button>
        {!isAdding && (
          <Button
            onClick={onDelete}
            variant="destructive"
            className="w-fit rounded-xl text-xs font-bold"
          >
            Delete Field
          </Button>
        )}
      </div>
    </div>
  );
};

export default FieldDetailsTab;
