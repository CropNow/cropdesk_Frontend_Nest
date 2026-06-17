import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Cpu, Pencil, Plus, Trash2, X } from "lucide-react";
import { DeviceKind, DeviceSettingsState } from "./SettingsLayout";
import { useDevices } from "@features/devices/hooks/useDevices";
import { farmersAPI } from "@services/api/farmers.api";
import { farmsAPI } from "@services/api/farms.api";
import { fieldsAPI } from "@services/api/fields.api";
import { cropsAPI } from "@services/api/crops.api";
import { sensorsAPI } from "@features/sensors/api/sensors.api";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  useMap,
  Marker,
  Polygon,
} from "react-leaflet";
import { GeomanControls } from "react-leaflet-geoman-v2";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

type WizardStep = 1 | 2 | 3 | 4 | 5;

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

const calculateGeodesicArea = (latLngs: any[]): number => {
  const earthRadius = 6378137; // Radius in meters
  let area = 0;
  const coords = latLngs.map((ll) => [
    (ll.lat * Math.PI) / 180,
    (ll.lng * Math.PI) / 180,
  ]);

  for (let i = 0; i < coords.length; i++) {
    const j = (i + 1) % coords.length;
    area +=
      (coords[j][1] - coords[i][1]) *
      (2 + Math.sin(coords[i][0]) + Math.sin(coords[j][0]));
  }

  area = Math.abs((area * earthRadius * earthRadius) / 2.0);
  return area; // Square meters
};

