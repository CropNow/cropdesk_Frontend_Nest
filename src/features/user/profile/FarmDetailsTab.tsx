import React, { useState, useEffect } from 'react';
import { Map, Ruler, LocateFixed } from 'lucide-react';

const FarmDetailsTab = () => {
  const [farmData, setFarmData] = useState({
    farmName: '',
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
    const storedUserStr = localStorage.getItem('registeredUser');
    if (storedUserStr) {
      try {
        const user = JSON.parse(storedUserStr);
        if (user.farmDetails) {
          setFarmData((prev) => ({
            ...prev,
            ...user.farmDetails,
          }));
        }
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
  }, []);

  return (
    <div className="bg-card border border-border rounded-3xl p-8">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground">Farm Details</h2>
        <p className="text-sm text-muted-foreground mt-1">
          General farm information
        </p>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Farm Name */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
            Farm Name
          </label>
          <input
            type="text"
            value={farmData.farmName || ''}
            readOnly
            className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none cursor-default"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
            Description
          </label>
          <textarea
            value={farmData.description || ''}
            readOnly
            className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none cursor-default resize-none h-20"
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
                value={
                  farmData.area
                    ? `${farmData.area} ${farmData.units || ''}`
                    : ''
                }
                readOnly
                className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none cursor-default"
              />
            </div>
          </div>
        </div>

        <hr className="border-border my-2" />
        <h3 className="text-sm font-bold text-muted-foreground uppercase">
          Location
        </h3>

        {/* Location */}
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
                value={farmData.location?.address || ''}
                readOnly
                className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none cursor-default"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              City & Country
            </label>
            <input
              type="text"
              value={
                farmData.location?.city
                  ? `${farmData.location.city}, ${farmData.location.country || ''}`
                  : ''
              }
              readOnly
              className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none cursor-default"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
            GPS Coordinates
          </label>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-muted rounded-xl">
              <LocateFixed size={18} className="text-foreground" />
            </div>
            <input
              type="text"
              value={
                farmData.location?.latitude
                  ? `${farmData.location.latitude}, ${farmData.location.longitude}`
                  : ''
              }
              readOnly
              className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none cursor-default font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmDetailsTab;
