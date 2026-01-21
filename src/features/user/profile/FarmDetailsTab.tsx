import React, { useState, useEffect } from 'react';
import { Map, Ruler, LocateFixed, ChevronDown } from 'lucide-react';

const FarmDetailsTab = ({
  farm,
  farms,
  selectedFarmId,
  onSelectFarm,
  onUpdate,
  onDelete,
}: {
  farm: any;
  farms?: any[];
  selectedFarmId?: string;
  onSelectFarm?: (id: string) => void;
  onUpdate: (data: any) => void;
  onDelete: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
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
    if (farm) {
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
    }
  }, [farm]);

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
    if (isEditing) {
      onUpdate({ ...farm, ...farmData });
    }
    setIsEditing(!isEditing);
  };

  if (!farm) {
    return (
      <div className="bg-card border border-border rounded-3xl p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No farm selected.</p>
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
          <h2 className="text-xl font-bold text-foreground">Farm Details</h2>
          <p className="text-sm text-muted-foreground mt-1">
            General farm information
          </p>
        </div>

        {/* Farm Selection Dropdown */}
        {farms && farms.length > 0 && onSelectFarm && (
          <div className="relative">
            <select
              value={selectedFarmId}
              onChange={(e) => onSelectFarm(e.target.value)}
              className="appearance-none bg-secondary/50 border border-border rounded-xl px-4 py-2 pr-10 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 cursor-pointer min-w-[200px]"
            >
              {farms.map((f) => (
                <option
                  key={f.id}
                  value={f.id}
                  className="bg-card text-foreground"
                >
                  {f.name || f.farmName || 'Unnamed Farm'}
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
        {/* Farm Name */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
            Farm Name
          </label>
          <input
            type="text"
            name="name"
            value={farmData.name || ''}
            readOnly={!isEditing}
            onChange={handleChange}
            className={`w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : 'focus:ring-2 focus:ring-green-500/50'}`}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={farmData.description || ''}
            readOnly={!isEditing}
            onChange={handleChange}
            className={`w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none resize-none h-20 ${!isEditing ? 'cursor-default' : 'focus:ring-2 focus:ring-green-500/50'}`}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Size */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              Total Area
            </label>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-muted rounded-xl">
                <Ruler size={18} className="text-foreground" />
              </div>
              <input
                type="text"
                name="area"
                value={farmData.area ? `${farmData.area}` : ''}
                readOnly={!isEditing}
                onChange={handleChange}
                placeholder={!isEditing ? '' : 'Area (e.g. 10)'}
                className={`w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : 'focus:ring-2 focus:ring-green-500/50'}`}
              />
            </div>
          </div>
        </div>

        <hr className="border-border my-2" />
        <h3 className="text-sm font-bold text-muted-foreground uppercase">
          Location
        </h3>

        {/* Location Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              Address / Landmark
            </label>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-muted rounded-xl">
                <Map size={18} className="text-foreground" />
              </div>
              <input
                type="text"
                name="location.address"
                value={farmData.location?.address || ''}
                readOnly={!isEditing}
                onChange={handleChange}
                className={`w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : 'focus:ring-2 focus:ring-green-500/50'}`}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              City
            </label>
            <input
              type="text"
              name="location.city"
              value={farmData.location?.city || ''}
              readOnly={!isEditing}
              onChange={handleChange}
              className={`w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : 'focus:ring-2 focus:ring-green-500/50'}`}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              Country
            </label>
            <input
              type="text"
              name="location.country"
              value={farmData.location?.country || ''}
              readOnly={!isEditing}
              onChange={handleChange}
              className={`w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : 'focus:ring-2 focus:ring-green-500/50'}`}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
          GPS Coordinates (Lat / Long)
        </label>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-muted rounded-xl">
            <LocateFixed size={18} className="text-foreground" />
          </div>
          <input
            type="text"
            name="location.latitude"
            placeholder="Latitude"
            value={farmData.location?.latitude || ''}
            readOnly={!isEditing}
            onChange={handleChange}
            className={`w-1/2 bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none font-mono ${!isEditing ? 'cursor-default' : 'focus:ring-2 focus:ring-green-500/50'}`}
          />
          <input
            type="text"
            name="location.longitude"
            placeholder="Longitude"
            value={farmData.location?.longitude || ''}
            readOnly={!isEditing}
            onChange={handleChange}
            className={`w-1/2 bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none font-mono ${!isEditing ? 'cursor-default' : 'focus:ring-2 focus:ring-green-500/50'}`}
          />
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-border flex gap-3">
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
          Delete Farm
        </button>
      </div>
    </div>
  );
};

export default FarmDetailsTab;
