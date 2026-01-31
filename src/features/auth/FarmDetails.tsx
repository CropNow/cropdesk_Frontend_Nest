import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import LocationPicker from '@/components/common/LocationPicker';
import { FormInput } from '@/components/common/FormInput';
import { FormTextarea } from '@/components/common/FormTextarea';
import { FormDropdown } from '@/components/common/FormDropdown';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import fieldInfoBg from '@/features/auth/asset/field_info.png';

interface FarmData {
  farmName: string;
  description: string;
  area: string;
  units: string;
  soilType: string;
  location: {
    address: string;
    city: string;
    country: string;
    latitude: string;
    longitude: string;
  };
}

const FarmDetails = () => {
  const navigate = useNavigate();
  const [farmData, setFarmData] = useState<FarmData>(() => {
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
    const sessionStr = localStorage.getItem('user');
    if (sessionStr) {
      try {
        const sessionUser = JSON.parse(sessionStr);
        const collectionStr = localStorage.getItem('app_users'); // STORAGE_KEYS.USERS_COLLECTION
        if (collectionStr && sessionUser.email) {
          const collection = JSON.parse(collectionStr);
          const user = collection[sessionUser.email.toLowerCase()];
          if (user && user.farmDetails) return user.farmDetails;
        }

        if (sessionUser.farmDetails) return sessionUser.farmDetails;
      } catch (e) {
        console.error('Error loading stored user', e);
      }
    }
    return {
      farmName: '',
      description: '',
      area: '',
      units: 'acres',
      soilType: '',
      location: {
        address: '',
        city: '',
        country: '',
        latitude: '',
        longitude: '',
      },
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!farmData.farmName.trim())
      newErrors.farmName = 'This field is not filled';
    if (!farmData.area.toString().trim())
      newErrors.area = 'This field is not filled';
    if (!farmData.location.address.trim())
      newErrors.address = 'This field is not filled';
    if (!farmData.location.city.trim())
      newErrors.city = 'This field is not filled';
    if (!farmData.location.country.trim())
      newErrors.country = 'This field is not filled';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

    if (validateForm()) {
      console.log('Farm Info:', farmData);
      // Navigate to next step
      navigate('/register/field-details');
    }
  };

  return (
    <div className="min-h-screen w-full flex relative bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={fieldInfoBg}
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
            <FormInput
              type="text"
              placeholder="Farm Name"
              value={farmData.farmName}
              onChange={(e) => {
                setFarmData({ ...farmData, farmName: e.target.value });
                if (errors.farmName) setErrors({ ...errors, farmName: '' });
              }}
              className="w-full px-4 py-3 bg-white/10 border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
              error={errors.farmName || ''}
            />
          </div>

          <div>
            <FormTextarea
              placeholder="Description (Optional)"
              value={farmData.description}
              onChange={(e) =>
                setFarmData({ ...farmData, description: e.target.value })
              }
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors resize-none h-20"
              // No error prop needed as it's optional
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormInput
                type="number"
                placeholder="Area / Size"
                value={farmData.area}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (val >= 0 || e.target.value === '') {
                    setFarmData({ ...farmData, area: e.target.value });
                  }
                  if (errors.area) setErrors({ ...errors, area: '' });
                }}
                min="0"
                className="w-full px-4 py-3 bg-white/10 border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
                error={errors.area || ''}
              />
            </div>
            <FormDropdown
              value={farmData.units}
              onChange={(e) =>
                setFarmData({ ...farmData, units: e.target.value })
              }
              className="w-full px-4 py-3 h-auto bg-white/10 border border-white/20 rounded-lg text-white appearance-none focus:outline-none focus:border-green-500 transition-colors [&>option]:text-black"
              // No error handling logic shown for units but if needed add error prop
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
            </FormDropdown>
          </div>

          <hr className="border-white/10 my-4" />
          <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
            Location Details
          </p>

          <div>
            <FormInput
              type="text"
              placeholder="Address / Landmark"
              value={farmData.location.address}
              onChange={(e) => {
                handleLocationChange('address', e.target.value);
                if (errors.address) setErrors({ ...errors, address: '' });
              }}
              className="w-full px-4 py-3 bg-white/10 border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
              error={errors.address || ''}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormInput
                type="text"
                placeholder="City"
                value={farmData.location.city}
                onChange={(e) => {
                  handleLocationChange('city', e.target.value);
                  if (errors.city) setErrors({ ...errors, city: '' });
                }}
                className="w-full px-4 py-3 bg-white/10 border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
                error={errors.city || ''}
              />
            </div>
            <div>
              <FormInput
                type="text"
                placeholder="Country"
                value={farmData.location.country}
                onChange={(e) => {
                  handleLocationChange('country', e.target.value);
                  if (errors.country) setErrors({ ...errors, country: '' });
                }}
                className="w-full px-4 py-3 bg-white/10 border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
                error={errors.country || ''}
              />
            </div>
          </div>

          <div className="relative border border-white/20 rounded-lg p-3 bg-white/5">
            <Label className="text-xs text-white/50 mb-1 block">
              Coordinates
            </Label>
            <div className="mb-2">
              <LocationPicker
                mode="point"
                value={
                  farmData.location.latitude && farmData.location.longitude
                    ? `${farmData.location.latitude}, ${farmData.location.longitude}`
                    : ''
                }
                onChange={(val: string) => {
                  const [lat = '', lng = ''] = val
                    .split(',')
                    .map((s) => s.trim());
                  setFarmData({
                    ...farmData,
                    location: {
                      ...farmData.location,
                      latitude: lat,
                      longitude: lng,
                    },
                  });
                }}
                onLocationDataChange={(data) => {
                  // Auto-fill city and country from reverse geocoding
                  setFarmData((prev) => ({
                    ...prev,
                    location: {
                      ...prev.location,
                      city: data.city || prev.location.city || '',
                      country: data.country || prev.location.country || '',
                    },
                  }));
                }}
                height="300px"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all active:scale-[0.98] text-lg"
          >
            Next: Field Details
          </Button>
        </form>
      </div>
    </div>
  );
};

export default FarmDetails;
