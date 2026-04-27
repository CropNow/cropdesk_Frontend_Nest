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
        className="relative overflow-hidden rounded-xl border border-cardBorder bg-cardBg/50 p-6 backdrop-blur-sm"
      >
        <div className="relative mb-5 flex items-center justify-start">
          <h2 className="text-lg font-bold sm:text-3xl max-w-[180px] sm:max-w-none">{device.name}</h2>
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
