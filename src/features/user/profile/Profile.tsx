import React, { useState } from 'react';
import { User, Map, Leaf, Droplets } from 'lucide-react';

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
import { ProfileProvider } from './context/ProfileProvider';
import { useProfile } from './context/useProfile';

// Inner Profile Component that consumes the context
const ProfileContent = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const {
    farmers,
    selectedFarmer,
    selectedFarm,
    selectedField,
    selectedCrop,
    selectedFarmerId,
    selectedFarmId,
    selectedFieldId,
    setSelectedFarmerId,
    setSelectedFarmId,
    setSelectedFieldId,
    setSelectedCropId,
    addFarmer,
    updateFarmer,
    deleteFarmer,
    addFarm,
    updateFarm,
    deleteFarm,
    addField,
    updateField,
    deleteField,
    addCrop,
    updateCrop,
    deleteCrop,
  } = useProfile();

  const [activeTab, setActiveTab] = useState('Profile');

  // Preferences State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPublicProfile, setIsPublicProfile] = useState(false);

  // User Details State
  // Note: This is UI state mostly, but we could move to context if we want "Global User" data elsewhere.
  // For now, keeping it here as it's purely Profile UI related.
  const [userDetails, setUserDetails] = useState({
    name: 'Farmer',
    email: '',
    joinDate: 'Dec 2024',
    bio: '',
  });

  // Load User Data for UI (distinct from the hierarchical data in Context)
  React.useEffect(() => {
    const sessionStr = localStorage.getItem('user');
    const currentUser = sessionStr ? JSON.parse(sessionStr) : null;
    if (currentUser) {
      const fullName =
        currentUser.firstName && currentUser.lastName
          ? `${currentUser.firstName} ${currentUser.lastName}`
          : currentUser.username || 'User';

  React.useEffect(() => {
    if (user) {
      setUserDetails({
        name: fullName,
        email: currentUser.email || '',
        joinDate: 'Dec 2024',
        bio: currentUser.bio || 'No bio provided.',
      });
    }
  }, []);

  const tabs = [
    'Profile',
    'Farmer Details',
    'Farm Details',
    'Field Details',
    'Crop Details',
    'Preferences',
  ];

  // Edit & Delete Logic for User Account
  const [isEditing, setIsEditing] = useState(false);
  const handleEditToggle = () => {
    if (isEditing) {
      // Save Logic
      const sessionStr = localStorage.getItem('user');
      const currentUser = sessionStr ? JSON.parse(sessionStr) : {};

      // Update local storage
      const updatedUser = { ...currentUser, bio: userDetails.bio };
      // Note: Updating name in local storage might require parsing first/last name if we want to be strict,
      // but provided requirements just asked to edit the name label. We'll update 'username' or similar field if simple.
      // For now, let's assume we update a 'displayName' or keep it simple.
      // User requested: "change the user name(label) and bio (textare) to just text while they want to edit it should be in label and teaxt area and save the updates"

      // We will persist 'bio' and 'username' (as name) for simplicity in this UI-first refactor
      updatedUser.bio = userDetails.bio;
      updatedUser.username = userDetails.name; // Simple mapping

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser); // Update context if it listens to this
    }
    setIsEditing((prev) => !prev);
  };

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
              {/* Header Section with Profile Icon, Details, and Add Device Button */}
              <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center bg-green-500 text-black flex-shrink-0 shadow-lg">
                    <User size={40} />
                  </div>
                  <div className="flex-1 space-y-2 mt-1">
                    {/* Name */}
                    {isEditing ? (
                      <div className="space-y-1">
                        <Label className="text-xs font-bold text-muted-foreground uppercase">
                          Name
                        </Label>
                        <Input
                          value={userDetails.name}
                          onChange={(e) =>
                            setUserDetails({
                              ...userDetails,
                              name: e.target.value,
                            })
                          }
                          className="h-9"
                        />
                      </div>
                    ) : (
                      <h2 className="text-2xl font-bold text-foreground">
                        {userDetails.name}
                      </h2>
                    )}

                    {/* Email */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{userDetails.email}</span>
                    </div>

                    {/* Bio */}
                    {isEditing ? (
                      <div className="space-y-1 w-full max-w-md">
                        <Label className="text-xs font-bold text-muted-foreground uppercase">
                          Bio
                        </Label>
                        <Textarea
                          value={userDetails.bio}
                          onChange={(e) =>
                            setUserDetails({
                              ...userDetails,
                              bio: e.target.value,
                            })
                          }
                          className="h-20 resize-none"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-foreground/80 max-w-lg leading-relaxed">
                        {userDetails.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Side: Action Buttons */}
                <div className="flex items-center gap-2">
                  {/* Edit & Delete moved to footer */}
                  <Button
                    size="icon"
                    className="rounded-xl w-10 h-10 bg-green-500 hover:bg-green-600 shadow-lg"
                    title="Add Device"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-black"
                    >
                      <path d="M5 12h14" />
                      <path d="M12 5v14" />
                    </svg>
                  </Button>
                </div>
              </div>

              {/* Stats Cards (First on Mobile) */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-muted-foreground uppercase mb-4 md:hidden">
                  Farm Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {/* Total Land Area */}
                  <div className="bg-[#1e40af] rounded-2xl p-6 relative overflow-hidden group hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Map size={24} className="text-white" />
                      </div>
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-4xl font-bold text-white mb-0.5">
                        {selectedFarm
                          ? selectedFarm.fields?.reduce(
                              (acc: number, f: any) =>
                                acc + (parseFloat(f.area) || 0),
                              0
                            )
                          : '0'}
                      </h3>
                      <p className="text-xs font-bold text-white/60 uppercase tracking-wider">
                        Total Land
                      </p>
                    </div>
                  </div>

                  {/* Cultivable Area */}
                  <div className="bg-[#16a34a] rounded-2xl p-6 relative overflow-hidden group hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Leaf size={24} className="text-white" />
                      </div>
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-4xl font-bold text-white mb-0.5">
                        {selectedField ? selectedField.area : '0'}
                      </h3>
                      <p className="text-xs font-bold text-white/60 uppercase tracking-wider">
                        Cultivable
                      </p>
                    </div>
                  </div>

                  {/* Water Source */}
                  <div className="bg-[#06b6d4] rounded-2xl p-6 relative overflow-hidden group hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Droplets size={24} className="text-white" />
                      </div>
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-white mb-0.5 capitalize truncate">
                        {selectedField && selectedField.irrigationMethod
                          ? selectedField.irrigationMethod
                          : 'No Source'}
                      </h3>
                      <p className="text-xs font-bold text-white/60 uppercase tracking-wider">
                        Water Source
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Device Details Section */}
              <div className="border-t border-border pt-8 mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-foreground">
                    Device Details
                  </h3>
                </div>

                <div className="bg-muted/50 rounded-2xl p-8 text-center border border-dashed border-border flex flex-col items-center justify-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-muted-foreground"
                    >
                      <rect width="18" height="12" x="3" y="10" rx="2" />
                      <path d="M12 2v2" />
                      <path d="M12 22v-2" />
                      <path d="m17 7 2-2" />
                      <path d="m7 7-2-2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium">
                      No devices connected yet
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      Add a device to start monitoring your farm
                    </p>
                  </div>
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

// Main Profile Component Wrapped in Provider
const Profile = () => {
  return (
    <ProfileProvider>
      <ProfileContent />
    </ProfileProvider>
  );
};

export default Profile;
