import { motion } from 'framer-motion';
import {
  Bell,
  Lock,
  Palette,
  Server,
  Settings as SettingsIcon,
  Tractor,
  User,
} from 'lucide-react';
import { SETTINGS_TABS, SettingsTab } from './SettingsLayout';

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

const TAB_ICONS: Record<SettingsTab, React.ComponentType<{ className?: string }>> = {
  profile: User,

  devices: SettingsIcon,
  notifications: Bell,
  appearance: Palette,
  security: Lock,
  system: Server,
};

export function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  return (
    <aside className="rounded-2xl border border-cardBorder bg-cardBg p-3 backdrop-blur-xl sm:p-4">
      <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.14em] text-textHint">Settings Menu</p>
      <nav className="space-y-1">
        {SETTINGS_TABS.map((tab, index) => {
          const Icon = TAB_ICONS[tab.id];
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              type="button"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.02 * index }}
              onClick={() => onTabChange(tab.id)}
              className={[
                'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition',
                isActive
                  ? 'border-accentPrimary/50 bg-accentPrimary/12 text-accentPrimary'
                  : 'border-transparent bg-transparent text-textLabel hover:border-cardBorder hover:bg-cardBg hover:text-textHeading',
              ].join(' ')}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{tab.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </aside>
  );
}
