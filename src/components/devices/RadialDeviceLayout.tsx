import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Droplets, Leaf, MapPin } from 'lucide-react';
import { DeviceData, DeviceType } from '../../constants/deviceConstants';

/**
 * RadialDeviceLayout - Right-aligned vertical arc layout matching the reference design.
 *
 * Left 40 %: device image (vertically centred, green radial glow).
 * Right 60 %: attributes stacked vertically with a subtle arc indent; no cards/containers.
 */
interface RadialDeviceLayoutProps {
  device: DeviceData;
  selectedDeviceType: DeviceType;
  currentDeviceIndex: number;
  cycleDevice: (dir: 1 | -1) => void;
}

export function RadialDeviceLayout({
  device,
  selectedDeviceType,
  currentDeviceIndex,
  cycleDevice,
}: RadialDeviceLayoutProps) {
  /**
   * Compute a horizontal offset that forms a gentle vertical arc on the right side.
   * Items at the edges get larger indent; the middle item sits closest to the left.
   */
  const getArcOffset = (index: number, total: number) => {
    const midpoint = (total - 1) / 2;
    const distance = Math.abs(index - midpoint);
    const maxDistance = midpoint;
    // Centre items get the largest indent (toward the device image); edges stay flush
    return Math.round((maxDistance - distance) * 18);
  };

  const attrs = [
    {
      label: 'Soil Type',
      value: typeof device.soilType === 'string' ? device.soilType : (device as any).field?.soil?.type || 'Clay',
      icon: <Leaf className="h-3 w-3" />,
      delay: 0.08,
    },
    {
      label: 'Area',
      value: typeof device.area === 'number' || typeof device.area === 'string' ? device.area : (device as any).field?.area || '120',
      icon: (
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
      ),
      delay: 0.1,
    },
    {
      label: 'Location',
      value: typeof device.location === 'string' ? device.location : (device as any).field?.location?.name || 'Smart Block A',
      icon: <MapPin className="h-3 w-3" />,
      delay: 0.12,
    },
    {
      label: 'Irrigation',
      value: typeof device.irrigationType === 'string' ? device.irrigationType : (device as any).field?.irrigation?.type || 'Drip',
      icon: <Droplets className="h-3 w-3" />,
      delay: 0.14,
    },
    {
      label: 'Boundary',
      value: typeof device.boundary === 'string' ? device.boundary : (device as any).field?.boundary?.type || 'Polygon',
      icon: (
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 2 19 22 19" />
        </svg>
      ),
      delay: 0.16,
    },
    {
      label: 'Crops',
      value: (
        <div className="mt-1 flex max-w-[200px] flex-wrap gap-1.5">
          {(device.crops || []).map((crop: any, idx: number) => {
            const cropName = typeof crop === 'string' ? crop : (crop.name || crop.scientificName || 'Crop');
            return (
              <span
                key={`${cropName}-${idx}`}
                className="rounded-full border border-accentPrimary/40 bg-accentPrimary/12 px-2.5 py-0.5 text-[10px] font-medium leading-relaxed text-[#9BFFD7]"
              >
                {cropName}
              </span>
            );
          })}
        </div>
      ),
      icon: <Leaf className="h-3 w-3" />,
      delay: 0.18,
    },
  ];

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center">
      {/* ─── LEFT: Device image + navigation ─── */}
      <div className="flex flex-col items-center md:w-2/5">
        {/* Device name */}
        <h2 className="self-start text-3xl font-semibold tracking-tight text-textHeading sm:text-4xl">
          {device.name}
        </h2>

        {/* Floating device image */}
        <div className="relative mt-4 flex min-h-[350px] items-center justify-center sm:min-h-[370px] md:min-h-[390px]">
          {(() => {
            const type = (device.deviceType || (device as any).type || 'nest').toLowerCase();
            const fallbackImage = type === 'seed' ? '/seed.png' : type === 'aero' ? '/kaptor_drone.png' : '/NEST.png';
            const displayImage = device.image || fallbackImage;

            return (
              <motion.img
                key={`${selectedDeviceType}-${currentDeviceIndex}`}
                src={displayImage}
                alt={device.name}
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                animate={{ opacity: 1, y: [0, -6, 0], scale: 1 }}
                transition={{
                  opacity: { duration: 0.35 },
                  y: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' },
                  scale: { duration: 0.35 },
                }}
                className="relative z-10 max-h-[300px] w-auto object-contain sm:max-h-[360px] md:max-h-[400px]"
              />
            );
          })()}
        </div>

      </div>

      {/* ─── RIGHT: Attributes in vertical arc ─── */}
      <div className="relative flex flex-col justify-center gap-5 py-2 pr-14 md:w-3/5 md:pl-10">
        {attrs.map((attr, index) => (
          <motion.div
            key={attr.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: attr.delay }}
            className="max-w-[200px] space-y-0.5"
            style={{ marginLeft: getArcOffset(index, attrs.length) }}
          >
            {/* Label row: icon + text */}
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-textSecondary">
              <span className="text-accentPrimary/70">{attr.icon}</span>
              <span>{attr.label}</span>
            </div>
            {/* Value */}
            <div className="text-[17px] font-semibold leading-snug text-textHeading">
              {attr.value}
            </div>
          </motion.div>
        ))}

        <button
          type="button"
          onClick={() => cycleDevice(1)}
          className="absolute right-0 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-cardBorder bg-black/20 dark:bg-black/45 text-textHeading transition hover:border-accentPrimary/70 hover:text-accentPrimary"
          aria-label="Next device"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
