import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Droplets, Leaf, MapPin } from 'lucide-react';
import { DeviceData, DeviceType } from '../../constants/deviceConstants';
import { RadialAttribute } from './RadialAttribute';
import { MobileAttribute } from './MobileAttribute';

/**
 * RadialDeviceLayoutV2 - Alternative radial layout for Dashboard 2
 * Uses explicit positioning instead of circular calculation
 */
interface RadialDeviceLayoutV2Props {
  device: DeviceData;
  selectedDeviceType: DeviceType;
  currentDeviceIndex: number;
  cycleDevice: (dir: 1 | -1) => void;
}

export function RadialDeviceLayoutV2({
  device,
  selectedDeviceType,
  currentDeviceIndex,
  cycleDevice,
}: RadialDeviceLayoutV2Props) {
  return (
    <>
      {/* ── Desktop layout ── */}
      <div className="hidden sm:block">
        <div className="relative mx-auto w-full max-w-[560px]" style={{ height: 340 }}>
          {/* ── Left attributes ── */}
          <RadialAttribute
            label="Area"
            value={device.area}
            icon={<svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>}
            posClass="left-16 top-[60px] -translate-y-0"
            align="left"
            delay={0.08}
          />
          <RadialAttribute
            label="Location"
            value={device.location}
            icon={<MapPin className="h-3 w-3" />}
            posClass="left-6 top-1/2 -translate-y-1/2"
            align="left"
            delay={0.12}
          />
          <RadialAttribute
            label="Boundary"
            value={device.boundary}
            icon={<svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 19 22 19" /></svg>}
            posClass="left-16 bottom-[60px] translate-y-0"
            align="left"
            delay={0.16}
          />

          {/* ── Right attributes ── */}
          <RadialAttribute
            label="Soil Type"
            value={device.soilType}
            icon={<Leaf className="h-3 w-3" />}
            posClass="right-16 top-[60px] -translate-y-0"
            align="right"
            delay={0.1}
          />
          <RadialAttribute
            label="Irrigation"
            value={device.irrigationType}
            icon={<Droplets className="h-3 w-3" />}
            posClass="right-6 top-1/2 -translate-y-1/2"
            align="right"
            delay={0.14}
          />
          <RadialAttribute
            label="Crops"
            value={
              <span className="flex flex-wrap gap-1">
                {device.crops.map((c) => (
                  <span key={c} className="rounded-md bg-accentPrimary/15 px-1.5 py-0.5 text-[10px] font-semibold text-accentPrimary">
                    {c}
                  </span>
                ))}
              </span>
            }
            icon={<Leaf className="h-3 w-3" />}
            posClass="right-16 bottom-[60px] translate-y-0"
            align="right"
            delay={0.18}
          />

          {/* ── Device image centrepiece ── */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.img
              key={`${selectedDeviceType}-${currentDeviceIndex}`}
              src={device.image}
              alt={device.name}
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: [0, -6, 0], scale: 1 }}
              transition={{
                opacity: { duration: 0.35 },
                y: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' },
                scale: { duration: 0.35 },
              }}
              className="relative z-10 mb-4 max-h-[240px] w-auto object-contain"
            />

            {/* ── Arrows at bottom ── */}
            <div className="relative z-20 flex items-center justify-center">
              <button
                type="button"
                onClick={() => cycleDevice(1)}
                className="grid h-10 w-10 place-items-center rounded-full border border-cardBorder bg-black/20 dark:bg-black/40 text-textHeading transition hover:border-accentPrimary/70 hover:text-accentPrimary"
                aria-label="Next device"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile layout ── */}
      <div className="sm:hidden flex flex-row gap-8 mt-2 w-full px-1 items-start">
        {/* Left column: Image and arrows */}
        <div className="flex flex-col items-center gap-4 w-[35%] shrink-0">
          <div className="relative w-full aspect-[3/4] flex items-center justify-center pt-8">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full mt-4"
              style={{ background: 'radial-gradient(circle, rgba(0,255,156,0.15) 0%, transparent 70%)' }}
            />
            <motion.img
              key={`mobile-${selectedDeviceType}-${currentDeviceIndex}`}
              src={device.image}
              alt={device.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, y: [0, -4, 0], scale: 1 }}
              transition={{
                opacity: { duration: 0.35 },
                y: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' },
                scale: { duration: 0.35 },
              }}
              className="relative z-10 max-h-[180px] w-auto object-contain drop-shadow-[0_12px_30px_rgba(0,255,156,0.2)]"
            />
          </div>
        </div>

        {/* Right column: Attributes list */}
        <div className="flex-grow flex flex-col gap-4 pt-1">
          <div className="translate-x-0">
            <MobileAttribute label="Soil Type" value={device.soilType} icon={<Leaf className="h-3 w-3" />} />
          </div>
          <div className="translate-x-2">
            <MobileAttribute label="Area" value={device.area} icon={<svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>} />
          </div>
          <div className="translate-x-4 flex items-center justify-between gap-6 pr-1">
            <MobileAttribute 
              label="Location" 
              value={<span className="whitespace-nowrap">{device.location}</span>} 
              icon={<MapPin className="h-3 w-3" />} 
            />
            <div className="flex items-center gap-2 pt-2 ml-4">
              <button
                type="button"
                onClick={() => cycleDevice(-1)}
                className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-black/40 text-textHeading transition hover:border-[#00FF9C]/70"
                aria-label="Previous device"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => cycleDevice(1)}
                className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-black/40 text-textHeading transition hover:border-[#00FF9C]/70"
                aria-label="Next device"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="translate-x-4">
            <MobileAttribute label="Irrigation" value={device.irrigationType} icon={<Droplets className="h-3 w-3" />} />
          </div>
          <div className="translate-x-2">
            <MobileAttribute label="Boundary" value={device.boundary} icon={<svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 19 22 19" /></svg>} />
          </div>
          <div className="translate-x-0">
             <MobileAttribute label="Crops" value={<span className="flex flex-wrap gap-1">{device.crops.map((c) => (<span key={c} className="rounded-md bg-[#00FF9C]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[#00FF9C]">{c}</span>))}</span>} icon={<Leaf className="h-3 w-3" />} />
          </div>
        </div>
      </div>
    </>
  );
}
