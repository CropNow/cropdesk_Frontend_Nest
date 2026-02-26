import React, { useState, useEffect } from 'react';
import {
  User,
  Map,
  Leaf,
  Droplets,
  Cpu,
  Trash2,
  Pencil,
  Plus,
} from 'lucide-react';
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
import { RegistrationPlaceholder } from '@/components/common/RegistrationPlaceholder';
// import { ProfileProvider } from './context/ProfileProvider';
import { useProfile } from './context/useProfile';
import { connectDevice, deleteDevice } from './device.service';
import { useTheme } from '@/hooks/useTheme';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
    loading: profileLoading,
  } = useProfile();

  const [activeTab, setActiveTab] = useState('Profile');

  // Theme
  const { theme, toggleTheme } = useTheme();

  // Preferences State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(theme === 'dark');
  const [isPublicProfile, setIsPublicProfile] = useState(false);

  // Sync isDarkMode with theme
  useEffect(() => {
    setIsDarkMode(theme === 'dark');
  }, [theme]);

  const handleDarkModeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked && theme !== 'dark') {
      toggleTheme();
    } else if (!checked && theme !== 'light') {
      toggleTheme();
    }
  };

  // Add Device Modal State
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);

  // Device State
  const [devices, setDevices] = useState<any[]>([]);
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [editingDevice, setEditingDevice] = useState<any>(null);

  // User Details State
  const [userDetails, setUserDetails] = useState({
    name: 'Farmer',
    email: '',
    joinDate: 'Dec 2024',
    bio: '',
  });

  // Alert & Confirm Dialog State
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'info' | 'warning' | 'error';
    onConfirm?: () => void;
    isConfirm?: boolean;
    confirmLabel?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    isConfirm: false,
  });

  const closeAlert = () =>
    setAlertConfig((prev) => ({ ...prev, isOpen: false }));

  // Check for profile completeness to allow Device Addition
  const checkProfileCompleteness = (): {
    complete: boolean;
    missingTab?: string;
    message?: string;
  } => {
    if (!selectedFarmer)
      return {
        complete: false,
        missingTab: 'Farmer Details',
        message: 'Please add Farmer Details first.',
      };
    if (!selectedFarm)
      return {
        complete: false,
        missingTab: 'Farm Details',
        message: 'Please add Farm Details first.',
      };
    if (!selectedField)
      return {
        complete: false,
        missingTab: 'Field Details',
        message: 'Please add Field Details first.',
      };
    if (!selectedCrop)
      return {
        complete: false,
        missingTab: 'Crop Details',
        message: 'Please add Crop Details first.',
      };
    return { complete: true };
  };

  const registrationCompleted = profileLoading
    ? false
    : checkProfileCompleteness().complete;

  const handleAttemptAddDevice = () => {
    const status = checkProfileCompleteness();
    if (status.complete) {
      setIsAddDeviceModalOpen(true);
    } else {
      setAlertConfig({
        isOpen: true,
        title: 'Registration Incomplete',
        message: 'Please complete your registration details to add a device.',
        type: 'warning',
      });
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
        setAlertConfig({
          isOpen: true,
          title: 'Direct Link Warning',
          message: `To add a device, ${status.message}`,
          type: 'warning',
          onConfirm: () => {
            if (status.missingTab) setActiveTab(status.missingTab);
            closeAlert();
          },
        });
      }
      // Clear state
      navigate(location.pathname, { replace: true, state: {} });
    }

    // Load Devices
    const storedDevices = localStorage.getItem('connected_devices');
    if (storedDevices) {
      setDevices(JSON.parse(storedDevices));
    } else if (selectedField && selectedField.id) {
      // Fallback: Try to fetch from backend if local storage is empty (Fresh Login)
      import('./device.service').then(({ getDevicesForField }) => {
        getDevicesForField(selectedField.id).then((fetchedDevices) => {
          if (fetchedDevices && fetchedDevices.length > 0) {
            // Map backend sensor to frontend Device format if needed
            // This assumes backend returns compatible structure or we just use it
            // We might need to map 'serialNumber' if backend uses 'code' or 'id'
            const mapped = fetchedDevices.map((d: any) => ({
              ...d,
              serialNumber: d.serialNumber || d.code || d.id, // Ensure serial matches
              status: d.status || (d.isOnline ? 'Active' : 'Offline'),
              connectedAt: d.createdAt || new Date().toISOString(),
            }));

            setDevices(mapped);
            localStorage.setItem('connected_devices', JSON.stringify(mapped));
          }
        });
      });
    }
  }, [
    user,
    location.state,
    profileLoading,
    selectedFarmer,
    selectedFarm,
    selectedField,
    selectedCrop,
  ]);

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
    setAlertConfig({
      isOpen: true,
      isConfirm: true,
      title: 'Delete Account',
      message:
        'Are you sure you want to delete your account? This action cannot be undone.',
      confirmLabel: 'Delete',
      type: 'error',
      onConfirm: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('registeredUser');
        setUser(null);
        navigate('/login');
        closeAlert(); // Although navigating away usually unmounts
      },
    });
  };

  const handleSaveDevice = async (deviceData: any) => {
    if (!deviceData.serialNumber) {
      setAlertConfig({
        isOpen: true,
        title: 'Missing Information',
        message: 'Please enter a serial number.',
        type: 'warning',
      });
      return;
    }

    setIsAddingDevice(true);
    try {
      const { registerNewDevice, getDevicesForField, updateDevice } =
        await import('./device.service');
      const fieldId =
        deviceData.fieldId || selectedField?.id || selectedField?._id;

      if (!fieldId) {
        throw new Error('No Field selected for the device.');
      }

      if (editingDevice) {
        // Update existing device
        await updateDevice(fieldId, editingDevice.sensorId, deviceData);
      } else {
        // Register new device
        await registerNewDevice(fieldId, deviceData);
      }

      // 2. Fetch Fresh Devices from Backend to sync state
      const fetchedDevices = await getDevicesForField(fieldId);

      // Safety check to ensure we have an array
      const devicesArray = Array.isArray(fetchedDevices)
        ? fetchedDevices
        : fetchedDevices?.data || [];

      const mapped = devicesArray.map((d: any) => ({
        ...d,
        serialNumber: d.serialNumber || d.code || d.id,
        status: d.status || (d.isOnline ? 'Active' : 'Offline'),
        connectedAt: d.createdAt || new Date().toISOString(),
      }));

      setDevices(mapped);
      localStorage.setItem('connected_devices', JSON.stringify(mapped));

      setIsAddDeviceModalOpen(false);
      setEditingDevice(null);
      setAlertConfig({
        isOpen: true,
        title: 'Success',
        message: editingDevice
          ? 'Device Updated Successfully!'
          : 'Device Registered Successfully!',
        type: 'info',
      });
    } catch (error: any) {
      setAlertConfig({
        isOpen: true,
        title: 'Registration Failed',
        message:
          error.response?.data?.message ||
          error.message ||
          'Failed to register device. Please try again.',
        type: 'error',
      });
    } finally {
      setIsAddingDevice(false);
    }
  };

  const handleDeleteDevice = async (device: any) => {
    setAlertConfig({
      isOpen: true,
      isConfirm: true,
      title: 'Delete Device',
      message: `Are you sure you want to delete the device "${device.name}"? This action cannot be undone.`,
      confirmLabel: 'Delete',
      type: 'error',
      onConfirm: async () => {
        closeAlert();
        try {
          // If the device has a fieldId and sensorId, try to delete from backend
          if (device.fieldId && device.sensorId) {
            await deleteDevice(device.fieldId, device.sensorId);
          }

          // Update Local State
          const updatedDevices = devices.filter(
            (d) => d.serialNumber !== device.serialNumber
          );
          setDevices(updatedDevices);
          localStorage.setItem(
            'connected_devices',
            JSON.stringify(updatedDevices)
          ); // Persist

          // If no devices left, maybe clear IoT data?
          if (updatedDevices.length === 0) {
            localStorage.removeItem('iot_device_data');
          }

          setAlertConfig({
            isOpen: true,
            title: 'Deleted',
            message: 'Device deleted successfully.',
            type: 'info',
          });
        } catch (error: any) {
          console.error('Failed to delete device:', error);
          // Fallback: Remove locally even if backend fails (to unblock user)
          const updatedDevices = devices.filter(
            (d) => d.serialNumber !== device.serialNumber
          );
          setDevices(updatedDevices);
          localStorage.setItem(
            'connected_devices',
            JSON.stringify(updatedDevices)
          );

          setAlertConfig({
            isOpen: true,
            title: 'Partial Delete',
            message:
              'Failed to delete device from backend, but removed locally.',
            type: 'warning',
          });
        }
      },
    });
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
                className={`px-4 py-2 md:px-6 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab
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
              {/* Header */}
              <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8 relative">
                <div className="flex items-start gap-4 flex-1 pr-12">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center bg-green-500 text-black flex-shrink-0 shadow-lg">
                    <User size={32} />
                  </div>
                  <div className="flex-1 space-y-1 mt-1">
                    {isEditing ? (
                      <div className="space-y-1">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase">
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
                          className="h-8 text-sm"
                          error={errors.name || ''}
                        />
                      </div>
                    ) : (
                      <h2 className="text-xl md:text-2xl font-bold text-foreground">
                        {userDetails.name}
                      </h2>
                    )}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{userDetails.email}</span>
                    </div>

                    {isEditing ? (
                      <div className="space-y-1 w-full max-w-md">
                        <Label className="text-[10px] font-bold text-muted-foreground uppercase">
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
                          className="h-16 resize-none text-sm"
                        />
                      </div>
                    ) : (
                      <p className="text-xs md:text-sm text-foreground/80 max-w-lg leading-relaxed">
                        {userDetails.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-muted-foreground uppercase mb-3 md:hidden">
                  Farm Statistics
                </h3>
                <div className="grid grid-cols-3 gap-3 md:gap-6">
                  {/* Total Land */}
                  <div className="bg-[#1e40af] rounded-2xl p-3 md:p-6 relative overflow-hidden group hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-2 md:mb-6 relative z-10">
                      <div className="p-1.5 md:p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Map className="w-4 h-4 md:w-6 md:h-6 text-white" />
                      </div>
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-lg md:text-4xl font-bold text-white mb-0.5">
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
                      <p className="text-[9px] md:text-xs font-bold text-white/60 uppercase tracking-wider">
                        Total Land
                      </p>
                    </div>
                  </div>

                  {/* Cultivable */}
                  <div className="bg-[#16a34a] rounded-2xl p-3 md:p-6 relative overflow-hidden group hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-2 md:mb-6 relative z-10">
                      <div className="p-1.5 md:p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Leaf className="w-4 h-4 md:w-6 md:h-6 text-white" />
                      </div>
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-lg md:text-4xl font-bold text-white mb-0.5">
                        {selectedField ? selectedField.area : '0'}
                      </h3>
                      <p className="text-[9px] md:text-xs font-bold text-white/60 uppercase tracking-wider">
                        Cultivable
                      </p>
                    </div>
                  </div>

                  {/* Water Source */}
                  <div className="bg-[#06b6d4] rounded-2xl p-3 md:p-6 relative overflow-hidden group hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start mb-2 md:mb-6 relative z-10">
                      <div className="p-1.5 md:p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Droplets className="w-4 h-4 md:w-6 md:h-6 text-white" />
                      </div>
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-base md:text-xl font-bold text-white mb-0.5 capitalize leading-tight">
                        {selectedField && selectedField.irrigationMethod
                          ? selectedField.irrigationMethod
                          : 'No Source'}
                      </h3>
                      <p className="text-[9px] md:text-xs font-bold text-white/60 uppercase tracking-wider">
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
                  {devices.length > 0 && (
                    <Button
                      onClick={() => {
                        setEditingDevice(null);
                        setIsAddDeviceModalOpen(true);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold h-9 px-4 rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-95"
                    >
                      <Plus size={16} />
                      Add Device
                    </Button>
                  )}
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
                            className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              device.status === 'Active'
                                ? 'bg-green-500/10 text-green-500'
                                : 'bg-red-500/10 text-red-500'
                            }`}
                          >
                            {device.status}
                          </div>
                          <div className="flex items-center gap-1 -mt-1 -mr-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-green-500 hover:bg-green-500/10"
                              onClick={() => {
                                setEditingDevice(device);
                                setIsAddDeviceModalOpen(true);
                              }}
                              title="Edit Device"
                            >
                              <Pencil size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteDevice(device)}
                              title="Delete Device"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
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
                    <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-xs">
                      Add a device to start monitoring your farm
                    </p>
                    <Button
                      onClick={handleAttemptAddDevice}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-2 rounded-xl flex items-center gap-2 shadow-lg transition-all active:scale-95"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                      Add Device
                    </Button>
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
                          onCheckedChange={handleDarkModeToggle}
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

          {!registrationCompleted ? (
            <div className="bg-card border border-border rounded-3xl p-8">
              <RegistrationPlaceholder
                title="No registration completed"
                description={`Complete your registration to view and manage your ${activeTab === 'Profile' ? 'farm' : activeTab.toLowerCase().replace(' details', '')} details.`}
                route="/register/farmer-details"
                variant="button"
                color="green"
                className="w-full max-w-md mx-auto"
              />
            </div>
          ) : (
            <>
              {activeTab === 'Farmer Details' && <FarmerDetailsTab />}
              {activeTab === 'Farm Details' && <FarmDetailsTab />}
              {activeTab === 'Field Details' && <FieldDetailsTab />}
              {activeTab === 'Crop Details' && <CropDetailsTab />}
            </>
          )}
        </div>
      </div>

      <AddDeviceModal
        isOpen={isAddDeviceModalOpen}
        onClose={() => {
          setIsAddDeviceModalOpen(false);
          setEditingDevice(null);
        }}
        initialData={editingDevice}
        onAdd={handleSaveDevice}
      />

      {/* Global Alert/Confirm Dialog */}
      <AlertDialog
        open={alertConfig.isOpen}
        onOpenChange={(open) => {
          if (!open) closeAlert();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertConfig.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertConfig.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {alertConfig.isConfirm ? (
              <>
                <AlertDialogCancel onClick={closeAlert}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={alertConfig.onConfirm}
                  className={
                    alertConfig.type === 'error'
                      ? 'bg-red-500 hover:bg-red-600'
                      : ''
                  }
                >
                  {alertConfig.confirmLabel || 'Confirm'}
                </AlertDialogAction>
              </>
            ) : (
              <AlertDialogAction
                onClick={() => {
                  if (alertConfig.onConfirm) alertConfig.onConfirm();
                  closeAlert();
                }}
              >
                Okay
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

// Main Profile Component (Wrapper) - Now just renders content as Provider is up a level
const Profile = () => {
  return <ProfileContent />;
};

export default Profile;
