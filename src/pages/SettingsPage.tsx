import { DashboardLayout } from '../components/layout/DashboardLayout';
import { SettingsLayout } from '../components/settings/SettingsLayout';

export function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1400px]">
        <SettingsLayout />
      </div>
    </DashboardLayout>
  );
}
