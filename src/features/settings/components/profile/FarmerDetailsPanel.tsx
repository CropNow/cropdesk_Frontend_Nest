import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { dashboardAPI } from "@features/dashboard/api/dashboard.api";
import { farmersAPI } from "@services/api/farmers.api";
import { Trash2 } from "lucide-react";

export function FarmerDetailsPanel() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    village: "",
    district: "",
    state: "",
  });
  const [farmerId, setFarmerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        setIsLoading(true);
        // Try to get farmer from farms list
        const res = await dashboardAPI.getFarms();
        const farmsList =
          res.data?.data?.farms || res.data?.data || res.data || [];
        if (Array.isArray(farmsList) && farmsList.length > 0) {
          const farm = farmsList[0];
          const fid =
            (farm.farmerId && typeof farm.farmerId === "object"
              ? (farm.farmerId._id || farm.farmerId.id)
              : farm.farmerId) ||
            (farm.farmer && (farm.farmer.id || farm.farmer._id));
          if (fid && typeof fid === "string") {
            setFarmerId(fid);
            const farmerRes = await farmersAPI.getFarmer(fid);
            const farmerData = farmerRes.data?.data || farmerRes.data;
            if (farmerData) {
              setFormData({
                name: farmerData.name || "",
                phone: farmerData.phone || "",
                email: farmerData.email || "",
                village:
                  farmerData.address?.village || farmerData.village || "",
                district:
                  farmerData.address?.district || farmerData.district || "",
                state: farmerData.address?.state || farmerData.state || "",
              });
            }
          }
        }
      } catch (err: any) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchFarmerData();
  }, []);

  const handleSave = async () => {
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim()
    ) {
      setError("Full Name, Phone Number, and Email Address are required.");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      setSuccessMsg("");
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: {
          village: formData.village,
          district: formData.district,
          state: formData.state,
          country: "India",
        },
      };

      if (farmerId) {
        await farmersAPI.updateFarmer(farmerId, payload);
        setSuccessMsg("Farmer details updated successfully.");
      } else {
        const res = await farmersAPI.createFarmer(payload);
        const newFarmer = res.data?.data || res.data;
        if (newFarmer && (newFarmer._id || newFarmer.id)) {
          setFarmerId(newFarmer._id || newFarmer.id);
        }
        setSuccessMsg("Farmer details created successfully.");
      }
    } catch (err: any) {
      setError("Failed to save farmer details.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!farmerId) return;
    if (
      !window.confirm(
        "Are you sure you want to delete this farmer profile? This will permanently delete the farmer record.",
      )
    ) {
      return;
    }
    try {
      setIsSaving(true);
      setError("");
      setSuccessMsg("");
      await farmersAPI.deleteFarmer(farmerId);
      setFarmerId(null);
      setFormData({
        name: "",
        phone: "",
        email: "",
        village: "",
        district: "",
        state: "",
      });
      setSuccessMsg("Farmer profile deleted successfully.");
    } catch (err: any) {
      setError("Failed to delete farmer profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return <div className="p-4 text-textSecondary">Loading...</div>;

  return (
    <div className="space-y-6">
      <h3 className="mb-4 text-xl font-bold text-textHeading">
        Farmer Details
      </h3>

      <div className="grid gap-4 sm:grid-cols-1">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-textMuted uppercase">
            Full Name *
          </span>
          <input
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-textMuted uppercase">
            Phone Number *
          </span>
          <input
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-textMuted uppercase">
            Email Address *
          </span>
          <input
            placeholder="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-textMuted uppercase">
            Village *
          </span>
          <input
            placeholder="Village"
            value={formData.village}
            onChange={(e) =>
              setFormData({ ...formData, village: e.target.value })
            }
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-textMuted uppercase">
            District *
          </span>
          <input
            placeholder="District"
            value={formData.district}
            onChange={(e) =>
              setFormData({ ...formData, district: e.target.value })
            }
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-textMuted uppercase">
            State *
          </span>
          <input
            placeholder="State"
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
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

        {farmerId && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDelete}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-500 hover:bg-rose-500/20 transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            Delete Farmer
          </motion.button>
        )}
      </div>
    </div>
  );
}
