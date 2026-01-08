import React, { useState, useEffect } from 'react';
import { Sprout, Calendar } from 'lucide-react';

const CropDetailsTab = () => {
  const [cropData, setCropData] = useState({
    cropName: '',
    plantingDate: '',
    harvestingDate: '',
    area: '',
  });

  useEffect(() => {
    const storedUserStr = localStorage.getItem('registeredUser');
    if (storedUserStr) {
      try {
        const user = JSON.parse(storedUserStr);
        if (user.cropDetails) {
          setCropData((prev) => ({
            ...prev,
            ...user.cropDetails,
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
        <h2 className="text-xl font-bold text-foreground">Crop Details</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Current season crops
        </p>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Crop Name */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
            Crop Name
          </label>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-muted rounded-xl">
              <Sprout size={18} className="text-foreground" />
            </div>
            <input
              type="text"
              value={cropData.cropName || ''}
              readOnly
              className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none cursor-default"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Planting Date */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              Planting Date
            </label>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-muted rounded-xl">
                <Calendar size={18} className="text-foreground" />
              </div>
              <input
                type="date"
                value={cropData.plantingDate || ''}
                readOnly
                className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none cursor-default"
              />
            </div>
          </div>

          {/* Harvest Date */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              Expected Harvest
            </label>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-muted rounded-xl">
                <Calendar size={18} className="text-foreground" />
              </div>
              <input
                type="date"
                value={cropData.harvestingDate || ''}
                readOnly
                className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none cursor-default"
              />
            </div>
          </div>
        </div>

        {/* Area */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
            Cultivation Area (Acres)
          </label>
          <input
            type="text"
            value={cropData.area || ''}
            readOnly
            className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none cursor-default"
          />
        </div>
      </div>
    </div>
  );
};

export default CropDetailsTab;
