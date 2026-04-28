import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ChevronDown,
  Cloud,
  CloudRain,
  Droplets,
  Download,
  Leaf,
  Mail,
  Radio,
  Thermometer,
  Wind,
  X,
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { SENSOR_CARDS } from '../../constants/deviceConstants';
import { useLockBodyScroll } from '../../hooks/common/useLockBodyScroll';

/**
 * SensorCategoriesSection - DashboardV2Page-equivalent interactive sensor insights
 */

export function SensorCategoriesSection({ data }: { data?: any }) {
  const { addToast } = useToast();
  const [showWeatherDetails, setShowWeatherDetails] = useState(false);
  const [showSoilDetails, setShowSoilDetails] = useState(false);
  const [showAirDetails, setShowAirDetails] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const activeSensorsCount = data?.activeSensorsCount ?? 12;
  const isAnySensorModalOpen = showWeatherDetails || showSoilDetails || showAirDetails;

  const handleExport = async () => {
    try {
      setIsExporting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addToast({
        message: 'Data export started. You will receive an email shortly.',
        type: 'success'
      });
    } catch (error) {
      addToast({
        message: 'Failed to export data. Please try again.',
        type: 'error'
      });
    } finally {
      setIsExporting(false);
    }
  };

  useLockBodyScroll(isAnySensorModalOpen);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-cardBorder bg-cardBg/50 p-5 backdrop-blur-sm"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold tracking-tight text-textHeading md:text-2xl">Sensor Insights</h3>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="group flex items-center gap-2 rounded-xl border border-accentPrimary/20 bg-accentPrimary/5 px-4 py-2 text-sm font-bold text-accentPrimary transition-all hover:bg-accentPrimary/10 disabled:opacity-50"
            title="Export last 1 month data to email"
          >
            {isExporting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-accentPrimary border-t-transparent" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>Export Data</span>
          </button>
        </div>

        {/* Mobile View - 2x2 grid layout */}
        <div className="grid grid-cols-2 gap-3 sm:hidden">
          {/* Active Sensors Card */}
          <div className="relative flex h-full flex-col items-start justify-between rounded-3xl border border-white/10 bg-cardBg p-4">
            <span className="absolute right-4 top-3 text-xl font-bold text-[#00FF9C]">{activeSensorsCount}</span>
            <div className="mb-4 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-cardBg/50 border border-cardBorder">
              <Radio className="h-4 w-4 text-[#00FF9C]" />
            </div>
            <p className="text-sm font-semibold leading-tight">
              Active
              <br />
              Sensors
            </p>
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
              className={`flex h-full flex-col items-start justify-between rounded-3xl border border-white/10 bg-cardBg p-4 ${card.title === 'Weather Sensors' || card.title === 'Soil Sensors' || card.title === 'Air Sensors' ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}
            >
              <div className={`mb-4 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent}`}>
                <card.icon className="h-4 w-4 text-[#00FF9C]" />
              </div>
              <p className="text-sm font-semibold leading-tight">{card.title}</p>
            </div>
          ))}
        </div>

        {/* Web View - 2x2 grid layout */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-2 gap-4">
            {/* Active Sensors Card */}
            <div className="relative flex flex-col items-start justify-between rounded-3xl border border-white/10 bg-cardBg p-5">
              <span className="absolute right-5 top-4 text-2xl font-bold text-[#00FF9C]">{activeSensorsCount}</span>
              <div className="mb-5 inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-cardBg/50 border border-cardBorder">
                <Radio className="h-5 w-5 text-[#00FF9C]" />
              </div>
              <p className="text-lg font-semibold leading-tight lg:text-xl">
                Active
                <br />
                Sensors
              </p>
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
                className={`flex flex-col items-start justify-between rounded-3xl border border-white/10 bg-cardBg p-5 ${card.title === 'Weather Sensors' || card.title === 'Soil Sensors' || card.title === 'Air Sensors' ? 'cursor-pointer' : ''}`}
              >
                <div className={`mb-5 inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent}`}>
                  <card.icon className="h-5 w-5 text-[#00FF9C]" />
                </div>
                <p className="text-lg font-semibold leading-tight lg:text-xl">{card.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

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
    </>
  );
}

function WeatherSensorsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeMetric, setActiveMetric] = useState<string | null>(null);

  const weatherSensors = [
    { id: 'wind-dir', title: 'Wind Direction', value: '0', unit: '°', icon: Wind, color: '#00FF9C' },
    { id: 'wind-speed', title: 'Wind Speed', value: '0', unit: 'm/s', icon: Wind, color: '#00FF9C' },
    { id: 'rain', title: 'Rain Fall', value: '0.5', unit: 'mm', icon: CloudRain, color: '#00FF9C' },
  ];

  const activeSensorData = weatherSensors.find((s) => s.id === activeMetric);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-2 backdrop-blur-sm lg:pl-[116px] lg:pr-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="flex h-[94vh] w-full flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-bgCard shadow-[0_32px_64px_-15px_rgba(0,0,0,0.6)] md:max-w-[72rem] md:rounded-[2.5rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-5 md:px-6 md:py-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-[0.75rem] bg-[#00FF9C]/10 md:h-14 md:w-14 md:rounded-[1rem]">
              <Cloud className="h-5 w-5 text-[#00FF9C] md:h-7 md:w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold leading-tight tracking-tight text-textHeading md:text-[1.6rem]">Weather Sensors</h2>
              <p className="mt-0.5 whitespace-nowrap text-sm font-medium text-textHint md:text-[0.9rem]">3 active sensors</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 transition-opacity hover:opacity-50">
            <X className="h-5 w-5 text-[#00FF9C] md:h-6 md:w-6" strokeWidth={2.5} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-8 md:px-6 md:pt-8 md:pb-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
            {weatherSensors.map((sensor) => (
              <div key={sensor.id} className="w-full">
                <div
                  onClick={() => setActiveMetric(activeMetric === sensor.id ? null : sensor.id)}
                  className={`flex h-[12.5rem] w-full cursor-pointer flex-col justify-between rounded-[1.5rem] border p-5 transition-all md:h-[11rem] md:w-[16rem] md:rounded-[2rem] md:p-6 ${activeMetric === sensor.id ? 'border-[#00FF9C] bg-[#00FF9C]/5 shadow-[0_0_20px_rgba(0,255,156,0.2)]' : 'border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-[#00FF9C]/30 hover:bg-white/[0.05] active:scale-95'}`}
                >
                  <div>
                    <div
                      className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl md:mb-4 md:h-10 md:w-10 md:rounded-2xl"
                      style={{ backgroundColor: `${sensor.color}1A` }}
                    >
                      <sensor.icon className="h-6 w-6 md:h-5 md:w-5 text-[#00FF9C]" />
                    </div>
                    <p className="mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-[0.75rem] font-bold uppercase tracking-wider text-white/90 md:text-[0.7rem]" title={sensor.title}>
                      {sensor.title}
                    </p>
                    <p className="text-[2rem] font-black leading-none tracking-tighter text-white md:text-[1.75rem]">
                      {sensor.value}
                      <span className="ml-1 text-[0.8rem] font-bold tracking-normal text-white/60 md:text-[0.7rem]">{sensor.unit}</span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_10px_#00FF9C] md:h-2 md:w-2" />
                      <span className="text-xs font-bold uppercase tracking-widest leading-none text-[#00FF9C] md:text-[0.75rem]">Good</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${activeMetric === sensor.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                <AnimatePresence>
                  {activeMetric === sensor.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="w-full overflow-hidden lg:hidden"
                    >
                      {sensor.id === 'wind-dir' ? <WindDirectionDetail onClose={() => setActiveMetric(null)} /> : 
                       sensor.id === 'wind-speed' ? <WindSpeedDetail onClose={() => setActiveMetric(null)} /> :
                       <RainFallDetail onClose={() => setActiveMetric(null)} />}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeMetric && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="hidden w-full overflow-hidden lg:block"
              >
                {activeMetric === 'wind-dir' ? <WindDirectionDetail onClose={() => setActiveMetric(null)} /> : 
                 activeMetric === 'wind-speed' ? <WindSpeedDetail onClose={() => setActiveMetric(null)} /> :
                 <RainFallDetail onClose={() => setActiveMetric(null)} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-auto shrink-0 px-4 pb-4 md:px-6 md:pb-6">
          <div className="flex flex-col gap-0.5 rounded-[1rem] border border-[#00FF9C]/10 bg-[#00FF9C]/[0.02] px-6 py-3 md:rounded-[1.25rem] md:py-3">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_8px_rgba(0,255,156,0.6)]" />
              <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#00FF9C] md:text-[0.7rem]">All sensors are operational</p>
            </div>
            <p className="ml-4 text-[0.5rem] font-bold uppercase tracking-[0.1em] text-textHint md:text-[0.6rem]">Last updated: 12/10/2025, 1:08:07 PM</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function RangeDropdown({
  value,
  options,
  onChange,
  triggerClassName = '',
  menuClassName = '',
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  triggerClassName?: string;
  menuClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (event.target instanceof Node && !el.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={[
          'flex w-full items-center justify-between gap-3 border border-white/10 bg-cardBg text-[#00FF9C] outline-none transition-colors hover:bg-white/[0.06]',
          triggerClassName,
        ].join(' ')}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{value}</span>
        <ChevronDown className={['h-4 w-4 text-[#00FF9C]/70 transition-transform', open ? 'rotate-180' : ''].join(' ')} />
      </button>

      {open ? (
        <div
          role="listbox"
          className={[
            'absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0A0E14]/95 shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl',
            menuClassName,
          ].join(' ')}
        >
          {options.map((opt) => {
            const isActive = opt === value;
            return (
              <button
                key={opt}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={[
                  'flex w-full items-center px-4 py-2 text-left text-[0.75rem] font-black uppercase tracking-wider transition-colors',
                  isActive ? 'bg-[#00FF9C]/10 text-[#00FF9C]' : 'text-white/90 hover:bg-white/[0.06]',
                ].join(' ')}
              >
                {opt}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function SoilSensorsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeSensor, setActiveSensor] = useState<string | null>(null);

  const toggleSensor = (sensorTitle: string) => {
    setActiveSensor((prev) => (prev === sensorTitle ? null : sensorTitle));
  };

  const soilSensors = [
    { title: 'Nitrogen', value: '0', unit: 'mg/kg', icon: Activity, color: '#00FF9C' },
    { title: 'Organic Carbon', value: '0', unit: '%', icon: Wind, color: '#00FF9C' },
    { title: 'Soil Temp at Surface', value: '24.79', unit: '°C', icon: Thermometer, color: '#00FF9C' },
    { title: 'Phosphorus', value: '0', unit: 'mg/kg', icon: Activity, color: '#00FF9C' },
    { title: 'Potassium', value: '0', unit: 'mg/kg', icon: Wind, color: '#00FF9C' },
    { title: 'PH Level', value: '0', unit: 'pH', icon: Thermometer, color: '#00FF9C' },
    { title: 'Soil Moisture at Surface', value: '57.01', unit: '%', icon: Droplets, color: '#00FF9C' },
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-2 backdrop-blur-sm lg:pl-[116px] lg:pr-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="flex h-[94vh] w-full flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-bgCard shadow-[0_32px_64px_-15px_rgba(0,0,0,0.6)] md:max-w-[72rem] md:rounded-[2.5rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-5 md:px-6 md:py-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-[0.75rem] bg-[#00FF9C]/10 md:h-14 md:w-14 md:rounded-[1rem]">
              <Leaf className="h-6 w-6 text-[#00FF9C] md:h-7 md:w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold leading-tight tracking-tight text-white md:text-[1.6rem]">Soil Sensors</h2>
              <p className="mt-0.5 whitespace-nowrap text-sm font-medium text-white/75 md:text-[0.9rem]">
                {soilSensors.length} active sensors
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 transition-opacity hover:opacity-50">
            <X className="h-5 w-5 text-[#00FF9C] md:h-6 md:w-6" strokeWidth={2.5} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-8 md:px-6 md:pt-8 md:pb-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
            {firstRowSensors.map((sensor, idx) => (
              <div key={idx} className="w-full">
                <div
                  onClick={() => toggleSensor(sensor.title)}
                  className={`flex h-[12.5rem] w-full cursor-pointer flex-col justify-between rounded-[1.5rem] border p-5 transition-all md:h-[11rem] md:w-[16rem] md:rounded-[2rem] md:p-6 ${activeSensor === sensor.title ? 'border-[#00FF9C] bg-[#00FF9C]/5 shadow-[0_0_20px_rgba(0,255,156,0.2)]' : 'border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-[#00FF9C]/30 hover:bg-white/[0.05] active:scale-95'}`}
                >
                  <div>
                    <div
                      className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl md:mb-4 md:h-10 md:w-10 md:rounded-2xl"
                      style={{ backgroundColor: `${sensor.color}1A` }}
                    >
                      <sensor.icon
                        className="h-6 w-6 md:h-5 md:w-5 text-[#00FF9C]"
                      />
                    </div>
                    <p className="mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-[0.75rem] font-bold uppercase tracking-wider text-white/90 md:text-[0.7rem]" title={sensor.title}>
                      {sensor.title}
                    </p>
                    <p className="text-[2rem] font-black leading-none tracking-tighter text-white md:text-[1.75rem]">
                      {sensor.value}
                      <span className="ml-1 text-[0.8rem] font-bold tracking-normal text-white/60 md:text-[0.7rem]">{sensor.unit}</span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_10px_#00FF9C] md:h-2 md:w-2" />
                      <span className="text-[0.65rem] font-bold uppercase tracking-widest leading-none text-[#00FF9C] md:text-[0.75rem]">Good</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${activeSensor === sensor.title ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                <AnimatePresence>
                  {activeSensor === sensor.title && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="w-full overflow-hidden lg:hidden"
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
                initial={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24, marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                className="hidden w-full overflow-hidden lg:block"
              >
                <SoilSensorDetail sensor={activeSensorData} onClose={() => setActiveSensor(null)} />
              </motion.div>
            )}
          </AnimatePresence>

          {secondRowSensors.length > 0 ? (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
              {secondRowSensors.map((sensor, idx) => (
                <div key={idx} className="w-full">
                  <div
                    onClick={() => toggleSensor(sensor.title)}
                    className={`flex h-[12.5rem] w-full cursor-pointer flex-col justify-between rounded-[1.5rem] border p-5 transition-all md:h-[11rem] md:w-[16rem] md:rounded-[2rem] md:p-6 ${activeSensor === sensor.title ? 'border-[#00FF9C] bg-[#00FF9C]/5 shadow-[0_0_20px_rgba(0,255,156,0.2)]' : 'border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-[#00FF9C]/30 hover:bg-white/[0.05] active:scale-95'}`}
                  >
                    <div>
                      <div
                        className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl md:mb-4 md:h-10 md:w-10 md:rounded-2xl"
                        style={{ backgroundColor: `${sensor.color}1A` }}
                      >
                        <sensor.icon
                          className="h-6 w-6 md:h-5 md:w-5 text-[#00FF9C]"
                        />
                      </div>
                      <p className="mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-[0.75rem] font-bold uppercase tracking-wider text-white/90 md:text-[0.7rem]" title={sensor.title}>
                        {sensor.title}
                      </p>
                      <p className="text-[2rem] font-black leading-none tracking-tighter text-white md:text-[1.75rem]">
                        {sensor.value}
                        <span className="ml-1 text-[0.8rem] font-bold tracking-normal text-white/60 md:text-[0.7rem]">{sensor.unit}</span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_10px_#00FF9C] md:h-2 md:w-2" />
                        <span className="text-[0.65rem] font-bold uppercase tracking-widest leading-none text-[#00FF9C] md:text-[0.75rem]">Good</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${activeSensor === sensor.title ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  <AnimatePresence>
                    {activeSensor === sensor.title && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="w-full overflow-hidden lg:hidden"
                      >
                        <SoilSensorDetail sensor={sensor} onClose={() => setActiveSensor(null)} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          ) : null}

          <AnimatePresence mode="wait">
            {activeSensor && activeSensorData && activeSensorIndex >= 4 && (
              <motion.div
                key="desktop-details-second-row"
                initial={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24, marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                className="hidden w-full overflow-hidden lg:block"
              >
                <SoilSensorDetail sensor={activeSensorData} onClose={() => setActiveSensor(null)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-auto shrink-0 px-4 pb-4 md:px-6 md:pb-6">
          <div className="flex flex-col gap-0.5 rounded-[1rem] border border-[#00FF9C]/10 bg-[#00FF9C]/[0.02] px-6 py-3 md:rounded-[1.25rem] md:py-3">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_8px_rgba(0,255,156,0.6)]" />
              <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#00FF9C] md:text-[0.7rem]">All sensors are operational</p>
            </div>
            <p className="ml-4 text-[0.5rem] font-bold uppercase tracking-[0.1em] text-textHint md:text-[0.6rem]">Last updated: 12/10/2025, 1:08:07 PM</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SoilSensorDetail({ sensor, onClose }: { sensor: any; onClose: () => void }) {
  const [selectedRange, setSelectedRange] = useState('24 Hours');
  const ranges = ['24 Hours', '7 Days', '1 Month'];

  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40 p-5 md:rounded-[2rem] md:px-6 md:pt-6 md:pb-4">
      <div className="mb-4 flex w-full items-start justify-between md:mb-6">
        <div className="z-20 flex flex-col items-start gap-3 md:gap-5">
          <div className="text-left">
            <h3 className="mb-1 text-2xl font-bold leading-none tracking-tight text-textHeading md:mb-1 md:text-xl">{sensor.displayName || sensor.title}</h3>
            <p className="text-[0.6rem] font-medium tracking-wide text-white/70 md:text-xs">24-Hour Trend</p>
          </div>

          <div className="hidden flex-wrap gap-3 md:flex">
            {ranges.map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`rounded-full px-5 py-1.5 text-xs font-bold transition-all ${selectedRange === range ? 'bg-[#00FF9C]/10 text-[#00FF9C] border border-[#00FF9C]/30 shadow-[0_0_15px_rgba(0,255,156,0.15)]' : 'text-textHint border border-white/5 hover:border-white/20'}`}
              >
                {range}
              </button>
            ))}
          </div>

          <div className="relative w-full min-w-[130px] md:hidden">
            <RangeDropdown
              value={selectedRange}
              options={ranges}
              onChange={setSelectedRange}
              triggerClassName="cursor-pointer rounded-full px-4 py-2 text-[0.7rem] font-black uppercase tracking-wider"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex flex-col items-end">
            <p className="text-3xl font-black leading-none tracking-tighter md:text-3xl text-[#00FF9C]">
              {sensor.value}
              <span className="ml-1 text-[1rem] font-extrabold text-[#00FF9C]">{sensor.unit}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 transition-all hover:bg-red-500/20 active:scale-95 md:h-9 md:w-9"
          >
            <X className="h-4 w-4 text-red-500 md:h-4 md:w-4" strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className="relative mt-6 flex h-[200px] w-full items-end justify-center overflow-hidden p-0 md:mt-8 md:h-[210px]">
        <WindSpeedChart />
        <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center md:bottom-2">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/70 md:text-[0.75rem]">No Data</p>
        </div>
      </div>
    </div>
  );
}

function AirSensorDetail({ sensor, onClose }: { sensor: any; onClose: () => void }) {
  const [selectedRange, setSelectedRange] = useState('24 Hours');
  const ranges = ['24 Hours', '7 Days', '1 Month'];

  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40 p-5 md:rounded-[2rem] md:px-6 md:pt-6 md:pb-4">
      <div className="mb-4 flex w-full items-start justify-between md:mb-6">
        <div className="z-20 flex flex-col items-start gap-3 md:gap-5">
          <div className="text-left">
            <h3 className="mb-1 text-2xl font-bold leading-none tracking-tight text-textHeading md:mb-1 md:text-xl">{sensor.displayName || sensor.title}</h3>
            <p className="text-[0.6rem] font-medium tracking-wide text-white/70 md:text-xs">24-Hour Trend</p>
          </div>

          <div className="hidden flex-wrap gap-3 md:flex">
            {ranges.map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`rounded-full px-5 py-1.5 text-xs font-bold transition-all ${selectedRange === range ? 'bg-[#00FF9C]/10 text-[#00FF9C] border border-[#00FF9C]/30 shadow-[0_0_15px_rgba(0,255,156,0.15)]' : 'text-textHint border border-white/5 hover:border-white/20'}`}
              >
                {range}
              </button>
            ))}
          </div>

          <div className="relative w-full min-w-[130px] md:hidden">
            <RangeDropdown
              value={selectedRange}
              options={ranges}
              onChange={setSelectedRange}
              triggerClassName="cursor-pointer rounded-full px-4 py-2 text-[0.7rem] font-black uppercase tracking-wider"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex flex-col items-end">
            <p className="text-3xl font-black leading-none tracking-tighter md:text-3xl text-[#00FF9C]">
              {sensor.value}
              <span className="ml-1 text-[1rem] font-extrabold text-[#00FF9C]">{sensor.unit}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 transition-all hover:bg-red-500/20 active:scale-95 md:h-9 md:w-9"
          >
            <X className="h-4 w-4 text-red-500 md:h-4 md:w-4" strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className="relative mt-6 flex h-[200px] w-full items-end justify-center overflow-hidden p-0 md:mt-8 md:h-[210px]">
        <WindSpeedChart />
        <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center md:bottom-2">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/70 md:text-[0.75rem]">No Data</p>
        </div>
      </div>
    </div>
  );
}

function AirSensorsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeSensor, setActiveSensor] = useState<string | null>(null);

  const airSensors = [
    { id: 'pm25', title: 'PM 2.5', value: '7', unit: 'µg/m³', icon: Activity, color: '#00FF9C' },
    { id: 'pm10', title: 'PM 10', value: '7', unit: 'µg/m³', icon: Activity, color: '#00FF9C' },
    { id: 'co2', title: 'CO2', displayName: <>CO<sub>2</sub></>, value: '0', unit: 'ppm', icon: Cloud, color: '#00FF9C' },
    { id: 'temp', title: 'Air Temp', value: '0', unit: '°C', icon: Thermometer, color: '#00FF9C' },
    { id: 'hum', title: 'Humidity', value: '0', unit: '%', icon: Droplets, color: '#00FF9C' },
    { id: 'pres', title: 'Air Pressure', value: '999', unit: 'hPa', icon: Activity, color: '#00FF9C' },
    { id: 'so2', title: 'SO2', displayName: <>SO<sub>2</sub></>, value: '0.47', unit: 'ppm', icon: Activity, color: '#00FF9C' },
    { id: 'no2', title: 'NO2', displayName: <>NO<sub>2</sub></>, value: '0.18', unit: 'ppm', icon: Activity, color: '#00FF9C' },
    { id: 'o3', title: 'O3', value: '0.02', unit: 'ppm', icon: Activity, color: '#00FF9C' },
    { id: 'leaf', title: 'Leaf Wetness', value: '0', unit: '%', icon: Leaf, color: '#00FF9C' },
  ];

  const row1 = airSensors.slice(0, 4);
  const row2 = airSensors.slice(4, 8);
  const row3 = airSensors.slice(8);
  const activeSensorData = airSensors.find((sensor) => sensor.id === activeSensor);
  const activeSensorIndex = airSensors.findIndex((sensor) => sensor.id === activeSensor);

  const toggleSensor = (id: string) => {
    setActiveSensor(activeSensor === id ? null : id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm lg:pl-[116px] lg:pr-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="flex h-[94vh] w-full flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-bgCard shadow-[0_32px_64px_-15px_rgba(0,0,0,0.6)] md:max-w-[72rem] md:rounded-[2.5rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-5 md:px-6 md:py-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-[0.75rem] bg-[#00FF9C]/10 md:h-14 md:w-14 md:rounded-[1rem]">
              <Wind className="h-5 w-5 text-[#00FF9C] md:h-7 md:w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold leading-tight tracking-tight text-textHeading md:text-[1.6rem]">Air Sensors</h2>
              <p className="mt-0.5 whitespace-nowrap text-sm font-medium text-textHint md:text-[0.9rem]">10 active sensors</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 transition-opacity hover:opacity-50">
            <X className="h-5 w-5 text-[#00FF9C] md:h-6 md:w-6" strokeWidth={2.5} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-8 md:px-6 md:pt-8 md:pb-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
            {row1.map((sensor, idx) => (
              <div key={idx} className="w-full">
                <div
                  onClick={() => toggleSensor(sensor.id)}
                  className={`flex h-[12.5rem] w-full cursor-pointer flex-col justify-between rounded-[1.5rem] border p-5 transition-all md:h-[11rem] md:w-[16rem] md:rounded-[2rem] md:p-6 ${activeSensor === sensor.id ? 'border-[#00FF9C] bg-[#00FF9C]/5 shadow-[0_0_20px_rgba(0,255,156,0.2)]' : 'border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-[#00FF9C]/30 hover:bg-white/[0.05] active:scale-95'}`}
                >
                  <div>
                    <div
                      className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl md:mb-4 md:h-10 md:w-10 md:rounded-2xl"
                      style={{ backgroundColor: `${sensor.color}1A` }}
                    >
                      <sensor.icon className="h-6 w-6 md:h-5 md:w-5 text-[#00FF9C]" />
                    </div>
                    <p className="mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-[0.75rem] font-bold uppercase tracking-wider text-white/90 md:text-[0.7rem]" title={sensor.title}>
                      {sensor.displayName || sensor.title}
                    </p>
                    <p className="text-[2rem] font-black leading-none tracking-tighter text-white md:text-[1.75rem]">
                      {sensor.value}
                      <span className="ml-1 text-[0.8rem] font-bold tracking-normal text-white/60 md:text-[0.7rem]">{sensor.unit}</span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_10px_#00FF9C] md:h-2 md:w-2" />
                      <span className="text-[0.65rem] font-bold uppercase tracking-widest leading-none text-[#00FF9C] md:text-[0.75rem]">Good</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${activeSensor === sensor.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                <AnimatePresence>
                  {activeSensor === sensor.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="w-full overflow-hidden lg:hidden"
                    >
                      <AirSensorDetail sensor={sensor} onClose={() => setActiveSensor(null)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeSensor && activeSensorData && activeSensorIndex >= 0 && activeSensorIndex < 4 && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24, marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                className="hidden overflow-hidden lg:block"
              >
                <AirSensorDetail sensor={activeSensorData} onClose={() => setActiveSensor(null)} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
            {row2.map((sensor, idx) => (
              <div key={idx} className="w-full">
                <div
                  onClick={() => toggleSensor(sensor.id)}
                  className={`flex h-[12.5rem] w-full cursor-pointer flex-col justify-between rounded-[1.5rem] border p-5 transition-all md:h-[11rem] md:w-[16rem] md:rounded-[2rem] md:p-6 ${activeSensor === sensor.id ? 'border-[#00FF9C] bg-[#00FF9C]/5 shadow-[0_0_20px_rgba(0,255,156,0.2)]' : 'border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-[#00FF9C]/30 hover:bg-white/[0.05] active:scale-95'}`}
                >
                  <div>
                    <div
                      className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl md:mb-4 md:h-10 md:w-10 md:rounded-2xl"
                      style={{ backgroundColor: `${sensor.color}1A` }}
                    >
                      <sensor.icon className="h-6 w-6 md:h-5 md:w-5 text-[#00FF9C]" />
                    </div>
                    <p className="mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-[0.75rem] font-bold uppercase tracking-wider text-white/90 md:text-[0.7rem]" title={sensor.title}>
                      {sensor.displayName || sensor.title}
                    </p>
                    <p className="text-[2rem] font-black leading-none tracking-tighter text-white md:text-[1.75rem]">
                      {sensor.value}
                      <span className="ml-1 text-[0.8rem] font-bold tracking-normal text-white/60 md:text-[0.7rem]">{sensor.unit}</span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_10px_#00FF9C] md:h-2 md:w-2" />
                      <span className="text-[0.65rem] font-bold uppercase tracking-widest leading-none text-[#00FF9C] md:text-[0.75rem]">Good</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${activeSensor === sensor.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                <AnimatePresence>
                  {activeSensor === sensor.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="w-full overflow-hidden lg:hidden"
                    >
                      <AirSensorDetail sensor={sensor} onClose={() => setActiveSensor(null)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeSensor && activeSensorData && activeSensorIndex >= 4 && activeSensorIndex < 8 && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24, marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                className="hidden overflow-hidden lg:block"
              >
                <AirSensorDetail sensor={activeSensorData} onClose={() => setActiveSensor(null)} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
            {row3.map((sensor, idx) => (
              <div key={idx} className="w-full">
                <div
                  onClick={() => toggleSensor(sensor.id)}
                  className={`flex h-[12.5rem] w-full cursor-pointer flex-col justify-between rounded-[1.5rem] border p-5 transition-all md:h-[11rem] md:w-[16rem] md:rounded-[2rem] md:p-6 ${activeSensor === sensor.id ? 'border-[#00FF9C] bg-[#00FF9C]/5 shadow-[0_0_20px_rgba(0,255,156,0.2)]' : 'border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-[#00FF9C]/30 hover:bg-white/[0.05] active:scale-95'}`}
                >
                  <div>
                    <div
                      className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl md:mb-4 md:h-10 md:w-10 md:rounded-2xl"
                      style={{ backgroundColor: `${sensor.color}1A` }}
                    >
                      <sensor.icon className="h-6 w-6 md:h-5 md:w-5 text-[#00FF9C]" />
                    </div>
                    <p className="mb-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-[0.75rem] font-bold uppercase tracking-wider text-white/90 md:text-[0.7rem]" title={sensor.title}>
                      {sensor.displayName || sensor.title}
                    </p>
                    <p className="text-[2rem] font-black leading-none tracking-tighter text-white md:text-[1.75rem]">
                      {sensor.value}
                      <span className="ml-1 text-[0.8rem] font-bold tracking-normal text-white/60 md:text-[0.7rem]">{sensor.unit}</span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_10px_#00FF9C] md:h-2 md:w-2" />
                      <span className="text-[0.65rem] font-bold uppercase tracking-widest leading-none text-[#00FF9C] md:text-[0.75rem]">Good</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${activeSensor === sensor.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                <AnimatePresence>
                  {activeSensor === sensor.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="w-full overflow-hidden lg:hidden"
                    >
                      <AirSensorDetail sensor={sensor} onClose={() => setActiveSensor(null)} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeSensor && activeSensorData && activeSensorIndex >= 8 && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24, marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                className="hidden overflow-hidden lg:block"
              >
                <AirSensorDetail sensor={activeSensorData} onClose={() => setActiveSensor(null)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-auto shrink-0 px-4 pb-4 md:px-6 md:pb-6">
          <div className="flex flex-col gap-0.5 rounded-[1rem] border border-[#00FF9C]/10 bg-[#00FF9C]/[0.02] px-6 py-3 md:rounded-[1.25rem] md:py-3">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_8px_rgba(0,255,156,0.6)]" />
              <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#00FF9C] md:text-[0.7rem]">All sensors are operational</p>
            </div>
            <p className="ml-4 text-[0.5rem] font-bold uppercase tracking-[0.1em] text-textHint md:text-[0.6rem]">Last updated: 12/10/2025, 1:08:07 PM</p>
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
    <div className="relative flex w-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40 p-3 md:rounded-[2rem] md:px-5 md:pt-5 md:pb-3">
      <div className="mb-2 flex w-full items-start justify-between md:mb-4">
        <div className="z-20 flex flex-col items-start gap-3 md:gap-5">
          <div className="text-left">
            <h3 className="mb-1 text-2xl font-bold leading-none tracking-tight text-textHeading md:mb-1 md:text-xl">Wind Direction</h3>
            <p className="text-[0.6rem] font-medium tracking-wide text-textHint md:text-xs">Direction Distribution</p>
          </div>

          <div className="hidden flex-wrap gap-3 md:flex">
            {ranges.map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`rounded-full px-5 py-1.5 text-xs font-bold transition-all ${selectedRange === range ? 'bg-[#00FF9C]/10 text-[#00FF9C] border border-[#00FF9C]/30 shadow-[0_0_15px_rgba(0,255,156,0.15)]' : 'text-textHint border border-white/5 hover:border-white/20'}`}
              >
                {range}
              </button>
            ))}
          </div>

          <div className="relative w-full min-w-[140px] md:hidden">
            <RangeDropdown
              value={selectedRange}
              options={ranges}
              onChange={setSelectedRange}
              triggerClassName="cursor-pointer rounded-full px-5 py-2.5 text-[0.75rem] font-black uppercase tracking-wider"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex flex-col items-end">
            <p className="text-3xl font-black leading-none tracking-tighter text-[#00FF9C] md:text-4xl">N</p>
            <div className="mt-0.5 flex items-center gap-1.5 md:mt-0.5">
              <span className="text-[0.8rem] font-bold text-textHint md:text-sm">0°</span>
              <Wind className="h-3 w-3 text-[#00FF9C]/40 md:h-4 md:w-4" />
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 transition-all hover:bg-red-500/20 active:scale-95 md:h-9 md:w-9"
          >
            <X className="h-5 w-5 text-red-500 md:h-4 md:w-4" strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className="relative mx-auto mt-2 flex aspect-square w-full max-w-[180px] items-center justify-center md:mt-0 md:max-w-[280px]">
        <WindDirectionRadar key={selectedRange} range={selectedRange} />
      </div>
    </div>
  );
}

function WindSpeedDetail({ onClose }: { onClose: () => void }) {
  const [selectedRange, setSelectedRange] = useState('24 Hours');
  const ranges = ['24 Hours', '7 Days', '1 Month'];

  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40 p-4 md:rounded-[2rem] md:px-5 md:pt-5 md:pb-3">
      <div className="mb-3 flex w-full items-start justify-between md:mb-4">
        <div className="z-20 flex flex-col items-start gap-3 md:gap-5">
          <div className="text-left">
            <h3 className="mb-1 text-2xl font-bold leading-none tracking-tight text-textHeading md:mb-1 md:text-xl">Wind Speed</h3>
            <p className="text-[0.6rem] font-medium tracking-wide text-white/70 md:text-xs">24-Hour Trend</p>
          </div>

          <div className="hidden flex-wrap gap-3 md:flex">
            {ranges.map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`rounded-full px-5 py-1.5 text-xs font-bold transition-all ${selectedRange === range ? 'bg-[#00FF9C]/10 text-[#00FF9C] border border-[#00FF9C]/30 shadow-[0_0_15px_rgba(0,255,156,0.15)]' : 'text-textHint border border-white/5 hover:border-white/20'}`}
              >
                {range}
              </button>
            ))}
          </div>

          <div className="relative w-full min-w-[140px] md:hidden">
            <RangeDropdown
              value={selectedRange}
              options={ranges}
              onChange={setSelectedRange}
              triggerClassName="cursor-pointer rounded-full px-5 py-2.5 text-[0.75rem] font-black uppercase tracking-wider"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex flex-col items-end">
            <p className="text-3xl font-black leading-none tracking-tighter text-[#00FF9C] md:text-3xl">0<span className="ml-1 text-[1rem] font-extrabold text-[#00FF9C]">m/s</span></p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 transition-all hover:bg-red-500/20 active:scale-95 md:h-9 md:w-9"
          >
            <X className="h-5 w-5 text-red-500 md:h-4 md:w-4" strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className="relative mt-0 flex h-[200px] w-full items-end justify-center overflow-hidden p-0 md:mt-1 md:h-[210px]">
        <WindSpeedChart />
        <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center md:bottom-2">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/70 md:text-[0.75rem]">No Data</p>
        </div>
      </div>
    </div>
  );
}

function WindSpeedChart() {
  return (
    <svg className="h-full w-full" viewBox="0 0 800 300" preserveAspectRatio="none">
      {[0, 20, 40, 60, 80].map((val) => {
        const y = 250 - (val / 80) * 230;
        return (
          <g key={val}>
            <text x="30" y={y + 5} fill="white" fillOpacity="0.6" fontSize="11" fontWeight="bold" className="tabular-nums select-none">{val}</text>
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

  const data =
    range === '24 Hours'
      ? [0, 0, 0, 0, 0, 0, 0, 0]
      : range === '7 Days'
        ? [1, 0, 0, 0, 0, 0, 0, 0]
        : [0, 0, 1, 0, 0, 0, 0, 0];

  const isEmpty = range === '24 Hours';
  const hasData = !isEmpty;

  const getCoordinates = (index: number, value: number) => {
    const angle = (index * (360 / directions.length) - 90) * (Math.PI / 180);
    return {
      x: center + radius * value * Math.cos(angle),
      y: center + radius * value * Math.sin(angle),
    };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const dataPoints = data.map((val, i) => getCoordinates(i, val));

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full drop-shadow-[0_0_34px_rgba(0,255,156,0.2)]" preserveAspectRatio="xMidYMid meet">
      {gridLevels.map((level, i) => {
        const points = directions.map((_, idx) => {
          const p = getCoordinates(idx, level);
          return `${p.x},${p.y}`;
        }).join(' ');
        return (
          <polygon key={i} points={points} fill="none" stroke="white" strokeOpacity={0.18} strokeWidth={1.4} />
        );
      })}

      {directions.map((_, i) => {
        const p = getCoordinates(i, 1);
        return (
          <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="white" strokeOpacity={0.18} strokeWidth={1.4} />
        );
      })}

      {directions.map((dir, i) => {
        const p = getCoordinates(i, 1.15);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            fill="#FFFFFF"
            fillOpacity={0.92}
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

      {hasData && (
        <motion.line
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5 }}
          x1={center}
          y1={center}
          x2={dataPoints[data.indexOf(1)].x}
          y2={dataPoints[data.indexOf(1)].y}
          stroke="#00FF9C"
          strokeWidth={6}
          strokeLinecap="round"
          className="drop-shadow-[0_0_22px_rgba(0,255,156,0.95)]"
        />
      )}
    </svg>
  );
}

function RainFallDetail({ onClose }: { onClose: () => void }) {
  const [selectedRange, setSelectedRange] = useState('24 Hours');
  const ranges = ['24 Hours', '7 Days', '1 Month'];

  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40 p-5 md:rounded-[2rem] md:px-5 md:pt-5 md:pb-3">
      <div className="mb-4 flex w-full items-start justify-between md:mb-5">
        <div className="z-20 flex flex-col items-start gap-3 md:gap-5">
          <div className="text-left">
            <h3 className="mb-0.5 text-2xl font-bold leading-none tracking-tight text-textHeading md:mb-1 md:text-xl">Rain Fall</h3>
            <p className="text-[0.5rem] font-medium tracking-wide text-white/70 md:text-xs">24-Hour Trend</p>
          </div>

          <div className="hidden flex-wrap gap-3 md:flex">
            {ranges.map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`rounded-full px-5 py-1.5 text-xs font-bold transition-all ${selectedRange === range ? 'bg-[#00FF9C]/10 text-[#00FF9C] border border-[#00FF9C]/30 shadow-[0_0_15px_rgba(0,255,156,0.15)]' : 'text-textHint border border-white/5 hover:border-white/20'}`}
              >
                {range}
              </button>
            ))}
          </div>

          <div className="relative w-full min-w-[140px] md:hidden">
            <RangeDropdown
              value={selectedRange}
              options={ranges}
              onChange={setSelectedRange}
              triggerClassName="cursor-pointer rounded-full px-5 py-2.5 text-[0.75rem] font-black uppercase tracking-wider"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex flex-col items-end">
            <p className="text-3xl font-black leading-none tracking-tighter text-[#00FF9C] md:text-3xl">0<span className="ml-1 text-[1rem] font-extrabold text-[#00FF9C]">mm</span></p>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 transition-all hover:bg-red-500/20 active:scale-95 md:h-9 md:w-9"
          >
            <X className="h-4 w-4 text-red-500 md:h-4 md:w-4" strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className="relative mt-0 flex h-[200px] w-full items-end justify-center overflow-hidden p-0 md:mt-1 md:h-[210px]">
        <RainFallChart />
        <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center md:bottom-2">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/70 md:text-[0.75rem]">No Data</p>
        </div>
      </div>
    </div>
  );
}

function RainFallChart() {
  return (
    <svg className="h-full w-full" viewBox="0 0 800 300" preserveAspectRatio="none">
      {[0, 20, 40, 60, 80].map((val) => {
        const y = 250 - (val / 80) * 230;
        return (
          <g key={val}>
            <text x="30" y={y + 5} fill="white" fillOpacity="0.6" fontSize="11" fontWeight="bold" className="tabular-nums select-none">{val}</text>
            <line x1="60" y1={y} x2="780" y2={y} stroke="white" strokeOpacity="0.04" strokeDasharray="4 4" />
          </g>
        );
      })}
    </svg>
  );
}
