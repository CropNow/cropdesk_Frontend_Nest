import { AnimatePresence, motion } from 'framer-motion';
import { ProfileSettings } from './ProfileSettings';

import { DeviceSettings } from './DeviceSettings';
import { NotificationSettings } from './NotificationSettings';
import { AppearanceSettings } from './AppearanceSettings';
import { SecuritySettings } from './SecuritySettings';
import { SystemSettings } from './SystemSettings';
import { SettingsState, SettingsTab } from './SettingsLayout';

interface SettingsContentProps {
  activeTab: SettingsTab;
  activeTabLabel: string;
  settings: SettingsState;
  setSettings: React.Dispatch<React.SetStateAction<SettingsState>>;
  onSave: (tab: SettingsTab) => void;
  onSystemReset: () => void;
  isSaving: boolean;
}

export function SettingsContent({
  activeTab,
  activeTabLabel,
  settings,
  setSettings,
  onSave,
  onSystemReset,
  isSaving,
}: SettingsContentProps) {
  return (
    <section className="rounded-2xl border border-cardBorder bg-cardBg p-4 backdrop-blur-xl sm:p-6">
      <div className="mb-4 flex items-center justify-between border-b border-cardBorder pb-3">
        <h2 className="text-lg font-semibold text-textHeading sm:text-xl">{activeTabLabel}</h2>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'profile' ? (
            <ProfileSettings
              values={settings.profile}
              onChange={(patch) =>
                setSettings((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } }))
              }
              onSave={() => onSave('profile')}
              isSaving={isSaving}
            />
          ) : null}



          {activeTab === 'devices' ? (
            <DeviceSettings
              devices={settings.devices}
              onAdd={(payload) =>
                setSettings((prev) => ({
                  ...prev,
                  devices: [
                    ...prev.devices,
                    {
                      id: Date.now(),
                      type: payload.type,
                      name: payload.name,
                      status: payload.status,
                      serialNumber: payload.serialNumber,
                      model: payload.model,
                      manufacturer: payload.manufacturer,
                      fieldId: payload.fieldId,
                      firmware: payload.firmware,
                      connectedOn: new Date().toLocaleDateString('en-US'),
                    },
                  ],
                }))
              }
              onRename={(id, name) =>
                setSettings((prev) => ({
                  ...prev,
                  devices: prev.devices.map((device) =>
                    device.id === id ? { ...device, name } : device
                  ),
                }))
              }
              onRemove={(id) =>
                setSettings((prev) => ({
                  ...prev,
                  devices: prev.devices.filter((device) => device.id !== id),
                }))
              }
              onToggleStatus={(id) =>
                setSettings((prev) => ({
                  ...prev,
                  devices: prev.devices.map((device) =>
                    device.id === id
                      ? {
                          ...device,
                          status: device.status === 'Connected' ? 'Offline' : 'Connected',
                        }
                      : device
                  ),
                }))
              }
              onUpdateDetails={(id, patch) =>
                setSettings((prev) => ({
                  ...prev,
                  devices: prev.devices.map((device) =>
                    device.id === id ? { ...device, ...patch } : device
                  ),
                }))
              }
              onDevicesLoad={(devices) =>
                setSettings((prev) => ({ ...prev, devices }))
              }
              onSave={() => onSave('devices')}
              isSaving={isSaving}
            />
          ) : null}

          {activeTab === 'notifications' ? (
            <NotificationSettings
              values={settings.notifications}
              onChange={(patch) =>
                setSettings((prev) => ({
                  ...prev,
                  notifications: { ...prev.notifications, ...patch },
                }))
              }
              onSave={() => onSave('notifications')}
              isSaving={isSaving}
            />
          ) : null}

          {activeTab === 'appearance' ? (
            <AppearanceSettings
              values={settings.appearance}
              onChange={(patch) =>
                setSettings((prev) => ({
                  ...prev,
                  appearance: { ...prev.appearance, ...patch },
                }))
              }
              onSave={() => onSave('appearance')}
              isSaving={isSaving}
            />
          ) : null}

          {activeTab === 'security' ? (
            <SecuritySettings
              values={settings.security}
              onChange={(patch) =>
                setSettings((prev) => ({
                  ...prev,
                  security: { ...prev.security, ...patch },
                }))
              }
              onLogoutAll={() =>
                setSettings((prev) => ({
                  ...prev,
                  security: { ...prev.security, activeSessions: [] },
                }))
              }
              onSave={() => onSave('security')}
              isSaving={isSaving}
            />
          ) : null}

          {activeTab === 'system' ? (
            <SystemSettings
              values={settings.system}
              onChange={(patch) =>
                setSettings((prev) => ({
                  ...prev,
                  system: { ...prev.system, ...patch },
                }))
              }
              onReset={onSystemReset}
              onSave={() => onSave('system')}
              isSaving={isSaving}
            />
          ) : null}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
