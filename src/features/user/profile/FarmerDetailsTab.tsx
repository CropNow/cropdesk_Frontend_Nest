import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail } from 'lucide-react';

const FarmerDetailsTab = () => {
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
    const storedUserStr = localStorage.getItem('registeredUser');
    if (storedUserStr) {
      try {
        const user = JSON.parse(storedUserStr);
        if (user.farmerDetails) {
          setFormData((prev) => ({
            ...prev,
            ...user.farmerDetails,
          }));
        } else if (user.firstName) {
          // Fallback if no specific farmer details but user is registered
          // This handles the "Skip" case where we might only have basic user info
          setFormData((prev) => ({
            ...prev,
            name: `${user.firstName} ${user.lastName || ''}`,
            email: user.email || '',
            phoneNumber: user.phone || '',
          }));
        }
      } catch (e) {
        console.error('Error parsing user data', e);
      }
    }
  }, []);

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
              value={formData.name || ''}
              readOnly
              className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none cursor-default"
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
                value={formData.phoneNumber || ''}
                readOnly
                className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none cursor-default"
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
                value={formData.email || ''}
                readOnly
                className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none cursor-default"
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
              value={formData.address || ''}
              readOnly
              className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none cursor-default resize-none h-24"
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
              value={formData.village || ''}
              readOnly
              className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none cursor-default"
            />
          </div>
          {/* District */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              District
            </label>
            <input
              type="text"
              value={formData.district || ''}
              readOnly
              className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none cursor-default"
            />
          </div>
          {/* State */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
              State
            </label>
            <input
              type="text"
              value={formData.state || ''}
              readOnly
              className="w-full bg-secondary rounded-xl text-foreground font-semibold px-4 py-3 text-sm focus:outline-none cursor-default"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDetailsTab;
