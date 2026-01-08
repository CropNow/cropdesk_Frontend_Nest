import React, { useState, useEffect } from 'react';
import { Layers, Droplets, FlaskConical } from 'lucide-react';

const FieldDetailsTab = () => {
  const [fieldData, setFieldData] = useState({
    fieldName: '',
    description: '',
    area: '',
    units: '',
    boundaryType: '',
    soilType: '',
    phLevel: '',
    irrigationMethod: '',
  });

  useEffect(() => {
    const storedUserStr = localStorage.getItem('registeredUser');
    if (storedUserStr) {
      try {
        const user = JSON.parse(storedUserStr);
        if (user.fieldDetails) {
          setFieldData((prev) => ({
            ...prev,
            ...user.fieldDetails,
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
        <h2 className="text-xl font-bold text-foreground">Field Details</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Specific field information
        </p>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Name */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
            Field Name
          </label>
          <input
            type="text"
            value={fieldData.fieldName || ''}
            readOnly
            className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none cursor-default"
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
              value={
                fieldData.area
                  ? `${fieldData.area} ${fieldData.units || ''}`
                  : ''
              }
              readOnly
              className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none cursor-default"
            />
          </div>
          {/* Boundary */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              Boundary Type
            </label>
            <input
              type="text"
              value={fieldData.boundaryType || ''}
              readOnly
              className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none cursor-default"
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
                value={fieldData.soilType || ''}
                readOnly
                className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none cursor-default"
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
                value={fieldData.phLevel || ''}
                readOnly
                className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none cursor-default"
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
                value={fieldData.irrigationMethod || ''}
                readOnly
                className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none cursor-default"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldDetailsTab;
