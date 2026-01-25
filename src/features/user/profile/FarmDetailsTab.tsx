import React, { useState, useEffect } from 'react';
import { Map, Ruler, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LocationPicker from '@/components/common/LocationPicker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
    units: '',
    location: {
      address: '',
      city: '',
      country: '',
      latitude: '',
      longitude: '',
    },
  });

  useEffect(() => {
    if (isAdding) {
      setFarmData({
        name: '',
        description: '',
        area: '',
        units: 'acres',
        location: {
          address: '',
          city: '',
          country: '',
          latitude: '',
          longitude: '',
        },
      });
      setIsEditing(true);
    } else if (selectedFarm) {
      let loc: any = {
        address: '',
        city: '',
        country: '',
        latitude: '',
        longitude: '',
      };
      if (selectedFarm.location && typeof selectedFarm.location === 'object') {
        loc = {
          address: selectedFarm.location.address || '',
          city: selectedFarm.location.city || '',
          country: selectedFarm.location.country || '',
          latitude: selectedFarm.location.latitude || '',
          longitude: selectedFarm.location.longitude || '',
        };
      } else if (typeof selectedFarm.location === 'string') {
        try {
          const parsed = JSON.parse(selectedFarm.location);
          if (typeof parsed === 'object' && parsed !== null) {
            loc = {
              address: parsed.address || '',
              city: parsed.city || '',
              country: parsed.country || '',
              latitude: parsed.latitude || '',
              longitude: parsed.longitude || '',
            };
          } else {
            loc.address = selectedFarm.location;
          }
        } catch (e) {
          loc.address = selectedFarm.location;
        }
      }

      setFarmData({
        name: selectedFarm.name || selectedFarm.farmName || '',
        description: selectedFarm.description || '',
        area: selectedFarm.area || '',
        units: selectedFarm.units || '',
        location: loc,
      });
      setIsEditing(false);
    }
  }, [selectedFarm, isAdding]);

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
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
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
    } else {
      // Requirement: Redirect new users to registration wizard if they haven't completed it
      if (!user?.isOnboardingComplete && (!farms || farms.length === 0)) {
        navigate('/register/farm-details'); // Redirect to farm step
        return;
      }
      setIsAdding(true);
    }
  };

  const startEditing = () => {
    if (!user?.isOnboardingComplete && (!farms || farms.length === 0)) {
      navigate('/register/farm-details');
      return;
    }
    setIsEditing(true);
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
                <div>
                  <Label className="block text-xs font-bold text-white uppercase mb-2">
                    Farm Name
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    value={farmData.name || ''}
                    onChange={handleChange}
                    className="w-full font-semibold px-4 py-3 text-sm"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label className="block text-xs font-bold text-white uppercase mb-2">
                    Description
                  </Label>
                  <Textarea
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
                      <Input
                        type="text"
                        name="area"
                        value={farmData.area ? `${farmData.area}` : ''}
                        onChange={handleChange}
                        placeholder="Area (e.g. 10)"
                        className="w-full font-semibold px-4 py-3 text-sm"
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
                      <Input
                        type="text"
                        name="location.address"
                        value={farmData.location?.address || ''}
                        onChange={handleChange}
                        className="w-full font-semibold px-4 py-3 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="block text-xs font-bold text-white uppercase mb-2">
                      City
                    </Label>
                    <Input
                      type="text"
                      name="location.city"
                      value={farmData.location?.city || ''}
                      onChange={handleChange}
                      className="w-full font-semibold px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="block text-xs font-bold text-white uppercase mb-2">
                      Country
                    </Label>
                    <Input
                      type="text"
                      name="location.country"
                      value={farmData.location?.country || ''}
                      onChange={handleChange}
                      className="w-full font-semibold px-4 py-3 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
                  GPS Coordinates (Lat / Long)
                </Label>
                <div className="mb-4">
                  <LocationPicker
                    mode="point"
                    readOnly={false}
                    value={
                      farmData.location?.latitude &&
                      farmData.location?.longitude
                        ? `${farmData.location.latitude}, ${farmData.location.longitude}`
                        : ''
                    }
                    onChange={(val: string) => {
                      const [lat, lng] = val.split(',').map((s) => s.trim());
                      setFarmData((prev) => ({
                        ...prev,
                        location: {
                          ...prev.location,
                          latitude: lat || '',
                          longitude: lng || '',
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
                    } else if (selectedFarm) {
                      let loc: any = {
                        address: '',
                        city: '',
                        country: '',
                        latitude: '',
                        longitude: '',
                      };
                      if (
                        selectedFarm.location &&
                        typeof selectedFarm.location === 'object'
                      ) {
                        loc = {
                          address: selectedFarm.location.address || '',
                          city: selectedFarm.location.city || '',
                          country: selectedFarm.location.country || '',
                          latitude: selectedFarm.location.latitude || '',
                          longitude: selectedFarm.location.longitude || '',
                        };
                      }
                      setFarmData({
                        name: selectedFarm.name || selectedFarm.farmName || '',
                        description: selectedFarm.description || '',
                        area: selectedFarm.area || '',
                        units: selectedFarm.units || 'acres',
                        location: loc,
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
