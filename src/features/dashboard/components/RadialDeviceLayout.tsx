import { motion } from "framer-motion";
import { ChevronRight, Droplets, Leaf, MapPin } from "lucide-react";
import { DeviceData, DeviceType } from "@shared/constants/deviceConstants";

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
  // Safety guard — device can be null briefly during offline cache restore.
  if (!device) return null;

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
      label: "Soil Type",
      value:
        typeof deviceView.soilType === "string"
          ? deviceView.soilType
          : deviceView.field?.soil?.type || "Clay",
      icon: <Leaf className="h-3 w-3" />,
      delay: 0.08,
    },
    {
      label: "Area",
      value:
        typeof deviceView.area === "number" || typeof deviceView.area === "string"
          ? deviceView.area
          : deviceView.field?.area || "120",
      icon: (
        <svg
          className="h-3 w-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
      ),
      delay: 0.1,
    },
    {
      label: "Location",
      value:
        typeof deviceView.location === "string"
          ? deviceView.location
          : deviceView.field?.location?.name || "Smart Block A",
      icon: <MapPin className="h-3 w-3" />,
      delay: 0.12,
    },
    {
      label: "Irrigation",
      value:
        typeof deviceView.irrigationType === "string"
          ? deviceView.irrigationType
          : deviceView.field?.irrigation?.type || "Drip",
      icon: <Droplets className="h-3 w-3" />,
      delay: 0.14,
    },
    {
      label: "Boundary",
      value:
        typeof deviceView.boundary === "string"
          ? deviceView.boundary
          : deviceView.field?.boundary?.type || "Polygon",
      icon: (
        <svg
          className="h-3 w-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="12 2 2 19 22 19" />
        </svg>
      ),
      delay: 0.16,
    },
    {
      label: "Crops",
      value:
        (deviceView.crops || [])
          .map((crop: string | { name?: string; scientificName?: string }) =>
            typeof crop === "string" ? crop : crop.name || crop.scientificName || "Crop",
          )
          .join(", ") || "N/A",
      icon: <Leaf className="h-3 w-3" />,
      delay: 0.18,
    },
  ];

  return (
    <div className="w-full">
      {/* Mobile Layout (Visible only on < sm screens) */}
      <div className="flex flex-col w-full sm:hidden">
        {/* Top Header Row: Device Name, Status & Switcher */}
        <div className="flex w-full items-center justify-between">
          <div className="min-w-0">
            <h2 className="text-scale-body font-black tracking-tight text-textHeading truncate">
              {device.name}
            </h2>
            <div className="mt-1 flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full ${deviceView.isOnline ? "animate-pulse bg-emerald-500" : "bg-red-500"}`}
              />
              <span
                className={`whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.16em] ${deviceView.isOnline ? "text-emerald-500/80" : "text-red-500/85"}`}
              >
                {deviceView.isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => cycleDevice(1)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-cardBorder bg-bgInput text-textHeading transition hover:border-accentPrimary/70 hover:text-accentPrimary"
            aria-label="Next device"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Lower Row: Image on the Left, Attribute List on the Right */}
        <div className="mt-4 flex flex-row items-center justify-between gap-4">
          {/* Left Column: Device Image with radial glow */}
          <div className="relative flex-1 max-w-[48%] flex items-center justify-center min-h-[190px]">
            <div
              className="pointer-events-none absolute h-24 w-24 animate-pulse duration-4000"
              style={{
                background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
              }}
            />
            {(() => {
              const type = (deviceView.deviceType || deviceView.type || "nest").toLowerCase();
              const fallbackImage =
                type === "seed" ? "/seed.png" : type === "aero" ? "/kaptor_drone.png" : "/NEST.png";
              const displayImage = device.image || fallbackImage;

              return (
                <motion.img
                  key={`${selectedDeviceType}-${currentDeviceIndex}`}
                  src={displayImage}
                  alt={device.name}
                  initial={{ opacity: 0, y: 12, scale: 0.9 }}
                  animate={{ opacity: 1, y: [0, -4, 0], scale: 1 }}
                  transition={{
                    opacity: { duration: 0.35 },
                    y: { repeat: Infinity, duration: 3.5, ease: "easeInOut" },
                    scale: { duration: 0.35 },
                  }}
                  className="relative z-10 max-h-[170px] w-auto object-contain drop-shadow-[0_22px_56px_var(--accent-glow)]"
                />
              );
            })()}
          </div>

          {/* Right Column: Attribute details stacked vertically */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            {attrs.map((attr) => (
              <div key={attr.label} className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-textSecondary">
                  <span className="text-accentPrimary/80 shrink-0">{attr.icon}</span>
                  <span className="truncate">{attr.label}</span>
                </div>
                <div className="text-[12px] font-bold text-textHeading truncate leading-none">
                  {attr.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Layout (Visible on >= sm screens) */}
      <div className="hidden sm:flex sm:flex-row items-stretch sm:items-center justify-between gap-6 sm:gap-4 md:gap-6 w-full">
        {/* ─── LEFT: Device image + navigation ─── */}
        <div className="flex flex-col items-center w-full sm:w-5/12 md:w-2/5">
          {/* Device name & status container */}
          <div className="flex w-full items-center justify-between sm:flex-col sm:items-start">
            <div className="min-w-0">
              <h2 className="truncate text-scale-body sm:text-scale-section font-bold tracking-tight text-textHeading">
                {device.name}
              </h2>
              <div className="mt-1 flex items-center gap-1.5">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${deviceView.isOnline ? "animate-pulse bg-emerald-500" : "bg-red-500"}`}
                />
                <span
                  className={`whitespace-nowrap text-scale-caption font-bold uppercase tracking-[0.16em] ${deviceView.isOnline ? "text-emerald-500/80 dark:text-emerald-400/80" : "text-red-500/80 dark:text-red-400/80"}`}
                >
                  {deviceView.isOnline ? "Online" : "Offline"}
                </span>
              </div>
            </div>
            {/* Mobile device switcher button */}
            <button
              type="button"
              onClick={() => cycleDevice(1)}
              className="sm:hidden grid h-8 w-8 shrink-0 place-items-center rounded-full border border-cardBorder bg-bgInput text-textHeading transition hover:border-accentPrimary/70 hover:text-accentPrimary"
              aria-label="Next device"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Floating device image with radial glow */}
          <div className="relative mt-4 flex min-h-[180px] sm:min-h-[250px] md:min-h-[390px] items-center justify-center w-full">
            {/* Green radial glow */}
            <div
              className="pointer-events-none absolute h-28 w-28 sm:h-52 sm:w-52 md:h-80 md:w-80 animate-pulse duration-4000"
              style={{
                background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
              }}
            />
            {(() => {
              const type = (deviceView.deviceType || deviceView.type || "nest").toLowerCase();
              const fallbackImage =
                type === "seed" ? "/seed.png" : type === "aero" ? "/kaptor_drone.png" : "/NEST.png";
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
                    y: { repeat: Infinity, duration: 3.5, ease: "easeInOut" },
                    scale: { duration: 0.35 },
                  }}
                  className="relative z-10 max-h-[140px] sm:max-h-[220px] md:max-h-[400px] w-auto object-contain drop-shadow-[0_22px_56px_var(--accent-glow)]"
                />
              );
            })()}
          </div>
        </div>

        {/* ─── RIGHT: Attributes ─── */}
        <div className="relative grid grid-cols-2 gap-x-4 gap-y-3 w-full sm:flex sm:flex-col sm:justify-center sm:gap-3 sm:py-2 sm:pl-4 sm:w-7/12 md:w-3/5 md:pl-10">
          {attrs.map((attr, index) => (
            <motion.div
              key={attr.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: attr.delay }}
              className={`space-y-0.5 w-full sm:max-w-[200px] ${
                index === 0 ? "sm:ml-0" :
                index === 1 ? "sm:ml-[18px]" :
                index === 2 ? "sm:ml-[36px]" :
                index === 3 ? "sm:ml-[36px]" :
                index === 4 ? "sm:ml-[18px]" :
                "sm:ml-0"
              }`}
            >
              {/* Label row: icon + text */}
              <div className="flex items-center gap-1.5 text-[11px] sm:text-scale-caption font-bold uppercase tracking-[0.14em] text-textSecondary">
                <span className="text-accentPrimary/70">{attr.icon}</span>
                <span className="truncate">{attr.label}</span>
              </div>
              {/* Value */}
              <div className="text-scale-caption sm:text-scale-body font-semibold leading-snug text-textHeading truncate">
                {attr.value}
              </div>
            </motion.div>
          ))}

          <button
            type="button"
            onClick={() => cycleDevice(1)}
            className="hidden sm:grid absolute right-0 top-1/2 h-8 w-8 sm:h-10 sm:w-10 -translate-y-1/2 place-items-center rounded-full border border-cardBorder bg-bgInput text-textHeading transition hover:border-accentPrimary/70 hover:text-accentPrimary"
            aria-label="Next device"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
