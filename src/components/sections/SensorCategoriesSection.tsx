import React, { useState } from 'react';
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
        className="rounded-3xl border border-white/10 bg-cardBg p-5 backdrop-blur-xl xl:col-span-2"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-3xl font-bold">Sensor Insights</h3>
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
            <div className="mb-4 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10">
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
              <div className="mb-5 inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10">
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

  const toggleMetric = (metric: string) => {
    setActiveMetric((prev) => (prev === metric ? null : metric));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-[1vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="flex max-h-[98vh] w-[99vw] flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-bgCard shadow-[0_32px_64px_-15px_rgba(0,0,0,0.6)] md:max-w-[85rem] md:rounded-[2.5rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5 md:px-6 md:py-3">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-[0.75rem] bg-[#00FF9C]/10 md:h-14 md:w-14 md:rounded-[1rem]">
              <Cloud className="h-5 w-5 text-[#00FF9C] md:h-7 md:w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold leading-tight tracking-tight text-textHeading md:text-[1.6rem]">Weather Sensors</h2>
              <p className="mt-0.5 whitespace-nowrap text-[0.75rem] font-medium text-textHint md:text-[0.9rem]">3 active sensors</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 transition-opacity hover:opacity-50">
            <X className="h-5 w-5 text-red-500/80 md:h-6 md:w-6" strokeWidth={2.5} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2 md:px-6 md:py-4">
          <div className="flex flex-col justify-start gap-4 md:flex-row md:flex-wrap md:gap-5">
            <div className="w-full md:w-auto">
              <div
                onClick={() => toggleMetric('Wind Direction')}
                className={`flex h-[12.5rem] w-full cursor-pointer flex-col justify-between rounded-[1.5rem] border px-6 py-5 transition-all md:h-[13rem] md:w-[16rem] md:rounded-[2rem] md:px-8 md:py-6 ${activeMetric === 'Wind Direction' ? 'border-[#00FF9C] bg-[#00FF9C]/5 shadow-[0_0_20px_rgba(0,255,156,0.2)]' : 'border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-[#00FF9C]/30 hover:bg-white/[0.05] active:scale-95'}`}
              >
                <div>
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl md:mb-6 md:rounded-2xl"
                    style={{ backgroundColor: '#A855F71A' }}
                  >
                    <Wind className={`h-6 w-6 ${activeMetric === 'Wind Direction' ? 'text-[#00FF9C]' : 'text-[#A855F7]'}`} />
                  </div>
                  <p className="mb-1 text-[0.75rem] font-bold uppercase tracking-wider text-white/90 md:text-[0.7rem]">Wind Direction</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-[1.2rem] font-black leading-none tracking-tight text-white md:text-[1.4rem]">0</span>
                    <span className="mb-1 text-[0.6rem] font-extrabold tracking-wider text-white/50 md:text-[0.8rem]">°</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_10px_#00FF9C] md:h-2 md:w-2" />
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest leading-none text-[#00FF9C] md:text-[0.75rem]">Good</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${activeMetric === 'Wind Direction' ? 'rotate-180' : ''}`} />
                </div>
              </div>

              <AnimatePresence>
                {activeMetric === 'Wind Direction' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="w-full overflow-hidden md:hidden"
                  >
                    <WindDirectionDetail onClose={() => setActiveMetric(null)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              onClick={() => toggleMetric('Wind Speed')}
              className={`flex h-[12.5rem] w-full cursor-pointer flex-col justify-between rounded-[1.5rem] border px-6 py-5 transition-all md:h-[13rem] md:w-[16rem] md:rounded-[2rem] md:px-8 md:py-6 ${activeMetric === 'Wind Speed' ? 'border-[#22D3EE] bg-[#22D3EE]/5 shadow-[0_0_20px_rgba(34,211,238,0.2)]' : 'border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-[#22D3EE]/30 hover:bg-white/[0.05] active:scale-95'}`}
            >
              <div>
                <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl md:mb-6 md:rounded-2xl"
                  style={{ backgroundColor: '#22D3EE1A' }}
                >
                  <Wind className={`h-6 w-6 ${activeMetric === 'Wind Speed' ? 'text-[#00FF9C]' : 'text-[#22D3EE]'}`} />
                </div>
                <p className="mb-1 text-[0.75rem] font-bold uppercase tracking-wider text-white/90 md:text-[0.7rem]">Wind Speed</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-[1.2rem] font-black leading-none tracking-tight text-white md:text-[1.4rem]">0</span>
                  <span className="mb-1 text-[0.6rem] font-extrabold tracking-wider text-white/50 md:text-[0.8rem]">m/s</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_10px_#00FF9C] md:h-2 md:w-2" />
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest leading-none text-[#00FF9C] md:text-[0.75rem]">Good</span>
                </div>
                <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${activeMetric === 'Wind Speed' ? 'rotate-180' : ''}`} />
              </div>
            </div>

            <AnimatePresence>
              {activeMetric === 'Wind Speed' && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="w-full overflow-hidden md:hidden"
                >
                  <WindSpeedDetail onClose={() => setActiveMetric(null)} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="w-full md:w-auto">
              <div
                onClick={() => toggleMetric('Rain Fall')}
                className={`flex h-[12.5rem] w-full cursor-pointer flex-col justify-between rounded-[1.5rem] border px-6 py-5 transition-all md:h-[13rem] md:w-[16rem] md:rounded-[2rem] md:px-8 md:py-6 ${activeMetric === 'Rain Fall' ? 'border-[#00FF9C] bg-[#00FF9C]/5 shadow-[0_0_20px_rgba(0,255,156,0.2)]' : 'border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-[#00FF9C]/30 hover:bg-white/[0.05] active:scale-95'}`}
              >
                <div>
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl md:mb-6 md:rounded-2xl"
                    style={{ backgroundColor: '#00FF9C1A' }}
                  >
                    <CloudRain className={`h-6 w-6 ${activeMetric === 'Rain Fall' ? 'text-[#00FF9C]' : 'text-[#00FF9C]/80'}`} />
                  </div>
                  <p className="mb-1 text-[0.75rem] font-bold uppercase tracking-wider text-white/90 md:text-[0.7rem]">Rain Fall</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-[1.2rem] font-black leading-none tracking-tight text-white md:text-[1.4rem]">0.5</span>
                    <span className="mb-1 text-[0.6rem] font-extrabold tracking-wider text-white/50 md:text-[0.8rem]">mm</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_10px_#00FF9C] md:h-2 md:w-2" />
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest leading-none text-[#00FF9C] md:text-[0.75rem]">Good</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${activeMetric === 'Rain Fall' ? 'rotate-180' : ''}`} />
                </div>
              </div>

              <AnimatePresence>
                {activeMetric === 'Rain Fall' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="w-full overflow-hidden md:hidden"
                  >
                    <RainFallDetail onClose={() => setActiveMetric(null)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeMetric === 'Wind Direction' && (
              <motion.div
                key="wind-direction-details"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="hidden w-full overflow-hidden md:block"
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
                className="hidden w-full overflow-hidden md:block"
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
                className="hidden w-full overflow-hidden md:block"
              >
                <RainFallDetail onClose={() => setActiveMetric(null)} />
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

function SoilSensorsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeSensor, setActiveSensor] = useState<string | null>(null);

  const toggleSensor = (sensorTitle: string) => {
    setActiveSensor((prev) => (prev === sensorTitle ? null : sensorTitle));
  };

  const soilSensors = [
    { title: 'Nitrogen', value: '0', unit: 'mg/kg', icon: Activity, color: '#00FF9C' },
    { title: 'Organic Carbon', value: '0', unit: '%', icon: Wind, color: '#FCD34D' },
    { title: 'Soil Temperature at Surface', value: '24.79', unit: '°C', icon: Thermometer, color: '#F87171' },
    { title: 'Phosphorus', value: '0', unit: 'mg/kg', icon: Activity, color: '#22D3EE' },
    { title: 'Potassium', value: '0', unit: 'mg/kg', icon: Wind, color: '#F59E0B' },
    { title: 'PH Level', value: '0', unit: 'pH', icon: Thermometer, color: '#A855F7' },
    { title: 'Soil Moisture at Surface', value: '57.01', unit: '%', icon: Droplets, color: '#3B82F6' },
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-[1vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="flex max-h-[98vh] w-[99vw] flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-bgCard shadow-[0_32px_64px_-15px_rgba(0,0,0,0.6)] md:max-w-[85rem] md:rounded-[2.5rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-5 md:px-6 md:py-6">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-[0.75rem] bg-emerald-500/10 md:h-14 md:w-14 md:rounded-[1rem]">
              <Leaf className="h-6 w-6 text-emerald-500 md:h-7 md:w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold leading-tight tracking-tight text-white md:text-[1.6rem]">Soil Sensors</h2>
              <p className="mt-0.5 whitespace-nowrap text-[0.75rem] font-medium text-white/75 md:text-[0.9rem]">
                {soilSensors.length} active sensors
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 transition-opacity hover:opacity-50">
            <X className="h-5 w-5 text-[#00FF9C] md:h-6 md:w-6" strokeWidth={2.5} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-8 md:px-6 md:py-10">
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
                        className={`h-6 w-6 md:h-5 md:w-5 ${activeSensor === sensor.title ? 'text-[#00FF9C]' : ''}`}
                        style={{ color: activeSensor !== sensor.title ? sensor.color : undefined }}
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
                      <div className="h-1.5 w-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_10px_#00FF9C]" />
                      <span className="text-[0.65rem] font-bold uppercase tracking-widest leading-none text-[#00FF9C] md:text-[0.75rem]">Good</span>
                    </div>
                    <ChevronDown className={`h-3.5 w-3.5 text-white/40 transition-transform ${activeSensor === sensor.title ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                <AnimatePresence>
                  {activeSensor === sensor.title && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="w-full overflow-hidden md:hidden"
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
                className="hidden w-full overflow-hidden md:block"
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
                    className={`flex h-[12.5rem] w-full cursor-pointer flex-col justify-between rounded-[1.5rem] border p-5 transition-all md:h-[11rem] md:rounded-[2rem] md:p-6 ${activeSensor === sensor.title ? 'border-[#00FF9C] bg-[#00FF9C]/5 shadow-[0_0_20px_rgba(0,255,156,0.2)]' : 'border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-[#00FF9C]/30 hover:bg-white/[0.05] active:scale-95'}`}
                  >
                    <div>
                      <div
                        className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl md:mb-4 md:h-10 md:w-10 md:rounded-2xl"
                        style={{ backgroundColor: `${sensor.color}1A` }}
                      >
                        <sensor.icon
                          className={`h-6 w-6 md:h-5 md:w-5 ${activeSensor === sensor.title ? 'text-[#00FF9C]' : ''}`}
                          style={{ color: activeSensor !== sensor.title ? sensor.color : undefined }}
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
                        <div className="h-1.5 w-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_10px_#00FF9C]" />
                        <span className="text-[0.65rem] font-bold uppercase tracking-widest leading-none text-[#00FF9C] md:text-[0.75rem]">Good</span>
                      </div>
                      <ChevronDown className={`h-3.5 w-3.5 text-white/40 transition-transform ${activeSensor === sensor.title ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  <AnimatePresence>
                    {activeSensor === sensor.title && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="w-full overflow-hidden md:hidden"
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
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="hidden w-full overflow-hidden md:block"
              >
                <SoilSensorDetail sensor={activeSensorData} onClose={() => setActiveSensor(null)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-auto shrink-0 px-4 pb-8 md:px-6 md:pb-12">
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
    <div className="relative flex w-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40 p-5 md:rounded-[2rem] md:p-6">
      <div className="mb-4 flex w-full items-start justify-between md:mb-5">
        <div className="z-20 flex flex-col items-start gap-3 md:gap-5">
          <div className="text-left">
            <h3 className="mb-1 text-2xl font-bold leading-none tracking-tight text-textHeading md:mb-1 md:text-xl">{sensor.title}</h3>
            <p className="text-[0.6rem] font-medium tracking-wide text-textHint md:text-xs">24-Hour Trend</p>
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
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="w-full appearance-none cursor-pointer rounded-full border border-white/10 bg-cardBg px-5 py-2.5 text-[0.75rem] font-black uppercase tracking-wider text-[#00FF9C] outline-none"
            >
              {ranges.map((range) => (
                <option key={range} value={range} className="bg-bgMain uppercase text-textHeading">{range}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <ChevronDown className="h-4 w-4 text-[#00FF9C]/60" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex flex-col items-end">
            <p className="text-3xl font-black leading-none tracking-tighter md:text-4xl" style={{ color: sensor.color }}>
              {sensor.value}
              <span className="ml-1 text-[1rem] font-extrabold uppercase" style={{ color: sensor.color }}>{sensor.unit}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 transition-all hover:bg-red-500/20 active:scale-95 md:h-9 md:w-9"
          >
            <X className="h-5 w-5 text-red-500 md:h-4 md:w-4" strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className="relative mt-0 flex h-[200px] w-full items-end justify-center overflow-hidden p-0 md:mt-1 md:h-[260px]">
        <WindSpeedChart />
        <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center md:bottom-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-textHint md:text-[0.75rem]">No Data</p>
        </div>
      </div>
    </div>
  );
}

function AirSensorDetail({ sensor, onClose }: { sensor: any; onClose: () => void }) {
  const [selectedRange, setSelectedRange] = useState('24 Hours');
  const ranges = ['24 Hours', '7 Days', '1 Month'];

  return (
    <div className="relative w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#0A0E14]/90 p-6 backdrop-blur-2xl md:p-8">
      <div className="mb-4 flex items-center justify-between md:hidden">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-black tracking-tight text-white">{sensor.title}</h3>
          <p className="text-xl font-black leading-none tracking-tighter text-[#00FF9C]">
            {sensor.value}
            <span className="ml-0.5 text-[0.7rem] font-bold uppercase">.{sensor.unit}</span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-lg transition-all active:scale-95 group"
        >
          <X className="h-5 w-5 text-[#00FF9C]" strokeWidth={3} />
        </button>
      </div>

      <p className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white/40 md:hidden">24-Hour Trend</p>

      <div className="mb-8 hidden items-start justify-between md:flex">
        <div>
          <h3 className="mb-1 text-2xl font-bold leading-tight tracking-tight text-white md:text-[1.75rem]">{sensor.title}</h3>
          <p className="text-[0.75rem] font-medium uppercase tracking-widest text-white/40 md:text-[0.85rem]">24-Hour Trend</p>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <p className="text-2xl font-black leading-none tracking-tighter text-[#00FF9C] md:text-[2.25rem]">
            {sensor.value}
            <span className="ml-0.5 text-[0.8rem] font-bold uppercase md:text-[0.9rem]">.{sensor.unit}</span>
          </p>
          <button
            onClick={onClose}
            className="ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 shadow-lg transition-all hover:bg-white/10 active:scale-95 group md:h-10 md:w-10"
          >
            <X className="h-4 w-4 text-white/40 group-hover:text-white md:h-5 md:w-5" strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className="mb-6 max-w-[200px] md:mb-8 md:max-w-[180px]">
        <div className="relative">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="w-full appearance-none cursor-pointer rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-[0.75rem] font-black uppercase tracking-wider text-[#00FF9C] outline-none transition-colors hover:bg-white/[0.08] md:px-5"
          >
            {ranges.map((range) => (
              <option key={range} value={range} className="bg-[#0A0E14] text-white uppercase">
                {range}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
            <ChevronDown className="h-4 w-4 text-[#00FF9C]/60" />
          </div>
        </div>
      </div>

      <div className="relative flex h-[220px] w-full items-end justify-center overflow-hidden rounded-[1.5rem] border border-white/5 bg-white/[0.02] p-0 md:h-[300px]">
        <WindSpeedChart />
        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center border-t border-white/5 pt-6">
          <p className="text-[0.7rem] font-black uppercase tracking-[0.3em] text-white/20 md:text-xs">No Data Available</p>
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="flex max-h-[90vh] w-[94vw] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-bgMain/95 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] backdrop-blur-3xl md:max-w-[1280px] md:rounded-[2.5rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4 md:px-14 md:py-4">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-[0.75rem] bg-indigo-500/10 md:h-14 md:w-14 md:rounded-[1rem]">
              <Wind className="h-5 w-5 text-indigo-400 md:h-7 md:w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold leading-tight tracking-tight text-textHeading md:text-[1.6rem]">Air Sensors</h2>
              <p className="mt-0.5 whitespace-nowrap text-[0.75rem] font-medium text-textHint md:text-[0.9rem]">10 active sensors</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 transition-opacity hover:opacity-50">
            <X className="h-5 w-5 text-red-500 md:h-6 md:w-6" strokeWidth={2.5} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:px-14 md:py-8">
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {row1.map((sensor, idx) => (
              <div key={idx} className="w-full">
                <div
                  onClick={() => toggleSensor(sensor.id)}
                  className={`flex h-[12.5rem] cursor-pointer flex-col justify-between rounded-[1.5rem] border px-6 py-5 transition-all md:h-[13rem] md:rounded-[2rem] md:px-8 md:py-6 ${activeSensor === sensor.id ? 'border-[#00FF9C] bg-[#00FF9C]/5 shadow-[0_0_20px_rgba(0,255,156,0.2)]' : 'border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-[#00FF9C]/30 hover:bg-white/[0.05] active:scale-95'}`}
                >
                  <div>
                    <div
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl md:mb-6 md:rounded-2xl"
                      style={{ backgroundColor: `${sensor.color}1A` }}
                    >
                      <sensor.icon className="h-6 w-6" style={{ color: sensor.color }} />
                    </div>
                    <p className="mb-1 text-[0.75rem] font-bold uppercase tracking-wider text-white/90 md:text-[0.7rem]">
                      {sensor.displayName || sensor.title}
                    </p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-[1.2rem] font-black leading-none tracking-tight text-white md:text-[1.4rem]">
                        {sensor.value}
                      </span>
                      <span className="mb-1 text-[0.6rem] font-extrabold tracking-wider text-white/50 md:text-[0.8rem]">
                        {sensor.unit}
                      </span>
                    </div>
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

          <AnimatePresence>
            {activeSensor && activeSensorIndex >= 0 && activeSensorIndex < 4 && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="hidden overflow-hidden lg:block"
              >
                <AirSensorDetail sensor={activeSensorData} onClose={() => setActiveSensor(null)} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {row2.map((sensor, idx) => (
              <div key={idx} className="w-full">
                <div
                  onClick={() => toggleSensor(sensor.id)}
                  className={`flex h-[12.5rem] cursor-pointer flex-col justify-between rounded-[1.5rem] border px-6 py-5 transition-all md:h-[13rem] md:rounded-[2rem] md:px-8 md:py-6 ${activeSensor === sensor.id ? 'border-[#00FF9C] bg-[#00FF9C]/5 shadow-[0_0_20px_rgba(0,255,156,0.2)]' : 'border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-[#00FF9C]/30 hover:bg-white/[0.05] active:scale-95'}`}
                >
                  <div>
                    <div
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl md:mb-6 md:rounded-2xl"
                      style={{ backgroundColor: `${sensor.color}1A` }}
                    >
                      <sensor.icon className="h-6 w-6" style={{ color: sensor.color }} />
                    </div>
                    <p className="mb-1 text-[0.75rem] font-bold uppercase tracking-wider text-white/90 md:text-[0.7rem]">
                      {sensor.displayName || sensor.title}
                    </p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-[1.2rem] font-black leading-none tracking-tight text-white md:text-[1.4rem]">
                        {sensor.value}
                      </span>
                      <span className="mb-1 text-[0.6rem] font-extrabold tracking-wider text-white/50 md:text-[0.8rem]">
                        {sensor.unit}
                      </span>
                    </div>
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

          <AnimatePresence>
            {activeSensor && activeSensorIndex >= 4 && activeSensorIndex < 8 && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="hidden overflow-hidden lg:block"
              >
                <AirSensorDetail sensor={activeSensorData} onClose={() => setActiveSensor(null)} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {row3.map((sensor, idx) => (
              <div key={idx} className="w-full">
                <div
                  onClick={() => toggleSensor(sensor.id)}
                  className={`flex h-[12.5rem] cursor-pointer flex-col justify-between rounded-[1.5rem] border px-6 py-5 transition-all md:h-[13rem] md:rounded-[2rem] md:px-8 md:py-6 ${activeSensor === sensor.id ? 'border-[#00FF9C] bg-[#00FF9C]/5 shadow-[0_0_20px_rgba(0,255,156,0.2)]' : 'border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:border-[#00FF9C]/30 hover:bg-white/[0.05] active:scale-95'}`}
                >
                  <div>
                    <div
                      className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl md:mb-6 md:rounded-2xl"
                      style={{ backgroundColor: `${sensor.color}1A` }}
                    >
                      <sensor.icon className="h-6 w-6" style={{ color: sensor.color }} />
                    </div>
                    <p className="mb-1 text-[0.75rem] font-bold uppercase tracking-wider text-white/90 md:text-[0.7rem]">
                      {sensor.displayName || sensor.title}
                    </p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-[1.2rem] font-black leading-none tracking-tight text-white md:text-[1.4rem]">
                        {sensor.value}
                      </span>
                      <span className="mb-1 text-[0.6rem] font-extrabold tracking-wider text-white/50 md:text-[0.8rem]">
                        {sensor.unit}
                      </span>
                    </div>
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

          <AnimatePresence>
            {activeSensor && activeSensorIndex >= 8 && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="hidden overflow-hidden lg:block"
              >
                <AirSensorDetail sensor={activeSensorData} onClose={() => setActiveSensor(null)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-auto shrink-0 px-6 pb-6 md:px-14 md:pb-8">
          <div className="flex flex-col gap-1 rounded-[1.25rem] border border-[#00FF9C]/10 bg-[#00FF9C]/5 px-6 py-3 md:rounded-[1.75rem] md:px-8 md:py-4">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-[#00FF9C] shadow-[0_0_10px_#00FF9C] md:h-2 md:w-2" />
              <p className="text-[0.75rem] font-extrabold uppercase leading-none tracking-wider text-[#00FF9C] md:text-[0.85rem]">All sensors are operational</p>
            </div>
            <p className="ml-4.5 text-[0.6rem] font-medium tracking-tight text-textHint md:text-[0.7rem]">Last updated: 12/10/2025, 1:08:07 PM</p>
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
    <div className="relative flex w-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40 p-5 md:rounded-[2rem] md:p-6">
      <div className="mb-4 flex w-full items-start justify-between md:mb-5">
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
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="w-full appearance-none cursor-pointer rounded-full border border-white/10 bg-cardBg px-5 py-2.5 text-[0.75rem] font-black uppercase tracking-wider text-[#00FF9C] outline-none"
            >
              {ranges.map((range) => (
                <option key={range} value={range} className="bg-bgMain uppercase text-textHeading">{range}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <ChevronDown className="h-4 w-4 text-[#00FF9C]/60" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex flex-col items-end">
            <p className="text-3xl font-black leading-none tracking-tighter text-[#A855F7] md:text-4xl">N</p>
            <div className="mt-0.5 flex items-center gap-1.5 md:mt-0.5">
              <span className="text-[0.8rem] font-bold text-textHint md:text-sm">0°</span>
              <Wind className="h-3 w-3 text-[#A855F7]/40 md:h-4 md:w-4" />
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

      <div className="relative mx-auto mt-4 flex aspect-square w-full max-w-[200px] items-center justify-center md:mt-2 md:max-w-[380px]">
        <WindDirectionRadar key={selectedRange} range={selectedRange} />
      </div>
    </div>
  );
}

function WindSpeedDetail({ onClose }: { onClose: () => void }) {
  const [selectedRange, setSelectedRange] = useState('24 Hours');
  const ranges = ['24 Hours', '7 Days', '1 Month'];

  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40 p-5 md:rounded-[2rem] md:p-6">
      <div className="mb-4 flex w-full items-start justify-between md:mb-5">
        <div className="z-20 flex flex-col items-start gap-3 md:gap-5">
          <div className="text-left">
            <h3 className="mb-1 text-2xl font-bold leading-none tracking-tight text-textHeading md:mb-1 md:text-xl">Wind Speed</h3>
            <p className="text-[0.6rem] font-medium tracking-wide text-textHint md:text-xs">24-Hour Trend</p>
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
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="w-full appearance-none cursor-pointer rounded-full border border-white/10 bg-cardBg px-5 py-2.5 text-[0.75rem] font-black uppercase tracking-wider text-[#00FF9C] outline-none"
            >
              {ranges.map((range) => (
                <option key={range} value={range} className="bg-bgMain uppercase text-textHeading">{range}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <ChevronDown className="h-4 w-4 text-[#00FF9C]/60" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex flex-col items-end">
            <p className="text-3xl font-black leading-none tracking-tighter text-red-500 md:text-4xl">0<span className="ml-1 text-[1rem] font-extrabold uppercase text-red-500">.m/s</span></p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 transition-all hover:bg-red-500/20 active:scale-95 md:h-9 md:w-9"
          >
            <X className="h-5 w-5 text-red-500 md:h-4 md:w-4" strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className="relative mt-0 flex h-[200px] w-full items-end justify-center overflow-hidden p-0 md:mt-1 md:h-[260px]">
        <WindSpeedChart />
        <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center md:bottom-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-textHint md:text-[0.75rem]">No Data</p>
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
    <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full drop-shadow-[0_0_20px_rgba(168,85,247,0.1)]" preserveAspectRatio="xMidYMid meet">
      {gridLevels.map((level, i) => {
        const points = directions.map((_, idx) => {
          const p = getCoordinates(idx, level);
          return `${p.x},${p.y}`;
        }).join(' ');
        return (
          <polygon key={i} points={points} fill="none" stroke="white" strokeOpacity={0.06} strokeWidth={1} />
        );
      })}

      {directions.map((_, i) => {
        const p = getCoordinates(i, 1);
        return (
          <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="white" strokeOpacity={0.06} strokeWidth={1} />
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

      {hasData && (
        <motion.line
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5 }}
          x1={center}
          y1={center}
          x2={dataPoints[data.indexOf(1)].x}
          y2={dataPoints[data.indexOf(1)].y}
          stroke="#A855F7"
          strokeWidth={5}
          strokeLinecap="round"
          className="drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
        />
      )}
    </svg>
  );
}

function RainFallDetail({ onClose }: { onClose: () => void }) {
  const [selectedRange, setSelectedRange] = useState('24 Hours');
  const ranges = ['24 Hours', '7 Days', '1 Month'];

  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40 p-5 md:rounded-[2rem] md:p-6">
      <div className="mb-4 flex w-full items-start justify-between md:mb-5">
        <div className="z-20 flex flex-col items-start gap-3 md:gap-5">
          <div className="text-left">
            <h3 className="mb-0.5 text-lg font-bold leading-none tracking-tight text-textHeading md:mb-1 md:text-xl">Rain Fall</h3>
            <p className="text-[0.5rem] font-medium tracking-wide text-textHint md:text-xs">24-Hour Trend</p>
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
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="w-full appearance-none cursor-pointer rounded-full border border-white/10 bg-cardBg px-5 py-2.5 text-[0.75rem] font-black uppercase tracking-wider text-[#00FF9C] outline-none"
            >
              {ranges.map((range) => (
                <option key={range} value={range} className="bg-bgMain uppercase text-textHeading">{range}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <ChevronDown className="h-4 w-4 text-[#00FF9C]/60" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex flex-col items-end">
            <p className="text-xl font-black leading-none tracking-tighter text-red-500 md:text-4xl">0<span className="ml-1 text-[0.7rem] font-extrabold uppercase text-red-500 md:text-[1rem]">.mm</span></p>
          </div>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 transition-all hover:bg-red-500/20 active:scale-95 md:h-9 md:w-9"
          >
            <X className="h-3.5 w-3.5 text-red-500 md:h-4 md:w-4" strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className="relative mt-0 flex h-[200px] w-full items-end justify-center overflow-hidden p-0 md:mt-1 md:h-[260px]">
        <RainFallChart />
        <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center md:bottom-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-textHint md:text-[0.75rem]">No Data</p>
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
            <text x="30" y={y + 5} fill="white" fillOpacity="0.15" fontSize="11" fontWeight="bold" className="tabular-nums select-none">{val}</text>
            <line x1="60" y1={y} x2="780" y2={y} stroke="white" strokeOpacity="0.04" strokeDasharray="4 4" />
          </g>
        );
      })}
    </svg>
  );
}
