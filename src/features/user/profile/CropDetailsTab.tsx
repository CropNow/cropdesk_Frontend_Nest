import React, { useState, useEffect } from 'react';
import { Sprout, Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '@/components/common/FormInput';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Subheading } from '@/components/common/Heading';
import { ListBox } from '@/components/ui/list-box';
import { useProfile } from './context/useProfile';
import { useAuth } from '../../auth/useAuth';

const CropDetailsTab = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    selectedField,
    selectedCrop,
    selectedCropId,
    addCrop,
    updateCrop,
    deleteCrop,
    setSelectedCropId,
  } = useProfile();

  // Derived crops list
  const crops = selectedField?.crops || [];

  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    cropName: '',
    plantingDate: '',
    harvestingDate: '',
    area: '',
  });

  // Sync with prop
  useEffect(() => {
    if (isAdding) {
      setFormData({
        cropName: '',
        plantingDate: '',
        harvestingDate: '',
        area: '',
      });
      setIsEditing(true);
    } else if (selectedCrop) {
      setFormData({
        cropName: selectedCrop.cropName || selectedCrop.name || '',
        plantingDate: selectedCrop.plantingDate || '',
        harvestingDate:
          selectedCrop.harvestingDate || selectedCrop.expectedHarvestDate || '',
        area: selectedCrop.area || '',
      });
      setIsEditing(false);
    } else {
      // Reset if no crop selected
      setFormData({
        cropName: '',
        plantingDate: '',
        harvestingDate: '',
        area: '',
      });
      setIsEditing(false);
    }
  }, [selectedCrop, isAdding]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.cropName.trim()) newErrors.cropName = 'Crop name is required';
    if (!formData.plantingDate.trim())
      newErrors.plantingDate = 'Planting date is required';
    if (!formData.harvestingDate.trim())
      newErrors.harvestingDate = 'Harvesting date is required';
    if (!formData.area.toString().trim()) newErrors.area = 'Area is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        name: formData.cropName,
        expectedHarvestDate: formData.harvestingDate,
      };

      if (isAdding) {
        await addCrop(payload);
        setIsAdding(false);
      } else if (isEditing && selectedCropId) {
        await updateCrop(selectedCropId, { ...selectedCrop, ...payload });
        setIsEditing(false);
      } else {
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Failed to save crop:', error);
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
      if (!user?.isOnboardingComplete && (!crops || crops.length === 0)) {
        navigate('/register/crop-details'); // Redirect to crop step
        return;
      }
      setIsAdding(true);
    }
  };

  const startEditing = () => {
    if (!user?.isOnboardingComplete && (!crops || crops.length === 0)) {
      navigate('/register/crop-details');
      return;
    }
    setIsEditing(true);
  };

  // No Crop Selected View
  if (!selectedCrop && !isAdding) {
    return (
      <div className="bg-card border border-border rounded-3xl p-8 flex items-center justify-center min-h-[400px] flex-col gap-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No crop selected.</p>
          <Button
            className="rounded-xl font-bold flex items-center gap-2 mx-auto"
            onClick={toggleAddMode}
          >
            <Plus size={16} />
            Add New Crop
          </Button>
        </div>
      </div>
    );
  }

  // FORM VIEW (Edit or Add)
  return (
    <div className="bg-card border border-border rounded-3xl p-8">
      {/* Header with Title and Add Button */}
      <div className="flex justify-between items-center mb-8">
        <Subheading className="font-bold">
          {isAdding ? 'Add New Crop' : 'Crop Details'}
        </Subheading>

        <div>
          {!isAdding && (
            <Button
              onClick={toggleAddMode}
              size="sm"
              className="rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <Plus size={16} />
              Add Crop
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

      {/* Grid Layout: Details Card (left) + Crop List (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        {/* Left: Crop Details Card or Form */}
        <div>
          {!isEditing ? (
            // READ MODE - Card Display
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 max-w-md">
              {/* Header - Crop Name */}
              <h3 className="text-xl font-bold text-foreground">
                {formData.cropName || 'Unnamed Crop'}
              </h3>

              {/* Details Section */}
              <div className="space-y-2 text-foreground">
                <p className="text-base">
                  Planted:{' '}
                  {formData.plantingDate ? (
                    new Date(formData.plantingDate).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )
                  ) : (
                    <span className="text-muted-foreground italic">
                      Not set
                    </span>
                  )}
                </p>

                <p className="text-base">
                  Expected Harvest:{' '}
                  {formData.harvestingDate ? (
                    new Date(formData.harvestingDate).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )
                  ) : (
                    <span className="text-muted-foreground italic">
                      Not set
                    </span>
                  )}
                </p>

                <p className="text-base">
                  Area:{' '}
                  {formData.area ? (
                    `${formData.area} acres`
                  ) : (
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
                {!isAdding && deleteCrop && selectedCropId && (
                  <>
                    <span className="text-muted-foreground">|</span>
                    <Button
                      variant="link"
                      onClick={() => deleteCrop(selectedCropId)}
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
                {/* Crop Name */}
                <div>
                  <Label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
                    Crop Name
                  </Label>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-muted rounded-xl">
                      <Sprout size={18} className="text-foreground" />
                    </div>
                    <FormInput
                      type="text"
                      name="cropName"
                      value={formData.cropName}
                      onChange={handleChange}
                      className="w-full font-semibold px-4 py-3 text-sm"
                      placeholder="e.g. Wheat, Corn"
                      error={errors.cropName || ''}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Planting Date */}
                  <div>
                    <Label className="block text-xs font-bold text-white uppercase mb-2">
                      Planting Date
                    </Label>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-muted rounded-xl">
                        <Calendar size={18} className="text-foreground" />
                      </div>
                      <FormInput
                        type="date"
                        name="plantingDate"
                        value={formData.plantingDate}
                        onChange={handleChange}
                        className="w-full font-semibold px-4 py-3 text-sm"
                        error={errors.plantingDate || ''}
                      />
                    </div>
                  </div>

                  {/* Harvest Date */}
                  <div>
                    <Label className="block text-xs font-bold text-white uppercase mb-2">
                      Expected Harvest
                    </Label>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-muted rounded-xl">
                        <Calendar size={18} className="text-foreground" />
                      </div>
                      <FormInput
                        type="date"
                        name="harvestingDate"
                        value={formData.harvestingDate}
                        onChange={handleChange}
                        className="w-full font-semibold px-4 py-3 text-sm"
                        error={errors.harvestingDate || ''}
                      />
                    </div>
                  </div>
                </div>

                {/* Area */}
                <div>
                  <Label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
                    Cultivation Area (Acres)
                  </Label>
                  <FormInput
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    className="w-full font-semibold px-4 py-3 text-sm"
                    error={errors.area || ''}
                  />
                </div>
              </div>

              {/* Actions */}
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
                      ? 'Save New Crop'
                      : 'Save Changes'}
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    if (isAdding) {
                      setIsAdding(false);
                    } else if (selectedCrop) {
                      setFormData({
                        cropName: selectedCrop.cropName || '',
                        plantingDate: selectedCrop.plantingDate || '',
                        harvestingDate: selectedCrop.harvestingDate || '',
                        area: selectedCrop.area || '',
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

        {/* Right: Crop List */}
        {!isAdding && crops && crops.length > 0 && (
          <div>
            <Label className="block text-[10px] uppercase font-bold text-white mb-4">
              Select Crop
            </Label>
            <ListBox
              items={crops.map((c: any) => {
                const item: { id: string; label: string; subLabel?: string } = {
                  id: c.id || c._id,
                  label: c.cropName || c.name || 'Unnamed Crop',
                };
                if (c.plantingDate) {
                  item.subLabel = `Planted: ${c.plantingDate}`;
                }
                return item;
              })}
              selectedId={
                selectedCropId || selectedCrop?.id || selectedCrop?._id || ''
              }
              onSelect={setSelectedCropId}
              height="h-[220px]"
            />
          </div>
        )}
      </div>
    </div>
  );
};
//crop details tab
export default CropDetailsTab;
