import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NoDeviceStateCardProps {
  title: string;
  className?: string;
  showAddButton?: boolean;
}

export function NoDeviceStateCard({
  title,
  className = '',
  showAddButton = false,
}: NoDeviceStateCardProps) {
  const navigate = useNavigate();

  const handleAddDevice = () => {
    navigate('/settings?tab=devices');
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl border border-cardBorder bg-cardBg/90 p-6 backdrop-blur-xl ${className}`}
    >
      <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
        {showAddButton ? (
          <>
            <button
              type="button"
              onClick={handleAddDevice}
              className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full border border-accentPrimary/35 bg-accentPrimary/10 text-accentPrimary transition hover:bg-accentPrimary/20"
              aria-label="Add device"
            >
              <Plus className="h-8 w-8" />
            </button>
            <h3 className="text-2xl font-bold text-textHeading">No devices connected</h3>
            <p className="mt-2 max-w-md text-sm text-textSecondary sm:text-base">
              Add your first device to start seeing live dashboard data.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold text-textHeading sm:text-2xl">{title}</h3>
            <p className="mt-3 max-w-md text-sm text-textSecondary sm:text-base">
              Add device to see {title}
            </p>
          </>
        )}
      </div>
    </motion.section>
  );
}
