import React, { useState } from 'react';
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

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };
  const [toggles, setToggles] = useState({
    weatherAlerts: true,
    cropAlerts: true,
    taskReminders: false,
  });

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

  const [farmDetails, setFarmDetails] = useState({
    farmName: '',
    ownershipType: '',
    location: '',
    pincode: '',
    totalLand: '',
    soilType: 'Not specified',
    irrigationMethod: 'Not specified',
    cropName: 'No crops selected',
    boundaryType: '',
  });

  React.useEffect(() => {
    const storedUserStr = localStorage.getItem('registeredUser');
    if (storedUserStr) {
      const user = JSON.parse(storedUserStr);

      setUserDetails({
        name:
          user.farmerDetails?.name ||
          `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
          user.username ||
          'Farmer',
        email: user.email || '',
        joinDate: 'Dec 2024', // Mock date
      });

      if (user.farmerDetails) {
        setContactInfo((prev) => ({
          ...prev,
          phone: user.farmerDetails.phoneNumber || '',
          email: user.farmerDetails.email || user.email || '',
          emergency: '', // Not collected yet
          alternateEmail: '',
        }));
      }

      if (user.farmDetails) {
        setFarmDetails((prev) => ({
          ...prev,
          farmName: user.farmDetails.farmName || '',
          totalLand: `${user.farmDetails.area || ''} ${user.farmDetails.units || ''}`,
          location: `${user.farmDetails.location?.address || ''}, ${user.farmDetails.location?.city || ''}`,
          ownershipType: 'Owned', // Default
          pincode: '',
        }));
      }

      if (user.fieldDetails) {
        setFarmDetails((prev) => ({
          ...prev,
          soilType: user.fieldDetails.soilType || 'Not specified',
          irrigationMethod:
            user.fieldDetails.irrigationMethod || 'Not specified',
          boundaryType: user.fieldDetails.boundaryType || '',
        }));
      }

      if (user.cropDetails) {
        setFarmDetails((prev) => ({
          ...prev,
          cropName: user.cropDetails.cropName || 'No crops selected',
        }));
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
    // Extract current number without the old code if possible, essentially handling the prefix replacement
    const parts = contactInfo.phone.split(' ');
    const numberPart =
      parts.length > 1 ? parts.slice(1).join(' ') : parts[0] || '';
    // If the current phone doesn't start with a code (user deleted it), just prepend.
    // But since we initialize with +91, we try to preserve the rest.
    setContactInfo((prev) => ({
      ...prev,
      phone: `${country.code} ${numberPart.replace(/^\+[\d]+\s*/, '')}`,
    }));
  };

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleFarmChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFarmDetails((prev) => ({ ...prev, [name]: value }));
  };

  const tabs = [
    'Profile',
    'Farmer Details',
    'Farm Details',
    'Field Details',
    'Crop Details',
    'Preferences',
  ];

  return (
    <main className="min-h-screen bg-background text-foreground pb-20 p-4 lg:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto">
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

        {/* PROFiLE TAB CONTENT */}
        {activeTab === 'Profile' && (
          <div className="bg-card border border-border rounded-3xl p-8">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-foreground">
                Your Profile
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Please update your profile settings here
              </p>
            </div>

            {/* User Header */}
            <div className="flex items-start gap-6 mb-10">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-green-500 flex items-center justify-center text-black">
                  <User size={32} />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-card rounded-full flex items-center justify-center border-4 border-card cursor-pointer hover:bg-muted">
                  <Camera size={14} className="text-black" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {userDetails.name}
                </h1>
                <p className="text-sm text-muted-foreground mb-3">
                  {userDetails.email}
                </p>
                <div className="flex gap-3">
                  <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/20 text-[10px] font-bold text-green-500 flex items-center gap-1.5 uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    Active Farmer
                  </div>
                  <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase">
                    Member since Dec 2024
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* Total Land Area */}
              <div className="bg-[#1e40af] rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Map size={24} className="text-white" />
                  </div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-4xl font-bold text-white mb-1">
                    {farmDetails.totalLand || '0'}{' '}
                    <span className="text-lg font-medium opacity-80"></span>
                  </h3>
                  <p className="text-xs font-bold text-white/60 uppercase tracking-wider">
                    Total Land Area
                  </p>
                </div>
              </div>

              {/* Cultivable Area */}
              <div className="bg-[#16a34a] rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Leaf size={24} className="text-white" />
                  </div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-4xl font-bold text-white mb-1">
                    1{' '}
                    <span className="text-lg font-medium opacity-80">
                      acres
                    </span>
                  </h3>
                  <p className="text-xs font-bold text-white/60 uppercase tracking-wider mb-4">
                    Cultivable Area
                  </p>
                  <div className="h-1.5 bg-black/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white/80 w-full rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Borewell */}
              <div className="bg-[#06b6d4] rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform">
                <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Droplets size={24} className="text-white" />
                  </div>
                  <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase">
                    Active
                  </div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Borewell
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
                    readOnly
                    className="flex-1 bg-secondary text-foreground rounded-r-xl font-bold px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  />
                </div>
              </div>

              {/* Profile Picture */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <label className="block text-xs font-bold text-muted-foreground uppercase">
                    Profile Picture
                  </label>
                  <Info size={14} className="text-muted-foreground" />
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-black">
                    <User size={28} />
                  </div>
                  <div className="flex gap-3">
                    <button className="px-6 py-2 bg-muted border border-border hover:bg-muted/80 rounded-xl text-xs font-bold text-foreground transition-all">
                      Edit
                    </button>
                    <button className="px-6 py-2 bg-[#ffe4e6] text-[#e11d48] rounded-xl text-xs font-bold hover:bg-[#ffced4] transition-all">
                      Delete
                    </button>
                  </div>
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
                ></textarea>
                <div className="text-right mt-2">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase">
                    275 characters remaining
                  </span>
                </div>
              </div>

              {/* Account Status */}
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-3">
                  Account Status
                </label>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-xs font-bold uppercase">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  Active Farmer
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FARMER DETAILS TAB */}
        {activeTab === 'Farmer Details' && <FarmerDetailsTab />}

        {/* FARM DETAILS TAB */}
        {activeTab === 'Farm Details' && <FarmDetailsTab />}

        {/* FIELD DETAILS TAB */}
        {activeTab === 'Field Details' && <FieldDetailsTab />}

        {/* CROP DETAILS TAB */}
        {activeTab === 'Crop Details' && <CropDetailsTab />}

        {/* PREFERENCES TAB CONTENT */}
        {activeTab === 'Preferences' && (
          <div className="bg-card border border-border rounded-3xl p-8">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-foreground">Preferences</h2>
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
                        <p className="text-xs text-muted-foreground">English</p>
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
