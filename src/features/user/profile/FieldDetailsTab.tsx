import React, { useState, useEffect } from 'react';
import { Layers, Droplets, FlaskConical, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LocationPicker from '@/components/common/LocationPicker';
import { FormInput } from '@/components/common/FormInput';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ListBox } from '@/components/ui/list-box';
import { Subheading } from '@/components/common/Heading';
import { useProfile } from './context/useProfile';
import { useAuth } from '../../auth/useAuth';

const FieldDetailsTab = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    selectedFarm,
    selectedField,
    selectedFieldId,
    addField,
    updateField,
    deleteField,
    setSelectedFieldId,
  } = useProfile();

  // Derived fields list
  const fields = selectedFarm?.fields || [];
  const parentFarmLocation = selectedFarm?.location;

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
        units: 'acres',
        boundaryType: '',
        soilType: '',
        phLevel: '',
        irrigationMethod: '',
        coordinates: '',
      });
      setIsEditing(true);
    } else if (selectedField) {
      let coords = selectedField.coordinates || '';

      // If no explicit coordinates string, try to parse from boundary (GeoJSON)
      if (!coords && selectedField.boundary) {
        try {
          // Backend usually sends GeoJSON: { type: 'Polygon', coordinates: [[[lon, lat], ...]] }
          // Frontend LocationPicker expects: { type: 'Polygon', points: [{lat, lng}, ...] } or [[lat, lng], ...]

          if (selectedField.boundary.type === 'Polygon' && selectedField.boundary.coordinates) {
            const geoJsonCoords = selectedField.boundary.coordinates[0]; // Outer ring
            if (Array.isArray(geoJsonCoords)) {
              // Convert [lon, lat] to {lat, lng} or [lat, lng]
              const points = geoJsonCoords.map((pt: any) => {
                if (Array.isArray(pt) && pt.length >= 2) {
                  return { lat: pt[1], lng: pt[0] };
                }
                return pt;
              });

              const shapeData = {
                type: 'Polygon',
                points: points
              };
              coords = JSON.stringify(shapeData);
            }
          }
        } catch (e) {
          console.warn('Failed to parse boundary for coordinates', e);
        }
      }

      setFieldData({
        name: selectedField.name || selectedField.fieldName || '',
        description: selectedField.description || '',
        area: selectedField.area || '',
        units: selectedField.units || selectedField.unit || 'acres',
        boundaryType:
          selectedField.boundaryType || selectedField.boundary?.type || '',
        soilType: selectedField.soilType || selectedField.soil?.type || '',
        phLevel: selectedField.phLevel || selectedField.soil?.ph || '',
        irrigationMethod:
          selectedField.irrigationMethod ||
          selectedField.irrigation?.type ||
          '',
        coordinates: coords,
      });
      setIsEditing(false);
    }
  }, [selectedField, isAdding]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFieldData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!fieldData.name.trim()) newErrors.name = 'Field name is required';
    if (!fieldData.area.toString().trim()) newErrors.area = 'Area is required';
    // Soil type, boundary type might be dropdowns with defaults or empty strings.
    // If they are required:
    if (!fieldData.boundaryType.trim()) newErrors.boundaryType = 'Boundary Type is required';
    if (!fieldData.soilType.trim()) newErrors.soilType = 'Soil Type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      if (isAdding) {
        // Construct payload for creation (nested structure)
        const payload = {
          ...fieldData,
          unit: fieldData.units, // Backend often expects 'unit'
          soil: {
            type: fieldData.soilType,
            ph: fieldData.phLevel,
          },
          irrigation: {
            type: fieldData.irrigationMethod,
          },
          boundary: {
            type: fieldData.boundaryType || 'Polygon',
          },
        };
        await addField(payload);
        setIsAdding(false);
      } else if (isEditing && selectedFieldId) {
        // Construct payload for update (nested structure)
        const payload = {
          name: fieldData.name,
          description: fieldData.description,
          area: fieldData.area,
          unit: fieldData.units,
          soil: {
            type: fieldData.soilType,
            ph: fieldData.phLevel,
          },
          irrigation: {
            type: fieldData.irrigationMethod,
          },
          boundary: {
            type: fieldData.boundaryType,
          },
          coordinates: fieldData.coordinates,
        };
        await updateField(selectedFieldId, payload);
        setIsEditing(false);
      } else {
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Failed to save field:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleAddMode = () => {
    if (isAdding) {
      setIsAdding(false);
      setIsEditing(false);
    } else {
      // Requirement: Redirect new users to registration wizard if they haven't completed it
      if (!user?.isOnboardingComplete && (!fields || fields.length === 0)) {
        navigate('/register/field-details'); // Redirect to field step
        return;
      }
      setIsAdding(true);
    }
  };

  const startEditing = () => {
    if (!user?.isOnboardingComplete && (!fields || fields.length === 0)) {
      navigate('/register/field-details');
      return;
    }
    setIsEditing(true);
  };

  if (!selectedField && !isAdding) {
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
      {/* Header with Title and Add Button */}
      <div className="flex justify-between items-center mb-8">
        <Subheading className="font-bold">
          {isAdding ? 'Add New Field' : 'Field Details'}
        </Subheading>

        <div>
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
      </div>

      {/* Grid Layout: Details Card (left) + Field List (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        {/* Left: Field Details Card or Form */}
        <div>
          {!isEditing ? (
            // READ MODE - Card Display
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 max-w-md">
              {/* Header - Field Name */}
              <h3 className="text-xl font-bold text-foreground">
                {fieldData.name || 'Unnamed Field'}
              </h3>

              {/* Details Section */}
              <div className="space-y-2 text-foreground">
                <p className="text-base">
                  Area:{' '}
                  {fieldData.area ? (
                    `${fieldData.area} ${fieldData.units || 'acres'}`
                  ) : (
                    <span className="text-muted-foreground italic">
                      Not provided
                    </span>
                  )}
                </p>

                <p className="text-base">
                  Boundary:{' '}
                  {fieldData.boundaryType || (
                    <span className="text-muted-foreground italic">
                      Not provided
                    </span>
                  )}
                </p>

                <p className="text-base">
                  Soil Type:{' '}
                  {fieldData.soilType || (
                    <span className="text-muted-foreground italic">
                      Not provided
                    </span>
                  )}
                </p>

                <p className="text-base">
                  pH Level:{' '}
                  {fieldData.phLevel || (
                    <span className="text-muted-foreground italic">
                      Not provided
                    </span>
                  )}
                </p>

                <p className="text-base">
                  Irrigation:{' '}
                  {fieldData.irrigationMethod || (
                    <span className="text-muted-foreground italic">
                      Not provided
                    </span>
                  )}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-border flex gap-4">
                <Button
                  variant="link"
                  onClick={startEditing}
                  className="text-primary hover:underline font-medium p-0 h-auto"
                >
                  Edit
                </Button>
                {!isAdding && deleteField && selectedFieldId && (
                  <>
                    <span className="text-muted-foreground">|</span>
                    <Button
                      variant="link"
                      onClick={() => deleteField(selectedFieldId)}
                      className="text-destructive hover:underline font-medium p-0 h-auto"
                    >
                      Remove
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-6 max-w-4xl">
                {/* Name */}
                <div>
                  <Label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
                    Field Name
                  </Label>

                  <FormInput
                    type="text"
                    name="name"
                    value={fieldData.name || ''}
                    onChange={handleChange}
                    className="w-full font-semibold px-4 py-3 text-sm"
                    error={errors.name || ''}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Area */}
                  <div>
                    <Label className="block text-xs font-bold text-white uppercase mb-2">
                      Area
                    </Label>
                    <FormInput
                      type="text"
                      name="area"
                      value={fieldData.area ? `${fieldData.area}` : ''}
                      onChange={handleChange}
                      placeholder="Area (e.g. 5)"
                      className="w-full font-semibold px-4 py-3 text-sm"
                      error={errors.area || ''}
                    />
                  </div>
                  {/* Boundary */}
                  <div>
                    <Label className="block text-xs font-bold text-white uppercase mb-2">
                      Boundary Type
                    </Label>
                    <FormInput
                      type="text"
                      name="boundaryType"
                      value={fieldData.boundaryType || ''}
                      onChange={handleChange}
                      className="w-full font-semibold px-4 py-3 text-sm"
                      error={errors.boundaryType || ''}
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
                    readOnly={false}
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
                        } catch (e) { }
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
                      let val = sqFt;
                      if (fieldData.units === 'acres') val = sqFt / 43560;
                      else if (fieldData.units === 'hectares')
                        val = sqFt / 107639;

                      setFieldData((prev) => ({
                        ...prev,
                        area: val.toFixed(2),
                      }));
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
                      <FormInput
                        type="text"
                        name="soilType"
                        value={fieldData.soilType || ''}
                        onChange={handleChange}
                        className="w-full font-semibold px-4 py-3 text-sm"
                        error={errors.soilType || ''}
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
                      <FormInput
                        type="text"
                        name="phLevel"
                        value={fieldData.phLevel || ''}
                        onChange={handleChange}
                        className="w-full font-semibold px-4 py-3 text-sm"
                        error={errors.phLevel || ''}
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
                      <FormInput
                        type="text"
                        name="irrigationMethod"
                        value={fieldData.irrigationMethod || ''}
                        onChange={handleChange}
                        className="w-full font-semibold px-4 py-3 text-sm"
                        error={errors.irrigationMethod || ''}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions for Field Tab */}
              <div className="flex gap-3 mt-8 border-t border-border pt-6">
                <Button
                  onClick={handleSave}
                  variant="default"
                  className="w-fit rounded-xl text-xs font-bold"
                  disabled={isSaving}
                >
                  {isSaving
                    ? 'Saving...'
                    : isAdding
                      ? 'Save New Field'
                      : 'Save Changes'}
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    if (isAdding) {
                      setIsAdding(false);
                    } else if (selectedField) {
                      setFieldData({
                        name:
                          selectedField.name || selectedField.fieldName || '',
                        description: selectedField.description || '',
                        area: selectedField.area || '',
                        units: selectedField.units || 'acres',
                        boundaryType: selectedField.boundaryType || '',
                        coordinates: selectedField.coordinates || '',
                        soilType: selectedField.soilType || '',
                        phLevel: selectedField.phLevel || '',
                        irrigationMethod: selectedField.irrigationMethod || '',
                      });
                    }
                  }}
                  variant="outline"
                  className="w-fit rounded-xl text-xs font-bold"
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Right: Field List */}
        {!isAdding && fields && fields.length > 0 && (
          <div>
            <Label className="block text-[10px] uppercase font-bold text-white mb-4">
              Select Field
            </Label>
            <ListBox
              items={fields.map((f: any) => {
                const item: { id: string; label: string; subLabel?: string } = {
                  id: f.id || f._id,
                  label: f.name || f.fieldName,
                };
                if (f.area) {
                  item.subLabel = `${f.area} ${f.units || 'acres'}`;
                }
                return item;
              })}
              selectedId={
                selectedFieldId || selectedField?.id || selectedField?._id || ''
              }
              onSelect={setSelectedFieldId}
              height="h-[220px]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldDetailsTab;
