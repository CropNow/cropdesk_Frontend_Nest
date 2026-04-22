import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SettingsSidebar } from './SettingsSidebar';
import { SettingsContent } from './SettingsContent';

export type SettingsTab =
  | 'profile'
  | 'farm'
  | 'devices'
  | 'notifications'
  | 'ai'
  | 'integrations'
  | 'appearance'
  | 'security'
  | 'system';

export type DeviceKind = 'NEST' | 'Seed' | 'Drone';

export interface ProfileSettingsState {
  name: string;
  email: string;
  phone: string;
  profilePicture: string;
}

export interface FarmSettingsState {
  farmName: string;
  location: string;
  areaAcres: string;
  cropTypes: string[];
  soilType: string;
  irrigationType: string;
}

export interface DeviceSettingsState {
  id: number;
  type: DeviceKind;
  name: string;
  status: 'Connected' | 'Offline';
  serialNumber: string;
  model: string;
  manufacturer: string;
  fieldId: string;
  firmware: string;
  connectedOn: string;
}

export interface NotificationSettingsState {
  pestAlerts: boolean;
  fungalAlerts: boolean;
  irrigationAlerts: boolean;
  weatherAlerts: boolean;
  sms: boolean;
  email: boolean;
  push: boolean;
}

export interface AISettingsState {
  sensitivity: 'Low' | 'Medium' | 'High';
  autoSuggestions: boolean;
  confidenceThreshold: number;
  enableRecommendations: boolean;
}

export interface IntegrationSettingsState {
  apiKey: string;
  weatherApiConnected: boolean;
  mapsConnected: boolean;
  exportFormat: 'CSV' | 'JSON';
  syncFrequency: '15 min' | '30 min' | '1 hour' | '6 hours' | '24 hours';
}

export interface AppearanceSettingsState {
  theme: 'Dark' | 'Light';
  accentColor: string;
  density: 'Compact' | 'Comfortable';
}

export interface SessionState {
  id: string;
  device: string;
  location: string;
  lastActive: string;
}

export interface SecuritySettingsState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
  activeSessions: SessionState[];
}

export interface SystemSettingsState {
  units: 'Metric' | 'Imperial';
  language: string;
  timeZone: string;
}

export interface SettingsState {
  profile: ProfileSettingsState;
  farm: FarmSettingsState;
  devices: DeviceSettingsState[];
  notifications: NotificationSettingsState;
  ai: AISettingsState;
  integrations: IntegrationSettingsState;
  appearance: AppearanceSettingsState;
  security: SecuritySettingsState;
  system: SystemSettingsState;
}

export const SETTINGS_TABS: Array<{ id: SettingsTab; label: string }> = [
  { id: 'profile', label: 'Profile' },
  { id: 'farm', label: 'Farm Settings' },
  { id: 'devices', label: 'Devices' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'security', label: 'Security' },
  { id: 'system', label: 'System' },
];

const INITIAL_SETTINGS: SettingsState = {
  profile: {
    name: 'CropNow',
    email: 'test@gmail.com',
    phone: '+91 98765 43210',
    profilePicture: '',
  },
  farm: {
    farmName: 'Green Valley Farm',
    location: 'Kallakurichi, Tamil Nadu',
    areaAcres: '12.8',
    cropTypes: ['Tomato', 'Onion', 'Chili'],
    soilType: 'Loamy',
    irrigationType: 'Drip',
  },
  devices: [
    {
      id: 1,
      type: 'NEST',
      name: 'NEST Tower A1',
      status: 'Connected',
      serialNumber: '6CJcgHUM3uEJVUSDvPP1zCwUu86aF',
      model: 'ms-200',
      manufacturer: 'cropnow',
      fieldId: '699e99bfc6e8e4b7b32061c8',
      firmware: 'v1',
      connectedOn: '4/6/2026',
    },
    {
      id: 2,
      type: 'Seed',
      name: 'moisture sensor',
      status: 'Connected',
      serialNumber: '6XKApzXTmOBu2YcLVvx1wGhEvT8K8',
      model: 'ms-200',
      manufacturer: 'cropnow',
      fieldId: '5f71a8e8a2c53f7f44a3dba2',
      firmware: 'v1',
      connectedOn: '4/6/2026',
    },
    {
      id: 3,
      type: 'Drone',
      name: 'Aero Drone X1',
      status: 'Offline',
      serialNumber: 'DRN-55X-A2F-90K',
      model: 'agri-drone-x1',
      manufacturer: 'cropnow',
      fieldId: '8b56d9b0138c4ef593f3f14e',
      firmware: 'v2.3.1',
      connectedOn: '3/28/2026',
    },
  ],
  notifications: {
    pestAlerts: true,
    fungalAlerts: true,
    irrigationAlerts: true,
    weatherAlerts: true,
    sms: false,
    email: true,
    push: true,
  },
  ai: {
    sensitivity: 'Medium',
    autoSuggestions: true,
    confidenceThreshold: 85,
    enableRecommendations: true,
  },
  integrations: {
    apiKey: 'cn_live_xxxxxxx',
    weatherApiConnected: true,
    mapsConnected: true,
    exportFormat: 'CSV',
    syncFrequency: '1 hour',
  },
  appearance: {
    theme: 'Dark',
    accentColor: '#00ff9c',
    density: 'Comfortable',
  },
  security: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    activeSessions: [
      { id: 's1', device: 'Chrome on Windows', location: 'Kallakurichi, IN', lastActive: 'Now' },
      { id: 's2', device: 'Mobile App (Android)', location: 'Chennai, IN', lastActive: '2h ago' },
    ],
  },
  system: {
    units: 'Metric',
    language: 'English',
    timeZone: 'Asia/Kolkata',
  },
};

export function SettingsLayout() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [settings, setSettings] = useState<SettingsState>(INITIAL_SETTINGS);
  const [savingTab, setSavingTab] = useState<SettingsTab | null>(null);
  const [toastMessage, setToastMessage] = useState('');

  const activeTabLabel = useMemo(() => {
    return SETTINGS_TABS.find((tab) => tab.id === activeTab)?.label ?? 'Settings';
  }, [activeTab]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setToastMessage('');
    }, 2200);

    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  const handleSave = (tab: SettingsTab) => {
    setSavingTab(tab);

    window.setTimeout(() => {
      setSavingTab(null);
      const label = SETTINGS_TABS.find((item) => item.id === tab)?.label ?? 'Settings';
      setToastMessage(label + ' saved successfully');
    }, 650);
  };

  const handleSystemReset = () => {
    setSettings((prev) => ({
      ...prev,
      system: {
        units: 'Metric',
        language: 'English',
        timeZone: 'Asia/Kolkata',
      },
    }));
    setToastMessage('System settings reset to defaults');
  };

  return (
    <div className="space-y-5">
      <header className="rounded-2xl border border-cardBorder bg-cardBg p-4 backdrop-blur-xl sm:p-6">
        <h1 className="text-2xl font-bold text-textHeading sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-textSecondary sm:text-base">Manage your system preferences</p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <SettingsContent
          activeTab={activeTab}
          activeTabLabel={activeTabLabel}
          settings={settings}
          setSettings={setSettings}
          onSave={handleSave}
          onSystemReset={handleSystemReset}
          isSaving={savingTab === activeTab}
        />
      </div>

      <AnimatePresence>
        {toastMessage ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-6 right-6 z-[120] rounded-xl border border-accentPrimary/40 bg-bgSidebar px-4 py-3 text-sm font-medium text-accentPrimary shadow-lg"
          >
            {toastMessage}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
