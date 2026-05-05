import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../layout/DashboardLayout';
import { WelcomeHeader } from './WelcomeHeader';
import { useAuth } from '../../contexts/AuthContext';

interface EmptyDashboardProps {
  weatherSummary: any;
  currentTime: Date;
}

export function EmptyDashboard({ weatherSummary, currentTime }: EmptyDashboardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const displayWeather = {
    temp: weatherSummary?.temp || '--',
    condition: weatherSummary?.condition || 'Unknown',
    city: weatherSummary?.city || 'N/A'
  };

  const handleAddDevice = () => {
    navigate('/settings?tab=devices');
  };

  const EmptyCard = ({ title, description, children, className = "" }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center rounded-[2.5rem] border border-cardBorder bg-cardBg/40 p-8 text-center backdrop-blur-md ${className}`}
    >
      {children}
      <h3 className="mt-4 text-2xl font-bold text-textHeading tracking-tight">{title}</h3>
      <p className="mt-2 text-base text-textSecondary/80">{description}</p>
    </motion.div>
  );

  return (
    <DashboardLayout>
      <WelcomeHeader
        currentTime={currentTime}
        weather={displayWeather}
        userName={user ? `${user.firstName} ${user.lastName}` : 'Farmer'}
      />

      <div className="mt-4 grid gap-6">
        {/* Top Row: Device & Farm Status */}
        <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative flex min-h-[360px] flex-col items-center justify-center rounded-[2.5rem] border border-cardBorder bg-cardBg/40 p-8 text-center backdrop-blur-md transition-all hover:border-accentPrimary/20 hover:bg-cardBg/60"
          >
            <button
              onClick={handleAddDevice}
              className="group relative grid h-20 w-20 place-items-center rounded-full border border-accentPrimary/30 bg-accentPrimary/10 text-accentPrimary transition-all duration-300 hover:scale-110 hover:bg-accentPrimary/20 hover:shadow-[0_0_30px_rgba(0,255,156,0.2)]"
            >
              <Plus className="h-10 w-10 transition-transform duration-500 group-hover:rotate-90" />
              <div className="absolute inset-0 rounded-full bg-accentPrimary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <h3 className="mt-8 text-3xl font-bold text-textHeading tracking-tight">No devices connected</h3>
            <p className="mt-3 max-w-[320px] text-lg text-textSecondary/80">Add your first device to start seeing live dashboard data.</p>
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