const blueDotIcon = L.divIcon({
  className: "user-location-marker",
  html: `
    <div style="
      width: 14px;
      height: 14px;
      background: #4285F4;
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(66, 133, 244, 0.6);
      position: relative;
    ">
      <div style="
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border-radius: 50%;
        background: rgba(66, 133, 244, 0.4);
        animation: pulse 2s infinite;
      "></div>
    </div>
    <style>
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(3); opacity: 0; }
      }
    </style>
  `,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const MapUIControls = ({
  isExpanded,
  mapType,
  onToggleExpand,
  onToggleMapType,
  onLocationFound,
}: {
  isExpanded: boolean;
  mapType: "street" | "satellite";
  onToggleExpand: (e: React.MouseEvent) => void;
  onToggleMapType: (e: React.MouseEvent) => void;
  onLocationFound?: (lat: number, lng: number) => void;
}) => {
  const map = useMap();
  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (controlsRef.current) {
      L.DomEvent.disableClickPropagation(controlsRef.current);
      L.DomEvent.disableScrollPropagation(controlsRef.current);
    }
  }, []);

  // Force map to invalidate size when expansion state changes
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 400);
    return () => clearTimeout(timer);
  }, [isExpanded, map]);

  const handleUserLocation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Visual feedback that we are trying to get location
    const originalTitle = e.currentTarget.getAttribute("title");
    e.currentTarget.setAttribute("title", "Locating...");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          map.flyTo([latitude, longitude], 17, {
            animate: true,
            duration: 1.5,
          });
          if (onLocationFound) onLocationFound(latitude, longitude);
          e.currentTarget.setAttribute(
            "title",
            originalTitle || "Use My Location",
          );
        },
        (err) => {
          console.error("Geolocation error:", err);
          let errorMsg = "Unable to get location.";
          if (err.code === 1)
            errorMsg =
              "Location permission denied. Please enable location in your browser settings and refresh.";
          else if (err.code === 2) errorMsg = "Location unavailable.";
          else if (err.code === 3) errorMsg = "Location request timed out.";
          alert(errorMsg);
          e.currentTarget.setAttribute(
            "title",
            originalTitle || "Use My Location",
          );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div
      ref={controlsRef}
      className="absolute inset-0 pointer-events-none z-[1000]"
    >
      {/* Bottom Left: Location Button (Google Style) */}
      <div className="absolute bottom-6 left-3 pointer-events-auto flex flex-col gap-2">
        <button
          type="button"
          onClick={handleUserLocation}
          className={`flex items-center justify-center rounded-xl border border-cardBorder bg-[#1a1c1e] text-textHeading shadow-lg shadow-black/40 hover:bg-[#25282c] transition-all active:scale-95 group ${isExpanded ? "px-4 py-2 gap-2 h-11" : "h-10 w-10"}`}
          title="Use My Location"
        >
          <span
            className={`${isExpanded ? "text-xl" : "text-lg"} transition-transform group-active:scale-125`}
          >
            📍
          </span>
          {isExpanded && (
            <span className="text-sm font-bold whitespace-nowrap">
              Use My Location
            </span>
          )}
        </button>
      </div>

      {/* Bottom Right: Expand and Satellite Controls (Safe from all toolbars) */}
      <div className="absolute bottom-6 right-3 flex flex-col gap-2 pointer-events-auto">
        <button
          type="button"
          onClick={onToggleExpand}
          className={`flex items-center justify-center rounded-lg border border-cardBorder bg-[#1a1c1e] text-textHeading shadow-lg shadow-black/40 hover:bg-[#25282c] transition-all active:scale-95 ${isExpanded ? "px-3 py-2 gap-2 h-10" : "h-9 w-9"}`}
          title={isExpanded ? "Collapse Map" : "Expand Map"}
        >
          <span className="text-base">{isExpanded ? "✖" : "⛶"}</span>
          {isExpanded && (
            <span className="text-xs font-bold whitespace-nowrap">
              Collapse
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onToggleMapType}
          className={`flex items-center justify-center rounded-lg border border-cardBorder bg-[#1a1c1e] text-textHeading shadow-lg shadow-black/40 hover:bg-[#25282c] transition-all active:scale-95 ${isExpanded ? "px-3 py-2 gap-2 h-10" : "h-9 w-9"}`}
          title={
            mapType === "street"
              ? "Switch to Satellite"
              : "Switch to Street View"
          }
        >
          <span className="text-base">
            {mapType === "street" ? "🛰️" : "🗺️"}
          </span>
          {isExpanded && (
            <span className="text-xs font-bold whitespace-nowrap">
              {mapType === "street" ? "Satellite" : "Normal"}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

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
  const [showWizard, setShowWizard] = useState(false);
  const [step, setStep] = useState<WizardStep>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingId, setEditingId] = useState<any>(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [mapType, setMapType] = useState<"street" | "satellite">("street");
  const { fetchDevices } = useDevices();

  const refreshDevices = async (fieldId?: string) => {
    try {
      const data = await fetchDevices(fieldId);
      if (data && Array.isArray(data)) {
        const mappedDevices: DeviceSettingsState[] = data.map((sensor: any) => {
          // Map backend type to frontend DeviceKind
          let mappedType: DeviceKind = "Seed";
          const typeUpper = (sensor.type || "").toUpperCase();
          if (typeUpper === "NEST") {
            mappedType = "NEST";
          } else if (typeUpper === "SEED" || typeUpper === "SOIL") {
            mappedType = "Seed";
          } else if (typeUpper === "DRONE") {
            mappedType = "Drone";
          }

          // Map backend status to frontend status
          const statusLower = (sensor.status || "").toLowerCase();
          const mappedStatus: "Connected" | "Offline" =
            statusLower === "active" || statusLower === "connected"
              ? "Connected"
              : "Offline";

          return {
            id: sensor._id,
            type: mappedType,
            name: sensor.name || "Unnamed Device",
            status: mappedStatus,
            serialNumber:
              sensor.serialNumber || sensor._id?.toString() || "N/A",
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
      console.error("Failed to load devices:", err);
    }
  };

  useEffect(() => {
    refreshDevices();
  }, []);

  const [wizardData, setWizardData] = useState({
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
    farmingType: "Conventional",
    installDate: new Date().toLocaleDateString("en-US"),
    installer: "CropNow Team",
    notes: "",
    farmerId: "",
    farmId: "",
    fieldId: "",
    cropId: "",
    location: "",
    boundaryCoordinates: [] as [number, number][],
  });

  const resetWizard = () => {
    setShowWizard(false);
    setStep(1);
    setWizardData({
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
      type: "Seed",
      serialNumber: "",
      manufacturer: "",
      addressLine: "",
      city: "",
      state: "",
      country: "India",
      zipCode: "",
      farmingType: "Conventional",
      installDate: new Date().toLocaleDateString("en-US"),
      installer: "CropNow Team",
      notes: "",
      farmerId: "",
      farmId: "",
      fieldId: "",
      cropId: "",
      location: "",
      boundaryCoordinates: [] as [number, number][],
    });
    setError("");
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
          setWizardData((prev) => ({ ...prev, farmerId: createdFarmer._id }));
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
          unit: "acres", // Defaulting to acres
          soilType: wizardData.soilType.toLowerCase(),
          irrigationType: wizardData.irrigationType.toLowerCase(),
          farmingType: wizardData.farmingType,
        });

        if (response.data?.data?._id) {
          setWizardData((prev) => ({
            ...prev,
            farmId: response.data.data._id,
          }));
        }
      }

      if (step === 3) {
        if (!wizardData.fieldName.trim() || !wizardData.area.trim()) {
          setError("Field details are required.");
          setIsSubmitting(false);
          return;
        }

        if (
          !wizardData.boundaryCoordinates ||
          wizardData.boundaryCoordinates.length < 4
        ) {
          setError(
            "Please draw a valid field boundary on the map (minimum 4 points required).",
          );
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
          setWizardData((prev) => ({ ...prev, fieldId: createdFieldId }));
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
          expectedHarvestDate: new Date(
            wizardData.expectedHarvest,
          ).toISOString(),
          area: parseFloat(wizardData.cultivationArea) || 0,
        });

        const createdCropId = response.data?.data?._id || response.data?._id;
        if (createdCropId) {
          setWizardData((prev) => ({ ...prev, cropId: createdCropId }));
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
      console.error("Wizard error:", err);
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

      console.log("Final Sensor Payload:", JSON.stringify(payload, null, 2));

      await sensorsAPI.createSensor(payload);

      onAdd({
        type: wizardData.type,
        name: wizardData.name.trim(),
        serialNumber: wizardData.serialNumber.trim(),
        manufacturer: wizardData.manufacturer.trim() || "GGSPL",
        fieldId: wizardData.fieldId,
      });

      // Refresh device list from backend
      await refreshDevices(wizardData.fieldId);

      setSuccessMessage(
        "Device added successfully! Redirecting to dashboard...",
      );

      // Navigate to dashboard after a short delay
      setTimeout(() => {
        resetWizard();
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError("Failed to create device. Please try again.");
      console.error("Submit wizard error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    const hasEmptyName = devices.some((device) => !device.name.trim());

    if (hasEmptyName) {
      setError("Every device must have a name before saving.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      // Update all devices that have been modified
      // NOTE: Backend only allows "name" to be updated via PATCH.
      // Other fields like serialNumber, model, etc. are rejected.
      await Promise.all(
        devices.map((device) =>
          sensorsAPI.updateSensor(device.id, {
            name: device.name,
          }),
        ),
      );

      setSuccessMessage("All changes saved successfully.");
      onSave();

      // Auto-clear success message
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(
        "Failed to save changes. Please check your connection and try again.",
      );
      console.error("Save error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this device? This action cannot be undone.",
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      await sensorsAPI.deleteSensor(id);
      setSuccessMessage("Device deleted successfully.");
      onRemove(id); // Update parent state immediately

      // Auto-clear success message
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to delete device. Please try again.");
      console.error("Delete error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={showWizard ? "pointer-events-none select-none blur-sm" : ""}
      >
        <div className="rounded-2xl border border-cardBorder bg-bgInput p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-textBody">
              Add New Device
            </p>
            <button
              type="button"
              onClick={() => setShowWizard(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-accentPrimary/40 bg-accentPrimary/15 px-4 py-2 text-sm font-semibold text-accentPrimary"
            >
              <Plus className="h-4 w-4" />
              Add Device
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {devices.map((device) => (
            <motion.div
              key={device.id}
              layout
              className="rounded-2xl border border-cardBorder bg-bgInput p-4"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-accentPrimary/15 text-accentPrimary">
                    <Cpu className="h-5 w-5" />
                  </span>
                  <div>
                    {editingId === device.id ? (
                      <input
                        value={device.name}
                        onChange={(event) =>
                          onRename(device.id, event.target.value)
                        }
                        className="w-full rounded-lg border border-cardBorder bg-bgInput px-2 py-1 text-xl font-bold text-textHeading outline-none transition focus:border-accentPrimary/60"
                      />
                    ) : (
                      <p className="text-xl font-bold text-textHeading">
                        {device.name}
                      </p>
                    )}
                    <p className="text-sm uppercase text-textSecondary">
                      {device.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onToggleStatus(device.id)}
                    className={[
                      "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition",
                      device.status === "Connected"
                        ? "bg-rose-200 text-rose-600"
                        : "bg-amber-200 text-amber-700",
                    ].join(" ")}
                  >
                    {device.status === "Connected" ? "Active" : "Offline"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setEditingId(editingId === device.id ? null : device.id)
                    }
                    className="text-textLabel transition hover:text-textHeading"
                    aria-label="Edit device"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(device.id)}
                    className="text-textLabel transition hover:text-rose-300 disabled:opacity-50"
                    disabled={isSubmitting}
                    aria-label="Remove device"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-textMuted">
                    Serial Number
                  </p>
                  {editingId === device.id ? (
                    <input
                      value={device.serialNumber}
                      onChange={(event) =>
                        onUpdateDetails(device.id, {
                          serialNumber: event.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-lg border border-cardBorder bg-bgInput px-2 py-1 text-sm text-textHeading outline-none"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-textHeading">
                      {device.serialNumber}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-textMuted">
                    Model
                  </p>
                  {editingId === device.id ? (
                    <input
                      value={device.model}
                      onChange={(event) =>
                        onUpdateDetails(device.id, {
                          model: event.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-lg border border-cardBorder bg-bgInput px-2 py-1 text-sm text-textHeading outline-none"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-textHeading">
                      {device.model}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-textMuted">
                    Manufacturer
                  </p>
                  {editingId === device.id ? (
                    <input
                      value={device.manufacturer}
                      onChange={(event) =>
                        onUpdateDetails(device.id, {
                          manufacturer: event.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-lg border border-cardBorder bg-bgInput px-2 py-1 text-sm text-textHeading outline-none"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-textHeading">
                      {device.manufacturer}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-textMuted">
                    Field ID
                  </p>
                  {editingId === device.id ? (
                    <input
                      value={device.fieldId}
                      onChange={(event) =>
                        onUpdateDetails(device.id, {
                          fieldId: event.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-lg border border-cardBorder bg-bgInput px-2 py-1 text-sm text-textHeading outline-none"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-textHeading">
                      {device.fieldId}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-textMuted">
                    Firmware
                  </p>
                  {editingId === device.id ? (
                    <input
                      value={device.firmware}
                      onChange={(event) =>
                        onUpdateDetails(device.id, {
                          firmware: event.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-lg border border-cardBorder bg-bgInput px-2 py-1 text-sm text-textHeading outline-none"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-textHeading">
                      {device.firmware}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-textMuted">
                    Connected
                  </p>
                  {editingId === device.id ? (
                    <input
                      value={device.connectedOn}
                      onChange={(event) =>
                        onUpdateDetails(device.id, {
                          connectedOn: event.target.value,
                        })
                      }
                      className="mt-1 w-full rounded-lg border border-cardBorder bg-bgInput px-2 py-1 text-sm text-textHeading outline-none"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-textHeading">
                      {device.connectedOn}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={isSaving || isSubmitting}
          className="rounded-xl border border-accentPrimary/40 bg-accentPrimary/15 px-4 py-2 text-sm font-semibold text-accentPrimary transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving || isSubmitting ? "Saving..." : "Save Changes"}
        </motion.button>
      </div>

      {showWizard ? (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="max-h-[96vh] w-full max-w-6xl overflow-y-auto rounded-[2rem] border border-cardBorder bg-bgSidebar">
            <div className="border-b border-cardBorder p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-accentPrimary/30 bg-accentPrimary/10 text-accentPrimary">
                    <Cpu className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-3xl font-bold text-textHeading">
                      Add New Device
                    </h3>
                    <p className="text-base text-textSecondary">
                      Register sensor or IoT device
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={resetWizard}
                  className="rounded-lg p-2 text-textHint transition hover:bg-cardBg hover:text-textHeading"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="border-b border-cardBorder px-6 py-4">
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {[
                  { id: 1, title: "Farmer Details" },
                  { id: 2, title: "Farm Details" },
                  { id: 3, title: "Field Details" },
                  { id: 4, title: "Crop Details" },
                  { id: 5, title: "Device Info" },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex min-w-0 flex-1 items-center gap-3"
                  >
                    <span
                      className={[
                        "grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold",
                        step > item.id
                          ? "bg-accentPrimary text-black"
                          : step === item.id
                            ? "border border-accentPrimary bg-accentPrimary/15 text-accentPrimary"
                            : "bg-cardBg text-textHint",
                      ].join(" ")}
                    >
                      {item.id}
                    </span>
                    <span className="whitespace-nowrap text-xs font-semibold text-textSecondary">
                      {item.title}
                    </span>
                    {item.id < 5 ? (
                      <div className="h-px flex-1 rounded-full bg-gradient-to-r from-[#00FF9C]/90 via-[#00FF9C]/35 to-transparent shadow-[0_0_14px_rgba(0,255,156,0.85)]" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5 p-6">
              {step === 1 ? (
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-textHeading">
                    Farmer Details
                  </h4>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                      Full Name *
                    </p>
                    <input
                      value={wizardData.farmerName}
                      onChange={(event) =>
                        setWizardData((prev) => ({
                          ...prev,
                          farmerName: event.target.value,
                        }))
                      }
                      placeholder="Full Name"
                      className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                        Phone Number *
                      </p>
                      <input
                        value={wizardData.phoneNumber}
                        onChange={(event) =>
                          setWizardData((prev) => ({
                            ...prev,
                            phoneNumber: event.target.value,
                          }))
                        }
                        placeholder="Phone Number"
                        className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                        Email Address *
                      </p>
                      <input
                        value={wizardData.emailAddress}
                        onChange={(event) =>
                          setWizardData((prev) => ({
                            ...prev,
                            emailAddress: event.target.value,
                          }))
                        }
                        placeholder="Email Address"
                        className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                        Village *
                      </p>
                      <input
                        value={wizardData.village}
                        onChange={(event) =>
                          setWizardData((prev) => ({
                            ...prev,
                            village: event.target.value,
                          }))
                        }
                        placeholder="Village"
                        className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                        District *
                      </p>
                      <input
                        value={wizardData.district}
                        onChange={(event) =>
                          setWizardData((prev) => ({
                            ...prev,
                            district: event.target.value,
                          }))
                        }
                        placeholder="District"
                        className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                        State *
                      </p>
                      <input
                        value={wizardData.farmerState}
                        onChange={(event) =>
                          setWizardData((prev) => ({
                            ...prev,
                            farmerState: event.target.value,
                          }))
                        }
                        placeholder="State"
                        className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-textHeading">
                    Farm Details
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                        Name *
                      </p>
                      <input
                        value={wizardData.farmName}
                        onChange={(event) =>
                          setWizardData((prev) => ({
                            ...prev,
                            farmName: event.target.value,
                          }))
                        }
                        placeholder="Farm Name"
                        className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                        Address Line *
                      </p>
                      <input
                        value={wizardData.addressLine}
                        onChange={(event) =>
                          setWizardData((prev) => ({
                            ...prev,
                            addressLine: event.target.value,
                          }))
                        }
                        placeholder="Address / Landmark"
                        className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                        City *
                      </p>
                      <input
                        value={wizardData.city}
                        onChange={(event) =>
                          setWizardData((prev) => ({
                            ...prev,
                            city: event.target.value,
                          }))
                        }
                        placeholder="City"
                        className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                        State *
                      </p>
                      <input
                        value={wizardData.state}
                        onChange={(event) =>
                          setWizardData((prev) => ({
                            ...prev,
                            state: event.target.value,
                          }))
                        }
                        placeholder="State"
                        className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                        Country *
                      </p>
                      <input
                        value={wizardData.country}
                        onChange={(event) =>
                          setWizardData((prev) => ({
                            ...prev,
                            country: event.target.value,
                          }))
                        }
                        placeholder="Country"
                        className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                        Zipcode *
                      </p>
                      <input
                        value={wizardData.zipCode}
                        onChange={(event) =>
                          setWizardData((prev) => ({
                            ...prev,
                            zipCode: event.target.value,
                          }))
                        }
                        placeholder="Zip Code"
                        className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                        Soil Type *
                      </p>
                      <select
                        value={wizardData.soilType}
                        onChange={(event) =>
                          setWizardData((prev) => ({
                            ...prev,
                            soilType: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                      >
                        <option value="Loamy">Loamy</option>
                        <option value="Sandy Loam">Sandy Loam</option>
                        <option value="Clay Loam">Clay Loam</option>
                        <option value="Silt Loam">Silt Loam</option>
                      </select>
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                        Irrigation Type *
                      </p>
                      <select
                        value={wizardData.irrigationType}
                        onChange={(event) =>
                          setWizardData((prev) => ({
                            ...prev,
                            irrigationType: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                      >
                        <option value="Drip">Drip</option>
                        <option value="Sprinkler">Sprinkler</option>
                        <option value="Furrow">Furrow</option>
                        <option value="Pivot">Pivot</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                      Farming Type *
                    </p>
                    <select
                      value={wizardData.farmingType}
                      onChange={(event) =>
                        setWizardData((prev) => ({
                          ...prev,
                          farmingType: event.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                    >
                      <option value="Conventional">Conventional</option>
                      <option value="organic">Organic</option>
                      <option value="Mixed">Mixed</option>
                    </select>
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-textHeading">
                    Field Details
                  </h4>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                      Field Name *
                    </p>
                    <input
                      value={wizardData.fieldName}
                      onChange={(event) =>
                        setWizardData((prev) => ({
                          ...prev,
                          fieldName: event.target.value,
                        }))
                      }
                      placeholder="Field Name"
                      className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                        Area *
                      </p>
                      <input
                        value={wizardData.area}
                        onChange={(event) =>
                          setWizardData((prev) => ({
                            ...prev,
                            area: event.target.value,
                          }))
                        }
                        placeholder="Area (e.g. 5)"
                        className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                        Boundary Type *
                      </p>
                      <select
                        value={wizardData.boundaryType}
                        onChange={(event) =>
                          setWizardData((prev) => ({
                            ...prev,
                            boundaryType: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                      >
                        <option value="Polygon">Polygon</option>
                        <option value="Rectangle">Rectangle</option>
                        <option value="Circle">Circle</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                      Field Location (Draw Shape) *
                    </p>
                    <div className="relative z-[1] h-64 w-full overflow-hidden rounded-2xl border border-cardBorder bg-bgInput">
                      <MapContainer
                        center={[12.9716, 77.5946]}
                        zoom={13}
                        style={{ height: "100%", width: "100%", zIndex: 1 }}
                      >
                        <TileLayer
                          url={
                            mapType === "street"
                              ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                          }
                          attribution={
                            mapType === "street"
                              ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                              : "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                          }
                        />
                        <MapUIControls
                          isExpanded={isMapExpanded}
                          mapType={mapType}
                          onToggleExpand={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsMapExpanded(!isMapExpanded);
                          }}
                          onToggleMapType={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setMapType((prev) =>
                              prev === "street" ? "satellite" : "street",
                            );
                          }}
                          onLocationFound={(lat, lng) =>
                            setUserLocation([lat, lng])
                          }
                        />
                        {userLocation && (
                          <Marker position={userLocation} icon={blueDotIcon} />
                        )}
                        {wizardData.boundaryCoordinates &&
                          wizardData.boundaryCoordinates.length > 0 && (
                            <Polygon
                              positions={wizardData.boundaryCoordinates.map(
                                (coord) => [coord[1], coord[0]],
                              )}
                              pathOptions={{
                                color: "#00FF9C",
                                fillColor: "#00FF9C",
                                fillOpacity: 0.2,
                              }}
                            />
                          )}
                        <FeatureGroup>
                          <GeomanControls
                            options={{
                              position: "topright",
                              drawText: false,
                              drawCircle: false,
                              drawCircleMarker: false,
                              drawMarker: false,
                              drawPolyline: false,
                              drawRectangle: true,
                              drawPolygon: true,
                              editMode: true,
                              dragMode: false,
                              cutPolygon: false,
                              removalMode: true,
                              rotateMode: false,
                            }}
                            globalOptions={{
                              continueDrawing: false,
                              editable: true,
                              pathOptions: {
                                color: "#00FF9C",
                                fillColor: "#00FF9C",
                                fillOpacity: 0.2,
                              },
                            }}
                            onCreate={(e: any) => {
                              const layer = e.layer;
                              if (layer && layer.getLatLngs) {
                                let latlngs = layer.getLatLngs();
                                if (
                                  latlngs &&
                                  latlngs.length > 0 &&
                                  Array.isArray(latlngs[0])
                                ) {
                                  latlngs = latlngs[0];
                                }
                                const coords: [number, number][] = latlngs.map(
                                  (ll: any) => [ll.lng, ll.lat],
                                );

                                if (coords.length > 0) {
                                  const first = coords[0];
                                  const last = coords[coords.length - 1];
                                  if (
                                    first[0] !== last[0] ||
                                    first[1] !== last[1]
                                  ) {
                                    coords.push([...first]);
                                  }
                                }

                                const areaSqM = calculateGeodesicArea(latlngs);
                                const areaAcres = (
                                  areaSqM * 0.000247105
                                ).toFixed(2);

                                setWizardData((prev) => ({
                                  ...prev,
                                  area: areaAcres,
                                  boundaryCoordinates: coords,
                                }));
                              }
                            }}
                            onChange={(e: any) => {
                              const layer = e.layer;
                              if (layer && layer.getLatLngs) {
                                let latlngs = layer.getLatLngs();
                                if (
                                  latlngs &&
                                  latlngs.length > 0 &&
                                  Array.isArray(latlngs[0])
                                ) {
                                  latlngs = latlngs[0];
                                }
                                const coords: [number, number][] = latlngs.map(
                                  (ll: any) => [ll.lng, ll.lat],
                                );
                                if (coords.length > 0) {
                                  const first = coords[0];
                                  const last = coords[coords.length - 1];
                                  if (
                                    first[0] !== last[0] ||
                                    first[1] !== last[1]
                                  ) {
                                    coords.push([...first]);
                                  }
                                }

                                const areaSqM = calculateGeodesicArea(latlngs);
                                const areaAcres = (
                                  areaSqM * 0.000247105
                                ).toFixed(2);

                                setWizardData((prev) => ({
                                  ...prev,
                                  area: areaAcres,
                                  boundaryCoordinates: coords,
                                }));
                              }
                            }}
                            onUpdate={(e: any) => {
                              const layer = e.layer;
                              if (layer && layer.getLatLngs) {
                                let latlngs = layer.getLatLngs();
                                if (
                                  latlngs &&
                                  latlngs.length > 0 &&
                                  Array.isArray(latlngs[0])
                                ) {
                                  latlngs = latlngs[0];
                                }
                                const coords: [number, number][] = latlngs.map(
                                  (ll: any) => [ll.lng, ll.lat],
                                );
                                if (coords.length > 0) {
                                  const first = coords[0];
                                  const last = coords[coords.length - 1];
                                  if (
                                    first[0] !== last[0] ||
                                    first[1] !== last[1]
                                  ) {
                                    coords.push([...first]);
                                  }
                                }

                                const areaSqM = calculateGeodesicArea(latlngs);
                                const areaAcres = (
                                  areaSqM * 0.000247105
                                ).toFixed(2);

                                setWizardData((prev) => ({
                                  ...prev,
                                  area: areaAcres,
                                  boundaryCoordinates: coords,
                                }));
                              }
                            }}
                            onMapRemove={() => {
                              setWizardData((prev) => ({
                                ...prev,
                                boundaryCoordinates: [],
                              }));
                            }}
                          />
                        </FeatureGroup>
                      </MapContainer>
                    </div>

                    {/* Centered Modal Expanded Map via Portal */}
                    {isMapExpanded &&
                      createPortal(
                        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300 p-4 sm:p-8">
                          <div className="relative h-[80vh] w-[90vw] max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#1a1c1e] shadow-2xl animate-in zoom-in-95 duration-300">
                            <MapContainer
                              center={
                                userLocation ||
                                (wizardData.boundaryCoordinates?.[0]
                                  ? [
                                      wizardData.boundaryCoordinates[0][1],
                                      wizardData.boundaryCoordinates[0][0],
                                    ]
                                  : [12.9716, 77.5946])
                              }
                              zoom={16}
                              style={{
                                height: "100%",
                                width: "100%",
                                zIndex: 1,
                              }}
                            >
                              <TileLayer
                                url={
                                  mapType === "street"
                                    ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                }
                                attribution={
                                  mapType === "street"
                                    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                    : "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                                }
                              />
                              <MapUIControls
                                isExpanded={true}
                                mapType={mapType}
                                onToggleExpand={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setIsMapExpanded(false);
                                }}
                                onToggleMapType={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setMapType((prev) =>
                                    prev === "street" ? "satellite" : "street",
                                  );
                                }}
                                onLocationFound={(lat, lng) =>
                                  setUserLocation([lat, lng])
                                }
                              />
                              {userLocation && (
                                <Marker
                                  position={userLocation}
                                  icon={blueDotIcon}
                                />
                              )}
                              {wizardData.boundaryCoordinates &&
                                wizardData.boundaryCoordinates.length > 0 && (
                                  <Polygon
                                    positions={wizardData.boundaryCoordinates.map(
                                      (coord) => [coord[1], coord[0]],
                                    )}
                                    pathOptions={{
                                      color: "#00FF9C",
                                      fillColor: "#00FF9C",
                                      fillOpacity: 0.2,
                                    }}
                                  />
                                )}
                              <FeatureGroup>
                                <GeomanControls
                                  options={{
                                    position: "topright",
                                    drawText: false,
                                    drawCircle: false,
                                    drawCircleMarker: false,
                                    drawMarker: false,
                                    drawPolyline: false,
                                    drawRectangle: true,
                                    drawPolygon: true,
                                    editMode: true,
                                    dragMode: false,
                                    cutPolygon: false,
                                    removalMode: true,
                                    rotateMode: false,
                                  }}
                                  globalOptions={{
                                    continueDrawing: false,
                                    editable: true,
                                    pathOptions: {
                                      color: "#00FF9C",
                                      fillColor: "#00FF9C",
                                      fillOpacity: 0.2,
                                    },
                                  }}
                                  onCreate={(e: any) => {
                                    const layer = e.layer;
                                    if (layer && layer.getLatLngs) {
                                      let latlngs = layer.getLatLngs();
                                      if (
                                        latlngs &&
                                        latlngs.length > 0 &&
                                        Array.isArray(latlngs[0])
                                      ) {
                                        latlngs = latlngs[0];
                                      }
                                      const coords: [number, number][] =
                                        latlngs.map((ll: any) => [
                                          ll.lng,
                                          ll.lat,
                                        ]);

                                      if (coords.length > 0) {
                                        const first = coords[0];
                                        const last = coords[coords.length - 1];
                                        if (
                                          first[0] !== last[0] ||
                                          first[1] !== last[1]
                                        ) {
                                          coords.push([...first]);
                                        }
                                      }

                                      const areaSqM =
                                        calculateGeodesicArea(latlngs);
                                      const areaAcres = (
                                        areaSqM * 0.000247105
                                      ).toFixed(2);

                                      setWizardData((prev) => ({
                                        ...prev,
                                        area: areaAcres,
                                        boundaryCoordinates: coords,
                                      }));
                                    }
                                  }}
                                  onChange={(e: any) => {
                                    const layer = e.layer;
                                    if (layer && layer.getLatLngs) {
                                      let latlngs = layer.getLatLngs();
                                      if (
                                        latlngs &&
                                        latlngs.length > 0 &&
                                        Array.isArray(latlngs[0])
                                      ) {
                                        latlngs = latlngs[0];
                                      }
                                      const coords: [number, number][] =
                                        latlngs.map((ll: any) => [
                                          ll.lng,
                                          ll.lat,
                                        ]);
                                      if (coords.length > 0) {
                                        const first = coords[0];
                                        const last = coords[coords.length - 1];
                                        if (
                                          first[0] !== last[0] ||
                                          first[1] !== last[1]
                                        ) {
                                          coords.push([...first]);
                                        }
                                      }

                                      const areaSqM =
                                        calculateGeodesicArea(latlngs);
                                      const areaAcres = (
                                        areaSqM * 0.000247105
                                      ).toFixed(2);

                                      setWizardData((prev) => ({
                                        ...prev,
                                        area: areaAcres,
                                        boundaryCoordinates: coords,
                                      }));
                                    }
                                  }}
                                />
                              </FeatureGroup>
                            </MapContainer>
                          </div>
                        </div>,
                        document.body,
                      )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                        Soil Type *
                      </p>
                      <select
                        value={wizardData.soilType}
                        onChange={(event) =>
                          setWizardData((prev) => ({
                            ...prev,
                            soilType: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                      >
                        <option value="Loamy">Loamy</option>
                        <option value="Sandy Loam">Sandy Loam</option>
                        <option value="Clay Loam">Clay Loam</option>
                        <option value="Silt Loam">Silt Loam</option>
                      </select>
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                        Irrigation *
                      </p>
                      <select
                        value={wizardData.irrigationType}
                        onChange={(event) =>
                          setWizardData((prev) => ({
                            ...prev,
                            irrigationType: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                      >
                        <option value="Drip">Drip</option>
                        <option value="Sprinkler">Sprinkler</option>
                        <option value="Furrow">Furrow</option>
                        <option value="Pivot">Pivot</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : null}

              {step === 4 ? (
                <div className="space-y-4">
                  <h4 className="text-xl font-semibold text-textHeading">
                    Crop Details
                  </h4>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                      Crop Name *
                    </p>
                    <input
                      value={wizardData.cropName}
                      onChange={(event) =>
                        setWizardData((prev) => ({
                          ...prev,
                          cropName: event.target.value,
                        }))
                      }
                      placeholder="e.g. Wheat, Corn"
                      className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                        Planting Date *
                      </p>
                      <input
                        type="date"
                        value={wizardData.plantingDate}
                        onChange={(event) =>
                          setWizardData((prev) => ({
                            ...prev,
                            plantingDate: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none [color-scheme:dark]"
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                        Expected Harvest *
                      </p>
                      <input
                        type="date"
                        value={wizardData.expectedHarvest}
                        onChange={(event) =>
                          setWizardData((prev) => ({
                            ...prev,
                            expectedHarvest: event.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                      Cultivation Area (Acres) *
                    </p>
                    <input
                      value={wizardData.cultivationArea}
                      onChange={(event) =>
                        setWizardData((prev) => ({
                          ...prev,
                          cultivationArea: event.target.value,
                        }))
                      }
                      placeholder="Area in acres"
                      className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                    />
                  </div>
                </div>
              ) : null}

              {step === 5 ? (
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                    Device Identity *
                  </p>
                  <input
                    value={wizardData.name}
                    onChange={(event) =>
                      setWizardData((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    placeholder="e.g. Field A Moisture Sensor"
                    className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                        Type *
                      </p>
                      <select
                        value={wizardData.type}
                        onChange={(event) =>
                          setWizardData((prev) => ({
                            ...prev,
                            type: event.target.value as DeviceKind,
                          }))
                        }
                        className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                      >
                        <option value="Seed">Soil Sensor</option>
                        <option value="NEST">IoT Tower</option>
                        <option value="Drone">Aero Drone</option>
                      </select>
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                        Selected Field *
                      </p>
                      <div className="w-full rounded-xl border border-cardBorder bg-cardBg/50 px-4 py-3 text-lg text-textHeading">
                        {wizardData.fieldName || "No field selected"}
                        <span className="ml-2 text-xs text-textHint">
                          ({wizardData.fieldId || "No ID"})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                      Serial Number *
                    </p>
                    <input
                      value={wizardData.serialNumber}
                      onChange={(event) =>
                        setWizardData((prev) => ({
                          ...prev,
                          serialNumber: event.target.value,
                        }))
                      }
                      placeholder="Unique Serial No."
                      className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                    />
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">
                      Manufacturer
                    </p>
                    <input
                      value={wizardData.manufacturer}
                      onChange={(event) =>
                        setWizardData((prev) => ({
                          ...prev,
                          manufacturer: event.target.value,
                        }))
                      }
                      placeholder="e.g. CropNow"
                      className="w-full rounded-xl border border-cardBorder bg-bgInput px-4 py-3 text-lg text-textHeading outline-none"
                    />
                  </div>
                </div>
              ) : null}

              {error ? <p className="text-sm text-rose-300">{error}</p> : null}
              {successMessage ? (
                <p className="text-sm font-semibold text-emerald-400">
                  {successMessage}
                </p>
              ) : null}
            </div>

            <div className="border-t border-cardBorder p-6">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={step === 1 ? resetWizard : goPrev}
                  className="rounded-xl px-4 py-2 text-lg font-semibold text-textHint transition hover:text-textHeading"
                >
                  {step === 1 ? "Cancel" : "Back"}
                </button>

                <button
                  type="button"
                  onClick={step === 5 ? submitWizard : goNext}
                  disabled={isSubmitting}
                  className="flex h-12 min-w-[140px] items-center justify-center rounded-2xl bg-accentPrimary px-8 text-lg font-bold text-black transition hover:bg-[#00e68d] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {step === 5 ? "Add Device" : "Next"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
