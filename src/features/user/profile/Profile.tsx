import React, { useState, useEffect } from 'react';
import { User, Map, Leaf, Droplets, Cpu, Trash2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import FarmerDetailsTab from './FarmerDetailsTab';
import FarmDetailsTab from './FarmDetailsTab';
import FieldDetailsTab from './FieldDetailsTab';
import CropDetailsTab from './CropDetailsTab';
import AddDeviceModal from './AddDeviceModal';
import { Switch } from '../../../components/ui/switch';
import { FormInput } from '@/components/common/FormInput';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormTextarea } from '@/components/common/FormTextarea';
import { ProfileProvider } from './context/ProfileProvider';
import { useProfile } from './context/useProfile';
import { connectDevice, deleteDevice } from './device.service';

// Inner Profile Component that consumes the context
const ProfileContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();

  // Consuming Profile Context for validation
  const {
    selectedFarmer,
    selectedFarm,
    selectedField,
    selectedCrop,
    loading: profileLoading
  } = useProfile();

  const [activeTab, setActiveTab] = useState('Profile');

  // Preferences State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPublicProfile, setIsPublicProfile] = useState(false);

  // Add Device Modal State
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);

  // Device State
  const [devices, setDevices] = useState<any[]>([]);
  const [isAddingDevice, setIsAddingDevice] = useState(false);

  // User Details State
  const [userDetails, setUserDetails] = useState({
    name: 'Farmer',
    email: '',
    joinDate: 'Dec 2024',
    bio: '',
  });

  // Check for profile completeness to allow Device Addition
  const checkProfileCompleteness = (): { complete: boolean; missingTab?: string; message?: string } => {
    if (!selectedFarmer) return { complete: false, missingTab: 'Farmer Details', message: 'Please add Farmer Details first.' };
    if (!selectedFarm) return { complete: false, missingTab: 'Farm Details', message: 'Please add Farm Details first.' };
    if (!selectedField) return { complete: false, missingTab: 'Field Details', message: 'Please add Field Details first.' };
    if (!selectedCrop) return { complete: false, missingTab: 'Crop Details', message: 'Please add Crop Details first.' };
    return { complete: true };
  };

  const handleAttemptAddDevice = () => {
    const status = checkProfileCompleteness();
    if (status.complete) {
      setIsAddDeviceModalOpen(true);
    } else {
      alert(status.message);
      if (status.missingTab) setActiveTab(status.missingTab);
    }
  };

  // Load User Data
  useEffect(() => {
    const sessionStr = localStorage.getItem('user');
    const storedUser = sessionStr ? JSON.parse(sessionStr) : null;
    const currentUser = user || storedUser;

    if (currentUser) {
      const fullName =
        currentUser.firstName && currentUser.lastName
          ? `${currentUser.firstName} ${currentUser.lastName}`
          : currentUser.username || 'User';

      setUserDetails({
        name: fullName,
        email: currentUser.email || '',
        joinDate: 'Dec 2024',
        bio: currentUser.bio || 'No bio provided.',
      });
    }

    // Check for redirect state to open Add Device modal
    // Only run this check if profile data is done loading to avoid false positives
    if (location.state?.openAddDevice && !profileLoading) {
      const status = checkProfileCompleteness();
      if (status.complete) {
        setIsAddDeviceModalOpen(true);
      } else {
        // If incomplete, redirect to the missing tab automatically
        alert(`To add a device, ${status.message}`);
        if (status.missingTab) setActiveTab(status.missingTab);
      }
      // Clear state
      navigate(location.pathname, { replace: true, state: {} });
    }

    // Load Devices
    const storedDevices = localStorage.getItem('connected_devices');
    if (storedDevices) {
      setDevices(JSON.parse(storedDevices));
    }
  }, [user, location.state, profileLoading, selectedFarmer, selectedFarm, selectedField, selectedCrop]);

  const tabs = [
    'Profile',
    'Farmer Details',
    'Farm Details',
    'Field Details',
    'Crop Details',
  ];

  // Edit & Delete Logic
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!userDetails.name.trim()) newErrors.name = 'This field is not filled';
    // Bio is optional? Let's say name is required.

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditToggle = () => {
    if (isEditing) {
      if (!validateForm()) return;

      const sessionStr = localStorage.getItem('user');
      const currentUser = sessionStr ? JSON.parse(sessionStr) : {};
      const updatedUser = {
        ...currentUser,
        bio: userDetails.bio,
        username: userDetails.name,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
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

  const handleAddDevice = async (deviceData: any) => {
    if (!deviceData.serialNumber) {
      alert('Please enter a serial number.');
      return;
    }

    setIsAddingDevice(true);
    try {
      // Connect to the device service
      // @ts-ignore
      const response: any = await connectDevice(deviceData.serialNumber, deviceData);

      if (response.success) {
        // 1. Update Devices List
        const newDevice = { ...deviceData, ...response.device };
        const updatedDevices = [...devices, newDevice];
        setDevices(updatedDevices);
        localStorage.setItem(
          'connected_devices',
          JSON.stringify(updatedDevices)
        );

        // 2. Persist IOT Data for the Dashboard
        localStorage.setItem(
          'iot_device_data',
          JSON.stringify(response.sensorData)
        );

        setIsAddDeviceModalOpen(false);
        alert('Device Connected Successfully! IoT Dashboard is now live.');
      }
    } catch (error: any) {
      alert(
        error.message ||
        'Failed to connect device. Please check the serial number.'
      );
    } finally {
      setIsAddingDevice(false);
    }
  };

  const handleDeleteDevice = async (device: any) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the device "${device.name}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      // If the device has a fieldId, try to delete from backend
      if (device.fieldId && device.serialNumber) {
        await deleteDevice(device.fieldId, device.serialNumber);
      }

      // Update Local State
      const updatedDevices = devices.filter(
        (d) => d.serialNumber !== device.serialNumber
      );
      setDevices(updatedDevices);
      localStorage.setItem('connected_devices', JSON.stringify(updatedDevices)); // Persist

      // If no devices left, maybe clear IoT data?
      if (updatedDevices.length === 0) {
        localStorage.removeItem('iot_device_data');
      }

      alert('Device deleted successfully.');
    } catch (error: any) {
      console.error('Failed to delete device:', error);
      alert('Failed to delete device from backend, but removing locally.');

      // Fallback: Remove locally even if backend fails (to unblock user)
      const updatedDevices = devices.filter(
        (d) => d.serialNumber !== device.serialNumber
      );
      setDevices(updatedDevices);
      localStorage.setItem('connected_devices', JSON.stringify(updatedDevices));
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground pb-20 p-4 pt-20 md:pt-8 lg:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-8">
        <div className="flex-1">
          {/* Sub Navigation */}
          <div className="bg-card border border-border rounded-2xl p-2 mb-8 flex overflow-x-auto no-scrollbar gap-2 sticky top-16 md:static z-40">
            {tabs.map((tab) => (
              <Button
                key={tab}
                variant="ghost"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 md:px-6 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${activeTab === tab
                  ? 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20 hover:text-green-500'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent'
                  }`}
              >
                {tab}
              </Button>
            ))}
          </div>

          {/* PROFILE TAB CONTENT */}
          {activeTab === 'Profile' && (
            <div className="bg-card border border-border rounded-3xl p-4 md:p-8">
              {/* Header */}
              <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center bg-green-500 text-black flex-shrink-0 shadow-lg">
                    <User size={40} />
                  </div>
                  <div className="flex-1 space-y-2 mt-1">
                    {isEditing ? (
                      <div className="space-y-1">
                        <Label className="text-xs font-bold text-muted-foreground uppercase">
                          Name
                        </Label>
                        <FormInput
                          value={userDetails.name}
                          onChange={(e) =>
                            setUserDetails({
                              ...userDetails,
                              name: e.target.value,
                            })
                          }
                          className="h-9"
                          error={errors.name || ''}
                        />
                      </div>
                    ) : (
                      <h2 className="text-2xl font-bold text-foreground">
                        {userDetails.name}
                      </h2>
                    )}

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{userDetails.email}</span>
                    </div>

                    {isEditing ? (
                      <div className="space-y-1 w-full max-w-md">
                        <Label className="text-xs font-bold text-muted-foreground uppercase">
                          Bio
                        </Label>
                        <FormTextarea
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

                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    className="rounded-xl w-10 h-10 bg-green-500 hover:bg-green-600 shadow-lg"
                    title="Add Device"
                    onClick={handleAttemptAddDevice}
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

              {/* Stats Cards */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-muted-foreground uppercase mb-4 md:hidden">
                  Farm Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {/* Total Land */}
                  <div className="bg-[#1e40af] rounded-2xl p-6 relative overflow-hidden group hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Map size={24} className="text-white" />
                      </div>
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-4xl font-bold text-white mb-0.5">
                        {selectedFarm
                          ? parseFloat(selectedFarm.area) > 0
                            ? selectedFarm.area
                            : selectedFarm.fields?.reduce(
                              (acc: number, f: any) =>
                                acc + (parseFloat(f.area) || 0),
                              0
                            ) || '0'
                          : '0'}
                      </h3>
                      <p className="text-xs font-bold text-white/60 uppercase tracking-wider">
                        Total Land
                      </p>
                    </div>
                  </div>

                  {/* Cultivable */}
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

              {/* Device Section - List or Empty State */}
              <div className="border-t border-border pt-8 mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-foreground">
                    Device Details
                  </h3>
                </div>

                {devices.length > 0 && checkProfileCompleteness().complete ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {devices.map((device, index) => (
                      <div
                        key={index}
                        className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                              <Cpu size={20} />
                            </div>
                            <div>
                              <h4 className="font-bold text-foreground">
                                {device.name}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {device.type}
                              </p>
                            </div>
                          </div>
                          <div
                            className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${device.status === 'Active'
                              ? 'bg-green-500/10 text-green-500'
                              : 'bg-red-500/10 text-red-500'
                              }`}
                          >
                            {device.status}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-2"
                            onClick={() => handleDeleteDevice(device)}
                            title="Delete Device"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                          <div className="overflow-hidden">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">
                              Serial Number
                            </p>
                            <p className="text-xs font-mono text-foreground mt-0.5 break-all">
                              {device.serialNumber}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">
                              Model
                            </p>
                            <p className="text-xs text-foreground mt-0.5">
                              {device.model || '-'}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">
                              Manufacturer
                            </p>
                            <p className="text-xs text-foreground mt-0.5">
                              {device.manufacturer || '-'}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">
                              Field ID
                            </p>
                            <p className="text-xs text-foreground mt-0.5">
                              {device.fieldId || '-'}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">
                              Firmware
                            </p>
                            <p className="text-xs text-foreground mt-0.5">
                              {device.firmwareVersion || '-'}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">
                              Connected
                            </p>
                            <p className="text-xs text-foreground mt-0.5">
                              {device.connectedAt
                                ? new Date(
                                  device.connectedAt
                                ).toLocaleDateString()
                                : 'Just now'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-muted/30 border border-dashed border-border rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-4">
                      <Cpu size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                      No devices connected yet
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                      Add a device to start monitoring your farm
                    </p>
                  </div>
                )}
              </div>

              {/* Preferences Section */}
              <div className="border-t border-border pt-8 mt-8">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-foreground">
                    Preferences
                  </h3>
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

          {activeTab === 'Farmer Details' && <FarmerDetailsTab />}
          {activeTab === 'Farm Details' && <FarmDetailsTab />}
          {activeTab === 'Field Details' && <FieldDetailsTab />}
          {activeTab === 'Crop Details' && <CropDetailsTab />}
        </div>
      </div>

      <AddDeviceModal
        isOpen={isAddDeviceModalOpen}
        onClose={() => setIsAddDeviceModalOpen(false)}
        onAdd={handleAddDevice}
      />
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
