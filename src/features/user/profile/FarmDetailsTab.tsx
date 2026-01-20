import React, { useState, useEffect } from 'react';
import { Map, Ruler, LocateFixed, Plus } from 'lucide-react';
import LocationPicker from '@/components/common/LocationPicker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Subheading } from '@/components/common/Heading';
import { Dropdown } from '@/components/ui/dropdown';

const FarmDetailsTab = ({
  farm,
  farms,
  onSelectFarm,
  onAdd,
  onUpdate,
  onDelete,
}: {
  farm: any;
  farms: any[];
  onSelectFarm: (id: string) => void;
  onAdd: (data: any) => void;
  onUpdate: (data: any) => void;
  onDelete: () => void;
}) => {
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
        units: '',
        location: {
          address: '',
          city: '',
          country: '',
          latitude: '',
          longitude: '',
        },
      });
      setIsEditing(true);
    } else if (farm) {
      setFarmData({
        name: farm.name || farm.farmName || '',
        description: farm.description || '',
        area: farm.area || '',
        units: farm.units || '',
        location: {
          address: farm.location?.address || '',
          city: farm.location?.city || '',
          country: farm.location?.country || '',
          latitude: farm.location?.latitude || '',
          longitude: farm.location?.longitude || '',
        },
      });
      setIsEditing(false);
    }
  }, [farm, isAdding]);

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

  const handleSave = () => {
    if (isAdding) {
      onAdd(farmData);
      setIsAdding(false);
    } else if (isEditing) {
      onUpdate({ ...farm, ...farmData });
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

  // Show "No Farm Selected" only if NOT adding AND no farm
  if (!farm && !isAdding) {
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
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4 md:gap-0">
        <div>
          <Subheading className="font-bold">
            {isAdding ? 'Add New Farm' : 'Farm Details'}
          </Subheading>
        </div>

        {/* Farm Selector */}
        {!isAdding && farms && farms.length > 0 && onSelectFarm && (
          <div className="flex-1 w-full md:w-auto mx-0 md:mx-8">
            <Label className="block text-[10px] uppercase font-bold text-white mb-1">
              Select Farm
            </Label>
            <Dropdown
              className="w-full md:w-fit min-w-[200px] bg-zinc-900 text-white border border-zinc-700 rounded-xl font-bold px-4 py-2 text-sm focus:outline-none cursor-pointer [&>option]:bg-zinc-800 [&>option]:text-white"
              value={farm?.id || ''}
              onChange={(e) => onSelectFarm(e.target.value)}
            >
              {farms.map((f) => (
                <option
                  key={f.id}
                  value={f.id}
                  className="bg-zinc-800 text-white"
                >
                  {f.name}
                </option>
              ))}
            </Dropdown>
          </div>
        )}

        <div className="w-full md:w-auto flex justify-end">
          {!isAdding && (
            <Button
              onClick={toggleAddMode}
              size="sm"
              className="rounded-xl text-xs font-bold flex items-center gap-2 w-full md:w-auto justify-center"
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
              className="rounded-xl text-xs font-bold w-full md:w-auto"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

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
            readOnly={!isEditing}
            onChange={handleChange}
            className={`w-full font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : ''}`}
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
            readOnly={!isEditing}
            onChange={handleChange}
            className={`w-full font-semibold px-4 py-3 text-sm focus:outline-none resize-none h-20 ${!isEditing ? 'cursor-default' : ''}`}
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
                readOnly={!isEditing}
                onChange={handleChange}
                placeholder={!isEditing ? '' : 'Area (e.g. 10)'}
                className={`w-full font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : ''}`}
              />
            </div>
          </div>
        </div>

        <hr className="border-border my-2" />
        <h3 className="text-sm font-bold text-white uppercase">Location</h3>

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
                readOnly={!isEditing}
                onChange={handleChange}
                className={`w-full font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : ''}`}
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
              readOnly={!isEditing}
              onChange={handleChange}
              className={`w-full font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : ''}`}
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
              readOnly={!isEditing}
              onChange={handleChange}
              className={`w-full font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : ''}`}
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
            readOnly={!isEditing}
            value={
              farmData.location?.latitude && farmData.location?.longitude
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
          variant={isEditing ? 'default' : 'secondary'}
          className="w-fit rounded-xl text-xs font-bold"
        >
          {isAdding
            ? 'Save New Farm'
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
            Delete Farm
          </Button>
        )}
      </div>
    </div>
  );
};

export default FarmDetailsTab;
