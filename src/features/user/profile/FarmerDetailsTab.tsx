import React, { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dropdown } from '@/components/ui/dropdown';
import { Subheading } from '@/components/common/Heading';

const FarmerDetailsTab = ({
  farmer,
  farmers,
  onSelectFarmer,
  onAdd,
  onUpdate,
  onDelete,
}: {
  farmer: any;
  farmers: any[];
  onSelectFarmer: (id: string) => void;
  onAdd: (data: any) => void;
  onUpdate: (data: any) => void;
  onDelete: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Initialize with default matching the structure
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: {
      village: '',
      district: '',
      state: '',
    },
  });

  useEffect(() => {
    if (isAdding) {
      setFormData({
        name: '',
        phone: '',
        email: '',
        address: {
          village: '',
          district: '',
          state: '',
        },
      });
      setIsEditing(true); // Force editing mode when adding
    } else if (farmer) {
      setFormData({
        name: farmer.name || '',
        phone: farmer.phone || farmer.phoneNumber || '',
        email: farmer.email || '',
        address: {
          village: farmer.address?.village || farmer.village || '',
          district: farmer.address?.district || farmer.district || '',
          state: farmer.address?.state || farmer.state || '',
        },
      });
      setIsEditing(false);
    }
  }, [farmer, isAdding]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (isAdding) {
      onAdd(formData);
      setIsAdding(false);
    } else if (isEditing) {
      onUpdate({ ...farmer, ...formData });
      setIsEditing(false); // Disable editing after save
    } else {
      setIsEditing(true); // Enable editing
    }
  };

  const toggleAddMode = () => {
    if (isAdding) {
      setIsAdding(false);
      setIsEditing(false);
    } else {
      setIsAdding(true);
    }
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4 md:gap-0">
        <div>
          <Subheading className="font-bold">
            {isAdding ? 'Add New Farmer' : 'Farmer Details'}
          </Subheading>
        </div>

        {/* Farmer Selector */}
        {!isAdding && farmers.length > 0 && (
          <div className="flex-1 w-full md:w-auto mx-0 md:mx-8">
            <Label className="block text-[10px] uppercase font-bold text-white mb-1">
              Select Farmer
            </Label>
            <Dropdown
              className="w-full md:w-fit min-w-[200px] bg-secondary rounded-xl text-foreground font-bold px-4 py-2 text-sm focus:outline-none cursor-pointer [&>option]:bg-zinc-800 [&>option]:text-white"
              value={farmer?.id || ''}
              onChange={(e) => onSelectFarmer(e.target.value)}
            >
              {farmers.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </Dropdown>
          </div>
        )}

        <div className="w-full md:w-auto flex justify-end">
          {!isAdding && (
            <Button
              onClick={toggleAddMode}
              size="sm"
              className="rounded-xl text-xs font-bold flex items-center gap-2 w-full md:w-auto justify-center"
            >
              <Plus size={16} />
              Add Farmer
            </Button>
          )}
          {isAdding && (
            <Button
              onClick={toggleAddMode}
              variant="secondary"
              size="sm"
              className="rounded-xl text-xs font-bold w-full md:w-auto"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Name */}
        <div>
          <Label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
            Full Name
          </Label>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-muted rounded-xl">
              <User size={18} className="text-foreground" />
            </div>
            <Input
              type="text"
              name="name"
              value={formData.name || ''}
              readOnly={!isEditing}
              onChange={handleChange}
              className={`w-full font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : ''}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phone */}
          <div>
            <Label className="block text-xs font-bold text-white uppercase mb-2">
              Phone Number
            </Label>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-muted rounded-xl">
                <Phone size={18} className="text-foreground" />
              </div>
              <Input
                type="text"
                name="phone"
                value={formData.phone || ''}
                readOnly={!isEditing}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className={`w-full font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : ''}`}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Label className="block text-xs font-bold text-white uppercase mb-2">
              Email Address
            </Label>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-muted rounded-xl">
                <Mail size={18} className="text-foreground" />
              </div>
              <Input
                type="text"
                name="email"
                value={formData.email || ''}
                readOnly={!isEditing}
                onChange={handleChange}
                className={`w-full font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : ''}`}
              />
            </div>
          </div>
        </div>

        <hr className="border-border my-2" />

        {/* Address textarea removed */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Village */}
          <div>
            <Label className="block text-xs font-bold text-white uppercase mb-2">
              Village
            </Label>
            <Input
              type="text"
              name="village"
              value={formData.address.village || ''}
              readOnly={!isEditing}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, village: e.target.value },
                })
              }
              className={`w-full font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : ''}`}
            />
          </div>
          {/* District */}
          <div>
            <Label className="block text-xs font-bold text-white uppercase mb-2">
              District
            </Label>
            <Input
              type="text"
              name="district"
              value={formData.address.district || ''}
              readOnly={!isEditing}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, district: e.target.value },
                })
              }
              className={`w-full font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : ''}`}
            />
          </div>
          {/* State */}
          <div>
            <Label className="block text-xs font-bold text-white uppercase mb-2">
              State
            </Label>
            <Input
              type="text"
              name="state"
              value={formData.address.state || ''}
              readOnly={!isEditing}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, state: e.target.value },
                })
              }
              className={`w-full font-semibold px-4 py-3 text-sm focus:outline-none ${!isEditing ? 'cursor-default' : ''}`}
            />
          </div>
        </div>

        {/* Actions for Farmer Tab */}
        <div className="flex gap-3 mt-8 border-t border-border pt-6">
          <Button
            onClick={handleSave}
            variant={isEditing ? 'default' : 'secondary'}
            className="w-fit rounded-xl text-xs font-bold"
          >
            {isAdding
              ? 'Save New Farmer'
              : isEditing
                ? 'Save Changes'
                : 'Edit Details'}
          </Button>
          {!isAdding && (
            <Button
              onClick={onDelete}
              variant="destructive"
              className="w-fit rounded-xl text-xs font-bold"
            >
              Delete Farmer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerDetailsTab;
