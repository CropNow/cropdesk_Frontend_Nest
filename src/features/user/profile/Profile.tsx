import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Map,
  Leaf,
  Droplets,
  Info,
  Camera,
  CheckCircle2,
  Monitor,
  Globe,
  ShieldCheck,
  LogOut,
  HelpCircle,
  MessageSquare,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import FarmerDetailsTab from './FarmerDetailsTab';
import FarmDetailsTab from './FarmDetailsTab';
import FieldDetailsTab from './FieldDetailsTab';
import CropDetailsTab from './CropDetailsTab';

const Profile = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');

  // Hierarchy State
  const [farmers, setFarmers] = useState<any[]>([]);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>('');
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [selectedFieldId, setSelectedFieldId] = useState<string>('');

  // Derived Selected Objects
  const selectedFarmer = farmers.find((f) => f.id === selectedFarmerId);
  const selectedFarm = selectedFarmer?.farms?.find(
    (f: any) => f.id === selectedFarmId
  );
  const selectedField = selectedFarm?.fields?.find(
    (f: any) => f.id === selectedFieldId
  );

  // Add Item Logic (Mock IDs)
  const addFarmer = () => {
    const newFarmer = {
      id: Date.now().toString(),
      name: 'New Farmer',
      farms: [],
    };
    const updatedFarmers = [...farmers, newFarmer];
    setFarmers(updatedFarmers);
    persistFarmers(updatedFarmers);
    setSelectedFarmerId(newFarmer.id);
  };

  const addFarm = () => {
    if (!selectedFarmerId) return;
    const newFarm = { id: Date.now().toString(), name: 'New Farm', fields: [] };
    const updatedFarmers = farmers.map((f) => {
      if (f.id === selectedFarmerId) {
        return { ...f, farms: [...(f.farms || []), newFarm] };
      }
      return f;
    });
    setFarmers(updatedFarmers);
    persistFarmers(updatedFarmers);
    setSelectedFarmId(newFarm.id);
  };

  const addField = () => {
    if (!selectedFarmId) return;
    const newField = {
      id: Date.now().toString(),
      name: 'New Field',
      area: '0',
      units: 'acres',
      irrigationMethod: 'Rainfed',
      crops: [],
    };
    const updatedFarmers = farmers.map((f) => {
      if (f.id === selectedFarmerId) {
        return {
          ...f,
          farms: f.farms.map((farm: any) => {
            if (farm.id === selectedFarmId) {
              return { ...farm, fields: [...(farm.fields || []), newField] };
            }
            return farm;
          }),
        };
      }
      return f;
    });
    setFarmers(updatedFarmers);
    persistFarmers(updatedFarmers);
    setSelectedFieldId(newField.id);
  };

  const persistFarmers = (updatedFarmers: any[]) => {
    const storedUserStr = localStorage.getItem('registeredUser');
    if (storedUserStr) {
      const user = JSON.parse(storedUserStr);
      user.farmers = updatedFarmers;
      localStorage.setItem('registeredUser', JSON.stringify(user));
    }
  };

  const [userDetails, setUserDetails] = useState({
    name: 'Farmer',
    email: '',
    joinDate: 'Dec 2024',
  });

  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: '',
    emergency: '',
    alternateEmail: '',
  });

  // Load Data
  // FIX: Read directly from the hydrated user context provided by useAuth(),
  // instead of manually parsing 'registeredUser' from localStorage which might be stale or incomplete.
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) {
      setUserDetails({
        name: user.username || user.firstName || 'User',
        email: user.email || '',
        joinDate: 'Dec 2024',
      });

      // Reconstruct Hierarchy from Flat Lists (or use existing hierarchy if saved that way)
      let hierarchy = [];

      // Prefer the hydrated 'farmers' array we built in auth.api.ts
      const rawFarmers = user.farmers || [];
      const rawFarms = user.farms || [];
      const rawFields = user.fields || [];
      const rawCrops = user.crops || [];

      // Link Fields to Crops
      const fieldsWithCrops = rawFields.map((field: any) => ({
        ...field,
        crops: rawCrops.filter(
          (c: any) =>
            c.fieldId === field.id ||
            c.fieldId === field.fieldName ||
            c.fieldId === field.name
        ),
      }));

      // Link Farms to Fields
      const farmsWithFields = rawFarms.map((farm: any) => ({
        ...farm,
        fields: fieldsWithCrops.filter(
          (f: any) =>
            f.farmId === farm.id ||
            f.farmId === farm.farmName ||
            f.farmId === farm.name
        ),
      }));

      // Link Farmers to Farms
      const farmersWithFarms = rawFarmers.map((farmer: any) => {
        if (
          farmer.farms &&
          Array.isArray(farmer.farms) &&
          farmer.farms.length > 0
        ) {
          return farmer;
        }
        return {
          ...farmer,
          farms: farmsWithFields.filter(
            (f: any) => f.farmerId === farmer.id || f.farmerId === farmer.name
          ),
        };
      });

      hierarchy = farmersWithFarms;

      if (hierarchy.length > 0) {
        setFarmers(hierarchy);
        // Default select first available
        const firstFarmer = hierarchy[0];
        setSelectedFarmerId(firstFarmer.id);

        if (firstFarmer.farms && firstFarmer.farms.length > 0) {
          const firstFarm = firstFarmer.farms[0];
          setSelectedFarmId(firstFarm.id);

          if (firstFarm.fields && firstFarm.fields.length > 0) {
            setSelectedFieldId(firstFarm.fields[0].id);
          }
        }
      } else {
        // Fallback / Initial Mock if no farmers exist
        const defaultFarmer = {
          id: 'default-farmer',
          name: user.farmerDetails?.name || 'Main Farmer',
          farms: [
            {
              id: 'default-farm',
              name: user.farmDetails?.farmName || 'Main Farm',
              fields: user.fieldDetails
                ? [
                    {
                      id: 'default-field',
                      name: 'Main Field',
                      area: user.farmDetails?.area || '0',
                      units: user.farmDetails?.units || 'acres',
                      irrigationMethod:
                        user.fieldDetails?.irrigationMethod || 'Borewell',
                      crops: [],
                    },
                  ]
                : [],
            },
          ],
        };
        const initFarmers = [defaultFarmer];
        setFarmers(initFarmers);
        // Note: We don't persist this back immediately to avoid overwriting registeredUser with mocks,
        // unless user edits. But for display we use it.
        setSelectedFarmerId(defaultFarmer.id);
        const firstFarm = defaultFarmer.farms[0];
        if (firstFarm) {
          setSelectedFarmId(firstFarm.id);
          if (firstFarm.fields && firstFarm.fields.length > 0) {
            const firstField = firstFarm.fields[0];
            if (firstField) {
              setSelectedFieldId(firstField.id);
            }
          }
        }
      }
    }
  }, []);

  const countries = [
    { name: 'India', code: '+91', flag: 'in' },
    { name: 'USA', code: '+1', flag: 'us' },
    { name: 'UK', code: '+44', flag: 'gb' },
    { name: 'Australia', code: '+61', flag: 'au' },
    { name: 'Germany', code: '+49', flag: 'de' },
    { name: 'Canada', code: '+1', flag: 'ca' },
    { name: 'Japan', code: '+81', flag: 'jp' },
  ];

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const handleCountrySelect = (country: (typeof countries)[0]) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  const tabs = [
    'Profile',
    'Farmer Details',
    'Farm Details',
    'Field Details',
    'Crop Details',
    'Preferences',
  ];

  // Edit & Delete Logic
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => setIsEditing((prev) => !prev);

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      localStorage.removeItem('user');
      localStorage.removeItem('registeredUser');
      setUser(null);
      navigate('/login');
    }
  };

  // Farmer CRUD
  const handleUpdateFarmer = (id: string, updates: any) => {
    const updated = farmers.map((f) =>
      f.id === id ? { ...f, ...updates } : f
    );
    setFarmers(updated);
    persistFarmers(updated);
  };

  const handleDeleteFarmer = (id: string) => {
    if (window.confirm('Delete this farmer?')) {
      const updated = farmers.filter((f) => f.id !== id);
      setFarmers(updated);
      persistFarmers(updated);
      if (selectedFarmerId === id && updated.length > 0)
        setSelectedFarmerId(updated[0].id);
      else if (updated.length === 0) setSelectedFarmerId('');
    }
  };

  // Farm CRUD
  const handleUpdateFarm = (id: string, updates: any) => {
    const updated = farmers.map((farmer) => {
      if (farmer.id === selectedFarmerId) {
        return {
          ...farmer,
          farms: farmer.farms.map((farm: any) =>
            farm.id === id ? { ...farm, ...updates } : farm
          ),
        };
      }
      return farmer;
    });
    setFarmers(updated);
    persistFarmers(updated);
  };

  const handleDeleteFarm = (id: string) => {
    if (window.confirm('Delete this farm?')) {
      const updated = farmers.map((farmer) => {
        if (farmer.id === selectedFarmerId) {
          return {
            ...farmer,
            farms: farmer.farms.filter((farm: any) => farm.id !== id),
          };
        }
        return farmer;
      });
      setFarmers(updated);
      persistFarmers(updated);
      // Logic to update selectedFarmId is tricky if we don't know the new one, but for now simple check:
      if (selectedFarmId === id) setSelectedFarmId('');
    }
  };

  // Field CRUD
  const handleUpdateField = (id: string, updates: any) => {
    const updated = farmers.map((farmer) => {
      if (farmer.id === selectedFarmerId) {
        return {
          ...farmer,
          farms: farmer.farms.map((farm: any) => {
            if (farm.id === selectedFarmId) {
              return {
                ...farm,
                fields: farm.fields.map((field: any) =>
                  field.id === id ? { ...field, ...updates } : field
                ),
              };
            }
            return farm;
          }),
        };
      }
      return farmer;
    });
    setFarmers(updated);
    persistFarmers(updated);
  };

  const handleDeleteField = (id: string) => {
    if (window.confirm('Delete this field?')) {
      const updated = farmers.map((farmer) => {
        if (farmer.id === selectedFarmerId) {
          return {
            ...farmer,
            farms: farmer.farms.map((farm: any) => {
              if (farm.id === selectedFarmId) {
                return {
                  ...farm,
                  fields: farm.fields.filter((field: any) => field.id !== id),
                };
              }
              return farm;
            }),
          };
        }
        return farmer;
      });
      setFarmers(updated);
      persistFarmers(updated);
      if (selectedFieldId === id) setSelectedFieldId('');
    }
  };

  // Crop CRUD
  const handleAddCrop = (newCrop: any) => {
    const cropWithId = { ...newCrop, id: newCrop.id || Date.now().toString() };
    const updated = farmers.map((farmer) => {
      if (farmer.id === selectedFarmerId) {
        return {
          ...farmer,
          farms: farmer.farms.map((farm: any) => {
            if (farm.id === selectedFarmId) {
              return {
                ...farm,
                fields: farm.fields.map((field: any) => {
                  if (field.id === selectedFieldId) {
                    return {
                      ...field,
                      crops: [...(field.crops || []), cropWithId],
                    };
                  }
                  return field;
                }),
              };
            }
            return farm;
          }),
        };
      }
      return farmer;
    });
    setFarmers(updated);
    persistFarmers(updated);
  };

  const handleUpdateCrop = (id: string, updates: any) => {
    const updated = farmers.map((farmer) => {
      if (farmer.id === selectedFarmerId) {
        return {
          ...farmer,
          farms: farmer.farms.map((farm: any) => {
            if (farm.id === selectedFarmId) {
              return {
                ...farm,
                fields: farm.fields.map((field: any) => {
                  if (field.id === selectedFieldId) {
                    return {
                      ...field,
                      crops: field.crops.map((crop: any) =>
                        crop.id === id ? { ...crop, ...updates } : crop
                      ),
                    };
                  }
                  return field;
                }),
              };
            }
            return farm;
          }),
        };
      }
      return farmer;
    });
    setFarmers(updated);
    persistFarmers(updated);
  };

  const handleDeleteCrop = (id: string) => {
    if (window.confirm('Delete this crop?')) {
      const updated = farmers.map((farmer) => {
        if (farmer.id === selectedFarmerId) {
          return {
            ...farmer,
            farms: farmer.farms.map((farm: any) => {
              if (farm.id === selectedFarmId) {
                return {
                  ...farm,
                  fields: farm.fields.map((field: any) => {
                    if (field.id === selectedFieldId) {
                      return {
                        ...field,
                        crops: field.crops.filter(
                          (crop: any) => crop.id !== id
                        ),
                      };
                    }
                    return field;
                  }),
                };
              }
              return farm;
            }),
          };
        }
        return farmer;
      });
      setFarmers(updated);
      persistFarmers(updated);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground pb-20 p-4 lg:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-8">
        {/* MAIN CONTENT */}
        <div className="flex-1">
          {/* Sub Navigation */}
          <div className="bg-card border border-border rounded-2xl p-2 mb-8 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === tab
                    ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent'
                }`}
              >
                {tab}
                {tab === 'General' && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                      activeTab === tab
                        ? 'bg-green-500 text-black'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    6
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* PROFILE TAB CONTENT */}
          {activeTab === 'Profile' && (
            <div className="bg-card border border-border rounded-3xl p-8">
              <div className="mb-8"></div>
              {/* User Header */}
              <div className="flex items-start gap-6 mb-10">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-green-500 text-black">
                  <User size={32} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {userDetails.name}
                  </h1>
                  <p className="text-sm text-muted-foreground mb-3">
                    {userDetails.email}
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="mb-6 flex justify-end items-center gap-4">
                <div className="relative inline-block text-left">
                  <div className="flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-xl">
                    <span className="text-xs font-bold text-muted-foreground uppercase">
                      Select Field:
                    </span>
                    <select
                      className="bg-transparent text-sm font-bold text-foreground focus:outline-none cursor-pointer"
                      value={selectedFieldId}
                      onChange={(e) => {
                        const fieldId = e.target.value;
                        for (const farmer of farmers) {
                          for (const farm of farmer.farms) {
                            const field = farm.fields.find(
                              (f: any) => f.id === fieldId
                            );
                            if (field) {
                              setSelectedFarmerId(farmer.id);
                              setSelectedFarmId(farm.id);
                              setSelectedFieldId(fieldId);
                              return;
                            }
                          }
                        }
                      }}
                    >
                      {farmers.map((farmer) => (
                        <optgroup
                          key={farmer.id}
                          label={`Farmer: ${farmer.name}`}
                        >
                          {farmer.farms?.map((farm: any) => (
                            <React.Fragment key={farm.id}>
                              {farm.fields?.length > 0 ? (
                                farm.fields.map((field: any) => (
                                  <option key={field.id} value={field.id}>
                                    {farm.name} - {field.name}
                                  </option>
                                ))
                              ) : (
                                <option disabled>
                                  No fields in {farm.name}
                                </option>
                              )}
                            </React.Fragment>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={addField}
                  disabled={!isEditing}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${!isEditing ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-green-500 text-black hover:bg-green-400'}`}
                >
                  Add Field
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Total Land Area - From Selected FARM */}
                <div className="bg-[#1e40af] rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                  <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Map size={24} className="text-white" />
                    </div>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-bold text-white mb-1">
                      {selectedFarm
                        ? selectedFarm.fields?.reduce(
                            (acc: number, f: any) =>
                              acc + (parseFloat(f.area) || 0),
                            0
                          ) +
                          ' ' +
                          (selectedFarm.units || 'acres')
                        : '0'}
                      <span className="text-lg font-medium opacity-80"></span>
                    </h3>
                    <p className="text-xs font-bold text-white/60 uppercase tracking-wider">
                      Total Land Area (Farm)
                    </p>
                  </div>
                </div>

                {/* Cultivable Area - From Selected FIELD */}
                <div className="bg-[#16a34a] rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                  <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Leaf size={24} className="text-white" />
                    </div>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-bold text-white mb-1">
                      {selectedField ? selectedField.area : '0'}{' '}
                      <span className="text-lg font-medium opacity-80">
                        {selectedField ? selectedField.units : 'acres'}
                      </span>
                    </h3>
                    <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-4">
                      Cultivable Area (Field)
                    </p>
                    <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white/80 w-full rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Water Source - From Selected FIELD */}
                <div className="bg-[#06b6d4] rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                  <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Droplets size={24} className="text-white" />
                    </div>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-2 capitalize truncate">
                      {selectedField && selectedField.irrigationMethod
                        ? selectedField.irrigationMethod
                        : 'No Source'}
                    </h3>
                    <p className="text-xs font-bold text-white/60 uppercase tracking-wider">
                      Primary Water Source
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="space-y-8 max-w-4xl">
                {/* Username */}
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-3">
                    Username
                  </label>
                  <div className="flex">
                    <div className="px-4 py-3 bg-muted border border-border rounded-l-xl text-muted-foreground text-sm font-medium border-r-0 flex items-center">
                      cropnow.com/
                    </div>
                    <input
                      type="text"
                      value={userDetails.name}
                      readOnly={!isEditing}
                      className="flex-1 bg-secondary text-foreground rounded-r-xl font-bold px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <label className="block text-xs font-bold text-muted-foreground uppercase">
                      Bio
                    </label>
                    <Info size={14} className="text-muted-foreground" />
                  </div>
                  <textarea
                    placeholder="Tell us about yourself and your farming experience..."
                    className="w-full h-32 bg-secondary rounded-xl text-foreground font-medium px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none p-4"
                    readOnly={!isEditing}
                  ></textarea>
                  <div className="text-right mt-2">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase">
                      275 characters remaining
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-border flex gap-3">
                <button
                  onClick={handleEditToggle}
                  className={`w-fit px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    isEditing
                      ? 'bg-green-500 text-black border-transparent hover:bg-green-400'
                      : 'bg-secondary text-foreground hover:bg-muted border-transparent'
                  }`}
                >
                  {isEditing ? 'Save Profile' : 'Edit Profile'}
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="w-fit px-4 py-2 bg-[#ffe4e6] text-[#e11d48] border border-transparent rounded-xl text-xs font-bold hover:bg-[#ffced4] transition-all"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* FARMER DETAILS TAB */}
          {activeTab === 'Farmer Details' && (
            <FarmerDetailsTab
              farmer={selectedFarmer}
              farmers={farmers}
              selectedFarmerId={selectedFarmerId}
              onSelectFarmer={setSelectedFarmerId}
              onUpdate={(updates: any) =>
                selectedFarmerId &&
                handleUpdateFarmer(selectedFarmerId, updates)
              }
              onDelete={() =>
                selectedFarmerId && handleDeleteFarmer(selectedFarmerId)
              }
            />
          )}

          {/* FARM DETAILS TAB */}
          {activeTab === 'Farm Details' && (
            <FarmDetailsTab
              farm={selectedFarm}
              farms={selectedFarmer?.farms || []}
              selectedFarmId={selectedFarmId}
              onSelectFarm={setSelectedFarmId}
              onUpdate={(updates: any) =>
                selectedFarmId && handleUpdateFarm(selectedFarmId, updates)
              }
              onDelete={() =>
                selectedFarmId && handleDeleteFarm(selectedFarmId)
              }
            />
          )}

          {/* FIELD DETAILS TAB */}
          {activeTab === 'Field Details' && (
            <FieldDetailsTab
              field={selectedField}
              fields={selectedFarm?.fields || []}
              selectedFieldId={selectedFieldId}
              onSelectField={setSelectedFieldId}
              onUpdate={(updates: any) =>
                selectedFieldId && handleUpdateField(selectedFieldId, updates)
              }
              onDelete={() =>
                selectedFieldId && handleDeleteField(selectedFieldId)
              }
            />
          )}

          {/* CROP DETAILS TAB */}
          {activeTab === 'Crop Details' && (
            <CropDetailsTab
              crops={selectedField?.crops || []}
              onAdd={handleAddCrop}
              onUpdate={(crop: any) => handleUpdateCrop(crop.id, crop)}
              onDelete={handleDeleteCrop}
            />
          )}

          {/* PREFERENCES TAB CONTENT */}
          {activeTab === 'Preferences' && (
            <div className="bg-card border border-border rounded-3xl p-8">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-foreground">
                  Preferences
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Customize your app experience
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Appearance */}
                <div className="bg-muted border border-border rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase mb-6">
                    Appearance
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between cursor-pointer group py-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                          <Monitor size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-foreground group-hover:text-blue-400 transition-colors flex items-center gap-2">
                            Theme Mode <ChevronRight size={14} />
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            System Default
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-px bg-border"></div>
                    <div className="flex items-center justify-between cursor-pointer group py-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                          <Globe size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-foreground group-hover:text-blue-400 transition-colors flex items-center gap-2">
                            Language <ChevronRight size={14} />
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            English
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Privacy & Security */}
                <div className="bg-muted border border-border rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase mb-6">
                    Privacy & Security
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between cursor-pointer group py-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                          <ShieldCheck size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-foreground group-hover:text-orange-400 transition-colors flex items-center gap-2">
                            Privacy Settings <ChevronRight size={14} />
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Control your data
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-px bg-border"></div>
                    <div className="flex items-center justify-between cursor-pointer group py-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                          <ShieldCheck size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-foreground group-hover:text-red-400 transition-colors flex items-center gap-2">
                            Data Sharing <ChevronRight size={14} />
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Manage permissions
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

// Internal ToggleItem Component
const ToggleItem = ({
  label,
  desc,
  active,
  onToggle,
}: {
  label: string;
  desc: string;
  active: boolean;
  onToggle: () => void;
}) => (
  <div
    className="flex items-center justify-between group cursor-pointer"
    onClick={onToggle}
  >
    <div>
      <h4 className="font-bold text-sm text-foreground group-hover:text-green-500 transition-colors">
        {label}
      </h4>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
    <div
      className={`w-10 h-6 rounded-full p-1 transition-colors ${active ? 'bg-green-500' : 'bg-muted border border-border'}`}
    >
      <div
        className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${active ? 'translate-x-4' : 'translate-x-0'}`}
      ></div>
    </div>
  </div>
);

export default Profile;
