import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { FormInput } from '@/components/common/FormInput';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from './useAuth';
import { useProfile } from '@/features/user/profile/context/useProfile';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import fieldInfoBg from '@/features/auth/asset/field_info.png';

const CropDetails = () => {
  const navigate = useNavigate();
  const { setUser, user } = useAuth(); // Get setUser to update context directly
  const { refreshProfile } = useProfile(); // Get refreshProfile to update global state
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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'info' | 'warning' | 'error';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  const closeAlert = () =>
    setAlertConfig((prev) => ({ ...prev, isOpen: false }));

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!cropData.cropName.trim())
      newErrors.cropName = 'This field is not filled';
    if (!cropData.plantingDate.trim())
      newErrors.plantingDate = 'This field is not filled';
    if (!cropData.harvestingDate.trim())
      newErrors.harvestingDate = 'This field is not filled';
    if (!cropData.area.toString().trim())
      newErrors.area = 'This field is not filled';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
        setAlertConfig({
          isOpen: true,
          title: 'Authentication Error',
          message: 'No access token found. Please login again.',
          type: 'error',
        });
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
          setAlertConfig({
            isOpen: true,
            title: 'Session Expired',
            message: 'Your session has expired. Please log in again.',
            type: 'warning',
          });
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
          setAlertConfig({
            isOpen: true,
            title: 'Unauthorized',
            message:
              'Cannot create farmer. Please ensure you are logged in correctly.',
            type: 'error',
          });
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
        unit: tempData.farmDetails?.units || 'acres', // FIXED: 'units' to match type/backend? Checking backend expectation...
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
        // Note: 'units' field removed - backend doesn't accept it
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

          let parsedCoords = tempData.fieldDetails.coordinates;
          if (typeof parsedCoords === 'string') {
            try {
              parsedCoords = JSON.parse(parsedCoords);
            } catch (e) {
              console.warn('Failed to parse coordinates string:', e);
            }
          }

          // Case 1: Standard LocationPicker Output { type: 'Polygon', points: [{lat, lng}, ...] }
          if (parsedCoords?.points && Array.isArray(parsedCoords.points)) {
            const rings = parsedCoords.points
              .map((p: any) => [p.lng, p.lat])
              .filter(
                (coord: any) =>
                  Array.isArray(coord) &&
                  coord.length === 2 &&
                  typeof coord[0] === 'number' &&
                  typeof coord[1] === 'number'
              );

            if (rings.length < 3) {
              console.warn(
                'Invalid polygon coordinates - less than 3 valid points'
              );
            } else {
              // Ensure closed loop for Polygon
              const firstRing = rings[0];
              const lastRing = rings[rings.length - 1];

              if (
                firstRing[0] !== lastRing[0] ||
                firstRing[1] !== lastRing[1]
              ) {
                rings.push(firstRing);
              }
              fieldPayload.boundary = {
                type: 'Polygon',
                coordinates: [rings],
              };
            }
          }
          // Case 2: Rectangle shape { type: 'Rectangle', bounds: {...} }
          else if (parsedCoords?.type === 'Rectangle' && parsedCoords?.bounds) {
            const { north, south, east, west } = parsedCoords.bounds;
            fieldPayload.boundary = {
              type: 'Polygon',
              coordinates: [
                [
                  [west, south],
                  [east, south],
                  [east, north],
                  [west, north],
                  [west, south], // Close the loop
                ],
              ],
            };
            console.log(
              'Converted Rectangle to Polygon:',
              fieldPayload.boundary
            );
          }
          // Case 3: Circle shape { type: 'Circle', center: {lat, lng}, radius: number }
          else if (
            parsedCoords?.type === 'Circle' &&
            parsedCoords?.center &&
            parsedCoords?.radius
          ) {
            // Convert circle to polygon approximation (32 points for smooth circle)
            const points = 32;
            const coordinates: number[][] = [];
            const { lat, lng } = parsedCoords.center;
            const radiusInMeters = parsedCoords.radius;

            for (let i = 0; i <= points; i++) {
              const angle = (i * 360) / points;
              const angleRad = (angle * Math.PI) / 180;

              // Calculate offset in degrees (approximate)
              // 1 degree latitude ≈ 111,320 meters
              // 1 degree longitude ≈ 111,320 * cos(latitude) meters
              const latOffset = (radiusInMeters / 111320) * Math.cos(angleRad);
              const lngOffset =
                (radiusInMeters / (111320 * Math.cos((lat * Math.PI) / 180))) *
                Math.sin(angleRad);

              coordinates.push([lng + lngOffset, lat + latOffset]);
            }

            fieldPayload.boundary = {
              type: 'Polygon',
              coordinates: [coordinates],
            };
            console.log('Converted Circle to Polygon:', fieldPayload.boundary);
          }
          // Case 4: Array of points (Leaflet style or raw)
          else if (Array.isArray(parsedCoords)) {
            // Assume [[lat, lng]] (Leaflet) or [{lat, lng}]
            const rings = parsedCoords.map((p: any) => {
              if (Array.isArray(p)) return [p[1], p[0]]; // Swap lat,lng to lng,lat
              if (p.lat && p.lng) return [p.lng, p.lat];
              return [0, 0];
            });
            // Ensure closed loop
            const firstRing = rings[0];
            if (rings.length > 0 && firstRing) rings.push(firstRing);

            fieldPayload.boundary = {
              type: 'Polygon',
              coordinates: [rings],
            };
          }
          // Case 5: Already GeoJSON
          else if (
            parsedCoords?.type === 'Polygon' &&
            parsedCoords?.coordinates
          ) {
            fieldPayload.boundary = parsedCoords;
          }
        } catch (e) {
          console.error('Error processing coordinates for backend:', e);
        }
      }

      const { createField } = await import('@/features/auth/api/field.api');
      const farmId = farm.id || (farm as any)._id;

      // Log the complete field payload for verification
      console.log(
        'Creating Field with Payload:',
        JSON.stringify(fieldPayload, null, 2)
      );
      console.log('Field Boundary Coordinates:', fieldPayload.boundary);

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
          setAlertConfig({
            isOpen: true,
            title: 'Warning',
            message: 'Field created but ID is missing. Crop creation skipped.',
            type: 'warning',
          });
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
              setAlertConfig({
                isOpen: true,
                title: 'Crop Creation Failed',
                message: cropErr.response.data.message || cropErr.message,
                type: 'error',
              });
            } else {
              setAlertConfig({
                isOpen: true,
                title: 'Crop Creation Failed',
                message: cropErr.message,
                type: 'error',
              });
            }
          }
          // We do NOT rethrow here, so the user flow can complete (redirect to dashboard)
          // even if crop fails. But the alert informs them.
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

      // Refresh Profile Context to ensure all widgets (Profile, Dashboard) have latest data
      try {
        console.log('Refreshing Profile Context...');
        await refreshProfile();
      } catch (profileErr) {
        console.warn('Failed to refresh profile context:', profileErr);
      }

      // Navigate is handled by caller or we can do it here if we pass navigate
      return true;
    } catch (error: any) {
      console.error('Finalization Failed:', error);
      console.error('Error Response Data:', error.response?.data);
      console.error('Error Status:', error.response?.status);

      if (error.response?.status === 401) {
        setAlertConfig({
          isOpen: true,
          title: 'Session Expired',
          message: 'Session Expired or Unauthorized. Please log in again.',
          type: 'warning',
        });
      } else if (error.response?.data) {
        const errorMsg =
          error.response.data.message ||
          error.response.data.error ||
          JSON.stringify(error.response.data);
        setAlertConfig({
          isOpen: true,
          title: 'Save Failed',
          message: `Failed to save data: ${errorMsg}`,
          type: 'error',
        });
      } else {
        setAlertConfig({
          isOpen: true,
          title: 'Save Failed',
          message: `Failed to save data: ${error.message || 'Unknown error'}`,
          type: 'error',
        });
      }
      throw error; // Rethrow to stop navigation if needed
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    console.log('Crop Details:', cropData);

    try {
      const success = await finalizeRegistration(cropData);

      // Only navigate on success
      if (success) {
        // Ensure no stale device data exists for the new user
        localStorage.removeItem('connected_devices');
        localStorage.removeItem('iot_device_data');
        navigate('/');
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setIsSubmitting(false);
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
          src={fieldInfoBg}
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
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Crop Name */}
          <div className="space-y-2">
            <Label className="text-white/60 ml-1">Crop Name</Label>
            <FormInput
              type="text"
              placeholder="e.g. Wheat, Rice, Tomato"
              value={cropData.cropName}
              onChange={(e) => {
                setCropData({ ...cropData, cropName: e.target.value });
                if (errors.cropName) setErrors({ ...errors, cropName: '' });
              }}
              className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-green-500 focus:ring-green-500"
              error={errors.cropName || ''}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/60 ml-1">Planting Date</Label>
              <FormInput
                type="date"
                value={cropData.plantingDate}
                onChange={(e) => {
                  setCropData({ ...cropData, plantingDate: e.target.value });
                  if (errors.plantingDate)
                    setErrors({ ...errors, plantingDate: '' });
                }}
                className="h-12 bg-white/10 border-white/20 text-white appearance-none focus:border-green-500 focus:ring-green-500"
                error={errors.plantingDate || ''}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/60 ml-1">Exp. Harvest</Label>
              <FormInput
                type="date"
                value={cropData.harvestingDate}
                onChange={(e) => {
                  setCropData({ ...cropData, harvestingDate: e.target.value });
                  if (errors.harvestingDate)
                    setErrors({ ...errors, harvestingDate: '' });
                }}
                className="h-12 bg-white/10 border-white/20 text-white appearance-none focus:border-green-500 focus:ring-green-500"
                error={errors.harvestingDate || ''}
              />
            </div>
          </div>

          {/* Area */}
          <div className="space-y-2">
            <Label className="text-white/60 ml-1">
              Cultivation Area (Acres)
            </Label>
            <FormInput
              type="number"
              placeholder="Area for this crop"
              value={cropData.area}
              onChange={(e) => {
                setCropData({ ...cropData, area: e.target.value });
                if (errors.area) setErrors({ ...errors, area: '' });
              }}
              className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-green-500 focus:ring-green-500"
              error={errors.area || ''}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all active:scale-[0.98] mt-4 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Setting up...' : 'Finish Setup'}
          </Button>

          <p className="text-center text-xs text-white/40 mt-4">
            You can always add more crops later from the dashboard.
          </p>
        </form>
      </div>

      <AlertDialog
        open={alertConfig.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setAlertConfig((prev) => ({ ...prev, isOpen: false }));
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertConfig.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertConfig.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() =>
                setAlertConfig((prev) => ({ ...prev, isOpen: false }))
              }
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CropDetails;
