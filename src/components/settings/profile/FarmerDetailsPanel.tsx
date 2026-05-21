import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dashboardAPI } from '../../../api/dashboard.api';
import { farmersAPI } from '../../../api/farmers.api';

export function FarmerDetailsPanel() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    village: '',
    district: '',
    state: '',
  });
  const [farmerId, setFarmerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchFarmerData = async () => {
      try {
        setIsLoading(true);
        // Try to get farmer from farms list
        const res = await dashboardAPI.getFarms();
        const farmsList = res.data?.data?.farms || res.data?.data || res.data || [];
        if (Array.isArray(farmsList) && farmsList.length > 0) {
          const farm = farmsList[0];
          const fid = farm.farmerId || (farm.farmer && (farm.farmer.id || farm.farmer._id));
          if (fid) {
            setFarmerId(fid);
            const farmerRes = await farmersAPI.getFarmer(fid);
            const farmerData = farmerRes.data?.data || farmerRes.data;
            if (farmerData) {
              setFormData({
                name: farmerData.name || '',
                phone: farmerData.phone || '',
                email: farmerData.email || '',
                village: farmerData.village || '',
                district: farmerData.district || '',
                state: farmerData.state || '',
              });
            }
          }
        }
      } catch (err: any) {
        console.error('Failed to fetch farmer details', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFarmerData();
  }, []);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setError('Full Name, Phone Number, and Email Address are required.');
      return;
    }
    
    try {
      setIsSaving(true);
      setError('');
      setSuccessMsg('');
      if (farmerId) {
        await farmersAPI.updateFarmer(farmerId, formData);
        setSuccessMsg('Farmer details updated successfully.');
      } else {
        const res = await farmersAPI.createFarmer(formData);
        const newFarmer = res.data?.data || res.data;
        if (newFarmer && (newFarmer._id || newFarmer.id)) {
          setFarmerId(newFarmer._id || newFarmer.id);
        }
        setSuccessMsg('Farmer details created successfully.');
      }
    } catch (err: any) {
      setError('Failed to save farmer details.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-4 text-textSecondary">Loading...</div>;

  return (
    <div className="space-y-6">
      <h3 className="mb-4 text-xl font-bold text-textHeading">Farmer Details</h3>
      
      <div className="grid gap-4 sm:grid-cols-1">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-textMuted uppercase">Full Name *</span>
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
          <span className="text-sm font-semibold text-textMuted uppercase">Phone Number *</span>
          <input
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-textMuted uppercase">Email Address *</span>
          <input
            placeholder="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-textMuted uppercase">Village *</span>
          <input
            placeholder="Village"
            value={formData.village}
            onChange={(e) => setFormData({ ...formData, village: e.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-textMuted uppercase">District *</span>
          <input
            placeholder="District"
            value={formData.district}
            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-textMuted uppercase">State *</span>
          <input
            placeholder="State"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full rounded-xl border border-cardBorder bg-bgInput px-3 py-2 text-sm text-textHeading outline-none transition focus:border-accentPrimary/60"
          />
        </label>
      </div>

      {error && <p className="text-sm text-rose-300">{error}</p>}
      {successMsg && <p className="text-sm text-emerald-400">{successMsg}</p>}

      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        disabled={isSaving}
        className="rounded-xl border border-accentPrimary/40 bg-accentPrimary/15 px-4 py-2 text-sm font-semibold text-accentPrimary transition disabled:cursor-not-allowed disabled:opacity-60 mt-4"
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </motion.button>
    </div>
  );
}
