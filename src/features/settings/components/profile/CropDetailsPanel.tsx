import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { dashboardAPI } from "@features/dashboard/api/dashboard.api";
import { cropsAPI } from "@services/api/crops.api";
import { Trash2 } from "lucide-react";

export function CropDetailsPanel() {
  const [farms, setFarms] = useState<any[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);

  const [crops, setCrops] = useState<any[]>([]);
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    plantingDate: "",
    expectedHarvest: "",
    area: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        setIsLoading(true);
        const res = await dashboardAPI.getFarms();
        const data = res.data?.data?.farms || res.data?.data || res.data || [];
        const farmsList = Array.isArray(data) ? data : [];
        setFarms(farmsList);
        if (farmsList.length > 0) {
          setSelectedFarmId(farmsList[0].id || farmsList[0]._id);
        }
      } catch (err: any) {
        setError("Failed to fetch farms");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFarms();
  }, []);

  useEffect(() => {
    if (!selectedFarmId) return;
    const fetchCrops = async () => {
      try {
        const res = await dashboardAPI.getFarmDevices(selectedFarmId);
        const data =
          res.data?.data || res.data?.devices || (Array.isArray(res.data) ? res.data : []);
        const extractedCrops: any[] = [];
        if (Array.isArray(data)) {
          data.forEach((d) => {
            if (Array.isArray(d.crops)) {
              d.crops.forEach((c: any) => {
                if (
                  c &&
                  !extractedCrops.some(
                    (existing) => (existing.id || existing._id) === (c.id || c._id),
                  )
                ) {
                  extractedCrops.push(c);
                }
              });
            }
          });
        }
        setCrops(extractedCrops);
        if (extractedCrops.length > 0) {
          handleSelectCrop(extractedCrops[0]);
        } else {
          setSelectedCropId(null);
        }
      } catch (err) {}
    };
    fetchCrops();
  }, [selectedFarmId]);

  const handleSelectCrop = (crop: any) => {
    setSelectedCropId(crop.id || crop._id);
    setFormData({
      name: crop.name || "",
      plantingDate: crop.plantingDate || crop.sowingDate || "",
      expectedHarvest: crop.expectedHarvestDate || crop.harvestDate || "",
      area: crop.area || crop.cultivationArea || "",
    });
    setError("");
    setSuccessMsg("");
  };

  const handleSave = async () => {
    if (!selectedCropId) return;
    try {
      setIsSaving(true);
      setError("");
      setSuccessMsg("");
      await cropsAPI.updateCrop(selectedCropId, {
        name: formData.name,
        plantingDate: new Date(formData.plantingDate).toISOString(),
        expectedHarvestDate: new Date(formData.expectedHarvest).toISOString(),
        area: parseFloat(formData.area) || 0,
      });
      setSuccessMsg("Crop details updated successfully.");
      setCrops(
        crops.map((c) =>
          c.id === selectedCropId || c._id === selectedCropId
            ? {
                ...c,
                name: formData.name,
                plantingDate: formData.plantingDate,
                expectedHarvestDate: formData.expectedHarvest,
                area: formData.area,
              }
            : c,
        ),
      );
    } catch (err: any) {
      setError("Failed to update crop details.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCropId) return;
    if (
      !window.confirm("Are you sure you want to delete this crop? This action cannot be undone.")
    ) {
      return;
    }
    try {
      setIsSaving(true);
      setError("");
      setSuccessMsg("");
      await cropsAPI.deleteCrop(selectedCropId);

      const updatedCrops = crops.filter((c) => (c.id || c._id) !== selectedCropId);
      setCrops(updatedCrops);

      if (updatedCrops.length > 0) {
        handleSelectCrop(updatedCrops[0]);
      } else {
        setSelectedCropId(null);
        setFormData({
          name: "",
          plantingDate: "",
          expectedHarvest: "",
          area: "",
        });
      }
      setSuccessMsg("Crop deleted successfully.");
    } catch (err: any) {
      setError("Failed to delete crop.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-4 text-textSecondary">Loading...</div>;

  return (
    <div className="space-y-6">
      <h3 className="mb-4 text-xl font-bold text-textHeading">Crop Details</h3>

      {farms.length > 0 && (
        <label className="space-y-2 block">
          <span className="text-sm font-semibold text-textMuted uppercase">Select Farm</span>
          <select
            value={selectedFarmId || ""}
            onChange={(e) => setSelectedFarmId(e.target.value)}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
          >
            {farms.map((farm) => (
              <option key={farm.id || farm._id} value={farm.id || farm._id}>
                {farm.name}
              </option>
            ))}
          </select>
        </label>
      )}

      {crops.length > 0 ? (
        <div className="space-y-4 pt-4 border-t border-cardBorder">
          <label className="space-y-2 block">
            <span className="text-sm font-semibold text-textMuted uppercase">Select Crop</span>
            <select
              value={selectedCropId || ""}
              onChange={(e) => {
                const crop = crops.find((c) => (c.id || c._id) === e.target.value);
                if (crop) handleSelectCrop(crop);
              }}
              className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
            >
              {crops.map((crop) => (
                <option key={crop.id || crop._id} value={crop.id || crop._id}>
                  {crop.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-1">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-textMuted uppercase">Crop Name *</span>
              <input
                placeholder="e.g. Wheat, Corn"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-textMuted uppercase">
                Planting Date *
              </span>
              <input
                type="date"
                value={
                  formData.plantingDate
                    ? new Date(formData.plantingDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-textMuted uppercase">
                Expected Harvest *
              </span>
              <input
                type="date"
                value={
                  formData.expectedHarvest
                    ? new Date(formData.expectedHarvest).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => setFormData({ ...formData, expectedHarvest: e.target.value })}
                className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-1">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-textMuted uppercase">
                Cultivation Area (Acres) *
              </span>
              <input
                placeholder="Area in acres"
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
              />
            </label>
          </div>

          {error && <p className="text-sm text-rose-300">{error}</p>}
          {successMsg && <p className="text-sm text-emerald-400">{successMsg}</p>}

          <div className="flex justify-between items-center mt-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-xl border border-accentPrimary/40 bg-accentPrimary/15 px-4 py-2 text-sm font-semibold text-accentPrimary transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </motion.button>

            {selectedCropId && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDelete}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-500 hover:bg-rose-500/20 transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Trash2 className="h-4 w-4" />
                Delete Crop
              </motion.button>
            )}
          </div>
        </div>
      ) : (
        <p className="text-textSecondary text-sm pt-4 border-t border-cardBorder">
          No crops found for this farm.
        </p>
      )}
    </div>
  );
}
