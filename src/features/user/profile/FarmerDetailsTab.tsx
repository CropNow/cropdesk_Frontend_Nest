import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail } from 'lucide-react';

const FarmerDetailsTab = ({
  farmer,
  onUpdate,
  onDelete,
}: {
  farmer: any;
  onUpdate: (data: any) => void;
  onDelete: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // Initialize with default matching the structure
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    address: '',
    village: '',
    district: '',
    state: '',
  });

  useEffect(() => {
    if (farmer) {
      setFormData({
        name: farmer.name || '',
        phoneNumber: farmer.phoneNumber || '',
        email: farmer.email || '',
        address: farmer.address || '',
        village: farmer.village || '',
        district: farmer.district || '',
        state: farmer.state || '',
      });
    }
  }, [farmer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (isEditing) {
      onUpdate({ ...farmer, ...formData });
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-8">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground">Farmer Details</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Personal information
        </p>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Name */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
            Full Name
          </label>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-muted rounded-xl">
              <User size={18} className="text-foreground" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              readOnly={!isEditing}
              onChange={handleChange}
              className={`w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : 'focus:ring-2 focus:ring-green-500/50'}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phone */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              Phone Number
            </label>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-muted rounded-xl">
                <Phone size={18} className="text-foreground" />
              </div>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber || ''}
                readOnly={!isEditing}
                onChange={handleChange}
                className={`w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : 'focus:ring-2 focus:ring-green-500/50'}`}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              Email Address
            </label>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-muted rounded-xl">
                <Mail size={18} className="text-foreground" />
              </div>
              <input
                type="text"
                name="email"
                value={formData.email || ''}
                readOnly={!isEditing}
                onChange={handleChange}
                className={`w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : 'focus:ring-2 focus:ring-green-500/50'}`}
              />
            </div>
          </div>
        </div>

        <hr className="border-border my-2" />

        {/* Address */}
        <div>
          <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
            Address
          </label>
          <div className="flex items-start gap-3">
            <div className="p-3 bg-muted rounded-xl">
              <MapPin size={18} className="text-foreground" />
            </div>
            <textarea
              name="address"
              value={formData.address || ''}
              readOnly={!isEditing}
              onChange={handleChange}
              className={`w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none resize-none h-24 ${!isEditing ? 'cursor-default' : 'focus:ring-2 focus:ring-green-500/50'}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Village */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              Village
            </label>
            <input
              type="text"
              name="village"
              value={formData.village || ''}
              readOnly={!isEditing}
              onChange={handleChange}
              className={`w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : 'focus:ring-2 focus:ring-green-500/50'}`}
            />
          </div>
          {/* District */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              District
            </label>
            <input
              type="text"
              name="district"
              value={formData.district || ''}
              readOnly={!isEditing}
              onChange={handleChange}
              className={`w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : 'focus:ring-2 focus:ring-green-500/50'}`}
            />
          </div>
          {/* State */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              State
            </label>
            <input
              type="text"
              name="state"
              value={formData.state || ''}
              readOnly={!isEditing}
              onChange={handleChange}
              className={`w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : 'focus:ring-2 focus:ring-green-500/50'}`}
            />
          </div>
        </div>

        {/* Actions for Farmer Tab */}
        <div className="flex gap-3 mt-8 border-t border-border pt-6">
          <button
            onClick={handleSave}
            className={`w-fit px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              isEditing
                ? 'bg-green-500 text-black border-transparent hover:bg-green-400'
                : 'bg-secondary text-foreground hover:bg-muted border-transparent'
            }`}
          >
            {isEditing ? 'Save Details' : 'Edit Details'}
          </button>
          <button
            onClick={onDelete}
            className="w-fit px-4 py-2 bg-[#ffe4e6] text-[#e11d48] border border-transparent rounded-xl text-xs font-bold hover:bg-[#ffced4] transition-all"
          >
            Delete Farmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmerDetailsTab;
