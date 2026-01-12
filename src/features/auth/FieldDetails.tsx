import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { convertAreaToSqFt } from '@/utils/unitConversion';

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
    const storedUserStr = localStorage.getItem('registeredUser');
    if (storedUserStr) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        if (
          storedUser.fieldDetails &&
          Object.keys(storedUser.fieldDetails).length > 0
        ) {
          return storedUser.fieldDetails;
        }
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

  // Import moved to top

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Field Details:', fieldData);

    // Validation against Farm Details
    const tempStr = localStorage.getItem('tempRegistrationData');
    if (tempStr) {
      const tempData = JSON.parse(tempStr);
      const farmDetails = tempData.farmDetails;

      if (farmDetails && farmDetails.area && farmDetails.units) {
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

        if (fieldAreaSqFt > farmAreaSqFt) {
          alert(
            `Field area (${fieldData.area} ${fieldData.units}) cannot exceed the total Farm area (${farmDetails.area} ${farmDetails.units})!`
          );
          return; // Stop execution
        }
      }

      // Update temp storage with new field details
      // Already handled by useEffect
    } else {
      // Fallback or init if missing
      // Already handled by useEffect
    }

    // Navigate to next step
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
            <input
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
            <textarea
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
            <input
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
            <select
              value={fieldData.units}
              onChange={(e) =>
                setFieldData({ ...fieldData, units: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white appearance-none focus:outline-none focus:border-green-500 transition-colors [&>option]:text-black"
            >
              <option value="acres">Acres</option>
              <option value="hectares">Hectares</option>
              <option value="sq_ft">Sq Ft</option>
            </select>
          </div>

          {/* Boundary Type */}
          <div>
            <label className="text-xs text-white/60 mb-1 block ml-1">
              Boundary Shape
            </label>
            <select
              value={fieldData.boundaryType}
              onChange={(e) =>
                setFieldData({ ...fieldData, boundaryType: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white appearance-none focus:outline-none focus:border-green-500 transition-colors [&>option]:text-black"
            >
              <option value="Polygon">Polygon (Irregular)</option>
              <option value="Rectangle">Rectangle</option>
              <option value="Square">Square</option>
              <option value="Circle">Circle</option>
            </select>
          </div>

          {/* Coordinates */}
          <div className="relative">
            <input
              type="text"
              placeholder="Coordinates (Lat, Long)"
              value={fieldData.coordinates}
              onChange={(e) =>
                setFieldData({ ...fieldData, coordinates: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors pr-10"
            />
            <button
              type="button"
              onClick={handleGeolocation}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-green-500"
              title="Use current location"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>

          {/* Soil Type */}
          <div>
            <label className="text-xs text-white/60 mb-1 block ml-1">
              Soil Type
            </label>
            <select
              value={fieldData.soilType}
              onChange={(e) =>
                setFieldData({ ...fieldData, soilType: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white appearance-none focus:outline-none focus:border-green-500 transition-colors [&>option]:text-black"
            >
              <option value="Clay">Clay</option>
              <option value="Sandy">Sandy</option>
              <option value="Loamy">Loamy</option>
              <option value="Chalky">Chalky</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>

          {/* pH Level & Irrigation */}
          <div className="grid grid-cols-2 gap-4">
            <input
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
            <select
              value={fieldData.irrigationMethod}
              onChange={(e) =>
                setFieldData({ ...fieldData, irrigationMethod: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white appearance-none focus:outline-none focus:border-green-500 transition-colors [&>option]:text-black"
            >
              <option value="Drip">Drip</option>
              <option value="Sprinkler">Sprinkler</option>
              <option value="Flood">Flood</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all active:scale-[0.98] mt-6"
          >
            Next: Crop Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default FieldDetails;
