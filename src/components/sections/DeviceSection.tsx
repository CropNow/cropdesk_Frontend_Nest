import React from 'react';
import { motion } from 'framer-motion';
import { DeviceData, DeviceType } from '../../constants/deviceConstants';
import { RadialDeviceLayout } from '../devices/RadialDeviceLayout';
import { RadialDeviceLayoutV2 } from '../devices/RadialDeviceLayoutV2';

interface DeviceSectionProps {
  device: DeviceData;
  selectedDeviceType: DeviceType;
  currentDeviceIndex: number;
  cycleDevice: (dir: 1 | -1) => void;
  variant?: 'v1' | 'v2';
}

export function DeviceSection({
  device,
  selectedDeviceType,
  currentDeviceIndex,
  cycleDevice,
  variant = 'v2',
}: DeviceSectionProps) {
  if (variant === 'v2') {
    return (
      <motion.section
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="relative overflow-hidden rounded-3xl border border-[#00FF9C]/20 bg-gradient-to-br from-emerald-500/15 via-white/[0.03] to-cyan-500/10 p-6 backdrop-blur-xl"
      >
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00FF9C]/15 blur-3xl" />
        <div className="relative mb-5 flex items-center justify-start">
          <h2 className="text-3xl font-bold">{device.name}</h2>
        </div>
        <RadialDeviceLayoutV2
          device={device}
          selectedDeviceType={selectedDeviceType}
          currentDeviceIndex={currentDeviceIndex}
          cycleDevice={cycleDevice}
        />
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.05 }}
      className="relative px-4 pb-1 pt-4 sm:px-6 sm:pb-2 sm:pt-6"
    >
      <RadialDeviceLayout
        device={device}
        selectedDeviceType={selectedDeviceType}
        currentDeviceIndex={currentDeviceIndex}
        cycleDevice={cycleDevice}
      />
    </motion.section>
  );
}
