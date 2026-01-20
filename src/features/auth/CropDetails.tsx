import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from './useAuth';

const CropDetails = () => {
  const navigate = useNavigate();
  const { setUser, user } = useAuth(); // Get setUser to update context directly
  const [cropData, setCropData] = useState(() => {
    const tempStr = localStorage.getItem('tempRegistrationData');
    if (tempStr) {
      try {
        const tempData = JSON.parse(tempStr);
        if (tempData.cropDetails) {
          return tempData.cropDetails;
        }
      } catch (error) {
        console.error('Error loading saved crop details:', error);
      }
    }
    return {
      cropName: '',
      plantingDate: '',
      harvestingDate: '',
      area: '',
    };
  });

  useEffect(() => {
    const tempStr = localStorage.getItem('tempRegistrationData');
    const tempData = tempStr ? JSON.parse(tempStr) : {};

    if (JSON.stringify(tempData.cropDetails) !== JSON.stringify(cropData)) {
      const updatedTemp = {
        ...tempData,
        cropDetails: cropData,
      };
      localStorage.setItem('tempRegistrationData', JSON.stringify(updatedTemp));
    }
  }, [cropData]);

  /* API Imports handled at top of file, ensuring we have them */

  const finalizeRegistration = async (finalCropData?: any) => {
    try {
      console.log('Finalizing Registration...');
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('CRITICAL: No access token found in localStorage!');
        alert(
          'Authentication Error: No access token found. Please login again.'
        );
        return false;
      }
      console.log('Access Token exists (length):', token.length);

      // Verify Token Validity with Backend using a known safe read endpoint
      try {
        const { getAllFarmers } =
          await import('@/features/auth/api/farmer.api');
        await getAllFarmers(); // Just a ping to check if token is accepted
        console.log('Token validated with backend (getAllFarmers).');
      } catch (authError: any) {
        console.error('Token validation failed:', authError);
        // If this read fails with 401, we know for sure token is bad
        if (authError.response?.status === 401) {
          alert('Your session has expired. Please log in again.');
          // force cleanup
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          navigate('/login');
          return false;
        }
        console.warn(
          'Network issue or other error checking token, proceeding with caution...'
        );
      }

      const tempStr = localStorage.getItem('tempRegistrationData');
      const tempData = tempStr ? JSON.parse(tempStr) : {};

      // 1. Create Farmer
      console.log('Creating Farmer...');

      // Safety: Ensure we use the logged-in user's email if possible to prevent 401/403 on mismatched identity
      let safeEmail = tempData.farmerDetails?.email;
      if (user && user.email) {
        safeEmail = user.email;
      }

      const farmerPayload = {
        name: tempData.farmerDetails?.name,
        phone: tempData.farmerDetails?.phone,
        email: safeEmail,
        address: tempData.farmerDetails?.address,
      };

      // Guard: Do not create a farmer if the name is empty (User skipped onboarding completely)
      if (!farmerPayload.name || farmerPayload.name.trim() === '') {
        console.warn('Skipping Farmer Creation: No name provided.');
        // We consider this "Status Quo Success" - user chose not to register details.
        // Cleanup storage and return.
        localStorage.removeItem('tempRegistrationData');
        return true;
      }

      let farmer;
      try {
        // Import dynamically to avoid top-level issues if something is wrong
        const { createFarmer } = await import('@/features/auth/api/farmer.api');
        farmer = await createFarmer(farmerPayload);
        console.log('Farmer Created:', farmer);
      } catch (err: any) {
        console.error('Create Farmer Failed:', err);
        if (err.response?.status === 401) {
          alert(
            'Unauthorized: Cannot create farmer. Please ensure you are logged in correctly.'
          );
          return false;
        }
        throw new Error(
          `Farmer creation failed: ${err.response?.data?.message || err.message}`
        );
      }

      // 2. Create Farm
      console.log('Creating Farm...');

      const loc = tempData.farmDetails?.location || {};
      const farmPayload = {
        name: tempData.farmDetails?.farmName, // DB expects 'name', FE stores 'farmName'
        description: tempData.farmDetails?.description || 'Main Farm',
        farmerId: farmer.id || (farmer as any)._id, // Safety check for ID field
        location: {
          address: loc.address || 'Unknown Address',
          city: loc.city || 'Unknown City',
          state: loc.state || 'Unknown State', // Added if available, though not in form explicitly sometimes
          country: loc.country || 'India',
          coordinates: {
            type: 'Point',
            coordinates: [
              parseFloat(loc.longitude || '0'),
              parseFloat(loc.latitude || '0'),
            ],
          },
        },
        area: tempData.farmDetails?.area || '0', // Keep as string for TS interface
        unit: tempData.farmDetails?.units || 'acres',
        soilType: tempData.farmDetails?.soilType || 'loamy', // Default or from field? Farm schema requires it.
        irrigationType: 'drip',
        farmingType: 'conventional',
      };

      // Ensure specific fields match backend Enum values
      // (Backend: clay, sandy, loamy... lowercase)
      // FE might have Capitalized.
      if (farmPayload.soilType)
        farmPayload.soilType = farmPayload.soilType.toLowerCase();
      if (farmPayload.unit) farmPayload.unit = farmPayload.unit.toLowerCase();

      // Cast payload to any if extra casting is needed by backend but TS restriction is tight
      // or rely on Mongoose string->number casting
      let farm;
      try {
        const { createFarm } = await import('@/features/auth/api/farm.api');
        farm = await createFarm(farmPayload as any);
        console.log('Farm Created:', farm);
      } catch (err: any) {
        console.error('Create Farm Failed:', err);
        throw new Error(
          `Farm creation failed: ${err.response?.data?.message || err.message}`
        );
      }

      // 3. Create Field
      console.log('Creating Field...');
      const fieldPayload = {
        name: tempData.fieldDetails?.fieldName, // DB 'name', FE 'fieldName'
        description: tempData.fieldDetails?.description,
        area: tempData.fieldDetails?.area || '0', // Keep as string
        unit: tempData.fieldDetails?.units?.toLowerCase() || 'acres',
        soil: {
          type: tempData.fieldDetails?.soilType?.toLowerCase() || 'loamy',
          ph: parseFloat(tempData.fieldDetails?.phLevel || '7'),
          organicCarbon: 0,
          nitrogen: 0,
          phosphorus: 0,
          potassium: 0,
        },
        irrigation: {
          type:
            tempData.fieldDetails?.irrigationMethod?.toLowerCase() || 'drip',
          waterSource: 'Well',
        },
        boundary: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 0],
              [0, 1],
              [1, 1],
              [1, 0],
              [0, 0],
            ],
          ], // Default mock boundary if none provided
        },
      };

      // Handle Coordinates
      if (tempData.fieldDetails?.coordinates) {
        try {
          // If valid GeoJSON or points are stored, parse and format for backend
          // Backend expects { type: "Polygon", coordinates: [[[lon, lat], ...]] }
          // User input might be simple string or JSON from LocationPicker
          // For now, using the fallback above to prevent crash if data is complex
          const parsedCoords =
            typeof tempData.fieldDetails.coordinates === 'string'
              ? JSON.parse(tempData.fieldDetails.coordinates)
              : tempData.fieldDetails.coordinates;

          // If parsedCoords is just an array of points, wrap it
          if (
            Array.isArray(parsedCoords) &&
            parsedCoords.length > 0 &&
            Array.isArray(parsedCoords[0])
          ) {
            // Assume it's [[lat, lng], ...]
            // Verify format and swap to [lon, lat] if needed?
            // Usually map tools give [lat, lng]. standard GeoJSON is [lon, lat].
          }
        } catch (e) {}
      }

      const { createField } = await import('@/features/auth/api/field.api');
      const farmId = farm.id || (farm as any)._id;
      // We need to cast fieldPayload to any because 'soil', 'irrigation', 'boundary' are not in current Field interface in auth.types.ts
      // Update auth.types.ts is better, but for now cast to avoid error
      const field = await createField(farmId, fieldPayload as any);
      console.log('Field Created Response:', field);

      // 4. Create Crop
      // Only if we have valid crop data
      const cropToSave = finalCropData || tempData.cropDetails;
      if (cropToSave && cropToSave.cropName) {
        console.log('Preparing to create crop...');
        const fieldId = field.id || (field as any)._id;

        if (!fieldId) {
          console.error(
            'CRITICAL: Field ID missing from created field response! Cannot create crop.'
          );
          console.log('Field Object:', field);
          alert('Field created but ID is missing. Crop creation skipped.');
        } else {
          console.log('Using Field ID for Crop:', fieldId);
          const cropPayload = {
            name: cropToSave.cropName,
            plantingDate: cropToSave.plantingDate,
            expectedHarvestDate: cropToSave.harvestingDate, // FE 'harvestingDate', BE 'expectedHarvestDate'
            area: cropToSave.area || '0',
            unit: 'acres', // Default
            // fieldId is passed in URL params, and not allowed in body by backend validation
          };
          console.log('Crop Payload:', cropPayload);

          try {
            const { createCrop } = await import('@/features/auth/api/crop.api');
            // Cast to any because Crop interface in auth.types.ts is very minimal
            const createdCrop = await createCrop(fieldId, cropPayload as any);
            console.log('Crop Created Successfully:', createdCrop);
          } catch (cropErr: any) {
            console.error('Failed to create crop:', cropErr);
            if (cropErr.response) {
              console.error(
                'Server responded with:',
                cropErr.response.status,
                cropErr.response.data
              );
              alert(
                `Crop creation failed: ${cropErr.response.data.message || cropErr.message}`
              );
            } else {
              alert(`Crop creation failed: ${cropErr.message}`);
            }
            // We do NOT rethrow here, so the user flow can complete (redirect to dashboard)
            // even if crop fails. But the alert informs them.
          }
        }
      } else {
        console.log('Skipping Crop creation: No valid crop data found.');
      }

      // Cleanup
      localStorage.removeItem('tempRegistrationData');

      // Refresh User/Session Global State to unlock UI (Smart Info etc) immediately
      try {
        console.log('Refreshing User Session to unlock dashboards...');
        const { getMe } = await import('@/features/auth/auth.api');
        const freshUser = await getMe();
        setUser(freshUser); // Update global context
        // Also update local storage to be safe
        import('@/utils/storage').then(({ saveStoredUser }) => {
          saveStoredUser(freshUser);
        });
      } catch (refreshErr) {
        console.warn(
          'Failed to refresh session, UI might require reload:',
          refreshErr
        );
      }

      // Navigate is handled by caller or we can do it here if we pass navigate
      return true;
    } catch (error: any) {
      console.error('Finalization Failed:', error);
      if (error.response?.status === 401) {
        alert('Session Expired or Unauthorized. Please log in again.');
      } else {
        alert(`Failed to save data: ${error.message || 'Unknown error'}`);
      }
      throw error; // Rethrow to stop navigation if needed
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Crop Details:', cropData);

    const success = await finalizeRegistration(cropData);

    // Only navigate on success
    if (success) {
      navigate('/');
    }
  };

  const handleSkip = () => {
    // Finalize Onboarding even if skipped, without adding current crop data
    finalizeRegistration({});
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full flex relative bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="crop-details.png" // Placeholder
          alt="Crops"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col justify-center px-8 py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </Button>

        {/* Skip Button */}

        {/* Header */}
        <div className="text-left mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Crop Details</h1>
          <p className="text-white/70 text-sm">
            What are you growing this season?
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Crop Name */}
          <div className="space-y-2">
            <Label className="text-white/60 ml-1">Crop Name</Label>
            <Input
              type="text"
              placeholder="e.g. Wheat, Rice, Tomato"
              value={cropData.cropName}
              onChange={(e) =>
                setCropData({ ...cropData, cropName: e.target.value })
              }
              className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/60 ml-1">Planting Date</Label>
              <Input
                type="date"
                value={cropData.plantingDate}
                onChange={(e) =>
                  setCropData({ ...cropData, plantingDate: e.target.value })
                }
                className="h-12 bg-white/10 border-white/20 text-white appearance-none focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/60 ml-1">Exp. Harvest</Label>
              <Input
                type="date"
                value={cropData.harvestingDate}
                onChange={(e) =>
                  setCropData({ ...cropData, harvestingDate: e.target.value })
                }
                className="h-12 bg-white/10 border-white/20 text-white appearance-none focus:border-green-500 focus:ring-green-500"
                required
              />
            </div>
          </div>

          {/* Area */}
          <div className="space-y-2">
            <Label className="text-white/60 ml-1">
              Cultivation Area (Acres)
            </Label>
            <Input
              type="number"
              placeholder="Area for this crop"
              value={cropData.area}
              onChange={(e) =>
                setCropData({ ...cropData, area: e.target.value })
              }
              className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full py-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all active:scale-[0.98] mt-4 text-xl"
          >
            Finish Setup
          </Button>

          <p className="text-center text-xs text-white/40 mt-4">
            You can always add more crops later from the dashboard.
          </p>
        </form>
      </div>
    </div>
  );
};

export default CropDetails;
