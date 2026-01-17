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
import { Switch } from '../../../components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const Profile = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('Profile');

  // Preferences State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPublicProfile, setIsPublicProfile] = useState(false);

  // Hierarchy State
  const [farmers, setFarmers] = useState<any[]>([]);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>('');
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [selectedFieldId, setSelectedFieldId] = useState<string>('');
  const [selectedCropId, setSelectedCropId] = useState<string>('');

  // Derived Selected Objects
  const selectedFarmer = farmers.find((f) => f.id === selectedFarmerId);
  const selectedFarm = selectedFarmer?.farms?.find(
    (f: any) => f.id === selectedFarmId
  );
  const selectedField = selectedFarm?.fields?.find(
    (f: any) => f.id === selectedFieldId
  );
  const selectedCrop = selectedField?.crops?.find(
    (c: any) => c.id === selectedCropId
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

  const handleCropSelect = (cropId: string) => {
    setSelectedCropId(cropId);
  };

  /* MOVED HANDLERS START */
  const handleFarmerSelect = (farmerId: string) => {
    setSelectedFarmerId(farmerId);
    // Auto-select first nested items
    const farmer = farmers.find((f) => f.id === farmerId);
    if (farmer && farmer.farms && farmer.farms.length > 0) {
      const firstFarm = farmer.farms[0];
      setSelectedFarmId(firstFarm.id);
      if (firstFarm.fields && firstFarm.fields.length > 0) {
        setSelectedFieldId(firstFarm.fields[0].id);
      } else {
        setSelectedFieldId('');
      }
    } else {
      setSelectedFarmId('');
      setSelectedFieldId('');
    }
  };

  const handleFarmSelect = (farmId: string) => {
    setSelectedFarmId(farmId);
    // Auto-select first field
    const farm = selectedFarmer?.farms?.find((f: any) => f.id === farmId);
    if (farm && farm.fields && farm.fields.length > 0) {
      setSelectedFieldId(farm.fields[0].id);
    } else {
      setSelectedFieldId('');
    }
  };
  /* MOVED HANDLERS END */

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
  React.useEffect(() => {
    const storedUserStr = localStorage.getItem('registeredUser');
    if (storedUserStr) {
      const user = JSON.parse(storedUserStr);

      setUserDetails({
        name: user.username || user.firstName || 'User',
        email: user.email || '',
        joinDate: 'Dec 2024',
      });

      // Reconstruct Hierarchy from Flat Lists (or use existing hierarchy if saved that way)
      let hierarchy = [];

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
    if (
      window.confirm(
        'Delete this farmer? All associated farms, fields, and crops will be deleted.'
      )
    ) {
      const updated = farmers.filter((f) => f.id !== id);
      setFarmers(updated);
      persistFarmers(updated);
      if (selectedFarmerId === id) {
        if (updated.length > 0) {
          handleFarmerSelect(updated[0].id);
        } else {
          setSelectedFarmerId('');
          setSelectedFarmId('');
          setSelectedFieldId('');
          setSelectedCropId('');
        }
      }
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
    if (
      window.confirm(
        'Delete this farm? All associated fields and crops will be deleted.'
      )
    ) {
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
      if (selectedFarmId === id) {
        // Find the specific farmer to get updated farms list
        const relatedFarmer = updated.find((f) => f.id === selectedFarmerId);
        if (
          relatedFarmer &&
          relatedFarmer.farms &&
          relatedFarmer.farms.length > 0
        ) {
          handleFarmSelect(relatedFarmer.farms[0].id);
        } else {
          setSelectedFarmId('');
          setSelectedFieldId('');
          setSelectedCropId('');
        }
      }
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
    if (
      window.confirm(
        'Delete this field? All associated crop details will be deleted.'
      )
    ) {
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
      if (selectedFieldId === id) {
        const relatedFarmer = updated.find((f) => f.id === selectedFarmerId);
        const relatedFarm = relatedFarmer?.farms?.find(
          (f: any) => f.id === selectedFarmId
        );
        if (
          relatedFarm &&
          relatedFarm.fields &&
          relatedFarm.fields.length > 0
        ) {
          // We can't use a dedicated handler easily because field selection logic is simple, so we do it manually or assume existing handler logic
          setSelectedFieldId(relatedFarm.fields[0].id);
          // Also reset crop
          if (
            relatedFarm.fields[0].crops &&
            relatedFarm.fields[0].crops.length > 0
          ) {
            setSelectedCropId(relatedFarm.fields[0].crops[0].id);
          } else {
            setSelectedCropId('');
          }
        } else {
          setSelectedFieldId('');
          setSelectedCropId('');
        }
      }
    }
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
      if (selectedCropId === id) {
        // Find the field to select next crop
        const relatedFarmer = updated.find((f) => f.id === selectedFarmerId);
        const relatedFarm = relatedFarmer?.farms?.find(
          (f: any) => f.id === selectedFarmId
        );
        const relatedField = relatedFarm?.fields?.find(
          (f: any) => f.id === selectedFieldId
        );

        if (
          relatedField &&
          relatedField.crops &&
          relatedField.crops.length > 0
        ) {
          setSelectedCropId(relatedField.crops[0].id);
        } else {
          setSelectedCropId('');
        }
      }
    }
  };

  const handleAddFarmer = (newFarmer: any) => {
    const id = (Math.random() * 10000).toString();
    const farmer = { ...newFarmer, id, farms: [] };
    const updated = [...farmers, farmer];
    setFarmers(updated);
    persistFarmers(updated);
    setSelectedFarmerId(id);
    setActiveTab('Farmer Details');
  };

  const handleAddFarm = (newFarm: any) => {
    if (!selectedFarmerId) return;
    const id = (Math.random() * 10000).toString();
    const updated = farmers.map((f) => {
      if (f.id === selectedFarmerId) {
        const farm = { ...newFarm, id, fields: [] };
        return { ...f, farms: [...(f.farms || []), farm] };
      }
      return f;
    });
    setFarmers(updated);
    persistFarmers(updated);
    setSelectedFarmId(id);
  };

  const handleAddField = (newField: any) => {
    if (!selectedFarmId || !selectedFarmerId) return;
    const id = (Math.random() * 10000).toString();
    const updated = farmers.map((farmer) => {
      if (farmer.id === selectedFarmerId) {
        return {
          ...farmer,
          farms: farmer.farms.map((farm: any) => {
            if (farm.id === selectedFarmId) {
              const field = { ...newField, id, crops: [] };
              return { ...farm, fields: [...(farm.fields || []), field] };
            }
            return farm;
          }),
        };
      }
      return farmer;
    });
    setFarmers(updated);
    persistFarmers(updated);
    setSelectedFieldId(id);
  };

  const handleAddCrop = (newCrop: any) => {
    if (!selectedFieldId || !selectedFarmId || !selectedFarmerId) return;
    const id = (Math.random() * 10000).toString();
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
                      crops: [...(field.crops || []), { ...newCrop, id }],
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
    setSelectedCropId(id);
  };

  return (
    <main className="min-h-screen bg-background text-foreground pb-20 p-4 pt-20 md:pt-8 lg:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-8">
        {/* MAIN CONTENT */}
        <div className="flex-1">
          {/* Sub Navigation */}
          <div className="bg-card border border-border rounded-2xl p-2 mb-8 flex overflow-x-auto no-scrollbar gap-2 sticky top-16 md:static z-40">
            {tabs.map((tab) => (
              <Button
                key={tab}
                variant="ghost"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 md:px-6 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab
                    ? 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20 hover:text-green-500'
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
              </Button>
            ))}
          </div>

          {/* PROFILE TAB CONTENT */}
          {activeTab === 'Profile' && (
            <div className="bg-card border border-border rounded-3xl p-4 md:p-8">
              <div className="mb-8"></div>

              <div className="flex flex-col-reverse md:flex-col">
                {/* User Header Section (Second on Mobile) */}
                <div className="flex items-start gap-4 mb-8 mt-6 md:mt-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center bg-green-500 text-black flex-shrink-0">
                    <User size={32} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1"></div>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {userDetails.email}
                    </p>
                  </div>
                </div>

                {/* Stats Cards (First on Mobile) */}
                <div className="mb-2">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase mb-4 md:hidden">
                    Farm Statistics
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-6">
                    {/* Total Land Area */}
                    <div className="bg-[#1e40af] rounded-2xl p-3 md:p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform h-28 md:h-auto flex flex-col justify-between">
                      <div className="hidden md:flex justify-between items-start mb-6 relative z-10">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                          <Map size={24} className="text-white" />
                        </div>
                      </div>
                      <div className="md:hidden mb-2">
                        <Map size={16} className="text-white opacity-80" />
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-xl md:text-4xl font-bold text-white mb-0.5">
                          {selectedFarm
                            ? selectedFarm.fields?.reduce(
                                (acc: number, f: any) =>
                                  acc + (parseFloat(f.area) || 0),
                                0
                              )
                            : '0'}
                        </h3>
                        <p className="text-[9px] md:text-xs font-bold text-white/60 uppercase tracking-wider leading-tight">
                          Total Land
                        </p>
                      </div>
                    </div>

                    {/* Cultivable Area */}
                    <div className="bg-[#16a34a] rounded-2xl p-3 md:p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform h-28 md:h-auto flex flex-col justify-between">
                      <div className="hidden md:flex justify-between items-start mb-6 relative z-10">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                          <Leaf size={24} className="text-white" />
                        </div>
                      </div>
                      <div className="md:hidden mb-2">
                        <Leaf size={16} className="text-white opacity-80" />
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-xl md:text-4xl font-bold text-white mb-0.5">
                          {selectedField ? selectedField.area : '0'}
                        </h3>
                        <p className="text-[9px] md:text-xs font-bold text-white/60 uppercase tracking-wider leading-tight">
                          Cultivable
                        </p>
                      </div>
                    </div>

                    {/* Water Source */}
                    <div className="bg-[#06b6d4] rounded-2xl p-3 md:p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform h-28 md:h-auto flex flex-col justify-between">
                      <div className="hidden md:flex justify-between items-start mb-6 relative z-10">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                          <Droplets size={24} className="text-white" />
                        </div>
                      </div>
                      <div className="md:hidden mb-2">
                        <Droplets size={16} className="text-white opacity-80" />
                      </div>
                      <div className="relative z-10">
                        <h3 className="text-lg md:text-xl font-bold text-white mb-0.5 capitalize truncate">
                          {selectedField && selectedField.irrigationMethod
                            ? selectedField.irrigationMethod
                            : 'No Source'}
                        </h3>
                        <p className="text-[9px] md:text-xs font-bold text-white/60 uppercase tracking-wider leading-tight">
                          Water Source
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="space-y-6 max-w-4xl">
                {/* Username */}
                <div>
                  <Label className="block text-xs font-bold text-muted-foreground uppercase mb-2 ml-1">
                    Username
                  </Label>
                  <Input
                    type="text"
                    value={userDetails.name}
                    readOnly={!isEditing}
                    className="w-full bg-white text-black rounded-xl font-bold px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 hover:bg-white/90 transition-colors"
                  />
                </div>

                {/* Bio */}
                <div>
                  <Label className="block text-xs font-bold text-muted-foreground uppercase mb-2 ml-1">
                    Bio
                  </Label>
                  <Textarea
                    placeholder="Tell us about yourself and your farming experience..."
                    className="w-full h-32 bg-white rounded-xl text-black font-medium px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    readOnly={!isEditing}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-border flex gap-3">
                <Button
                  onClick={handleEditToggle}
                  variant={isEditing ? 'default' : 'secondary'}
                  className="w-fit rounded-xl text-xs font-bold"
                >
                  {isEditing ? 'Save Profile' : 'Edit Profile'}
                </Button>
                <Button
                  onClick={handleDeleteAccount}
                  variant="destructive"
                  className="w-fit rounded-xl text-xs font-bold"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          )}

          {/* FARMER DETAILS TAB */}
          {activeTab === 'Farmer Details' && (
            <FarmerDetailsTab
              farmer={selectedFarmer}
              farmers={farmers}
              onSelectFarmer={handleFarmerSelect}
              onAdd={handleAddFarmer}
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
              onSelectFarm={handleFarmSelect}
              onAdd={handleAddFarm}
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
              onSelectField={setSelectedFieldId}
              onAdd={handleAddField}
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
              crop={selectedCrop}
              crops={selectedField?.crops || []}
              onSelectCrop={handleCropSelect}
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
                {/* Notifications */}
                <div className="bg-muted border border-border rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase mb-6">
                    Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <h4 className="font-bold text-sm text-foreground">
                          Email Alerts
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Receive daily summaries
                        </p>
                      </div>
                      <Switch
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    <div className="w-full h-px bg-border/50"></div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <h4 className="font-bold text-sm text-foreground">
                          SMS Updates
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Get critical alerts via SMS
                        </p>
                      </div>
                      <Switch
                        checked={smsNotifications}
                        onCheckedChange={setSmsNotifications}
                      />
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="bg-muted border border-border rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase mb-6">
                    Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <h4 className="font-bold text-sm text-foreground">
                          Dark Mode
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Switch to dark theme
                        </p>
                      </div>
                      <Switch
                        checked={isDarkMode}
                        onCheckedChange={setIsDarkMode}
                      />
                    </div>
                    <div className="w-full h-px bg-border/50"></div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <h4 className="font-bold text-sm text-foreground">
                          Public Profile
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Allow others to see your farm stats
                        </p>
                      </div>
                      <Switch
                        checked={isPublicProfile}
                        onCheckedChange={setIsPublicProfile}
                      />
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

export default Profile;
