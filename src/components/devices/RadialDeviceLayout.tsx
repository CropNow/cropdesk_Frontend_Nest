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

type DeviceFieldInfo = {
  soil?: { type?: string };
  area?: string | number;
  location?: { name?: string };
  irrigation?: { type?: string };
  boundary?: { type?: string };
};

type DeviceView = DeviceData & {
  isOnline?: boolean;
  type?: string;
  field?: DeviceFieldInfo;
  crops?: Array<string | { name?: string; scientificName?: string }>;
};

export function RadialDeviceLayout({
  device,
  selectedDeviceType,
  currentDeviceIndex,
  cycleDevice,
}: RadialDeviceLayoutProps) {
  const deviceView = device as DeviceView;

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
      value: typeof deviceView.soilType === 'string' ? deviceView.soilType : deviceView.field?.soil?.type || 'Clay',
      icon: <Leaf className="h-3 w-3" />,
      delay: 0.08,
    },
    {
      label: 'Area',
      value: typeof deviceView.area === 'number' || typeof deviceView.area === 'string' ? deviceView.area : deviceView.field?.area || '120',
      icon: (
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
      ),
      delay: 0.1,
    },
    {
      label: 'Location',
      value: typeof deviceView.location === 'string' ? deviceView.location : deviceView.field?.location?.name || 'Smart Block A',
      icon: <MapPin className="h-3 w-3" />,
      delay: 0.12,
    },
    {
      label: 'Irrigation',
      value: typeof deviceView.irrigationType === 'string' ? deviceView.irrigationType : deviceView.field?.irrigation?.type || 'Drip',
      icon: <Droplets className="h-3 w-3" />,
      delay: 0.14,
    },
    {
      label: 'Boundary',
      value: typeof deviceView.boundary === 'string' ? deviceView.boundary : deviceView.field?.boundary?.type || 'Polygon',
      icon: (
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 2 19 22 19" />
        </svg>
      ),
      delay: 0.16,
    },
    {
      label: 'Crops',
      value: (deviceView.crops || [])
        .map((crop: string | { name?: string; scientificName?: string }) => (typeof crop === 'string' ? crop : (crop.name || crop.scientificName || 'Crop')))
        .join(', ') || 'N/A',
      icon: <Leaf className="h-3 w-3" />,
      delay: 0.18,
    },
  ];

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center">
      {/* ─── LEFT: Device image + navigation ─── */}
      <div className="flex flex-col items-center md:w-2/5">
        {/* Device name */}
        <h2 className="self-start truncate whitespace-nowrap text-[clamp(1.05rem,1.8vw,1.875rem)] font-semibold tracking-tight text-textHeading sm:text-3xl">
          {device.name}
        </h2>

        <div className="mt-1 flex w-full items-center justify-start gap-1.5 self-start">
          <span className={`h-2.5 w-2.5 rounded-full ${deviceView.isOnline ? 'animate-pulse bg-emerald-500' : 'bg-red-500'}`} />
          <span className={`whitespace-nowrap text-[0.75rem] font-bold uppercase tracking-[0.16em] sm:text-sm ${deviceView.isOnline ? 'text-emerald-400/80' : 'text-red-400/80'}`}>
            {deviceView.isOnline ? 'System Online' : 'System Offline'}
          </span>
        </div>

        {/* Floating device image with radial glow */}
        <div className="relative mt-4 flex min-h-[350px] items-center justify-center sm:min-h-[370px] md:min-h-[390px]">
          {/* Green radial glow */}
          <div
            className="pointer-events-none absolute h-52 w-52 rounded-full sm:h-72 sm:w-72 md:h-80 md:w-80"
            style={{
              background: 'radial-gradient(circle, rgba(0,255,156,0.15), transparent 70%)',
            }}
          />
          {(() => {
            const type = (deviceView.deviceType || deviceView.type || 'nest').toLowerCase();
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
                className="relative z-10 max-h-[300px] w-auto object-contain drop-shadow-[0_22px_56px_rgba(0,255,156,0.32)] sm:max-h-[360px] md:max-h-[400px]"
              />
            );
          })()}
        </div>

      </div>

      {/* ─── RIGHT: Attributes in vertical arc ─── */}
      <div className="relative flex flex-col justify-end gap-5 py-2 pr-14 md:w-3/5 md:pl-10">
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
