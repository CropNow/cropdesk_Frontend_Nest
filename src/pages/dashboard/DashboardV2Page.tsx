import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  Bug,
  ChevronLeft,
  ChevronRight,
  Cloud,
  CloudSun,
  Droplets,
  Eye,
  Leaf,
  MapPin,
  ShieldCheck,
  SunMedium,
  Thermometer,
  Waves,
  Wind,
  X,
  CloudRain,
  ChevronDown,
  Activity,
  Radio,
} from 'lucide-react';

type DeviceType = 'nest' | 'seed' | 'aero';

type DeviceData = {
  id: number;
  deviceType: DeviceType;
  name: string;
  subtitle: string;
  image: string;
  area: string;
  location: string;
  boundary: string;
  soilType: string;
  irrigationType: string;
  crops: string[];
};

type FisStatus = 'Optimal' | 'Warning' | 'Critical';

const DEVICE_LABELS: Record<DeviceType, string> = {
  nest: 'NEST',
  seed: 'Seed',
  aero: 'Aero Drone',
};

const DEVICE_LIBRARY: Record<DeviceType, DeviceData[]> = {
  nest: [
    {
      id: 1,
      deviceType: 'nest',
      name: 'NEST Tower A1',
      subtitle: 'IoT Field Intelligence Tower',
      image: '/NEST.png',
      area: '5.2 acres',
      location: 'Green Valley Farm',
      boundary: 'Polygon',
      soilType: 'Loamy',
      irrigationType: 'Drip',
      crops: ['Tomato', 'Onion', 'Chili'],
    },
    {
      id: 2,
      deviceType: 'nest',
      name: 'NEST Tower B2',
      subtitle: 'IoT Field Intelligence Tower',
      image: '/NEST.png',
      area: '4.6 acres',
      location: 'Valley Farm',
      boundary: 'Polygon',
      soilType: 'Sandy Loam',
      irrigationType: 'Sprinkler',
      crops: ['Corn', 'Cabbage'],
    },
  ],
  seed: [
    {
      id: 1,
      deviceType: 'seed',
      name: 'Seed Rover S1',
      subtitle: 'Autonomous Ground Scout',
      image: '/seed.png',
      area: '6.3 acres',
      location: 'Green Valley Farm - Sector 1',
      boundary: 'Linear Path',
      soilType: 'Loamy',
      irrigationType: 'Drip',
      crops: ['Tomato', 'Okra', 'Bean'],
    },
    {
      id: 2,
      deviceType: 'seed',
      name: 'Seed Rover S2',
      subtitle: 'Autonomous Ground Scout',
      image: '/seed.png',
      area: '7.0 acres',
      location: 'Green Valley Farm - Sector 2',
      boundary: 'Grid Path',
      soilType: 'Clay Loam',
      irrigationType: 'Furrow',
      crops: ['Potato', 'Pea'],
    },
  ],
  aero: [
    {
      id: 1,
      deviceType: 'aero',
      name: 'Aero Drone X1',
      subtitle: 'Aerial Monitoring System',
      image: '/kaptor_drone.png',
      area: '9.0 acres',
      location: 'South Block',
      boundary: 'Aerial Grid',
      soilType: 'Mixed',
      irrigationType: 'Mixed',
      crops: ['All Crops'],
    },
    {
      id: 2,
      deviceType: 'aero',
      name: 'Aero Drone X2',
      subtitle: 'Aerial Monitoring System',
      image: '/kaptor_drone.png',
      area: '11.4 acres',
      location: 'North Block',
      boundary: 'Aerial Grid',
      soilType: 'Silt Loam',
      irrigationType: 'Pivot',
      crops: ['Wheat', 'Millet'],
    },
  ],
};

const SENSOR_CARDS = [
  { title: 'Weather Sensors', icon: CloudSun, accent: 'from-cyan-500/20 to-sky-500/10' },
  { title: 'Soil Sensors', icon: Leaf, accent: 'from-lime-500/20 to-emerald-500/10' },
  { title: 'Air Sensors', icon: Wind, accent: 'from-indigo-500/20 to-blue-500/10' },
];

const FIS_CARDS: Array<{ title: string; value: number; status: FisStatus; body: string; icon: React.ElementType }> = [
  {
    title: 'Pest Analysis',
    value: 85,
    status: 'Warning',
    body: 'Minor aphid clustering in Sector G-14. Migration projected in 48h.',
    icon: Bug,
  },
  {
    title: 'Fungal Activity',
    value: 12,
    status: 'Optimal',
    body: 'Spore counts low and environment currently limits propagation.',
    icon: ShieldCheck,
  },
  {
    title: 'Air Quality',
    value: 93,
    status: 'Optimal',
    body: 'CO2 at 415 ppm, humidity stable for healthy crop respiration.',
    icon: Wind,
  },
];

const AI_INSIGHTS: Array<{ title: string; description: string; level: 'good' | 'warn' }> = [
  { title: 'Irrigation', description: 'Moisture trend stable in the last 6h.', level: 'good' },
  { title: 'Fungal', description: 'Low risk under current temperature profile.', level: 'good' },
  { title: 'Pest', description: 'Localized hotspots detected in southern rows.', level: 'warn' },
  { title: 'AQI', description: 'Air quality within expected farm threshold.', level: 'good' },
];

type FarmStatusMetric = {
  id: string;
  label: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  color: 'emerald' | 'cyan' | 'amber' | 'orange' | 'violet' | 'blue';
  min: number;
  max: number;
  status: 'optimal' | 'warning' | 'critical';
};

