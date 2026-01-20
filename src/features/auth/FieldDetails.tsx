import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { convertAreaToSqFt } from '@/utils/unitConversion';
import { isLocationValid } from '@/utils/geoUtils';
import LocationPicker from '@/components/common/LocationPicker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dropdown } from '@/components/ui/dropdown';

const FieldDetails = () => {
  const navigate = useNavigate();
  const [fieldData, setFieldData] = useState(() => {
    const tempStr = localStorage.getItem('tempRegistrationData');
    if (tempStr) {
      try {
        const tempData = JSON.parse(tempStr);
        if (tempData.fieldDetails) {
          return tempData.fieldDetails;
        }
      } catch (e) {
        console.error('Error parsing temp data', e);
      }
    }
    const sessionStr = localStorage.getItem('user');
    if (sessionStr) {
      try {
        const sessionUser = JSON.parse(sessionStr);
        const collectionStr = localStorage.getItem('app_users'); // STORAGE_KEYS.USERS_COLLECTION
        if (collectionStr && sessionUser.email) {
          const collection = JSON.parse(collectionStr);
          const user = collection[sessionUser.email.toLowerCase()];
          if (user && user.fieldDetails) return user.fieldDetails;
        }

        if (sessionUser.fieldDetails) return sessionUser.fieldDetails;
      } catch (e) {
        console.error('Error loading stored user', e);
      }
    }
    return {
      fieldName: '',
      description: '',
      area: '',
      units: 'acres',
      boundaryType: 'Polygon',
      coordinates: '',
      soilType: 'Loamy',
      phLevel: '',
      irrigationMethod: 'Drip',
    };
  });

  useEffect(() => {
    const tempStr = localStorage.getItem('tempRegistrationData');
    const tempData = tempStr ? JSON.parse(tempStr) : {};

    if (JSON.stringify(tempData.fieldDetails) !== JSON.stringify(fieldData)) {
      const updatedTemp = {
        ...tempData,
        fieldDetails: fieldData,
      };
      localStorage.setItem('tempRegistrationData', JSON.stringify(updatedTemp));
    }
  }, [fieldData]);

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFieldData((prev: any) => ({
            ...prev,
            coordinates: `${position.coords.latitude}, ${position.coords.longitude}`,
          }));
        },
        (error) => {
          console.error('Error detecting location', error);
          alert('Unable to retrieve your location.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Field Details Submitting:', fieldData);

    try {
      // Validation against Farm Details
      const tempStr = localStorage.getItem('tempRegistrationData');
      if (tempStr) {
        let tempData: any = {};
        try {
          tempData = JSON.parse(tempStr);
        } catch (jsonErr) {
          console.error(
            'Error parsing tempRegistrationData during validation',
            jsonErr
          );
        }

        const farmDetails = tempData.farmDetails;

        if (farmDetails && farmDetails.area && farmDetails.units) {
          try {
            const farmAreaSqFt = convertAreaToSqFt(
              parseFloat(farmDetails.area),
              farmDetails.units
            );
            const fieldAreaSqFt = convertAreaToSqFt(
              parseFloat(fieldData.area),
              fieldData.units
            );

            console.log(
              `Validation: Farm ${farmAreaSqFt} sqft vs Field ${fieldAreaSqFt} sqft`
            );

            if (
              !isNaN(farmAreaSqFt) &&
              !isNaN(fieldAreaSqFt) &&
              fieldAreaSqFt > farmAreaSqFt
            ) {
              alert(
                `Field area (${fieldData.area} ${fieldData.units}) cannot exceed the total Farm area (${farmDetails.area} ${farmDetails.units})!`
              );
              return; // Stop execution
            }

            // Validate Location Distance
            if (
              farmDetails.location &&
              farmDetails.location.latitude &&
              farmDetails.location.longitude &&
              fieldData.coordinates
            ) {
              const locValidation = isLocationValid(
                farmDetails.location.latitude,
                farmDetails.location.longitude,
                fieldData.coordinates,
                10 // Max 10km radius
              );
              if (!locValidation.valid) {
                alert(locValidation.error || 'Location validation failed');
                return;
              }
            }
          } catch (valErr) {
            console.error('Validation error:', valErr);
          }
        }
      }
    } catch (err) {
      console.error('Unexpected error in handleNext:', err);
    }

    // Navigate to next step
    console.log('Navigating to Crop Details...');
    navigate('/register/crop-details');
  };

  return (
    <div className="min-h-screen w-full flex relative bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="field-details.png" // Placeholder, should be replaced or generic
          alt="Field view"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col justify-center px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-white mb-4">
              Field Details
            </h1>
            <p className="text-white/70 text-sm">
              Specifics about your field management
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleNext} className="space-y-4">
          {/* Field Name & Description */}
          <div>
            <Input
              type="text"
              placeholder="Field Name"
              value={fieldData.fieldName}
              onChange={(e) =>
                setFieldData({ ...fieldData, fieldName: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="Description (Optional)"
              value={fieldData.description}
              onChange={(e) =>
                setFieldData({ ...fieldData, description: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors resize-none h-20"
            />
          </div>

          {/* Area & Units */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Area"
              value={fieldData.area}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (val >= 0 || e.target.value === '') {
                  setFieldData({ ...fieldData, area: e.target.value });
                }
              }}
              min="0"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
              required
            />
            <Dropdown
              value={fieldData.units}
              onChange={(e) =>
                setFieldData({ ...fieldData, units: e.target.value })
              }
              className="w-full px-4 py-3 h-auto bg-white/10 border border-white/20 rounded-lg text-white appearance-none focus:outline-none focus:border-green-500 transition-colors [&>option]:text-black"
            >
              <option value="acres">Acres</option>
              <option value="hectares">Hectares</option>
              <option value="sq_ft">Sq Ft</option>
            </Dropdown>
          </div>

          {/* Boundary Type */}
          <div>
            <Label className="text-xs text-white/60 mb-1 block ml-1">
              Boundary Shape
            </Label>
            <Dropdown
              value={fieldData.boundaryType}
              onChange={(e) =>
                setFieldData({ ...fieldData, boundaryType: e.target.value })
              }
              className="w-full px-4 py-3 h-auto bg-white/10 border border-white/20 rounded-lg text-white appearance-none focus:outline-none focus:border-green-500 transition-colors [&>option]:text-black"
            >
              <option value="Polygon">Polygon (Irregular)</option>
              <option value="Rectangle">Rectangle</option>
              <option value="Square">Square</option>
              <option value="Circle">Circle</option>
            </Dropdown>
          </div>

          {/* Coordinates / Map */}
          <div className="relative border border-white/20 rounded-lg p-3 bg-white/5">
            <Label className="text-xs text-white/50 mb-1 block">
              Field Boundary (Draw your field)
            </Label>
            <LocationPicker
              mode="polygon"
              value={fieldData.coordinates} // Will be empty or JSON string
              onChange={(val: any) => {
                // val is JSON string like {"type":"Rectangle", "points":...}
                setFieldData({ ...fieldData, coordinates: val });
                // Auto set boundary type if possible
                try {
                  const parsed = JSON.parse(val);
                  if (parsed.type) {
                    if (parsed.type === 'Rectangle') {
                      setFieldData((prev: any) => ({
                        ...prev,
                        coordinates: val,
                        boundaryType: 'Rectangle',
                      }));
                    } else if (parsed.type === 'Circle') {
                      setFieldData((prev: any) => ({
                        ...prev,
                        coordinates: val,
                        boundaryType: 'Circle',
                      }));
                    } else {
                      setFieldData((prev: any) => ({
                        ...prev,
                        coordinates: val,
                        boundaryType: 'Polygon',
                      }));
                    }
                  }
                } catch (e) {}
              }}
              height="350px"
            />
          </div>

          {/* Soil Type */}
          <div>
            <Label className="text-xs text-white/60 mb-1 block ml-1">
              Soil Type
            </Label>
            <Dropdown
              value={fieldData.soilType}
              onChange={(e) =>
                setFieldData({ ...fieldData, soilType: e.target.value })
              }
              className="w-full px-4 py-3 h-auto bg-white/10 border border-white/20 rounded-lg text-white appearance-none focus:outline-none focus:border-green-500 transition-colors [&>option]:text-black"
            >
              <option value="Clay">Clay</option>
              <option value="Sandy">Sandy</option>
              <option value="Loamy">Loamy</option>
              <option value="Chalky">Chalky</option>
              <option value="Mixed">Mixed</option>
            </Dropdown>
          </div>

          {/* pH Level & Irrigation */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              step="0.1"
              min="0"
              max="14"
              placeholder="Soil pH (0-14)"
              value={fieldData.phLevel}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (e.target.value === '' || (val >= 0 && val <= 14)) {
                  setFieldData({ ...fieldData, phLevel: e.target.value });
                }
              }}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
            />
            <Dropdown
              value={fieldData.irrigationMethod}
              onChange={(e) =>
                setFieldData({ ...fieldData, irrigationMethod: e.target.value })
              }
              className="w-full px-4 py-3 h-auto bg-white/10 border border-white/20 rounded-lg text-white appearance-none focus:outline-none focus:border-green-500 transition-colors [&>option]:text-black"
            >
              <option value="Drip">Drip</option>
              <option value="Sprinkler">Sprinkler</option>
              <option value="Flood">Flood</option>
              <option value="Manual">Manual</option>
            </Dropdown>
          </div>

          <Button
            type="submit"
            className="w-full py-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all active:scale-[0.98] mt-6 text-lg"
          >
            Next: Crop Details
          </Button>
        </form>
      </div>
    </div>
  );
};

export default FieldDetails;
