import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@app/layouts/DashboardLayout";
import { WelcomeHeader } from "./WelcomeHeader";
import { useAuth } from "@app/providers/AuthContext";

interface EmptyDashboardProps {
  currentTime: Date;
}

export function EmptyDashboard({ currentTime }: EmptyDashboardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAddDevice = () => {
    navigate("/settings?tab=devices");
  };

  const EmptyCard = ({ title, description, children, className = "" }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center rounded-xl border border-borderColor bg-bgInput p-8 text-center shadow-sm ${className}`}
    >
      {children}
      <h3 className="mt-4 text-scale-card font-bold text-textHeading tracking-tight">{title}</h3>
      <p className="mt-2 text-scale-body font-medium text-textSecondary">{description}</p>
    </motion.div>
  );

  return (
    <DashboardLayout>
      <WelcomeHeader
        currentTime={currentTime}
        userName={user ? `${user.firstName} ${user.lastName}` : "Farmer"}
      />

      <div className="mt-4 grid gap-6">
        {/* Top Row: Device & Farm Status */}
        <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-cardBorder bg-cardBg p-8 text-center shadow-card transition-all hover:border-accentPrimary/40"
          >
            <button
              onClick={handleAddDevice}
              className="group relative grid h-20 w-20 place-items-center rounded-full border border-accentPrimary/20 bg-accentPrimary/10 text-accentPrimary transition-all duration-300 hover:scale-105 hover:bg-accentPrimary/20 hover:border-accentPrimary/40"
            >
              <Plus className="h-10 w-10 transition-transform duration-500 group-hover:rotate-90" />
            </button>
            <h3 className="mt-8 text-scale-section font-bold text-textHeading tracking-tight">No devices connected</h3>
            <p className="mt-3 max-w-[320px] text-scale-body font-medium text-textSecondary">Add your first device to start seeing live dashboard data.</p>
          </motion.div>

          <EmptyCard
            title="Overall Farm Status"
            description="Add device to see Overall Farm Status"
            className="min-h-[360px]"
          />
        </div>

        {/* Middle Row: Sensors & Alerts */}
        <div className="grid gap-6 xl:grid-cols-2">
          <EmptyCard
            title="Sensor Insights"
            description="Add device to see Sensor Insights"
            className="min-h-[300px]"
          />
          <EmptyCard
            title="FIS Alert Engine"
            description="Add device to see FIS Alert Engine"
            className="min-h-[300px]"
          />
        </div>

        {/* Bottom Row: AI & Water */}
        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <EmptyCard
            title="AI Insights"
            description="Add device to see AI Insights"
            className="min-h-[260px]"
          />
          <EmptyCard
            title="Water Savings"
            description="Add device to see Water Savings"
            className="min-h-[260px]"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