const FARM_STATUS_METRICS: FarmStatusMetric[] = [
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

const isDeviceType = (value: string | null): value is DeviceType => {
  return value === 'nest' || value === 'seed' || value === 'aero';
};

function CircularGauge({ value }: { value: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative h-16 w-16">
      <svg className="h-16 w-16 -rotate-90" viewBox="0 0 72 72" fill="none">
        <circle cx="36" cy="36" r={radius} stroke="rgba(255,255,255,0.12)" strokeWidth="6" />
        <circle
          cx="36"
          cy="36"
          r={radius}
          stroke="#00FF9C"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-sm font-bold text-[#00FF9C]">{value}%</span>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-bgMain px-4 pb-10 pt-8 text-textHeading sm:px-6 lg:pl-28 lg:pr-10">
      <div className="mx-auto max-w-[1500px] animate-pulse space-y-6">
        <div className="h-24 rounded-3xl bg-cardBg" />
        <div className="h-[360px] rounded-3xl bg-cardBg" />
        <div className="grid gap-6 xl:grid-cols-5">
          <div className="h-[350px] rounded-3xl bg-cardBg xl:col-span-2" />
          <div className="h-[350px] rounded-3xl bg-cardBg xl:col-span-3" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-[320px] rounded-3xl bg-cardBg lg:col-span-2" />
          <div className="h-[320px] rounded-3xl bg-cardBg" />
        </div>
      </div>
    </main>
  );
}

export function DashboardV2Page() {
  const [searchParams, setSearchParams] = useSearchParams();
  const deviceFromQuery = searchParams.get('device');
  const initialType: DeviceType = isDeviceType(deviceFromQuery) ? deviceFromQuery : 'nest';

  const [selectedDeviceType, setSelectedDeviceType] = useState<DeviceType>(initialType);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showWeatherDetails, setShowWeatherDetails] = useState(false);
  const [showSoilDetails, setShowSoilDetails] = useState(false);
  const [showAirDetails, setShowAirDetails] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const value = searchParams.get('device');
    if (isDeviceType(value) && value !== selectedDeviceType) {
      setSelectedDeviceType(value);
      setCurrentDeviceIndex(0);
    }
  }, [searchParams, selectedDeviceType]);

  const deviceList = DEVICE_LIBRARY[selectedDeviceType];
  const currentDevice = deviceList[currentDeviceIndex % deviceList.length];

  const cycleDevice = (direction: 1 | -1) => {
    setCurrentDeviceIndex((prev) => {
      const next = prev + direction;
      if (next < 0) return deviceList.length - 1;
      if (next >= deviceList.length) return 0;
      return next;
    });
  };

  const onTypeChange = (type: DeviceType) => {
    setSelectedDeviceType(type);
    setCurrentDeviceIndex(0);
    setSearchParams({ device: type });
  };

  const weatherSummary = useMemo(() => {
    return {
      city: 'Kallakurichi, IN',
      temp: '30 C',
      condition: 'Partly cloudy',
    };
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-bgMain px-4 pb-10 pt-8 text-textHeading sm:px-6 lg:pl-28 lg:pr-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-20 top-24 h-64 w-64 rounded-full bg-[#00FF9C]/10 blur-3xl" />
        <div className="absolute right-10 top-56 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-[1500px] space-y-6">
        <motion.section
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="rounded-3xl border border-white/10 bg-cardBg p-5 backdrop-blur-xl"
        >
          <>
            {/* Mobile View (< 640px) */}
            <div className="sm:hidden flex flex-wrap items-center justify-start gap-5 md:gap-5">
              <div className="flex flex-col justify-center">
                <p className="text-base font-medium text-textBody mb-1">Welcome back,</p>
                <h1 className="text-xl font-bold tracking-tight text-textHeading mb-2">CropNow</h1>

                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#00FF9C]/80">
                  <Cloud className="h-4 w-4" />
                  {weatherSummary.city}
                </div>
              </div>

              <div className="flex flex-col items-end justify-center text-right">
                <p className="text-3xl font-extrabold tracking-tighter text-textHeading">
                  {weatherSummary.temp.split(' ')[0]}<span className="text-xl text-textMuted">°C</span>
                </p>
                <p className="mt-1 text-sm font-medium text-textSecondary">{weatherSummary.condition}</p>
              </div>
            </div>

            {/* Tablet/Desktop View (>= 640px) */}
            <div className="hidden sm:flex sm:flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-textHeading sm:text-4xl">Welcome back, CropNow</h1>
                <p className="mt-2 text-sm font-medium text-textLabel">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  <span className="mx-2 text-textHint">•</span>
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  <span className="mx-2 flex-col hidden sm:inline text-textHint">•</span>
                  <span className="block sm:inline mt-1 sm:mt-0">Green Valley Farm, Kallakurichi - Smart Block A</span>
                </p>
              </div>

              <div className="flex flex-col items-start lg:items-end">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#00FF9C]/80">
                  <Cloud className="h-4 w-4" />
                  {weatherSummary.city}
                </div>
                <div className="mt-4 flex items-baseline gap-5">
                  <p className="text-4xl font-extrabold tracking-tighter text-textHeading lg:text-4xl">
                    {weatherSummary.temp.split(' ')[0]}<span className="text-2xl text-textMuted lg:text-3xl">°C</span>
                  </p>
                  <p className="text-lg font-medium text-textSecondary">{weatherSummary.condition}</p>
                </div>
              </div>
            </div>
          </>
        </motion.section>

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.05 }}
            className="relative overflow-hidden rounded-3xl border border-[#00FF9C]/20 bg-gradient-to-br from-emerald-500/15 via-white/[0.03] to-cyan-500/10 p-6 backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00FF9C]/15 blur-3xl" />

            <div className="relative mb-5 flex items-center justify-start">
              <h2 className="text-3xl font-bold">{currentDevice.name}</h2>
            </div>

            <RadialDeviceLayout device={currentDevice} selectedDeviceType={selectedDeviceType} currentDeviceIndex={currentDeviceIndex} cycleDevice={cycleDevice} />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="rounded-3xl border border-white/10 bg-cardBg p-6 backdrop-blur-xl"
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
            <div className="sm:hidden flex flex-col">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="text-2xl font-bold text-textHeading">Overall Farm Status</h3>
                <div className="scale-75 origin-right flex-shrink-0">
                  <CircularGauge value={85} />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                {/* Row 1: Soil moisture, Temperature, Wind Speed */}
                <div className="grid grid-cols-3 gap-2">
                  <FarmStatusCard metric={FARM_STATUS_METRICS[0]} />
                  <FarmStatusCard metric={FARM_STATUS_METRICS[1]} />
                  <FarmStatusCard metric={FARM_STATUS_METRICS[2]} />
                </div>

                {/* Row 2: Humidity, Visibility, Leaf Wetness */}
                <div className="grid grid-cols-3 gap-2">
                  <FarmStatusCard metric={FARM_STATUS_METRICS[3]} />
                  <FarmStatusCard metric={FARM_STATUS_METRICS[4]} />
                  <FarmStatusCard metric={FARM_STATUS_METRICS[5]} />
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        <section className="grid gap-6 xl:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-white/10 bg-cardBg p-5 backdrop-blur-xl xl:col-span-2"
          >
            <h3 className="mb-4 text-3xl font-bold">Sensor Insights</h3>
            
            {/* Mobile View - 2x2 grid layout */}
            <div className="grid grid-cols-2 gap-3 sm:hidden">
              {/* Active Sensors Card */}
              <div className="relative flex flex-col items-start justify-between rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 h-[120px]">
                <span className="absolute top-4 right-5 text-xl font-bold text-[#00FF9C]">19</span>
                <div className="mb-auto inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10">
                  <Radio className="h-4 w-4 text-[#00FF9C]" />
                </div>
                <p className="text-[0.85rem] font-bold leading-tight mt-4">Active<br/>Sensors</p>
              </div>

              {/* Sensor Category Cards */}
              {SENSOR_CARDS.map((card) => (
                <div
                  key={card.title}
                  onClick={() => {
                    if (card.title === 'Weather Sensors') setShowWeatherDetails(true);
                    if (card.title === 'Soil Sensors') setShowSoilDetails(true);
                    if (card.title === 'Air Sensors') setShowAirDetails(true);
                  }}
                  className={`flex flex-col items-start justify-between rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 h-[120px] ${card.title === 'Weather Sensors' || card.title === 'Soil Sensors' || card.title === 'Air Sensors' ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}
                >
                  <div className={`mb-auto inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent}`}>
                    <card.icon className="h-4 w-4 text-[#00FF9C]" />
                  </div>
                  <p className="text-[0.85rem] font-bold leading-tight mt-4">{card.title.split(' ').join('\n')}</p>
                </div>
              ))}
            </div>

            {/* Web View - 2x2 grid layout */}
            <div className="hidden sm:block">
              <div className="grid grid-cols-2 gap-4">
                {/* Active Sensors Card */}
                <div className="relative flex flex-col items-start justify-between rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-6 h-[160px]">
                  <span className="absolute top-5 right-6 text-2xl font-bold text-[#00FF9C]">19</span>
                  <div className="mb-auto inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10">
                    <Radio className="h-5 w-5 text-[#00FF9C]" />
                  </div>
                  <p className="text-xl font-bold leading-tight mt-6">Active<br/>Sensors</p>
                </div>

                {/* Sensor Category Cards */}
                {SENSOR_CARDS.map((card) => (
                  <motion.div
                    key={card.title}
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (card.title === 'Weather Sensors') setShowWeatherDetails(true);
                      if (card.title === 'Soil Sensors') setShowSoilDetails(true);
                      if (card.title === 'Air Sensors') setShowAirDetails(true);
                    }}
                    className={`flex flex-col items-start justify-between rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-6 h-[160px] ${card.title === 'Weather Sensors' || card.title === 'Soil Sensors' || card.title === 'Air Sensors' ? 'cursor-pointer' : ''}`}
                  >
                    <div className={`mb-auto inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent}`}>
                      <card.icon className="h-5 w-5 text-[#00FF9C]" />
                    </div>
                    <p className="text-xl font-bold leading-tight mt-6">{card.title.split(' ').join('\n')}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="rounded-3xl border border-[#00FF9C]/20 bg-gradient-to-br from-[#00FF9C]/10 via-white/[0.03] to-transparent p-5 backdrop-blur-xl xl:col-span-3"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-3xl font-bold">FIS Alert Engine</h3>
              <span className="rounded-full border border-[#00FF9C]/30 bg-[#00FF9C]/10 px-3 py-1 text-xs font-semibold text-[#00FF9C]">
                ACTIVE
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {FIS_CARDS.map((card) => (
                <div key={card.title} className="rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all hover:bg-white/[0.05]">
                  {/* Top Row: Icon + Title */}
                  <div className="mb-5 flex items-center gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 backdrop-blur-md border border-white/5 shadow-inner">
                      <card.icon className="h-5 w-5 text-[#00FF9C]" />
                    </span>
                    <h4 className="text-xl font-bold text-white tracking-tight whitespace-nowrap">{card.title}</h4>
                  </div>

                  {/* Body Content */}
                  <p className="text-sm font-medium leading-relaxed text-white/60 min-h-[48px] line-clamp-2">
                    {card.body}
                  </p>

                  {/* Footer: Status + Linear Progress Bar */}
                  <div className="mt-6 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={[
                          'inline-flex rounded-full px-3 py-1 text-[0.65rem] font-black uppercase tracking-widest',
                          card.status === 'Optimal' && 'bg-[#00FF9C]/10 text-[#00FF9C] border border-[#00FF9C]/20',
                          card.status === 'Warning' && 'bg-yellow-400/10 text-yellow-300 border border-yellow-400/20',
                          card.status === 'Critical' && 'bg-red-400/10 text-red-300 border border-red-400/20',
                        ].join(' ')}
                      >
                        {card.status}
                      </span>
                      <span className="text-xs font-black text-white/40 tracking-tighter">{card.value}%</span>
                    </div>

                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5 border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${card.value}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className={`h-full rounded-full shadow-[0_0_10px_rgba(0,255,156,0.2)] ${
                          card.status === 'Optimal' ? 'bg-gradient-to-r from-[#00FF9C] to-emerald-400' :
                          card.status === 'Warning' ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                          'bg-gradient-to-r from-red-500 to-rose-600'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-[#00FF9C]/25 bg-[#00FF9C]/10 p-4">
              <p className="text-lg font-semibold">Suggestion</p>
              <p className="mt-1 text-textBody">
                Deploy sub-surface irrigation now. Solar intensity is rising, hydrate early to maximize yield.
              </p>
              <div className="mt-4 h-3 rounded-full bg-black/30">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '98.4%' }}
                  transition={{ duration: 1.1, delay: 0.2 }}
                  className="h-3 rounded-full bg-gradient-to-r from-[#00FF9C] to-emerald-300"
                />
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-textLabel">
                <span>Confidence</span>
                <span>98.4%</span>
              </div>
              
              {/* Mobile-Only Acknowledge Button */}
              <div className="mt-4 sm:hidden">
                <button
                  type="button"
                  className="w-full rounded-xl bg-[#00FF9C]/20 border border-[#00FF9C]/40 py-2.5 text-sm font-semibold text-[#00FF9C] transition hover:bg-[#00FF9C]/30 active:scale-[0.98]"
                >
                  Acknowledge
                </button>
              </div>

              {/* Web-Only Acknowledge Button */}
              <div className="hidden sm:mt-4 sm:flex sm:justify-end">
                <button
                  type="button"
                  className="rounded-lg border border-[#00FF9C]/30 bg-[#00FF9C]/10 px-4 py-1.5 text-sm font-semibold text-[#00FF9C] transition-all hover:bg-[#00FF9C]/20 active:scale-[0.98]"
                >
                  Acknowledge
                </button>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="rounded-3xl border border-white/10 bg-cardBg p-5 backdrop-blur-xl lg:col-span-2"
          >
            <h3 className="mb-4 text-3xl font-bold">AI Insights</h3>
            <div className="space-y-3">
              {AI_INSIGHTS.map((item) => (
                <motion.div
                  key={item.title}
                  whileHover={{ x: 3 }}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={[
                        'h-3 w-3 rounded-full',
                        item.level === 'good' ? 'bg-[#00FF9C]' : 'bg-yellow-300',
                      ].join(' ')}
                    />
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-textSecondary">{item.description}</p>
                    </div>
                  </div>
                  <span className="text-sm text-textMuted">-</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22 }}
            className="rounded-3xl border border-white/10 bg-cardBg p-5 backdrop-blur-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-3xl font-bold">Water Savings</h3>
              <span className="rounded-full border border-[#00FF9C]/30 bg-[#00FF9C]/10 px-3 py-1 text-sm font-semibold text-[#00FF9C]">
                15.0%
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/20 to-transparent p-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-cyan-200">Total Saved</p>
                <p className="mt-2 text-5xl font-bold text-cyan-300">0 L</p>
                <p className="text-sm text-textLabel">This Month</p>
              </div>

              <div className="rounded-2xl border border-[#00FF9C]/20 bg-gradient-to-br from-emerald-500/20 to-transparent p-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-[#00FF9C]">Daily Average</p>
                <p className="mt-2 text-5xl font-bold text-[#00FF9C]">0 L</p>
                <p className="text-sm text-textLabel">Per Day</p>
              </div>
            </div>
          </motion.div>
        </section>


      </div>

      <AnimatePresence>
        {showWeatherDetails && (
          <WeatherSensorsModal 
            isOpen={showWeatherDetails} 
            onClose={() => setShowWeatherDetails(false)} 
          />
        )}
        {showSoilDetails && (
          <SoilSensorsModal 
            isOpen={showSoilDetails} 
            onClose={() => setShowSoilDetails(false)} 
          />
        )}
        {showAirDetails && (
          <AirSensorsModal 
            isOpen={showAirDetails} 
            onClose={() => setShowAirDetails(false)} 
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function WeatherSensorsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeMetric, setActiveMetric] = useState<string | null>(null);

  const toggleMetric = (metric: string) => {
    setActiveMetric(prev => prev === metric ? null : metric);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-[1vh] bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="w-[99vw] md:max-w-[85rem] bg-bgCard rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-15px_rgba(0,0,0,0.6)] border border-white/5 max-h-[98vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-5 md:px-6 md:py-6 border-b border-white/5">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-[0.75rem] md:rounded-[1rem] bg-[#00FF9C]/10 flex items-center justify-center">
              <Cloud className="w-6 h-6 md:w-7 md:h-7 text-[#00FF9C]" />
            </div>
            <div>
              <h2 className="text-xl md:text-[1.6rem] font-bold text-textHeading leading-tight tracking-tight">Weather Sensors</h2>
              <p className="text-textHint text-[0.75rem] md:text-[0.9rem] font-medium mt-0.5 whitespace-nowrap">3 active sensors</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 transition-opacity hover:opacity-50"
          >
            <X className="w-5 h-5 md:w-6 md:h-6 text-red-500/80" strokeWidth={2.5} />
          </button>
        </div>

        {/* Content - Scrollable on Mobile */}
        <div className="px-4 py-8 md:px-6 md:py-10 overflow-y-auto">
          <div className="flex flex-col md:flex-row md:flex-wrap justify-start gap-4 md:gap-5">
            {/* Wind Direction */}
            <div className="w-full md:w-auto">
              <div 
                onClick={() => toggleMetric('Wind Direction')}
                className={`w-full md:w-[16rem] p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border transition-all cursor-pointer ${activeMetric === 'Wind Direction' ? 'border-[#00FF9C] bg-[#00FF9C]/5 shadow-[0_0_20px_rgba(0,255,156,0.2)]' : 'border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-[#00FF9C]/30 hover:bg-white/[0.05] active:scale-95'} flex flex-col justify-between h-[12.5rem] md:h-[11rem]`}
              >
                <div>
                  <div 
                    className="w-12 h-12 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4"
                    style={{ backgroundColor: '#A855F71A' }}
                  >
                    <Wind className={`w-6 h-6 md:w-5 md:h-5 ${activeMetric === 'Wind Direction' ? 'text-[#00FF9C]' : 'text-[#A855F7]'}`} style={{ color: activeMetric === 'Wind Direction' ? undefined : '#A855F7' }} />
                  </div>
                  <p className="text-[0.75rem] md:text-[0.7rem] font-bold text-white/90 tracking-wider uppercase mb-0.5 whitespace-nowrap">Wind Direction</p>
                  <p className="text-[2rem] md:text-[1.75rem] font-black text-white leading-none tracking-tighter">0<span className="text-[0.8rem] md:text-[0.7rem] ml-1 font-bold text-white/60 tracking-normal">°</span></p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_10px_#00FF9C]" />
                    <span className="text-[0.65rem] md:text-[0.75rem] font-bold text-[#00FF9C] uppercase tracking-widest leading-none">Good</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${activeMetric === 'Wind Direction' ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Mobile/Integrated Details - Appears immediately below card */}
              <AnimatePresence>
                {activeMetric === 'Wind Direction' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden w-full md:hidden"
                  >
                    <WindDirectionDetail onClose={() => setActiveMetric(null)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wind Speed */}
            <div 
              onClick={() => toggleMetric('Wind Speed')}
              className={`w-full md:w-[16rem] p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border transition-all cursor-pointer ${activeMetric === 'Wind Speed' ? 'border-[#22D3EE] bg-[#22D3EE]/5 shadow-[0_0_20px_rgba(34,211,238,0.2)]' : 'border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-[#22D3EE]/30 hover:bg-white/[0.05] active:scale-95'} flex flex-col justify-between h-[12.5rem] md:h-[11rem]`}
            >
              <div>
                <div 
                  className="w-12 h-12 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4"
                  style={{ backgroundColor: '#22D3EE1A' }}
                >
                  <Wind className={`w-6 h-6 md:w-5 md:h-5 ${activeMetric === 'Wind Speed' ? 'text-[#00FF9C]' : 'text-[#22D3EE]'}`} style={{ color: activeMetric === 'Wind Speed' ? undefined : '#22D3EE' }} />
                </div>
                <p className="text-[0.75rem] md:text-[0.7rem] font-bold text-white/90 tracking-wider uppercase mb-0.5 whitespace-nowrap">Wind Speed</p>
                <p className="text-[2rem] md:text-[1.75rem] font-black text-white leading-none tracking-tighter">0<span className="text-[0.8rem] md:text-[0.7rem] ml-1 font-bold text-white/60 tracking-normal">m/s</span></p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_10px_#00FF9C]" />
                  <span className="text-[0.65rem] md:text-[0.75rem] font-bold text-[#00FF9C] uppercase tracking-widest leading-none">Good</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${activeMetric === 'Wind Speed' ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Mobile/Integrated Details - Wind Speed */}
            <AnimatePresence>
              {activeMetric === 'Wind Speed' && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden w-full md:hidden"
                >
                  <WindSpeedDetail onClose={() => setActiveMetric(null)} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Rain Fall */}
            <div className="w-full md:w-auto">
              <div 
                onClick={() => toggleMetric('Rain Fall')}
                className={`w-full md:w-[16rem] p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border transition-all cursor-pointer ${activeMetric === 'Rain Fall' ? 'border-[#00FF9C] bg-[#00FF9C]/5 shadow-[0_0_20px_rgba(0,255,156,0.2)]' : 'border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-[#00FF9C]/30 hover:bg-white/[0.05] active:scale-95'} flex flex-col justify-between h-[12.5rem] md:h-[11rem]`}
              >
                <div>
                  <div 
                    className="w-12 h-12 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6"
                    style={{ backgroundColor: '#00FF9C1A' }}
                  >
                    <CloudRain className={`w-6 h-6 md:w-6 md:h-6 ${activeMetric === 'Rain Fall' ? 'text-[#00FF9C]' : 'text-[#00FF9C]/80'}`} style={{ color: '#00FF9C' }} />
                  </div>
                  <p className="text-[0.75rem] md:text-[0.7rem] font-bold text-white/90 tracking-wider uppercase mb-0.5 whitespace-nowrap">Rain Fall</p>
                  <p className="text-[2rem] md:text-[1.75rem] font-black text-white leading-none tracking-tighter">0.5<span className="text-[0.8rem] md:text-[0.7rem] ml-1 font-bold text-white/60 tracking-normal">mm</span></p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_10px_#00FF9C]" />
                    <span className="text-[0.65rem] md:text-[0.75rem] font-bold text-[#00FF9C] uppercase tracking-widest leading-none">Good</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${activeMetric === 'Rain Fall' ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Mobile/Integrated Details - Rain Fall */}
              <AnimatePresence>
                {activeMetric === 'Rain Fall' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden w-full md:hidden"
                  >
                    <RainFallDetail onClose={() => setActiveMetric(null)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Integrated Details - Appears below card on mobile, below grid on desktop */}
          <AnimatePresence mode="wait">
            {activeMetric === 'Wind Direction' && (
              <motion.div
                key="wind-direction-details"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden w-full hidden md:block"
              >
                <WindDirectionDetail onClose={() => setActiveMetric(null)} />
              </motion.div>
            )}
            {activeMetric === 'Wind Speed' && (
              <motion.div
                key="wind-speed-details"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden w-full hidden md:block"
              >
                <WindSpeedDetail onClose={() => setActiveMetric(null)} />
              </motion.div>
            )}
            {activeMetric === 'Rain Fall' && (
              <motion.div
                key="rain-fall-details"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden w-full hidden md:block"
              >
                <RainFallDetail onClose={() => setActiveMetric(null)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-4 pb-8 md:px-6 md:pb-12 mt-auto">
          <div className="bg-[#00FF9C]/[0.02] rounded-[1rem] md:rounded-[1.25rem] py-3 md:py-3 px-6 flex flex-col gap-0.5 border border-[#00FF9C]/10">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_8px_rgba(0,255,156,0.6)]" />
              <p className="text-[0.6rem] md:text-[0.7rem] font-black text-[#00FF9C] uppercase tracking-[0.2em]">All sensors are operational</p>
            </div>
            <p className="text-[0.5rem] md:text-[0.6rem] text-textHint font-bold ml-4 tracking-[0.1em] uppercase">Last updated: 12/10/2025, 1:08:07 PM</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Radial Device Layout ─────────────────────────────────────────────────────

type RadialAttributeProps = {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  /** tailwind classes for absolute positioning */
  posClass: string;
  /** which side the text aligns to */
  align: 'left' | 'right' | 'center';
  delay?: number;
};

function RadialAttribute({ label, value, icon, posClass, align, delay = 0 }: RadialAttributeProps) {
  const textAlign =
    align === 'left' ? 'items-end text-right' : align === 'right' ? 'items-start text-left' : 'items-center text-center';
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.08, filter: 'brightness(1.25)' }}
      className={`group absolute z-10 flex flex-col gap-0.5 ${textAlign} ${posClass} cursor-default`}
    >
      <span className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-textMuted ${align === 'left' ? 'flex-row-reverse' : 'flex-row'}`}>
        <span className="text-[#00FF9C]/70">{icon}</span>
        {label}
      </span>
      <span className="text-sm font-medium text-[#E5E7EB]/90 leading-tight">{value}</span>
    </motion.div>
  );
}

function MobileAttribute({ label, value, icon }: { label: string; value: React.ReactNode; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#00FF9C]/90">
        {icon}
        <span className="text-textSecondary">{label}</span>
      </span>
      <span className="text-sm font-medium text-textBody leading-snug">{value}</span>
    </div>
  );
}

type RadialDeviceLayoutProps = {
  device: DeviceData;
  selectedDeviceType: DeviceType;
  currentDeviceIndex: number;
  cycleDevice: (dir: 1 | -1) => void;
};

function RadialDeviceLayout({ device, selectedDeviceType, currentDeviceIndex, cycleDevice }: RadialDeviceLayoutProps) {
  return (
    <>
      <div className="hidden sm:block relative mx-auto w-full max-w-[560px]" style={{ height: 340 }}>
        {/* ── Left attributes ── */}
        <RadialAttribute
          label="Area" value={device.area}
          icon={<svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>}
          posClass="left-16 top-[60px] -translate-y-0" align="left" delay={0.08}
        />
        <RadialAttribute
          label="Location" value={device.location}
          icon={<MapPin className="h-3 w-3" />}
          posClass="left-6 top-1/2 -translate-y-1/2" align="left" delay={0.12}
        />
        <RadialAttribute
          label="Boundary" value={device.boundary}
          icon={<svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 19 22 19" /></svg>}
          posClass="left-16 bottom-[60px] translate-y-0" align="left" delay={0.16}
        />

        {/* ── Right attributes ── */}
        <RadialAttribute
          label="Soil Type" value={device.soilType}
          icon={<Leaf className="h-3 w-3" />}
          posClass="right-16 top-[60px] -translate-y-0" align="right" delay={0.1}
        />
        <RadialAttribute
          label="Irrigation" value={device.irrigationType}
          icon={<Droplets className="h-3 w-3" />}
          posClass="right-6 top-1/2 -translate-y-1/2" align="right" delay={0.14}
        />
        <RadialAttribute
          label="Crops"
          value={
            <span className="flex flex-wrap gap-1">
              {device.crops.map((c) => (
                <span key={c} className="rounded-md bg-[#00FF9C]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[#00FF9C]">{c}</span>
              ))}
            </span>
          }
          icon={<Leaf className="h-3 w-3" />}
          posClass="right-16 bottom-[60px] translate-y-0" align="right" delay={0.18}
        />

        {/* ── Device image centrepiece ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* radial glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,255,156,0.18) 0%, transparent 70%)' }}
          />

          <motion.img
            key={`${selectedDeviceType}-${currentDeviceIndex}`}
            src={device.image}
            alt={device.name}
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: [0, -6, 0], scale: 1 }}
            transition={{ opacity: { duration: 0.35 }, y: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' }, scale: { duration: 0.35 } }}
            className="relative z-10 mb-4 max-h-[240px] w-auto object-contain drop-shadow-[0_16px_40px_rgba(0,255,156,0.25)]"
          />

          {/* ── Arrows at bottom ── */}
          <div className="relative z-20 flex items-center justify-center gap-6">
            <button
            type="button"
            onClick={() => cycleDevice(-1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/40 text-textHeading transition hover:border-[#00FF9C]/70 hover:text-[#00FF9C]"
            aria-label="Previous device"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => cycleDevice(1)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/40 text-textHeading transition hover:border-[#00FF9C]/70 hover:text-[#00FF9C]"
            aria-label="Next device"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
    <div className="sm:hidden flex flex-col items-center gap-8 mt-4 w-full px-2">
      {/* Mobile Device image centrepiece */}
      <div className="relative flex flex-row items-center justify-between w-full min-h-[220px] px-2">
        {/* radial glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,255,156,0.18) 0%, transparent 70%)' }}
        />

        {/* Left Arrow */}
        <button
          type="button"
          onClick={() => cycleDevice(-1)}
          className="relative z-20 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 bg-black/40 text-textHeading transition hover:border-[#00FF9C]/70 hover:text-[#00FF9C]"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <motion.img
          key={`mobile-${selectedDeviceType}-${currentDeviceIndex}`}
          src={device.image}
          alt={device.name}
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: [0, -6, 0], scale: 1 }}
          transition={{ opacity: { duration: 0.35 }, y: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' }, scale: { duration: 0.35 } }}
          className="relative z-10 max-h-[160px] w-auto object-contain flex-grow drop-shadow-[0_16px_40px_rgba(0,255,156,0.25)]"
        />

        {/* Right Arrow */}
        <button
          type="button"
          onClick={() => cycleDevice(1)}
          className="relative z-20 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 bg-black/40 text-textHeading transition hover:border-[#00FF9C]/70 hover:text-[#00FF9C]"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Grid Attributes */}
      <div className="w-full grid grid-cols-2 gap-x-4 gap-y-6 items-start mt-2 pb-6">
        {/* Row 1 */}
        <MobileAttribute
          label="Area" value={device.area}
          icon={<svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>}
        />
        <MobileAttribute
          label="Soil Type" value={device.soilType}
          icon={<Leaf className="h-3 w-3" />}
        />

        {/* Row 2 */}
        <MobileAttribute
          label="Location" value={device.location}
          icon={<MapPin className="h-3 w-3" />}
        />
        <MobileAttribute
          label="Irrigation" value={device.irrigationType}
          icon={<Droplets className="h-3 w-3" />}
        />

        {/* Row 3 */}
        <MobileAttribute
          label="Boundary" value={device.boundary}
          icon={<svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 19 22 19" /></svg>}
        />
        <MobileAttribute
          label="Crops"
          value={
            <span className="flex flex-wrap gap-1">
              {device.crops.map((c) => (
                <span key={c} className="rounded-md bg-[#00FF9C]/15 px-1.5 py-0.5 text-[10px] font-semibold text-[#00FF9C]">{c}</span>
              ))}
            </span>
          }
          icon={<Leaf className="h-3 w-3" />}
        />
      </div>
    </div>
    </>
  );
}

// ─── InfoCard (legacy – retained for type-safety) ─────────────────────────────

function FarmStatusCard({ metric }: { metric: FarmStatusMetric }) {
  const icon = React.isValidElement(metric.icon)
    ? React.cloneElement(metric.icon as React.ReactElement, { className: 'h-5 w-5 sm:h-6 sm:w-6' })
    : metric.icon;

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-white/15 bg-black/20 p-2 sm:p-4 text-center transition h-full"
    >
      <div className="mb-1 sm:mb-2 text-textLabel">
        {icon}
      </div>
      <div className="mb-0.5 flex flex-wrap items-baseline justify-center gap-0.5 sm:gap-1 px-1">
        <span className="text-lg sm:text-2xl font-bold tracking-tight text-textHeading">{metric.value}</span>
        {metric.unit && (
          <span className="text-[10px] sm:text-sm font-medium text-textMuted">{metric.unit}</span>
        )}
      </div>
      <p className="text-[9px] sm:text-xs font-medium text-textHint leading-tight break-words">{metric.label}</p>
    </motion.div>
  );
}

function SoilSensorsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeSensor, setActiveSensor] = useState<string | null>(null);

  const toggleSensor = (sensorTitle: string) => {
    setActiveSensor(prev => prev === sensorTitle ? null : sensorTitle);
  };

  const soilSensors = [
    { title: 'Nitrogen', value: '0', unit: 'mg/kg', icon: Waves, color: '#00FF9C' },
    { title: 'Organic Carbon', value: '0', unit: '%', icon: Wind, color: '#FCD34D' },
    { title: 'Soil Temperature at Surface', value: '24', unit: '°C', icon: Thermometer, color: '#F87171' },
    { title: 'Phosphorus', value: '0', unit: 'mg/kg', icon: Waves, color: '#22D3EE' },
    { title: 'Potassium', value: '0', unit: 'mg/kg', icon: Wind, color: '#F59E0B' },
    { title: 'pH Level', value: '0', unit: 'pH', icon: Thermometer, color: '#A855F7' },
    { title: 'Soil Moisture at Surface', value: '57', unit: '%', icon: Droplets, color: '#3B82F6' },
  ];

  const activeSensorIndex = activeSensor ? soilSensors.findIndex((sensor) => sensor.title === activeSensor) : -1;
  const activeSensorData = soilSensors.find((sensor) => sensor.title === activeSensor);
  const firstRowSensors = soilSensors.slice(0, 4);
  const secondRowSensors = soilSensors.slice(4);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-[1vh] bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="w-[99vw] md:max-w-[85rem] bg-bgCard rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-15px_rgba(0,0,0,0.6)] border border-white/5 max-h-[98vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-5 md:px-6 md:py-6 border-b border-white/5">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-[0.75rem] md:rounded-[1rem] bg-emerald-500/10 flex items-center justify-center">
              <Leaf className="w-6 h-6 md:w-7 md:h-7 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-xl md:text-[1.6rem] font-bold text-white leading-tight tracking-tight">Soil Sensors</h2>
              <p className="text-white/75 text-[0.75rem] md:text-[0.9rem] font-medium mt-0.5 whitespace-nowrap">{soilSensors.length} active sensors</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 transition-opacity hover:opacity-50">
            <X className="w-5 h-5 md:w-6 md:h-6 text-[#00FF9C]" strokeWidth={2.5} />
          </button>
        </div>

        {/* Content - Scrollable on Mobile */}
        <div className="px-4 py-8 md:px-6 md:py-10 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {firstRowSensors.map((sensor, idx) => (
              <div key={idx} className="w-full">
                <div 
                  onClick={() => toggleSensor(sensor.title)}
                  className={`w-full md:w-[16rem] p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border transition-all cursor-pointer ${activeSensor === sensor.title ? 'border-[#00FF9C] bg-[#00FF9C]/5 shadow-[0_0_20px_rgba(0,255,156,0.2)]' : 'border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-[#00FF9C]/30 hover:bg-white/[0.05] active:scale-95'} flex flex-col justify-between h-[12.5rem] md:h-[11rem]`}
                >
                  <div>
                    <div 
                      className="w-12 h-12 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4"
                      style={{ backgroundColor: `${sensor.color}1A` }}
                    >
                      <sensor.icon className={`w-6 h-6 md:w-5 md:h-5 ${activeSensor === sensor.title ? 'text-[#00FF9C]' : ''}`} style={{ color: activeSensor !== sensor.title ? sensor.color : undefined }} />
                    </div>
                    <p className="text-[0.75rem] md:text-[0.7rem] font-bold text-white/90 tracking-wider uppercase mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis" title={sensor.title}>{sensor.title}</p>
                    <p className="text-[2rem] md:text-[1.75rem] font-black text-white leading-none tracking-tighter">
                      {sensor.value}<span className="text-[0.8rem] md:text-[0.7rem] ml-1 font-bold text-white/60 tracking-normal">{sensor.unit}</span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_10px_#00FF9C]" />
                      <span className="text-[0.65rem] md:text-[0.75rem] font-bold text-[#00FF9C] uppercase tracking-widest leading-none">Good</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${activeSensor === sensor.title ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Mobile/Integrated Details */}
                <AnimatePresence>
                  {activeSensor === sensor.title && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden w-full md:hidden"
                    >
                      <SoilSensorDetail sensor={sensor} onClose={() => setActiveSensor(null)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeSensor && activeSensorData && activeSensorIndex >= 0 && activeSensorIndex < 4 && (
              <motion.div
                key="desktop-details-first-row"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden w-full hidden md:block"
              >
                <SoilSensorDetail sensor={activeSensorData} onClose={() => setActiveSensor(null)} />
              </motion.div>
            )}
          </AnimatePresence>

          {secondRowSensors.length > 0 && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {secondRowSensors.map((sensor, idx) => (
                <div key={idx} className="w-full">
                  <div 
                    onClick={() => toggleSensor(sensor.title)}
                    className={`w-full p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border transition-all cursor-pointer ${activeSensor === sensor.title ? 'border-[#00FF9C] bg-[#00FF9C]/5 shadow-[0_0_20px_rgba(0,255,156,0.2)]' : 'border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-[#00FF9C]/30 hover:bg-white/[0.05] active:scale-95'} flex flex-col justify-between h-[12.5rem] md:h-[11rem]`}>
                    <div>
                      <div 
                        className="w-12 h-12 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4"
                        style={{ backgroundColor: `${sensor.color}1A` }}
                      >
                        <sensor.icon className={`w-6 h-6 md:w-5 md:h-5 ${activeSensor === sensor.title ? 'text-[#00FF9C]' : ''}`} style={{ color: activeSensor !== sensor.title ? sensor.color : undefined }} />
                      </div>
                      <p className="text-[0.75rem] md:text-[0.7rem] font-bold text-white/90 tracking-wider uppercase mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis" title={sensor.title}>{sensor.title}</p>
                      <p className="text-[2rem] md:text-[1.75rem] font-black text-white leading-none tracking-tighter">
                        {sensor.value}<span className="text-[0.8rem] md:text-[0.7rem] ml-1 font-bold text-white/60 tracking-normal">{sensor.unit}</span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_10px_#00FF9C]" />
                        <span className="text-[0.65rem] md:text-[0.75rem] font-bold text-[#00FF9C] uppercase tracking-widest leading-none">Good</span>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${activeSensor === sensor.title ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  <AnimatePresence>
                    {activeSensor === sensor.title && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden w-full md:hidden"
                      >
                        <SoilSensorDetail sensor={sensor} onClose={() => setActiveSensor(null)} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {activeSensor && activeSensorData && activeSensorIndex >= 4 && (
              <motion.div
                key="desktop-details-second-row"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden w-full hidden md:block"
              >
                <SoilSensorDetail sensor={activeSensorData} onClose={() => setActiveSensor(null)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Area */}
        <div className="px-4 pb-8 md:px-6 md:pb-12 mt-auto">
          <div className="bg-[#00FF9C]/[0.02] rounded-[1rem] md:rounded-[1.25rem] py-3 md:py-3 px-6 flex flex-col gap-0.5 border border-[#00FF9C]/10">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_8px_rgba(0,255,156,0.6)]" />
              <p className="text-[0.6rem] md:text-[0.7rem] font-black text-[#00FF9C] uppercase tracking-[0.2em]">All sensors are operational</p>
            </div>
            <p className="text-[0.5rem] md:text-[0.6rem] text-textHint font-bold ml-4 tracking-[0.1em] uppercase">Last updated: 12/10/2025, 1:08:07 PM</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SoilSensorDetail({ sensor, onClose }: { sensor: any, onClose: () => void }) {
  const [selectedRange, setSelectedRange] = useState('24 Hours');
  const ranges = ['24 Hours', '7 Days', '1 Month'];

  return (
    <div className="relative w-full rounded-[2rem] border border-white/10 bg-[#0A0E14]/90 p-6 md:p-8 overflow-hidden backdrop-blur-2xl">
      {/* Top Header Row */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-2xl md:text-[1.75rem] font-bold text-white tracking-tight leading-tight mb-1">{sensor.title}</h3>
          <p className="text-white/40 text-[0.75rem] md:text-[0.85rem] font-medium uppercase tracking-widest">24-Hour Trend</p>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <p className="text-[#00FF9C] text-2xl md:text-[2.25rem] font-black leading-none tracking-tighter">
            {sensor.value}<span className="text-[0.8rem] md:text-[0.9rem] ml-0.5 font-bold uppercase">.{sensor.unit}</span>
          </p>
          <button 
            onClick={onClose}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:bg-white/10 active:scale-95 shadow-lg group ml-1"
          >
            <X className="w-4 h-4 md:w-5 md:h-5 text-white/40 group-hover:text-white" strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Unified Dropdown Row */}
      <div className="mb-8 max-w-[180px]">
        <div className="relative">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-5 py-3 text-[0.75rem] font-black text-[#00FF9C] uppercase tracking-wider outline-none appearance-none cursor-pointer hover:bg-white/[0.08] transition-colors"
          >
            {ranges.map(range => (
              <option key={range} value={range} className="bg-[#0A0E14] text-white uppercase">{range}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDown className="w-4 h-4 text-[#00FF9C]/60" />
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative w-full h-[220px] md:h-[300px] p-0 flex items-end justify-center overflow-hidden bg-white/[0.02] rounded-[1.5rem] border border-white/5">
        <WindSpeedChart />
        <div className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none border-t border-white/5 w-full pt-6">
          <p className="text-white/20 text-[0.7rem] md:text-xs font-black tracking-[0.3em] uppercase">No Recorded Data</p>
        </div>
      </div>
    </div>
  );
}

function AirSensorDetail({ sensor, onClose }: { sensor: any; onClose: () => void }) {
  const [selectedRange, setSelectedRange] = useState('24 Hours');
  const ranges = ['24 Hours', '7 Days', '1 Month'];

  return (
    <div className="relative w-full rounded-[2rem] border border-white/10 bg-[#0A0E14]/90 p-6 md:p-8 overflow-hidden backdrop-blur-2xl">
      {/* Mobile-Only Header Structure: [Heading] [Metric] [X] all together */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-black text-white tracking-tight">{sensor.title}</h3>
          <p className="text-[#00FF9C] text-xl font-black leading-none tracking-tighter">
            {sensor.value}<span className="text-[0.7rem] ml-0.5 font-bold uppercase">.{sensor.unit}</span>
          </p>
        </div>
        <button 
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all active:scale-95 shadow-lg group"
        >
          <X className="w-5 h-5 text-[#00FF9C]" strokeWidth={3} />
        </button>
      </div>
      
      {/* Mobile-Only Subtitle */}
      <p className="md:hidden text-white/40 text-[0.7rem] font-bold uppercase tracking-[0.2em] mb-4">24-Hour Trend</p>

      {/* Desktop Header Row (Restored/Maintained) */}
      <div className="hidden md:flex items-start justify-between mb-8">
        <div>
          <h3 className="text-2xl md:text-[1.75rem] font-bold text-white tracking-tight leading-tight mb-1">{sensor.title}</h3>
          <p className="text-white/40 text-[0.75rem] md:text-[0.85rem] font-medium uppercase tracking-widest">24-Hour Trend</p>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <p className="text-[#00FF9C] text-2xl md:text-[2.25rem] font-black leading-none tracking-tighter">
            {sensor.value}<span className="text-[0.8rem] md:text-[0.9rem] ml-0.5 font-bold uppercase">.{sensor.unit}</span>
          </p>
          <button 
            onClick={onClose}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:bg-white/10 active:scale-95 shadow-lg group ml-1"
          >
            <X className="w-4 h-4 md:w-5 md:h-5 text-white/40 group-hover:text-white" strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Unified Dropdown Row */}
      <div className="mb-6 md:mb-8 max-w-[200px] md:max-w-[180px]">
        <div className="relative">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 md:px-5 py-3 md:py-3 text-[0.75rem] md:text-[0.75rem] font-black text-[#00FF9C] uppercase tracking-wider outline-none appearance-none cursor-pointer hover:bg-white/[0.08] transition-colors"
          >
            {ranges.map(range => (
              <option key={range} value={range} className="bg-[#0A0E14] text-white uppercase">{range}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDown className="w-4 h-4 text-[#00FF9C]/60" />
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative w-full h-[220px] md:h-[300px] p-0 flex items-end justify-center overflow-hidden bg-white/[0.02] rounded-[1.5rem] border border-white/5">
        <WindSpeedChart />
        <div className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none border-t border-white/5 w-full pt-6">
          <p className="text-white/20 text-[0.7rem] md:text-xs font-black tracking-[0.3em] uppercase">No Data Available</p>
        </div>
      </div>
    </div>
  );
}

function AirSensorsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeSensor, setActiveSensor] = useState<string | null>(null);

  const airSensors = [
    { id: 'pm25', title: 'PM 2.5', value: '7', unit: 'µg/m³', icon: Activity, color: '#3B82F6' },
    { id: 'pm10', title: 'PM 10', value: '7', unit: 'µg/m³', icon: Activity, color: '#22D3EE' },
    { id: 'co2', title: 'CO2', displayName: <>CO<sub>2</sub></>, value: '0', unit: 'ppm', icon: Cloud, color: '#E5E7EB' },
    { id: 'temp', title: 'Air Temperature', value: '0', unit: '°C', icon: Thermometer, color: '#F59E0B' },
    { id: 'hum', title: 'Humidity', value: '0', unit: '%', icon: Droplets, color: '#3B82F6' },
    { id: 'pres', title: 'Air Pressure', value: '999', unit: 'hPa', icon: Activity, color: '#3B82F6' },
    { id: 'so2', title: 'SO2', displayName: <>SO<sub>2</sub></>, value: '0.47', unit: 'ppm', icon: Activity, color: '#FBBF24' },
    { id: 'no2', title: 'NO2', displayName: <>NO<sub>2</sub></>, value: '0.18', unit: 'ppm', icon: Activity, color: '#F97316' },
    { id: 'o3', title: 'O3', value: '0.02', unit: 'ppm', icon: Activity, color: '#22C55E' },
    { id: 'leaf', title: 'Leaf Wetness', value: '0', unit: '%', icon: Leaf, color: '#22C55E' },
  ];

  const row1 = airSensors.slice(0, 4);
  const row2 = airSensors.slice(4, 8);
  const row3 = airSensors.slice(8);

  const activeSensorData = airSensors.find(s => s.id === activeSensor);
  const activeSensorIndex = airSensors.findIndex(s => s.id === activeSensor);

  const toggleSensor = (id: string) => {
    setActiveSensor(activeSensor === id ? null : id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="w-[94vw] md:max-w-[1280px] bg-bgMain/95 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 md:px-14 md:py-4 border-b border-white/5">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-[0.75rem] md:rounded-[1rem] bg-indigo-500/10 flex items-center justify-center">
              <Wind className="w-6 h-6 md:w-7 md:h-7 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl md:text-[1.6rem] font-bold text-textHeading leading-tight tracking-tight">Air Sensors</h2>
              <p className="text-textHint text-[0.75rem] md:text-[0.9rem] font-medium mt-0.5 whitespace-nowrap">10 active sensors</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 transition-opacity hover:opacity-50">
            <X className="w-5 h-5 md:w-6 md:h-6 text-[#00FF9C]" strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 md:px-14 md:py-8 overflow-y-auto">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            {row1.map((sensor, idx) => (
              <div key={idx} className="w-full">
                <div 
                  onClick={() => toggleSensor(sensor.id)}
                  className={`px-6 py-5 md:px-8 md:py-6 rounded-[1.5rem] md:rounded-[2rem] border transition-all cursor-pointer flex flex-col justify-between h-[12.5rem] md:h-[13rem] ${
                    activeSensor === sensor.id 
                      ? 'border-[#00FF9C] bg-[#00FF9C]/5 shadow-[0_0_20px_rgba(0,255,156,0.2)]' 
                      : 'border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-[#00FF9C]/30 hover:bg-white/[0.05] active:scale-95'
                  }`}
                >
                  <div>
                    <div 
                      className="w-12 h-12 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6"
                      style={{ backgroundColor: `${sensor.color}1A` }}
                    >
                      <sensor.icon className="w-6 h-6 md:w-6 md:h-6" style={{ color: sensor.color }} />
                    </div>
                    <p className="text-[0.75rem] md:text-[0.7rem] font-bold text-white/90 tracking-wider uppercase mb-1">{sensor.displayName || sensor.title}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-[1.2rem] md:text-[1.4rem] font-black text-white leading-none tracking-tight">
                        {sensor.value}
                      </span>
                      <span className="text-[0.6rem] md:text-[0.8rem] font-extrabold text-white/50 tracking-wider mb-1">
                        {sensor.unit}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#00FF9C] shadow-[0_0_10px_#00FF9C]" />
                      <span className="text-[0.65rem] md:text-[0.75rem] font-bold text-[#00FF9C] uppercase tracking-widest leading-none">Good</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${activeSensor === sensor.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Mobile Detail Expansion */}
                <AnimatePresence>
                  {activeSensor === sensor.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden w-full lg:hidden"
                    >
                      <AirSensorDetail sensor={sensor} onClose={() => setActiveSensor(null)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Desktop Expansion for Row 1 */}
          <AnimatePresence>
            {activeSensor && activeSensorIndex >= 0 && activeSensorIndex < 4 && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="hidden lg:block overflow-hidden"
              >
                <AirSensorDetail sensor={activeSensorData} onClose={() => setActiveSensor(null)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            {row2.map((sensor, idx) => (
              <div key={idx} className="w-full">
                <div 
                  onClick={() => toggleSensor(sensor.id)}
                  className={`px-6 py-5 md:px-8 md:py-6 rounded-[1.5rem] md:rounded-[2rem] border transition-all cursor-pointer flex flex-col justify-between h-[12.5rem] md:h-[13rem] ${
                    activeSensor === sensor.id 
                      ? 'border-[#00FF9C] bg-[#00FF9C]/5 shadow-[0_0_20px_rgba(0,255,156,0.2)]' 
                      : 'border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-[#00FF9C]/30 hover:bg-white/[0.05] active:scale-95'
                  }`}
                >
                  <div>
                    <div 
                       className="w-12 h-12 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6"
                       style={{ backgroundColor: `${sensor.color}1A` }}
                    >
                      <sensor.icon className="w-6 h-6 md:w-6 md:h-6" style={{ color: sensor.color }} />
                    </div>
                    <p className="text-[0.75rem] md:text-[0.7rem] font-bold text-white/90 tracking-wider uppercase mb-1">{sensor.displayName || sensor.title}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-[1.2rem] md:text-[1.4rem] font-black text-white leading-none tracking-tight">
                        {sensor.value}
                      </span>
                      <span className="text-[0.6rem] md:text-[0.8rem] font-extrabold text-white/50 tracking-wider mb-1">
                        {sensor.unit}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#00FF9C] shadow-[0_0_10px_#00FF9C]" />
                       <span className="text-[0.65rem] md:text-[0.75rem] font-bold text-[#00FF9C] uppercase tracking-widest leading-none">Good</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${activeSensor === sensor.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Mobile Detail Expansion for Row 2 */}
                <AnimatePresence>
                  {activeSensor === sensor.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden w-full lg:hidden"
                    >
                      <AirSensorDetail sensor={sensor} onClose={() => setActiveSensor(null)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Desktop Expansion for Row 2 */}
          <AnimatePresence>
            {activeSensor && activeSensorIndex >= 4 && activeSensorIndex < 8 && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="hidden lg:block overflow-hidden"
              >
                <AirSensorDetail sensor={activeSensorData} onClose={() => setActiveSensor(null)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
            {row3.map((sensor, idx) => (
              <div key={idx} className="w-full">
                <div 
                  onClick={() => toggleSensor(sensor.id)}
                  className={`px-6 py-5 md:px-8 md:py-6 rounded-[1.5rem] md:rounded-[2rem] border transition-all cursor-pointer flex flex-col justify-between h-[12.5rem] md:h-[13rem] ${
                    activeSensor === sensor.id 
                      ? 'border-[#00FF9C] bg-[#00FF9C]/5 shadow-[0_0_20px_rgba(0,255,156,0.2)]' 
                      : 'border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-[#00FF9C]/30 hover:bg-white/[0.05] active:scale-95'
                  }`}
                >
                  <div>
                    <div 
                       className="w-12 h-12 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6"
                       style={{ backgroundColor: `${sensor.color}1A` }}
                    >
                      <sensor.icon className="w-6 h-6 md:w-6 md:h-6" style={{ color: sensor.color }} />
                    </div>
                    <p className="text-[0.75rem] md:text-[0.7rem] font-bold text-white/90 tracking-wider uppercase mb-1">{sensor.displayName || sensor.title}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-[1.2rem] md:text-[1.4rem] font-black text-white leading-none tracking-tight">
                        {sensor.value}
                      </span>
                      <span className="text-[0.6rem] md:text-[0.8rem] font-extrabold text-white/50 tracking-wider mb-1">
                        {sensor.unit}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#00FF9C] shadow-[0_0_10px_#00FF9C]" />
                       <span className="text-[0.65rem] md:text-[0.75rem] font-bold text-[#00FF9C] uppercase tracking-widest leading-none">Good</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${activeSensor === sensor.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Mobile Detail Expansion for Row 3 */}
                <AnimatePresence>
                  {activeSensor === sensor.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden w-full lg:hidden"
                    >
                      <AirSensorDetail sensor={sensor} onClose={() => setActiveSensor(null)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Desktop Expansion for Row 3 */}
          <AnimatePresence>
            {activeSensor && activeSensorIndex >= 8 && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="hidden lg:block overflow-hidden"
              >
                <AirSensorDetail sensor={activeSensorData} onClose={() => setActiveSensor(null)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Area */}
        <div className="px-6 pb-6 md:px-14 md:pb-8 mt-auto">
          <div className="bg-[#00FF9C]/5 rounded-[1.25rem] md:rounded-[1.75rem] py-3 md:py-4 px-6 md:px-8 flex flex-col gap-1 border border-[#00FF9C]/10">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#00FF9C] shadow-[0_0_10px_#00FF9C]" />
              <p className="text-[0.75rem] md:text-[0.85rem] font-extrabold text-[#00FF9C] uppercase tracking-wider leading-none">All sensors are operational</p>
            </div>
            <p className="text-[0.6rem] md:text-[0.7rem] text-textHint font-medium ml-4.5 tracking-tight">Last updated: 12/10/2025, 1:08:07 PM</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function WindDirectionDetail({ onClose }: { onClose: () => void }) {
  const [selectedRange, setSelectedRange] = useState('24 Hours');
  const ranges = ['24 Hours', '7 Days', '1 Month'];

  return (
    <div className="relative w-full rounded-[2rem] border border-white/10 bg-[#0A0E14]/90 p-6 md:p-8 overflow-hidden backdrop-blur-2xl">
      {/* Top Header Row */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-2xl md:text-[1.75rem] font-bold text-white tracking-tight leading-tight mb-1">Wind Direction</h3>
          <p className="text-white/40 text-[0.75rem] md:text-[0.85rem] font-medium uppercase tracking-widest">Direction Distribution</p>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex flex-col items-end">
            <p className="text-[#00FF9C] text-2xl md:text-[2.25rem] font-black leading-none tracking-tighter mb-1">N</p>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#00FF9C]/10 border border-[#00FF9C]/20">
              <span className="text-[#00FF9C] text-[0.7rem] md:text-[0.8rem] font-black tracking-tighter">0° DEG</span>
              <Wind className="w-3 md:w-4 h-3 md:h-4 text-[#00FF9C]" />
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:bg-white/10 active:scale-95 shadow-lg group ml-1"
          >
            <X className="w-4 h-4 md:w-5 md:h-5 text-white/40 group-hover:text-white" strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Unified Dropdown Row */}
      <div className="mb-8 max-w-[180px]">
        <div className="relative">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-5 py-3 text-[0.75rem] font-black text-[#00FF9C] uppercase tracking-wider outline-none appearance-none cursor-pointer hover:bg-white/[0.08] transition-colors"
          >
            {ranges.map(range => (
              <option key={range} value={range} className="bg-[#0A0E14] text-white uppercase">{range}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDown className="w-4 h-4 text-[#00FF9C]/60" />
          </div>
        </div>
      </div>

      {/* Centered Diagram Area */}
      <div className="relative flex items-center justify-center w-full max-w-[200px] md:max-w-[340px] aspect-square mx-auto mt-0 z-0 select-none bg-white/[0.01] rounded-full border border-white/5 p-8 shadow-inner">
        <WindDirectionRadar key={selectedRange} range={selectedRange} />
      </div>
    </div>
  );
}   


function WindSpeedDetail({ onClose }: { onClose: () => void }) {
  const [selectedRange, setSelectedRange] = useState('24 Hours');
  const ranges = ['24 Hours', '7 Days', '1 Month'];

  return (
    <div className="relative w-full rounded-[2rem] border border-white/10 bg-[#0A0E14]/90 p-6 md:p-8 overflow-hidden backdrop-blur-2xl">
      {/* Top Header Row */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-2xl md:text-[1.75rem] font-bold text-white tracking-tight leading-tight mb-1">Wind Speed</h3>
          <p className="text-white/40 text-[0.75rem] md:text-[0.85rem] font-medium uppercase tracking-widest">24-Hour Trend</p>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <p className="text-[#00FF9C] text-2xl md:text-[2.25rem] font-black leading-none tracking-tighter">
            0<span className="text-[0.8rem] md:text-[0.9rem] ml-0.5 font-bold uppercase">.m/s</span>
          </p>
          <button 
            onClick={onClose}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:bg-white/10 active:scale-95 shadow-lg group ml-1"
          >
            <X className="w-4 h-4 md:w-5 md:h-5 text-white/40 group-hover:text-white" strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Unified Dropdown Row */}
      <div className="mb-8 max-w-[180px]">
        <div className="relative">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-5 py-3 text-[0.75rem] font-black text-[#00FF9C] uppercase tracking-wider outline-none appearance-none cursor-pointer hover:bg-white/[0.08] transition-colors"
          >
            {ranges.map(range => (
              <option key={range} value={range} className="bg-[#0A0E14] text-white uppercase">{range}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDown className="w-4 h-4 text-[#00FF9C]/60" />
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative w-full h-[220px] md:h-[300px] p-0 flex items-end justify-center overflow-hidden bg-white/[0.02] rounded-[1.5rem] border border-white/5">
        <WindSpeedChart />
        <div className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none border-t border-white/5 w-full pt-6">
          <p className="text-white/20 text-[0.7rem] md:text-xs font-black tracking-[0.3em] uppercase">No Recorded Data</p>
        </div>
      </div>
    </div>
  );
}


function WindSpeedChart() {
  return (
    <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
      {/* Y-Axis Labels */}
      {[0, 20, 40, 60, 80].map((val, i) => {
        // Shifting grid up: 0 now sits at y=250 (50px from bottom) instead of y=260
        const y = 250 - (val / 80) * 230;
        return (
          <g key={val}>
            <text x="30" y={y + 5} fill="white" fillOpacity="0.15" fontSize="11" fontWeight="bold" className="tabular-nums select-none">{val}</text>
            <line x1="60" y1={y} x2="780" y2={y} stroke="white" strokeOpacity="0.04" strokeDasharray="4 4" />
          </g>
        );
      })}
    </svg>
  );
}

function WindDirectionRadar({ size = 320, range = '24 Hours' }: { size?: number; range?: string }) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const center = size / 2;
  const radius = size * 0.4;

  // Reverting to the simpler "Line" style that was preferred, with clear range differences
  const data = 
    range === '24 Hours' 
      ? [0, 0, 0, 0, 0, 0, 0, 0] 
      : range === '7 Days'
        ? [1, 0, 0, 0, 0, 0, 0, 0] // North
        : [0, 0, 1, 0, 0, 0, 0, 0]; // East for Month

  const isEmpty = range === '24 Hours';
  const hasData = !isEmpty;

  const getCoordinates = (index: number, value: number) => {
    const angle = (index * (360 / directions.length) - 90) * (Math.PI / 180);
    return {
      x: center + radius * value * Math.cos(angle),
      y: center + radius * value * Math.sin(angle)
    };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const dataPoints = data.map((val, i) => getCoordinates(i, val));
  const dataPath = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg 
      viewBox={`0 0 ${size} ${size}`} 
      className="w-full h-full drop-shadow-[0_0_20px_rgba(168,85,247,0.1)]"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Grid Lines */}
      {gridLevels.map((level, i) => {
        const points = directions.map((_, idx) => {
          const p = getCoordinates(idx, level);
          return `${p.x},${p.y}`;
        }).join(' ');
        return (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke="white"
            strokeOpacity={0.06}
            strokeWidth={1}
          />
        );
      })}

      {/* Axis Lines */}
      {directions.map((_, i) => {
        const p = getCoordinates(i, 1);
        return (
          <line
            key={i}
            x1={center} y1={center}
            x2={p.x} y2={p.y}
            stroke="white"
            strokeOpacity={0.06}
            strokeWidth={1}
          />
        );
      })}

      {/* Labels */}
      {directions.map((dir, i) => {
        const p = getCoordinates(i, 1.15);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            fill="#FFFFFF"
            fillOpacity={0.5}
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="middle"
            className="tracking-tighter"
          >
            {dir}
          </text>
        );
      })}

      {/* Data Pulse Line - Returning to Purple as per original "web view" style */}
      {hasData && (
        <motion.line
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5 }}
          x1={center} y1={center}
          x2={dataPoints[data.indexOf(1)].x} 
          y2={dataPoints[data.indexOf(1)].y}
          stroke="#00FF9C"
          strokeWidth={5}
          strokeLinecap="round"
          className="drop-shadow-[0_0_10px_rgba(0,255,156,0.5)]"
        />
      )}
    </svg>
  );
}

function RainFallDetail({ onClose }: { onClose: () => void }) {
  const [selectedRange, setSelectedRange] = useState('24 Hours');
  const ranges = ['24 Hours', '7 Days', '1 Month'];

  return (
    <div className="relative w-full rounded-[2rem] border border-white/10 bg-[#0A0E14]/90 p-6 md:p-8 overflow-hidden backdrop-blur-2xl">
      {/* Top Header Row */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="text-2xl md:text-[1.75rem] font-bold text-white tracking-tight leading-tight mb-1">Rain Fall</h3>
          <p className="text-white/40 text-[0.75rem] md:text-[0.85rem] font-medium uppercase tracking-widest">24-Hour Trend</p>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <p className="text-[#00FF9C] text-2xl md:text-[2.25rem] font-black leading-none tracking-tighter">
            0<span className="text-[0.8rem] md:text-[0.9rem] ml-0.5 font-bold uppercase">.mm</span>
          </p>
          <button 
            onClick={onClose}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:bg-white/10 active:scale-95 shadow-lg group ml-1"
          >
            <X className="w-4 h-4 md:w-5 md:h-5 text-white/40 group-hover:text-white" strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Unified Dropdown Row */}
      <div className="mb-8 max-w-[180px]">
        <div className="relative">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-5 py-3 text-[0.75rem] font-black text-[#00FF9C] uppercase tracking-wider outline-none appearance-none cursor-pointer hover:bg-white/[0.08] transition-colors"
          >
            {ranges.map(range => (
              <option key={range} value={range} className="bg-[#0A0E14] text-white uppercase">{range}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDown className="w-4 h-4 text-[#00FF9C]/60" />
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative w-full h-[220px] md:h-[300px] p-0 flex items-end justify-center overflow-hidden bg-white/[0.02] rounded-[1.5rem] border border-white/5">
        <WindSpeedChart />
        <div className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none border-t border-white/5 w-full pt-6">
          <p className="text-white/20 text-[0.7rem] md:text-xs font-black tracking-[0.3em] uppercase">No Recorded Data</p>
        </div>
      </div>
    </div>
  );
}
 

function RainFallChart() {
  return (
    <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
      {/* Y-Axis Labels */}
      {[0, 20, 40, 60, 80].map((val, i) => {
        const y = 250 - (val / 80) * 230;
        return (
          <g key={val}>
            <text x="30" y={y + 5} fill="white" fillOpacity="0.15" fontSize="11" fontWeight="bold" className="tabular-nums select-none">{val}</text>
            <line x1="60" y1={y} x2="780" y2={y} stroke="white" strokeOpacity="0.04" strokeDasharray="4 4" />
          </g>
        );
      })}
    </svg>
  );
}

export default DashboardV2Page;
