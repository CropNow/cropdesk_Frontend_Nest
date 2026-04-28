import { motion } from 'framer-motion';

/**
 * WaterSavingsSection - Displays water savings metrics
 */
export function WaterSavingsSection({ data }: { data?: any }) {
  const savings = data || {
    percent: '15.0%',
    total: '0 L',
    daily: '0 L',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22 }}
      className="rounded-xl border border-cardBorder bg-cardBg/50 p-5 backdrop-blur-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold tracking-tight text-textHeading md:text-2xl">Water Savings</h3>
        <span className="rounded-full border border-accentPrimary/30 bg-accentPrimary/10 px-3 py-1 text-sm font-semibold text-accentPrimary">
          {savings.percent}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div className="rounded-xl border border-cardBorder bg-cardBg/30 p-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-accentCyan">Total Saved</p>
          <p className="mt-2 text-3xl font-bold text-accentCyan">{savings.total}</p>
          <p className="text-sm text-textLabel">This Month</p>
        </div>

        <div className="rounded-xl border border-cardBorder bg-cardBg/30 p-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-accentPrimary">Daily Average</p>
          <p className="mt-2 text-3xl font-bold text-accentPrimary">{savings.daily}</p>
          <p className="text-sm text-textLabel">Per Day</p>
        </div>
      </div>
    </motion.div>
  );
}
