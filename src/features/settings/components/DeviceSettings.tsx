import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeviceKind, DeviceSettingsState } from "./SettingsLayout";
import { useDevices } from "@features/devices/hooks/useDevices";
import { sensorsAPI } from "@features/sensors/api/sensors.api";
import { useDeviceWizard } from "../hooks/useDeviceWizard";
import { DeviceCardList } from "./device/DeviceCardList";
import { DeviceWizard } from "./device/DeviceWizard";

interface NewDevicePayload {
  type: DeviceKind;
  name: string;
  serialNumber: string;
  manufacturer: string;
  fieldId: string;
}

interface DeviceSettingsProps {
  devices: DeviceSettingsState[];
  onAdd: (payload: NewDevicePayload) => void;
  onRemove: (id: any) => void;
  onRename: (id: any, name: string) => void;
  onToggleStatus: (id: any) => void;
  onUpdateDetails: (id: any, patch: Partial<DeviceSettingsState>) => void;
  onDevicesLoad: (devices: DeviceSettingsState[]) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function DeviceSettings({
  devices,
  onAdd,
  onRemove,
  onRename,
  onToggleStatus,
  onUpdateDetails,
  onDevicesLoad,
  onSave,
  isSaving,
}: DeviceSettingsProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { fetchDevices } = useDevices();

  const refreshDevices = async (fieldId?: string) => {
    try {
      const data = await fetchDevices(fieldId);
      if (data && Array.isArray(data)) {
        const mappedDevices: DeviceSettingsState[] = data.map((sensor: any) => {
          let mappedType: DeviceKind = "Seed";
          const typeUpper = (sensor.type || "").toUpperCase();
          if (typeUpper === "NEST") {
            mappedType = "NEST";
          } else if (typeUpper === "SEED" || typeUpper === "SOIL") {
            mappedType = "Seed";
          } else if (typeUpper === "DRONE") {
            mappedType = "Drone";
          }

          const statusLower = (sensor.status || "").toLowerCase();
          const mappedStatus: "Connected" | "Offline" =
            statusLower === "active" || statusLower === "connected" ? "Connected" : "Offline";

          return {
            id: sensor._id,
            type: mappedType,
            name: sensor.name || "Unnamed Device",
            status: mappedStatus,
            serialNumber: sensor.serialNumber || sensor._id?.toString() || "N/A",
            model: sensor.model || "ms-200",
            manufacturer: sensor.manufacturer || "cropnow",
            fieldId: sensor.fieldId || "N/A",
            firmware: sensor.firmware || "v1.0",
            connectedOn: sensor.createdAt
              ? new Date(sensor.createdAt).toLocaleDateString("en-US")
              : "N/A",
          };
        });
        onDevicesLoad(mappedDevices);
      }
    } catch (err) {
      // Ignored
    }
  };

  useEffect(() => {
    refreshDevices();
  }, []);

  const {
    showWizard,
    setShowWizard,
    step,
    error: wizardError,
    successMessage: wizardSuccessMessage,
    wizardData,
    updateWizardData,
    resetWizard,
    goNext,
    goPrev,
    submitWizard,
  } = useDeviceWizard({
    onAdd,
    refreshDevices,
    navigate,
  });

  const handleSave = async () => {
    const hasEmptyName = devices.some((device) => !device.name.trim());

    if (hasEmptyName) {
      setError("Every device must have a name before saving.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await Promise.all(
        devices.map((device) =>
          sensorsAPI.updateSensor(device.id, {
            name: device.name,
          }),
        ),
      );

      onSave();
    } catch (err) {
      setError("Failed to save changes. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (
      !window.confirm("Are you sure you want to delete this device? This action cannot be undone.")
    ) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await sensorsAPI.deleteSensor(id);
      onRemove(id);
    } catch (err) {
      setError("Failed to delete device. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className={showWizard ? "pointer-events-none select-none blur-sm" : ""}>
        <DeviceCardList
          devices={devices}
          onRename={onRename}
          onToggleStatus={onToggleStatus}
          onUpdateDetails={onUpdateDetails}
          handleDelete={handleDelete}
          handleSave={handleSave}
          onAddClick={() => setShowWizard(true)}
          error={error}
          isSaving={isSaving}
          isSubmitting={isSubmitting}
        />
      </div>

      {showWizard && (
        <DeviceWizard
          step={step}
          wizardData={wizardData}
          isSubmitting={isSubmitting}
          error={wizardError}
          successMessage={wizardSuccessMessage}
          onChange={updateWizardData}
          goNext={goNext}
          goPrev={goPrev}
          submitWizard={submitWizard}
          resetWizard={resetWizard}
        />
      )}
    </div>
  );
}
