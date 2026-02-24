import React, { useState, useEffect } from 'react';
import { Map, Ruler, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LocationPicker from '@/components/common/LocationPicker';
import { FormInput } from '@/components/common/FormInput';
import { FormTextarea } from '@/components/common/FormTextarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Subheading } from '@/components/common/Heading';
import { ListBox } from '@/components/ui/list-box';
import { useProfile } from './context/useProfile';
import { useAuth } from '../../auth/useAuth';

const FarmDetailsTab = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    selectedFarmer,
    selectedFarm,
    selectedFarmId,
    addFarm,
    updateFarm,
    deleteFarm,
    setSelectedFarmId,
  } = useProfile();

  // Derived farms list from context
  const farms = selectedFarmer?.farms || [];

  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [farmData, setFarmData] = useState({
    name: '',
    description: '',
    area: '',
    unit: 'acres',
    soilType: 'loamy',
    irrigationType: 'drip',
    farmingType: 'conventional',
    location: {
      address: '',
      city: '',
      state: '',
      country: 'India',
      zipCode: '',
    },
  });

  useEffect(() => {
    if (isAdding) {
      setFarmData({
        name: '',
        description: '',
        area: '',
        unit: 'acres',
        soilType: 'loamy',
        irrigationType: 'drip',
        farmingType: 'conventional',
        location: {
          address: '',
          city: '',
          state: '',
          country: 'India',
          zipCode: '',
        },
      });
      setIsEditing(true);
    } else if (selectedFarm) {
      setFarmData({
        name: selectedFarm.name || selectedFarm.farmName || '',
        description: selectedFarm.description || '',
        area: selectedFarm.area || '',
        unit: selectedFarm.unit || selectedFarm.units || 'acres',
        soilType: selectedFarm.soilType || 'loamy',
        irrigationType: selectedFarm.irrigationType || 'drip',
        farmingType: selectedFarm.farmingType || 'conventional',
        location: {
          address: selectedFarm.location?.address || '',
          city: selectedFarm.location?.city || '',
          state: selectedFarm.location?.state || '',
          country: selectedFarm.location?.country || '',
          zipCode: selectedFarm.location?.zipCode || '',
        },
      });
      setIsEditing(false);
    }
  }, [selectedFarm, isAdding]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!farmData.name.trim()) newErrors.name = 'Farm name is required';
    if (!farmData.area.toString().trim()) newErrors.area = 'Area is required';
    if (!farmData.location.address.trim())
      newErrors.address = 'Address is required';
    if (!farmData.location.city.trim()) newErrors.city = 'City is required';
    if (!farmData.location.country.trim())
      newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFarmData((prev) => {
      if (name.startsWith('location.')) {
        const child = name.split('.')[1] as keyof typeof prev.location;
        return {
          ...prev,
          location: {
            ...prev.location,
            [child]: value,
          },
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
    // Clear error for the changed field
    if (name.startsWith('location.')) {
      const errorKey = name.split('.')[1];
      if (errorKey && errors[errorKey])
        setErrors((prev) => ({ ...prev, [errorKey]: '' }));
    } else if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      if (isAdding) {
        await addFarm(farmData);
        setIsAdding(false);
      } else if (isEditing && selectedFarmId) {
        await updateFarm(selectedFarmId, { ...selectedFarm, ...farmData });
        setIsEditing(false);
      } else {
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Failed to save farm:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleAddMode = () => {
    if (isAdding) {
      setIsAdding(false);
      setIsEditing(false);
      setErrors({}); // Clear errors when canceling add mode
    } else {
      // Requirement: Redirect new users to registration wizard if they haven't completed it
      if (!user?.isOnboardingComplete && (!farms || farms.length === 0)) {
        navigate('/register/farm-details'); // Redirect to farm step
        return;
      }
      setIsAdding(true);
      setErrors({}); // Clear errors when starting add mode
    }
  };

  const startEditing = () => {
    if (!user?.isOnboardingComplete && (!farms || farms.length === 0)) {
      navigate('/register/farm-details');
      return;
    }
    setIsEditing(true);
    setErrors({}); // Clear errors when starting edit mode
  };

  // Show "No Farm Selected" only if NOT adding AND no farm
  if (!selectedFarm && !isAdding) {
    return (
      <div className="bg-card border border-border rounded-3xl p-8 flex items-center justify-center min-h-[400px] flex-col gap-4">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No farm selected.</p>
          <Button
            className="rounded-xl font-bold flex items-center gap-2 mx-auto"
            onClick={toggleAddMode}
          >
            <Plus size={16} />
            Add New Farm
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
          {isAdding ? 'Add New Farm' : 'Farm Details'}
        </Subheading>

        <div>
          {!isAdding && (
            <Button
              onClick={toggleAddMode}
              size="sm"
              className="rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <Plus size={16} />
              Add Farm
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

      {/* Grid Layout: Details Card (left) + Farm List (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        {/* Left: Farm Details Card or Form */}
        <div>
          {!isEditing ? (
            // READ MODE - Card Display
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 max-w-md">
              {/* Header - Farm Name */}
              <h3 className="text-xl font-bold text-foreground">
                {farmData.name || 'Unnamed Farm'}
              </h3>

              {/* Details Section */}
              <div className="space-y-2 text-foreground">
                <p className="text-base text-muted-foreground">
                  {farmData.description || (
                    <span className="italic">No description provided</span>
                  )}
                </p>

                <p className="text-base">
                  Area:{' '}
                  {farmData.area ? (
                    `${farmData.area} acres`
                  ) : (
                    <span className="text-muted-foreground italic">
                      Not provided
                    </span>
                  )}
                </p>

                <p className="text-base">
                  Location:{' '}
                  {farmData.location?.address || (
                    <span className="text-muted-foreground italic">
                      Not provided
                    </span>
                  )}
                </p>

                <p className="text-base">
                  {farmData.location?.city || farmData.location?.country ? (
                    [farmData.location.city, farmData.location.country]
                      .filter(Boolean)
                      .join(', ')
                  ) : (
                    <span className="text-muted-foreground italic">
                      City/Country not provided
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
                {!isAdding && deleteFarm && selectedFarmId && (
                  <>
                    <span className="text-muted-foreground">|</span>
                    <Button
                      variant="link"
                      onClick={() => deleteFarm(selectedFarmId)}
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
                {/* Farm Name */}
                {/* Farm Name */}
                <div>
                  <Label className="block text-xs font-bold text-white uppercase mb-2">
                    Farm Name
                  </Label>
                  <FormInput
                    type="text"
                    name="name"
                    value={farmData.name || ''}
                    onChange={(e) => {
                      setFarmData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }));
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    className="w-full font-semibold px-4 py-3 text-sm"
                    error={errors.name || ''}
                  />
                </div>

                {/* Description */}
                <div>
                  <Label className="block text-xs font-bold text-white uppercase mb-2">
                    Description
                  </Label>
                  <FormTextarea
                    name="description"
                    value={farmData.description || ''}
                    onChange={handleChange}
                    className="w-full font-semibold px-4 py-3 text-sm resize-none h-20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Size */}
                  <div>
                    <Label className="block text-xs font-bold text-white uppercase mb-2">
                      Total Area
                    </Label>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-muted rounded-xl">
                        <Ruler size={18} className="text-foreground" />
                      </div>
                      <FormInput
                        type="text"
                        name="area"
                        value={farmData.area ? `${farmData.area}` : ''}
                        onChange={(e) => {
                          setFarmData((prev) => ({
                            ...prev,
                            area: e.target.value,
                          }));
                          if (errors.area) setErrors({ ...errors, area: '' });
                        }}
                        placeholder="Area (e.g. 10)"
                        className="w-full font-semibold px-4 py-3 text-sm"
                        error={errors.area || ''}
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-border my-2" />
                <h3 className="text-sm font-bold text-white uppercase">
                  Location
                </h3>

                {/* Location Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="block text-xs font-bold text-white uppercase mb-2">
                      Address / Landmark
                    </Label>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-muted rounded-xl">
                        <Map size={18} className="text-foreground" />
                      </div>
                      <FormInput
                        type="text"
                        name="location.address"
                        value={farmData.location?.address || ''}
                        onChange={(e) => {
                          setFarmData((prev) => ({
                            ...prev,
                            location: {
                              ...prev.location,
                              address: e.target.value,
                            },
                          }));
                          if (errors.address)
                            setErrors({ ...errors, address: '' });
                        }}
                        className="w-full font-semibold px-4 py-3 text-sm"
                        error={errors.address || ''}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="block text-xs font-bold text-white uppercase mb-2">
                      City
                    </Label>
                    <FormInput
                      type="text"
                      name="location.city"
                      value={farmData.location?.city || ''}
                      onChange={(e) => {
                        setFarmData((prev) => ({
                          ...prev,
                          location: { ...prev.location, city: e.target.value },
                        }));
                        if (errors.city) setErrors({ ...errors, city: '' });
                      }}
                      className="w-full font-semibold px-4 py-3 text-sm"
                      error={errors.city || ''}
                    />
                  </div>
                  <div>
                    <Label className="block text-xs font-bold text-white uppercase mb-2">
                      Country
                    </Label>
                    <FormInput
                      type="text"
                      name="location.country"
                      value={farmData.location?.country || ''}
                      onChange={(e) => {
                        setFarmData((prev) => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            country: e.target.value,
                          },
                        }));
                        if (errors.country)
                          setErrors({ ...errors, country: '' });
                      }}
                      className="w-full font-semibold px-4 py-3 text-sm"
                      error={errors.country || ''}
                    />
                  </div>
                  <div>
                    <Label className="block text-xs font-bold text-white uppercase mb-2">
                      Zip Code
                    </Label>
                    <FormInput
                      type="text"
                      name="location.zipCode"
                      value={farmData.location?.zipCode || ''}
                      onChange={(e) => {
                        setFarmData((prev) => ({
                          ...prev,
                          location: {
                            ...prev.location,
                            zipCode: e.target.value,
                          },
                        }));
                      }}
                      className="w-full font-semibold px-4 py-3 text-sm"
                    />
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label className="block text-xs font-bold text-white uppercase mb-2">
                      Soil Type
                    </Label>
                    <FormInput
                      type="text"
                      name="soilType"
                      value={farmData.soilType}
                      onChange={handleChange}
                      placeholder="e.g. loamy"
                      className="w-full font-semibold px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs font-bold text-white uppercase mb-2">
                      Irrigation Type
                    </Label>
                    <FormInput
                      type="text"
                      name="irrigationType"
                      value={farmData.irrigationType}
                      onChange={handleChange}
                      placeholder="e.g. drip"
                      className="w-full font-semibold px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs font-bold text-white uppercase mb-2">
                      Farming Type
                    </Label>
                    <FormInput
                      type="text"
                      name="farmingType"
                      value={farmData.farmingType}
                      onChange={handleChange}
                      placeholder="e.g. organic"
                      className="w-full font-semibold px-4 py-3 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
                  Location Helper (Auto-fill)
                </Label>
                <div className="mb-4">
                  <LocationPicker
                    mode="point"
                    readOnly={false}
                    value=""
                    onChange={() => {}} // No longer storing specific lat/lng in state
                    onLocationDataChange={(data) => {
                      setFarmData((prev) => ({
                        ...prev,
                        location: {
                          ...prev.location,
                          address: data.address || prev.location.address || '',
                          city: data.city || prev.location.city || '',
                          country: data.country || prev.location.country || '',
                        },
                      }));
                    }}
                    height="300px"
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border flex gap-3">
                <Button
                  onClick={handleSave}
                  variant="default"
                  className="w-fit rounded-xl text-xs font-bold"
                  disabled={isSaving}
                >
                  {isSaving
                    ? 'Saving...'
                    : isAdding
                      ? 'Save New Farm'
                      : 'Save Changes'}
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    if (isAdding) {
                      setIsAdding(false);
                      setFarmData({
                        name: selectedFarm.name || selectedFarm.farmName || '',
                        description: selectedFarm.description || '',
                        area: selectedFarm.area || '',
                        unit:
                          selectedFarm.unit || selectedFarm.units || 'acres',
                        soilType: selectedFarm.soilType || 'loamy',
                        irrigationType: selectedFarm.irrigationType || 'drip',
                        farmingType: selectedFarm.farmingType || 'conventional',
                        location: {
                          address: selectedFarm.location?.address || '',
                          city: selectedFarm.location?.city || '',
                          state: selectedFarm.location?.state || '',
                          country: selectedFarm.location?.country || '',
                          zipCode: selectedFarm.location?.zipCode || '',
                        },
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

        {/* Right: Farm List */}
        {!isAdding && farms && farms.length > 0 && (
          <div>
            <Label className="block text-[10px] uppercase font-bold text-white mb-4">
              Select Farm
            </Label>
            <ListBox
              items={farms.map((f: any) => ({
                id: f.id || f._id,
                label: f.name || f.farmName,
                subLabel:
                  (typeof f.location === 'object'
                    ? f.location?.city || f.location?.address
                    : f.location) || '',
              }))}
              selectedId={
                selectedFarmId || selectedFarm?.id || selectedFarm?._id || ''
              }
              onSelect={setSelectedFarmId}
              height="h-[220px]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmDetailsTab;
