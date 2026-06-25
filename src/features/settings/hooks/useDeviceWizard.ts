import { useState } from "react";
import { DeviceKind } from "../components/SettingsLayout";
import { farmersAPI } from "@services/api/farmers.api";
import { farmsAPI } from "@services/api/farms.api";
import { fieldsAPI } from "@services/api/fields.api";
import { cropsAPI } from "@services/api/crops.api";
import { sensorsAPI } from "@features/sensors/api/sensors.api";

export type WizardStep = 1 | 2 | 3 | 4 | 5;

export interface NewDevicePayload {
  type: DeviceKind;
  name: string;
  serialNumber: string;
  manufacturer: string;
  fieldId: string;
}

interface UseDeviceWizardProps {
  onAdd: (payload: NewDevicePayload) => void;
  refreshDevices: (fieldId?: string) => Promise<void>;
  navigate: (path: string) => void;
}

export function useDeviceWizard({ onAdd, refreshDevices, navigate }: UseDeviceWizardProps) {
  const [showWizard, setShowWizard] = useState(false);
  const [step, setStep] = useState<WizardStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const initialWizardData = {
    farmerName: "",
    phoneNumber: "",
    emailAddress: "",
    village: "",
    district: "",
    farmerState: "",
    farmName: "",
    fieldName: "",
    area: "",
    boundaryType: "Polygon",
    soilType: "Loamy",
    irrigationType: "Drip",
    cropName: "",
    plantingDate: "",
    expectedHarvest: "",
    cultivationArea: "",
    name: "",
    type: "Seed" as DeviceKind,
    serialNumber: "",
    manufacturer: "",
    addressLine: "",
    city: "",
    state: "",
    country: "India",
    zipCode: "",
    farmingType: "conventional",
    installDate: new Date().toLocaleDateString("en-US"),
    installer: "CropNow Team",
    notes: "",
    farmerId: "",
    farmId: "",
    fieldId: "",
    cropId: "",
    location: "",
    boundaryCoordinates: [] as [number, number][],
  };

  const [wizardData, setWizardData] = useState(initialWizardData);

  const resetWizard = () => {
    setShowWizard(false);
    setStep(1);
    setWizardData(initialWizardData);
    setError("");
    setSuccessMessage("");
  };

  const updateWizardData = (fields: Partial<typeof initialWizardData>) => {
    setWizardData((prev) => ({ ...prev, ...fields }));
  };

  const goNext = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      if (step === 1) {
        if (
          !wizardData.farmerName.trim() ||
          !wizardData.phoneNumber.trim() ||
          !wizardData.emailAddress.trim() ||
          !wizardData.village.trim() ||
          !wizardData.district.trim() ||
          !wizardData.farmerState.trim()
        ) {
          setError("Farmer details are required.");
          setIsSubmitting(false);
          return;
        }

        const response = await farmersAPI.createFarmer({
          name: wizardData.farmerName,
          phone: wizardData.phoneNumber,
          email: wizardData.emailAddress,
          address: {
            village: wizardData.village,
            district: wizardData.district,
            state: wizardData.farmerState,
            country: "India",
          },
        });

        const createdFarmer = response.data?.data || response.data;
        if (createdFarmer?._id) {
          updateWizardData({ farmerId: createdFarmer._id });
        }
      }

      if (step === 2) {
        if (
          !wizardData.farmName.trim() ||
          !wizardData.addressLine.trim() ||
          !wizardData.city.trim() ||
          !wizardData.state.trim() ||
          !wizardData.country.trim() ||
          !wizardData.zipCode.trim() ||
          !wizardData.soilType.trim() ||
          !wizardData.irrigationType.trim() ||
          !wizardData.farmingType.trim()
        ) {
          setError("Farm details are required.");
          setIsSubmitting(false);
          return;
        }

        const response = await farmsAPI.createFarm({
          farmerId: wizardData.farmerId,
          name: wizardData.farmName,
          location: {
            address: wizardData.addressLine,
            city: wizardData.city,
            state: wizardData.state,
            country: wizardData.country,
            zipCode: wizardData.zipCode,
          },
          area: parseFloat(wizardData.area) || 0,
          unit: "acres",
          soilType: wizardData.soilType.toLowerCase(),
          irrigationType: wizardData.irrigationType.toLowerCase(),
          farmingType: wizardData.farmingType,
        });

        if (response.data?.data?._id) {
          updateWizardData({ farmId: response.data.data._id });
        }
      }

      if (step === 3) {
        if (!wizardData.fieldName.trim() || !wizardData.area.trim()) {
          setError("Field details are required.");
          setIsSubmitting(false);
          return;
        }

        if (!wizardData.boundaryCoordinates || wizardData.boundaryCoordinates.length < 4) {
          setError("Please draw a valid field boundary on the map (minimum 4 points required).");
          setIsSubmitting(false);
          return;
        }

        const response = await fieldsAPI.createField({
          farmId: wizardData.farmId,
          name: wizardData.fieldName,
          area: parseFloat(wizardData.area) || 0,
          soil: { type: wizardData.soilType.toLowerCase() },
          irrigation: { type: wizardData.irrigationType.toLowerCase() },
          boundary: {
            type: "Polygon",
            coordinates: [wizardData.boundaryCoordinates],
          },
        });

        const createdFieldId = response.data?.data?._id || response.data?._id;
        if (createdFieldId) {
          updateWizardData({ fieldId: createdFieldId });
        }
      }

      if (step === 4) {
        if (
          !wizardData.cropName.trim() ||
          !wizardData.plantingDate.trim() ||
          !wizardData.expectedHarvest.trim() ||
          !wizardData.cultivationArea.trim()
        ) {
          setError("Crop details are required.");
          setIsSubmitting(false);
          return;
        }

        const response = await cropsAPI.createCrop({
          fieldId: wizardData.fieldId,
          name: wizardData.cropName,
          plantingDate: new Date(wizardData.plantingDate).toISOString(),
          expectedHarvestDate: new Date(wizardData.expectedHarvest).toISOString(),
          area: parseFloat(wizardData.cultivationArea) || 0,
        });

        const createdCropId = response.data?.data?._id || response.data?._id;
        if (createdCropId) {
          updateWizardData({ cropId: createdCropId });
        }
      }

      if (step === 5) {
        if (!wizardData.name.trim() || !wizardData.serialNumber.trim()) {
          setError("Device identity and serial number are required.");
          setIsSubmitting(false);
          return;
        }
      }

      if (step < 5) {
        setStep((prev) => (prev + 1) as WizardStep);
      }
    } catch (err) {
      setError("Failed to save data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goPrev = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as WizardStep);
    }
  };

  const submitWizard = async () => {
    if (!wizardData.name.trim() || !wizardData.serialNumber.trim()) {
      setError("Device identity and serial number are required.");
      return;
    }
    if (!wizardData.fieldId) {
      setError("No field selected. Please complete the Field Details step.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const payload = {
        name: wizardData.name.trim(),
        type: wizardData.type === "Seed" ? "SEED" : "NEST",
        fieldId: wizardData.fieldId,
        unit: "composite",
        serialNumber: wizardData.serialNumber.trim(),
        manufacturer: wizardData.manufacturer.trim() || "GGSPL",
      };

      await sensorsAPI.createSensor(payload);

      onAdd({
        type: wizardData.type,
        name: wizardData.name.trim(),
        serialNumber: wizardData.serialNumber.trim(),
        manufacturer: wizardData.manufacturer.trim() || "GGSPL",
        fieldId: wizardData.fieldId,
      });

      await refreshDevices(wizardData.fieldId);

      setSuccessMessage("Device added successfully! Redirecting to dashboard...");

      setTimeout(() => {
        resetWizard();
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError("Failed to create device. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    showWizard,
    setShowWizard,
    step,
    setStep,
    isSubmitting,
    error,
    setError,
    successMessage,
    wizardData,
    setWizardData,
    updateWizardData,
    resetWizard,
    goNext,
    goPrev,
    submitWizard,
  };
}
