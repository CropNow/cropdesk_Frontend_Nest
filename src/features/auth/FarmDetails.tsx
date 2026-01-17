import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import LocationPicker from '@/components/common/LocationPicker';

const FarmDetails = () => {
  const navigate = useNavigate();
  const [farmData, setFarmData] = useState(() => {
    const tempStr = localStorage.getItem('tempRegistrationData');
    if (tempStr) {
      try {
        const tempData = JSON.parse(tempStr);
        if (tempData.farmDetails) {
          return tempData.farmDetails;
        }
      } catch (error) {
        console.error('Error loading temp data:', error);
      }
    }
    const storedUserStr = localStorage.getItem('registeredUser');
    if (storedUserStr) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        if (
          storedUser.farmDetails &&
          Object.keys(storedUser.farmDetails).length > 0
        ) {
          return storedUser.farmDetails;
        }
      } catch (e) {
        console.error('Error loading stored user', e);
      }
    }
    return {
      farmName: '',
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
    };
  });

  useEffect(() => {
    const tempStr = localStorage.getItem('tempRegistrationData');
    const tempData = tempStr ? JSON.parse(tempStr) : {};

    if (JSON.stringify(tempData.farmDetails) !== JSON.stringify(farmData)) {
      const updatedTemp = {
        ...tempData,
        farmDetails: farmData,
      };
      localStorage.setItem('tempRegistrationData', JSON.stringify(updatedTemp));
    }
  }, [farmData]);

  useEffect(() => {
    // Only run geo if no location data exists to avoid overwriting
    if (!farmData.location.latitude && !farmData.location.longitude) {
      handleGeolocation(true);
    }
  }, []);

  const handleLocationChange = (field: string, value: string) => {
    setFarmData({
      ...farmData,
      location: {
        ...farmData.location,
        [field]: value,
      },
    });
  };

  const handleGeolocation = (silent = false) => {
    if (!navigator.geolocation) {
      if (!silent) alert('Geolocation is not supported by your browser.');
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFarmData({
          ...farmData,
          location: {
            ...farmData.location,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          },
        });
      },
      (error) => {
        console.error('Error detecting location', error);
        if (silent) return; // Don't alert if running in silent mode (e.g. on mount)

        let errorMessage = 'Unable to retrieve your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              'Location permission denied. Please enable it in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage =
              'Location information is unavailable. Please check your device settings.';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get user location timed out.';
            break;
        }
        alert(errorMessage);
      },
      options
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Farm Info:', farmData);

    // Navigate to next step
    navigate('/register/field-details');
  };

  return (
    <div className="min-h-screen w-full flex relative bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="06b6826f726671798a795a97e67f4df476be5768.png"
          alt="Aerial view of fields"
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
            <h1 className="text-3xl font-bold text-white mb-4">Farm Details</h1>
            <p className="text-white/70 text-sm">Tell us about your farm</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Farm Name"
              value={farmData.farmName}
              onChange={(e) =>
                setFarmData({ ...farmData, farmName: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
              required
            />
          </div>

          <div>
            <textarea
              placeholder="Description (Optional)"
              value={farmData.description}
              onChange={(e) =>
                setFarmData({ ...farmData, description: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors resize-none h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Area / Size"
              value={farmData.area}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (val >= 0 || e.target.value === '') {
                  setFarmData({ ...farmData, area: e.target.value });
                }
              }}
              min="0"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
              required
            />
            <select
              value={farmData.units}
              onChange={(e) =>
                setFarmData({ ...farmData, units: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white appearance-none focus:outline-none focus:border-green-500 transition-colors"
            >
              <option value="acres" className="bg-gray-800">
                Acres
              </option>
              <option value="hectares" className="bg-gray-800">
                Hectares
              </option>
              <option value="sq_ft" className="bg-gray-800">
                Sq Ft
              </option>
            </select>
          </div>

          <hr className="border-white/10 my-4" />
          <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
            Location Details
          </p>

          <div>
            <input
              type="text"
              placeholder="Address / Landmark"
              value={farmData.location.address}
              onChange={(e) => handleLocationChange('address', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="City"
              value={farmData.location.city}
              onChange={(e) => handleLocationChange('city', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
              required
            />
            <input
              type="text"
              placeholder="Country"
              value={farmData.location.country}
              onChange={(e) => handleLocationChange('country', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
              required
            />
          </div>

          <div className="relative border border-white/20 rounded-lg p-3 bg-white/5">
            <label className="text-xs text-white/50 mb-1 block">
              Coordinates
            </label>
            <div className="mb-2">
              <LocationPicker
                mode="point"
                value={
                  farmData.location.latitude && farmData.location.longitude
                    ? `${farmData.location.latitude}, ${farmData.location.longitude}`
                    : ''
                }
                onChange={(val: string) => {
                  const [lat, lng] = val.split(',').map((s) => s.trim());
                  setFarmData({
                    ...farmData,
                    location: {
                      ...farmData.location,
                      latitude: lat,
                      longitude: lng,
                    },
                  });
                }}
                height="300px"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all active:scale-[0.98]"
          >
            Next: Field Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default FarmDetails;
