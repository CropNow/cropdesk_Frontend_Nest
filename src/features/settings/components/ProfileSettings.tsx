import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ProfileSettingsState } from "./SettingsLayout";
import { useProfileSettings } from "@features/settings/hooks/useProfileSettings";
import { UserDetailsPanel } from "./profile/UserDetailsPanel";
import { FarmerDetailsPanel } from "./profile/FarmerDetailsPanel";
import { FarmDetailsPanel } from "./profile/FarmDetailsPanel";
import { FieldDetailsPanel } from "./profile/FieldDetailsPanel";
import { CropDetailsPanel } from "./profile/CropDetailsPanel";

interface ProfileSettingsProps {
  values: ProfileSettingsState;
  onChange: (patch: Partial<ProfileSettingsState>) => void;
  onSave: () => void;
  isSaving: boolean;
}

type ProfileTab = "user" | "farmer" | "farm" | "field" | "crop";

export function ProfileSettings({
  values,
  onChange,
  onSave,
  isSaving,
}: ProfileSettingsProps) {
  const {
    fetchProfile,
    updateProfile,
    isLoading: isUpdating,
  } = useProfileSettings();
  const [activeTab, setActiveTab] = useState<ProfileTab>("user");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchProfile();
        if (profile) {
          onChange({
            firstName: profile.firstName || values.firstName,
            lastName: profile.lastName || values.lastName,
            email: profile.email || values.email,
            phone: profile.phone || values.phone,
          });
        }
      } catch (err) {
      }
    };
    loadProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
      });
      onSave(); // Trigger toast
    } catch (err) {
      throw err;
    }
  };

  const tabs: { id: ProfileTab; label: string }[] = [
    { id: "user", label: "User" },
    { id: "farmer", label: "Farmer" },
    { id: "farm", label: "Farm" },
    { id: "field", label: "Field" },
    { id: "crop", label: "Crop" },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Inner Sidebar */}
      <aside className="w-full md:w-48 shrink-0 border-r border-cardBorder pr-4 flex flex-row md:flex-col gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium text-left rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-accentPrimary/15 text-accentPrimary"
                : "text-textSecondary hover:bg-cardBorder/50 hover:text-textPrimary"
            }`}
          >
            {tab.label} Details
          </button>
        ))}
      </aside>

      {/* Panel Content */}
      <div className="flex-1 min-w-0">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "user" && (
            <UserDetailsPanel
              values={values}
              onChange={onChange}
              onSave={handleUpdateProfile}
              isSaving={isSaving}
              isUpdating={isUpdating}
            />
          )}
          {activeTab === "farmer" && <FarmerDetailsPanel />}
          {activeTab === "farm" && <FarmDetailsPanel />}
          {activeTab === "field" && <FieldDetailsPanel />}
          {activeTab === "crop" && <CropDetailsPanel />}
        </motion.div>
      </div>
    </div>
  );
}
