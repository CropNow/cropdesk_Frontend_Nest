import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Eye, Leaf, Thermometer, Waves, Wind } from 'lucide-react';
import { CircularGauge } from '../common/CircularGauge';
import { FarmStatusCard } from '../common/FarmStatusCard';
import { FarmStatusMetric } from '../../constants/deviceConstants';

const DASHBOARD2_FARM_STATUS_METRICS: FarmStatusMetric[] = [
  {
    id: 'soil-moisture',
    label: 'Soil moisture',
    value: 54.3,
    unit: 'v/v',
    icon: <Waves className="h-5 w-5" />,
    color: 'cyan',
    min: 0,
    max: 100,
    status: 'optimal',
  },
  {
    id: 'temperature',
    label: 'Temperature',
    value: 27.5,
    unit: '°C',
    icon: <Thermometer className="h-5 w-5" />,
    color: 'orange',
    min: 0,
    max: 50,
    status: 'optimal',
  },
  {
    id: 'wind-speed',
    label: 'Wind speed',
    value: 0,
    unit: 'm/s',
    icon: <Wind className="h-5 w-5" />,
    color: 'blue',
    min: 0,
    max: 30,
    status: 'optimal',
  },
  {
    id: 'humidity',
    label: 'Humidity',
    value: 53,
    unit: '%',
    icon: <Droplets className="h-5 w-5" />,
    color: 'violet',
    min: 0,
    max: 100,
    status: 'optimal',
  },
  {
    id: 'visibility',
    label: 'Visibility',
    value: 24.1,
    unit: 'km',
    icon: <Eye className="h-5 w-5" />,
    color: 'emerald',
    min: 0,
    max: 50,
    status: 'optimal',
  },
  {
    id: 'leaf-wetness',
    label: 'Leaf Wetness',
    value: 30,
    unit: '%',
    icon: <Leaf className="h-5 w-5" />,
    color: 'emerald',
    min: 0,
    max: 100,
    status: 'optimal',
  },
];

/**
 * FarmHealthSection - Farm health metrics overview
 */
export function FarmHealthSection() {
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
          <CircularGauge value={85} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DASHBOARD2_FARM_STATUS_METRICS.map((metric, index) => (
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
            <CircularGauge value={85} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {DASHBOARD2_FARM_STATUS_METRICS.map((metric) => (
            <FarmStatusCard key={metric.id} metric={metric} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
