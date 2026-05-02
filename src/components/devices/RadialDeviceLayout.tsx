import { useEffect, useState } from 'react';
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
  showTitle?: boolean;
}

export function RadialDeviceLayout({
  device,
  selectedDeviceType,
  currentDeviceIndex,
  cycleDevice,
  showTitle = true,
}: RadialDeviceLayoutProps) {
  const [isMdUp, setIsMdUp] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');
    const sync = () => setIsMdUp(mql.matches);
    sync();

    mql.addEventListener('change', sync);
    return () => mql.removeEventListener('change', sync);
  }, []);

  const isMobile = !isMdUp;

  /**
   * Compute a normalized horizontal offset (0..1) that forms a gentle vertical arc on the right side.
   * Items at the edges get 0; the middle item gets 1.
   */
  const getArcFactor = (index: number, total: number) => {
    const midpoint = (total - 1) / 2;
    const distance = Math.abs(index - midpoint);
    const maxDistance = midpoint;
    // Centre items get the largest indent (toward the device image); edges stay flush
    if (maxDistance <= 0) return 0;
    return (maxDistance - distance) / maxDistance;
  };

  const attrs = [
    {
      label: 'Soil Type',
      value: typeof device.soilType === 'string' ? device.soilType : (device as any).field?.soil?.type || 'Clay',
      icon: <Leaf className="h-3 w-3" />,
      delay: 0.01,
    },
    {
      label: 'Area',
      value: typeof device.area === 'number' || typeof device.area === 'string' ? device.area : (device as any).field?.area || '120',
      icon: (
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
      ),
      delay: 0.02,
    },
    {
      label: 'Location',
      value: typeof device.location === 'string' ? device.location : (device as any).field?.location?.name || 'Smart Block A',
      icon: <MapPin className="h-3 w-3" />,
      delay: 0.03,
    },
    {
      label: 'Irrigation',
      value: typeof device.irrigationType === 'string' ? device.irrigationType : (device as any).field?.irrigation?.type || 'Drip',
      icon: <Droplets className="h-3 w-3" />,
      delay: 0.04,
    },
    {
      label: 'Boundary',
      value: typeof device.boundary === 'string' ? device.boundary : (device as any).field?.boundary?.type || 'Polygon',
      icon: (
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 2 19 22 19" />
        </svg>
      ),
      delay: 0.05,
    },
    {
      label: 'Crops',
      value: (() => {
        const first: any = (device.crops || [])[0];
        if (!first) return '—';
        return typeof first === 'string' ? first : (first.name || first.scientificName || 'Crop');
      })(),
      icon: <Leaf className="h-3 w-3" />,
      delay: 0.06,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {showTitle && (
        <h2 className="max-w-[180px] text-xl font-semibold tracking-tight text-textHeading md:hidden">
          {device.name}
        </h2>
      )}

      <div className="flex flex-row gap-2 md:items-center md:gap-4">
      <div className="flex w-[35%] shrink-0 flex-col items-center md:w-2/5">
        {/* Device name */}
        {showTitle && (
          <h2 className="hidden self-start text-xl font-semibold tracking-tight text-textHeading md:block md:text-2xl">
            {device.name}
          </h2>
        )}

        {/* Floating device image with radial glow */}
        <div className="relative mt-8 flex min-h-[240px] w-full items-center justify-center pt-6 sm:min-h-[370px] md:mt-4 md:min-h-[390px]">
          {/* Green radial glow */}
          <div
            className="pointer-events-none absolute h-40 w-40 rounded-full sm:h-72 sm:w-72 md:h-80 md:w-80"
            style={{
              background: 'radial-gradient(circle, rgba(0,255,156,0.15), transparent 70%)',
            }}
          />
          {(() => {
            const type = (device.deviceType || (device as any).type || 'nest').toLowerCase();
            const fallbackImage = type === '/seed.png' ? '/seed.png' : type === '/kaptor_drone.png' ? '/kaptor_drone.png' : '/NEST.png';
            const displayImage = device.image || fallbackImage;

            return (
              <motion.img
                key={`${selectedDeviceType}-${currentDeviceIndex}`}
                src={displayImage}
                alt={device.name}
                loading="eager"
                decoding="async"
                {...({ fetchpriority: 'high' } as any)}
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: [0, -6, 0], scale: 1 }}
                transition={{
                  opacity: { duration: 0.2 },
                  y: { repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.4 },
                  scale: { duration: 0.2 },
                }}
                className="relative z-10 max-h-[220px] w-auto object-contain drop-shadow-[0_18px_44px_rgba(0,255,156,0.28)] sm:max-h-[360px] md:max-h-[400px]"
              />
            );
          })()}
        </div>
      </div>

      {/* ─── RIGHT: Attributes in vertical arc ─── */}
      <div className="relative z-20 flex-1 py-1 pl-4 pr-8 md:ml-0 md:w-3/5 md:py-2 md:pl-10 md:pr-14">
        {isMobile ? (
          <div className="flex flex-col justify-center gap-4 pb-2 pt-1">
            {attrs.map((attr, index) => {
              const arcFactor = getArcFactor(index, attrs.length); // 0 edges, 1 middle
              // Semi-circular wrap: middle sits furthest right (around the image).
              const indentPx = Math.round(14 + arcFactor * 30);

              return (
                <motion.div
                  key={attr.label}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: attr.delay }}
                  className="max-w-[220px]"
                  style={{ marginLeft: indentPx }}
                >
                  <div className="flex items-center justify-between gap-6 pr-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-textSecondary">
                        <span className="text-accentPrimary/70">{attr.icon}</span>
                        <span>{attr.label}</span>
                      </div>
                      <div className="text-[15px] font-normal leading-snug text-textHeading max-w-[120px]">{attr.value}</div>
                    </div>
                    {attr.label === 'Location' && (
                      <button
                        type="button"
                        onClick={() => cycleDevice(1)}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-black/40 text-textHeading transition hover:border-accentPrimary/70 hover:text-accentPrimary mt-2"
                        aria-label="Next device"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="relative flex flex-col justify-center gap-5">
            {attrs.map((attr, index) => (
              <motion.div
                key={attr.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: attr.delay }}
                className="max-w-[200px] space-y-0.5"
                style={{ marginLeft: Math.round(getArcFactor(index, attrs.length) * 42) }}
              >
                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-textSecondary">
                  <span className="text-accentPrimary/70">{attr.icon}</span>
                  <span>{attr.label}</span>
                </div>
                <div className="text-[17px] font-semibold leading-snug text-textHeading">{attr.value}</div>
              </motion.div>
            ))}

            <button
              type="button"
              onClick={() => cycleDevice(1)}
              className="absolute -right-8 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-cardBorder bg-black/20 text-textHeading transition hover:border-accentPrimary/70 hover:text-accentPrimary dark:bg-black/45 md:grid"
              aria-label="Next device"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
