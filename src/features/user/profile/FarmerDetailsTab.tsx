import React, { useState, useEffect } from 'react';
import { User as UserIcon, Phone, Mail, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ListBox } from '@/components/ui/list-box';
import { Subheading } from '@/components/common/Heading';
import { useProfile } from './context/useProfile';
import { useAuth } from '../../auth/useAuth';

const FarmerDetailsTab = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    farmers,
    selectedFarmer,
    selectedFarmerId,
    setSelectedFarmerId,
    addFarmer,
    updateFarmer,
    deleteFarmer,
  } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
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
    } else if (selectedFarmer) {
      setFormData({
        name: selectedFarmer.name || '',
        phone: selectedFarmer.phone || selectedFarmer.phoneNumber || '',
        email: selectedFarmer.email || '',
        address: {
          village:
            selectedFarmer.address?.village || selectedFarmer.village || '',
          district:
            selectedFarmer.address?.district || selectedFarmer.district || '',
          state: selectedFarmer.address?.state || selectedFarmer.state || '',
        },
      });
      setIsEditing(false);
    }
  }, [selectedFarmer, isAdding]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (isAdding) {
        await addFarmer(formData);
        setIsAdding(false);
      } else if (isEditing && selectedFarmerId) {
        await updateFarmer(selectedFarmerId, {
          ...selectedFarmer,
          ...formData,
        });
        setIsEditing(false);
      } else {
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Failed to save farmer:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleAddMode = () => {
    if (isAdding) {
      setIsAdding(false);
      setIsEditing(false);
    } else {
      // Requirement: Redirect new users to registration wizard if they haven't completed it
      if (!user?.isOnboardingComplete && (!farmers || farmers.length === 0)) {
        console.log('User incomplete, redirecting to Onboarding...');
        navigate('/register/farmer-details');
        return;
      }
      setIsAdding(true);
    }
  };

  const startEditing = () => {
    if (!user?.isOnboardingComplete && (!farmers || farmers.length === 0)) {
      navigate('/register/farmer-details');
      return;
    }
    setIsEditing(true);
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-8">
      {/* Header with Title and Add Button */}
      <div className="flex justify-between items-center mb-8">
        <Subheading className="font-bold">
          {isAdding ? 'Add New Farmer' : 'Farmer Details'}
        </Subheading>

        <div>
          {!isAdding && (
            <Button
              onClick={toggleAddMode}
              size="sm"
              className="rounded-xl text-xs font-bold flex items-center gap-2"
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
              className="rounded-xl text-xs font-bold"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Grid Layout: Details Card (left) + Farmer List (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        {/* Left: Farmer Details Card or Form */}
        <div>
          {!isEditing ? (
            // READ MODE - Card Display
            <div className="bg-card border border-border rounded-xl p-6 space-y-4 max-w-md">
              {/* Header - Farmer Name */}
              <h3 className="text-xl font-bold text-foreground">
                {formData.name || 'Unnamed Farmer'}
              </h3>

              {/* Details Section */}
              <div className="space-y-2 text-foreground">
                {formData.address.village ||
                formData.address.district ||
                formData.address.state ? (
                  <p className="text-base">
                    {[
                      formData.address.village,
                      formData.address.district,
                      formData.address.state,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                ) : (
                  <p className="text-muted-foreground italic text-sm">
                    No address provided
                  </p>
                )}

                <p className="text-base">
                  Phone number:{' '}
                  {formData.phone || (
                    <span className="text-muted-foreground italic">
                      Not provided
                    </span>
                  )}
                </p>

                <p className="text-base">
                  Email:{' '}
                  {formData.email || (
                    <span className="text-muted-foreground italic">
                      Not provided
                    </span>
                  )}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-border flex gap-4">
                <Button
                  variant="link"
                  onClick={startEditing}
                  className="text-primary hover:underline font-medium p-0 h-auto"
                >
                  Edit
                </Button>
                {!isAdding && deleteFarmer && selectedFarmerId && (
                  <>
                    <span className="text-muted-foreground">|</span>
                    <Button
                      variant="link"
                      onClick={() => deleteFarmer(selectedFarmerId)}
                      className="text-destructive hover:underline font-medium p-0 h-auto"
                    >
                      Remove
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : (
            // EDIT MODE - Form Display
            <div className="space-y-6 max-w-4xl">
              {/* Name */}
              <div>
                <Label className="block text-xs font-bold text-muted-foreground uppercase mb-2">
                  Full Name
                </Label>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-muted rounded-xl">
                    <UserIcon size={18} className="text-foreground" />
                  </div>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    className="w-full font-semibold px-4 py-3 text-sm"
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
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full font-semibold px-4 py-3 text-sm"
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
                      onChange={handleChange}
                      className="w-full font-semibold px-4 py-3 text-sm"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-border my-2" />

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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          village: e.target.value,
                        },
                      })
                    }
                    className="w-full font-semibold px-4 py-3 text-sm"
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          district: e.target.value,
                        },
                      })
                    }
                    className="w-full font-semibold px-4 py-3 text-sm"
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, state: e.target.value },
                      })
                    }
                    className="w-full font-semibold px-4 py-3 text-sm"
                  />
                </div>
              </div>

              {/* Actions for Farmer Tab */}
              <div className="flex gap-3 mt-8 border-t border-border pt-6">
                <Button
                  onClick={handleSave}
                  variant="default"
                  className="w-fit rounded-xl text-xs font-bold"
                  disabled={isSaving}
                >
                  {isSaving
                    ? 'Saving...'
                    : isAdding
                      ? 'Save New Farmer'
                      : 'Save Changes'}
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    if (isAdding) {
                      setIsAdding(false);
                    } else if (selectedFarmer) {
                      setFormData({
                        name: selectedFarmer.name || '',
                        phone: selectedFarmer.phone || '',
                        email: selectedFarmer.email || '',
                        address: {
                          village: selectedFarmer.address?.village || '',
                          district: selectedFarmer.address?.district || '',
                          state: selectedFarmer.address?.state || '',
                        },
                      });
                    }
                  }}
                  variant="outline"
                  className="w-fit rounded-xl text-xs font-bold"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Farmer List */}
        {!isAdding && farmers.length > 0 && (
          <div>
            <Label className="block text-[10px] uppercase font-bold text-white mb-4">
              Select Farmer
            </Label>
            <ListBox
              items={farmers.map((f, index) => ({
                id: f.id || f._id || `temp-${index}`,
                label: f.name || 'Unnamed',
                subLabel: f.phone || f.email,
              }))}
              selectedId={
                selectedFarmerId ||
                selectedFarmer?.id ||
                selectedFarmer?._id ||
                ''
              }
              onSelect={(id) => setSelectedFarmerId(id)}
              height="h-[220px]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDetailsTab;
