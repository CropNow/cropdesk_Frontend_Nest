import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { convertAreaToSqFt } from '@/utils/unitConversion';
import { isLocationValid } from '@/utils/geoUtils';
import LocationPicker from '@/components/common/LocationPicker';
import { FormInput } from '@/components/common/FormInput';
import { FormTextarea } from '@/components/common/FormTextarea';
import { FormDropdown } from '@/components/common/FormDropdown';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
      unit: 'acres',
      boundaryType: 'Polygon',
      coordinates: '',
      soilType: 'Loamy',
      phLevel: '',
      irrigationMethod: 'Drip',
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (!fieldData.fieldName.trim())
      newErrors.fieldName = 'This field is not filled';
    if (!fieldData.area.toString().trim())
      newErrors.area = 'This field is not filled';
    if (!fieldData.boundaryType.trim())
      newErrors.boundaryType = 'This field is not filled';
    if (!fieldData.soilType.trim())
      newErrors.soilType = 'This field is not filled';

    // Coordinates validation is trickier as it might be complex object or string
    // But let's at least check if it's there?
    // Usually handled by the picker, but let's strictly require it?
    // The previous implementation didn't strictly block in UI except via 'required' on hidden inputs potentially?
    // Actually LocationPicker might update it.

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
          setAlertConfig({
            isOpen: true,
            title: 'Location Error',
            message: 'Unable to retrieve your location.',
            type: 'warning',
          });
        }
      );
    } else {
      setAlertConfig({
        isOpen: true,
        title: 'Not Supported',
        message: 'Geolocation is not supported by your browser.',
        type: 'warning',
      });
    }
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

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
        const farmUnit = farmDetails?.unit || farmDetails?.units;

        if (farmDetails && farmDetails.area && farmUnit) {
          try {
            const farmAreaSqFt = convertAreaToSqFt(
              parseFloat(farmDetails.area),
              farmUnit
            );
            const fieldAreaSqFt = convertAreaToSqFt(
              parseFloat(fieldData.area),
              fieldData.unit
            );

            console.log(
              `Validation: Farm ${farmAreaSqFt} sqft vs Field ${fieldAreaSqFt} sqft`
            );

            if (
              !isNaN(farmAreaSqFt) &&
              !isNaN(fieldAreaSqFt) &&
              fieldAreaSqFt > farmAreaSqFt
            ) {
              setAlertConfig({
                isOpen: true,
                title: 'Area Validation Error',
                message: `Field area (${fieldData.area} ${fieldData.units}) cannot exceed the total Farm area (${farmDetails.area} ${farmDetails.units})!`,
                type: 'warning',
              });
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
                setAlertConfig({
                  isOpen: true,
                  title: 'Location Validation Error',
                  message: locValidation.error || 'Location validation failed',
                  type: 'warning',
                });
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
          src={fieldInfoBg}
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
            <FormInput
              type="text"
              placeholder="Field Name"
              value={fieldData.fieldName}
              onChange={(e) => {
                setFieldData({ ...fieldData, fieldName: e.target.value });
                if (errors.fieldName) setErrors({ ...errors, fieldName: '' });
              }}
              className="w-full px-4 py-3 bg-white/10 border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
              error={errors.fieldName || ''}
            />
          </div>
          <div>
            <FormTextarea
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
            <div className="flex flex-col">
              <FormInput
                type="text"
                placeholder="Area"
                value={fieldData.area}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^\d*\.?\d*$/.test(val)) {
                    setFieldData({ ...fieldData, area: val });
                    if (errors.area) setErrors({ ...errors, area: '' });
                  }
                }}
                className="w-full px-4 py-3 bg-white/10 border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
                error={errors.area || ''}
              />
            </div>
            <FormDropdown
              value={fieldData.unit}
              onChange={(e) =>
                setFieldData({ ...fieldData, unit: e.target.value })
              }
              className="px-4 py-3 h-auto bg-white/10 border border-white/20 rounded-lg text-white appearance-none focus:outline-none focus:border-green-500 transition-colors [&>option]:text-black"
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

          {/* Boundary Type */}
          <div>
            <Label className="text-xs text-white/60 mb-1 block">
              Boundary Shape
            </Label>
            <FormDropdown
              value={fieldData.boundaryType}
              onChange={(e) =>
                setFieldData({ ...fieldData, boundaryType: e.target.value })
              }
              className="px-4 py-3 h-auto bg-white/10 border border-white/20 rounded-lg text-white appearance-none focus:outline-none focus:border-green-500 transition-colors [&>option]:text-black"
              error={errors.boundaryType || ''}
            >
              <option value="Polygon">Polygon</option>
              <option value="Square">Square</option>
            </FormDropdown>
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
              onAreaCalculated={(sqFt: number) => {
                const acres = (sqFt / 43560).toString();
                setFieldData((prev: any) => ({
                  ...prev,
                  area: acres,
                }));
              }}
              height="350px"
            />
          </div>

          {/* Soil Type */}
          <div>
            <Label className="text-xs text-white/60 mb-1 block ml-1">
              Soil Type
            </Label>
            <div className="flex flex-col">
              <FormDropdown
                value={fieldData.soilType}
                onChange={(e) => {
                  setFieldData({ ...fieldData, soilType: e.target.value });
                  if (errors.soilType) setErrors({ ...errors, soilType: '' });
                }}
                className="w-full px-4 py-3 h-auto bg-white/10 border-white/20 rounded-lg text-white appearance-none focus:outline-none focus:border-green-500 transition-colors [&>option]:text-black"
                error={errors.soilType || ''}
              >
                <option value="Clay">Clay</option>
                <option value="Sandy">Sandy</option>
                <option value="Loamy">Loamy</option>
                <option value="Chalky">Chalky</option>
                <option value="Mixed">Mixed</option>
              </FormDropdown>
            </div>
          </div>

          {/* pH Level & Irrigation */}
          <div className="grid grid-cols-2 gap-4">
            <FormInput
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
              className="w-full px-4 py-3 bg-white/10 border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-green-500 transition-colors"
            />
            <FormDropdown
              value={fieldData.irrigationMethod}
              onChange={(e) =>
                setFieldData({ ...fieldData, irrigationMethod: e.target.value })
              }
              className="px-4 py-3 h-auto bg-white/10 border border-white/20 rounded-lg text-white appearance-none focus:outline-none focus:border-green-500 transition-colors [&>option]:text-black"
            >
              <option value="Drip">Drip</option>
              <option value="Sprinkler">Sprinkler</option>
              <option value="Flood">Flood</option>
              <option value="Manual">Manual</option>
            </FormDropdown>
          </div>

          <Button
            type="submit"
            className="w-full py-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all active:scale-[0.98] mt-6 text-lg"
          >
            Next: Crop Details
          </Button>
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

export default FieldDetails;
