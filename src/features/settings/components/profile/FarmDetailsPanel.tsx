import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { dashboardAPI } from "@features/dashboard/api/dashboard.api";
import { farmsAPI } from "@services/api/farms.api";

export function FarmDetailsPanel() {
  const [farms, setFarms] = useState<any[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    addressLine: "",
    city: "",
    state: "",
    country: "India",
    zipcode: "",
    soilType: "Loamy",
    irrigationType: "Drip",
    farmingType: "Conventional",
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
          handleSelectFarm(farmsList[0]);
        }
      } catch (err: any) {
        setError("Failed to fetch farms");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFarms();
  }, []);

  const handleSelectFarm = (farm: any) => {
    setSelectedFarmId(farm.id || farm._id);
    setFormData({
      name: farm.name || "",
      addressLine: farm.location?.address || "",
      city: farm.location?.city || "",
      state: farm.location?.state || "",
      country: farm.location?.country || "India",
      zipcode: farm.location?.zipCode || "",
      soilType: farm.soilType || "Loamy",
      irrigationType: farm.irrigationType || "Drip",
      farmingType: farm.farmingType || "Conventional",
    });
    setError("");
    setSuccessMsg("");
  };

  const handleSave = async () => {
    if (!selectedFarmId) return;
    try {
      setIsSaving(true);
      setError("");
      setSuccessMsg("");
      await farmsAPI.updateFarm(selectedFarmId, {
        name: formData.name,
        location: {
          address: formData.addressLine,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipcode,
        },
        soilType: formData.soilType,
        irrigationType: formData.irrigationType,
        farmingType: formData.farmingType,
      });
      setSuccessMsg("Farm details updated successfully.");
      setFarms(
        farms.map((f) =>
          f.id === selectedFarmId || f._id === selectedFarmId
            ? {
                ...f,
                name: formData.name,
                location: {
                  ...f.location,
                  address: formData.addressLine,
                  city: formData.city,
                  state: formData.state,
                  country: formData.country,
                  zipCode: formData.zipcode,
                },
                soilType: formData.soilType,
                irrigationType: formData.irrigationType,
                farmingType: formData.farmingType,
              }
            : f,
        ),
      );
    } catch (err: any) {
      setError("Failed to update farm details.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return <div className="p-4 text-textSecondary">Loading farms...</div>;

  return (
    <div className="space-y-6">
      <h3 className="mb-4 text-xl font-bold text-textHeading">Farm Details</h3>

      {farms.length > 0 ? (
        <div className="space-y-4">
          <label className="space-y-2 block">
            <span className="text-sm font-semibold text-textMuted uppercase">
              Select Farm
            </span>
            <select
              value={selectedFarmId || ""}
              onChange={(e) => {
                const farm = farms.find(
                  (f) => (f.id || f._id) === e.target.value,
                );
                if (farm) handleSelectFarm(farm);
              }}
              className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
            >
              {farms.map((farm) => (
                <option key={farm.id || farm._id} value={farm.id || farm._id}>
                  {farm.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-textMuted uppercase">
                Name *
              </span>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-textMuted uppercase">
                Address Line *
              </span>
              <input
                value={formData.addressLine}
                onChange={(e) =>
                  setFormData({ ...formData, addressLine: e.target.value })
                }
                className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-textMuted uppercase">
                City *
              </span>
              <input
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-textMuted uppercase">
                State *
              </span>
              <input
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-textMuted uppercase">
                Country *
              </span>
              <input
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-textMuted uppercase">
                Zipcode *
              </span>
              <input
                value={formData.zipcode}
                onChange={(e) =>
                  setFormData({ ...formData, zipcode: e.target.value })
                }
                className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-textMuted uppercase">
                Soil Type *
              </span>
              <select
                value={formData.soilType}
                onChange={(e) =>
                  setFormData({ ...formData, soilType: e.target.value })
                }
                className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
              >
                <option value="red_soil">Red Soil</option>
                <option value="black_soil">Black Soil (Regur)</option>
                <option value="laterite_soil">Laterite Soil</option>
                <option value="alluvial_soil">Alluvial Soil</option>
                <option value="sandy_coastal_soil">Sandy / Coastal Soil</option>
                <option value="forest_soil">Forest Soil</option>
                <option value="saline_alkali_soil">Saline / Alkali Soil</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold text-textMuted uppercase">
                Irrigation Type *
              </span>
              <select
                value={formData.irrigationType}
                onChange={(e) =>
                  setFormData({ ...formData, irrigationType: e.target.value })
                }
                className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
              >
                <option value="Drip">Drip</option>
                <option value="Sprinkler">Sprinkler</option>
                <option value="Flood">Flood</option>
                <option value="Rainfed">Rainfed</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-1">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-textMuted uppercase">
                Farming Type *
              </span>
              <select
                value={formData.farmingType}
                onChange={(e) =>
                  setFormData({ ...formData, farmingType: e.target.value })
                }
                className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
              >
                <option value="Conventional">Conventional</option>
                <option value="Organic">Organic</option>
                <option value="Mixed">Mixed</option>
              </select>
            </label>
          </div>

          {error && <p className="text-sm text-rose-300">{error}</p>}
          {successMsg && (
            <p className="text-sm text-emerald-400">{successMsg}</p>
          )}

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl border border-accentPrimary/40 bg-accentPrimary/15 px-4 py-2 text-sm font-semibold text-accentPrimary transition disabled:cursor-not-allowed disabled:opacity-60 mt-4"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </motion.button>
        </div>
      ) : (
        <p className="text-textSecondary text-sm">No farms found.</p>
      )}
    </div>
  );
}
