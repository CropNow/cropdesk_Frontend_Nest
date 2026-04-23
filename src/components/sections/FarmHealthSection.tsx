import React from 'react';
import { motion } from 'framer-motion';
import { CircularGauge } from '../common/CircularGauge';
import { FarmStatusCard } from '../common/FarmStatusCard';
import { FARM_STATUS_METRICS } from '../../constants/deviceConstants';

/**
 * FarmHealthSection - Farm health metrics overview
 */
export function FarmHealthSection({ data }: { data?: any }) {
  const metrics = data?.metrics || FARM_STATUS_METRICS;
  const overallHealth = data?.overallHealth || 85;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="rounded-3xl border border-cardBorder bg-cardBg p-6 backdrop-blur-xl"
    >
      {/* Desktop View */}
      <div className="hidden sm:block">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="mt-1 text-3xl font-bold text-textHeading">Overall Farm Status</h3>
          </div>
          <CircularGauge value={overallHealth} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FARM_STATUS_METRICS.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.04 }}
            >
              <FarmStatusCard metric={metric} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex flex-col sm:hidden">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-2xl font-bold text-textHeading">Overall Farm Status</h3>
          <div className="origin-right flex-shrink-0 scale-75">
            <CircularGauge value={overallHealth} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {FARM_STATUS_METRICS.map((metric) => (
            <FarmStatusCard key={metric.id} metric={metric} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
