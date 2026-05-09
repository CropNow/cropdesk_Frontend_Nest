import React, { useState, useEffect } from 'react';
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
import { sensorsAPI } from '../../api/sensors.api';

/**
 * SensorCategoriesSection - DashboardV2Page-equivalent interactive sensor insights
 */

export function SensorCategoriesSection({ data }: { data?: any }) {
  const { addToast } = useToast();
  const [showNestDetails, setShowNestDetails] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  const activeSensorsCount = data?.activeSensorsCount ?? 12;
  const isAnySensorModalOpen = showNestDetails;
  // The deviceId used for nest-device API (serialNumber like "01")
  const nestDeviceId = data?.serialNumber || data?.deviceId || data?.latestData?.deviceId;

  const handleExport = async (range: string) => {
    setShowExportMenu(false);
    try {
      const sensorId = data?.latestData?.sensorId || data?.latestData?.deviceId;
      
      if (!sensorId) {
        addToast({
          message: 'No sensor ID found for export.',
          type: 'error'
        });
        return;
      }

      setIsExporting(true);
      
      await sensorsAPI.exportData({
        sensorId,
        format: 'csv',
        range,
        email: true
      });
      
      addToast({
        message: 'Data export request sent. You will receive an email shortly.',
        type: 'success'
      });
    } catch (error: any) {
      console.error('Export Error:', error);
      addToast({
        message: error.response?.data?.message || 'Failed to export data. Please try again.',
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
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="group flex items-center gap-2 rounded-xl border border-accentPrimary/20 bg-accentPrimary/5 px-4 py-2 text-sm font-bold text-accentPrimary transition-all hover:bg-accentPrimary/10 disabled:opacity-50"
              title="Export data to email"
            >
              {isExporting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-accentPrimary border-t-transparent" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>Export Data</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {showExportMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/10 bg-cardBg p-2 shadow-xl backdrop-blur-xl z-50"
                >
                  <div className="text-xs font-semibold text-textHint mb-2 px-2 pt-1">Select Range</div>
                  <button
                    onClick={() => handleExport('7d')}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-white/5 text-white"
                  >
                    Last 7 Days
                  </button>
                  <button
                    onClick={() => handleExport('15d')}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-white/5 text-white"
                  >
                    Last 15 Days
                  </button>
                  <button
                    onClick={() => handleExport('30d')}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-white/5 text-white"
                  >
                    Last 30 Days
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Smoother Compact Stacked Layout */}
        <div className="flex flex-col gap-4">
          {/* Connectivity Hub Card */}
          <motion.div
            whileHover={{ y: -2 }}
            className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-6 backdrop-blur-xl transition-all"
          >
            {/* Soft Status Glow */}
            <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full blur-[50px] transition-colors duration-700 ${data?.isOnline ? 'bg-emerald-500/15' : 'bg-red-500/15'}`} />
            
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <div className={`h-2 w-2 rounded-full ${data?.isOnline ? 'animate-pulse bg-emerald-500' : 'bg-red-500'}`} />
                    <span className={`text-[0.65rem] font-bold uppercase tracking-[0.15em] ${data?.isOnline ? 'text-emerald-400/80' : 'text-red-400/80'}`}>
                      {data?.isOnline ? 'System Online' : 'System Offline'}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold tracking-tight text-white/90">Connectivity Hub</h4>
                </div>
                
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03] border border-white/5">
                  <Radio className={`h-4 w-4 ${data?.isOnline ? 'text-emerald-400' : 'text-white/20'}`} />
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tighter text-white">
                      {activeSensorsCount}
                    </span>
                    <span className="text-lg font-bold text-white/20">
                      / {data?.totalSensorsCount || 16}
                    </span>
                  </div>
                  <p className="text-[0.6rem] font-bold uppercase tracking-widest text-white/30">Active Sensors</p>
                </div>

                <div className="flex flex-col items-end text-right">
                  <p className="text-[0.6rem] font-bold uppercase tracking-widest text-white/20">Last Sync</p>
                  <p className="text-lg font-bold tracking-tight text-white/80">
                    {data?.timestamp ? new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </p>
                  <p className="text-[0.65rem] font-medium text-white/30">
                    {data?.timestamp ? new Date(data.timestamp).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Interactive Sensor Entry Cards */}
          {SENSOR_CARDS.map((card) => (
            <motion.div
              key={card.title}
              whileHover={{ y: -3, scale: 1.002 }}
              whileTap={{ scale: 0.998 }}
              onClick={() => {
                if (card.title === 'Nest Device Sensors') setShowNestDetails(true);
              }}
              className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-[#00FF9C]/10 bg-gradient-to-br from-[#00FF9C]/5 via-transparent to-transparent p-6 backdrop-blur-xl transition-all hover:border-[#00FF9C]/25 hover:bg-[#00FF9C]/8"
            >
              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-[1rem] bg-gradient-to-br ${card.accent} border border-white/5 transition-transform group-hover:scale-105`}>
                    <card.icon className="h-5 w-5 text-[#00FF9C]" />
                  </div>
                  <div className="rounded-full bg-white/5 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <ChevronDown className="h-4 w-4 -rotate-90 text-[#00FF9C]" />
                  </div>
                </div>

                <div className="flex flex-col gap-0.5">
                  <h4 className="text-xl font-bold tracking-tight text-white">{card.title}</h4>
                  <p className="text-xs font-medium text-white/40">Access detailed telemetry & trends</p>
                </div>
              </div>

              {/* Subtle Decorative Accent */}
              <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-[#00FF9C]/3 blur-[60px] transition-colors group-hover:bg-[#00FF9C]/6" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {showNestDetails && (
          <NestSensorsModal
            isOpen={showNestDetails}
            onClose={() => setShowNestDetails(false)}
            data={{ ...(data?.latestData || {}), deviceId: nestDeviceId, sensorId: data?.sensorId || data?.latestData?.sensorId || data?.latestData?._id || data?.latestData?.id }}
          />
        )}
      </AnimatePresence>
    </>
  );
}






/**
 * Fetches chart data from the aggregation API for a given metric and range.
 */
async function fetchNestChartData(sensorId: string, selectedRange: string, metric: string): Promise<any[]> {
  if (!sensorId || !metric) return [];

  const rangeMap: Record<string, string> = {
    '24 Hours': '24h',
    '7 Days': '7d',
    '1 Month': '30d',
  };

  const aggMap: Record<string, string> = {
    '24 Hours': 'hour',
    '7 Days': 'day',
    '1 Month': 'day',
  };

  const params = {
    range: rangeMap[selectedRange] || '7d',
    aggregation: aggMap[selectedRange] || 'day',
    metric: metric,
  };

  try {
    const res = await sensorsAPI.getAggregatedData(sensorId, params);
    if (Array.isArray(res.data)) {
      return res.data.map((item: any) => ({
        timestamp: item._id,
        average: item.average,
        [metric]: item.average,
      }));
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch aggregated data:', error);
    return [];
  }
}

function RealDataChart({ data, chartType = 'bar', unit = '', selectedRange = '24 Hours', metricKey = '' }: { data: any[]; chartType?: 'bar' | 'line'; unit?: string; selectedRange?: string; metricKey?: string }) {
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  console.log('RealDataChart received data:', data);

  // Pad data to ensure a full timeline is always shown across the X-axis
  const now = new Date();
  const isDay = selectedRange === '24 Hours';
  const isWeek = selectedRange === '7 Days';
  const pointsCount = isDay ? 24 : (isWeek ? 7 : 30);
  const intervalMs = isDay ? 3600000 : 86400000;
  
  const timeline = Array.from({ length: pointsCount }, (_, i) => {
    const time = new Date(now.getTime() - (pointsCount - 1 - i) * intervalMs);
    if (isDay) time.setMinutes(0, 0, 0);
    else time.setHours(0, 0, 0, 0);

    return {
      timestamp: time.toISOString(),
      [metricKey]: 0,
      average: 0,
      isPlaceholder: true
    };
  });

  if (data && data.length > 0) {
    data.forEach(realPoint => {
      const realTime = new Date(realPoint.timestamp || realPoint._id || realPoint.time).getTime();
      let closestIdx = -1;
      let minDiff = Infinity;
      
      timeline.forEach((slot, idx) => {
        const diff = Math.abs(new Date(slot.timestamp).getTime() - realTime);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });

      if (closestIdx !== -1 && minDiff < intervalMs) {
        timeline[closestIdx] = { 
          ...timeline[closestIdx], 
          ...realPoint, 
          isPlaceholder: false,
          [metricKey]: realPoint[metricKey] ?? realPoint.average ?? 0
        };
      }
    });
  }

  const chartData = timeline;

  const points = chartData.map((d: any) => {
    let val: number | undefined;
    
    if (metricKey && d[metricKey] !== undefined && d[metricKey] !== null) {
      const num = Number(d[metricKey]);
      if (!isNaN(num)) val = num;
    }

    if (val === undefined) {
      const possibleKeys = ['value', 'avg', 'average', 'reading', 'val'];
      for (const key of possibleKeys) {
        if (d[key] !== undefined && d[key] !== null) {
          const num = Number(d[key]);
          if (!isNaN(num)) {
            val = num;
            break;
          }
        }
      }
    }

    if (val === undefined) {
      for (const key in d) {
        const keyLower = key.toLowerCase();
        if (keyLower.includes('id') || keyLower.includes('time') || keyLower.includes('date') || keyLower.includes('created') || keyLower.includes('updated')) {
          continue;
        }
        const num = Number(d[key]);
        if (d[key] !== null && d[key] !== '' && typeof d[key] !== 'boolean' && !isNaN(num)) {
          val = num;
          break;
        }
      }
    }
    
    return val !== undefined ? val : 0;
  });

  const maxVal = Math.max(...points, 1);
  const minVal = Math.min(...points, 0);
  const range = maxVal - minVal;

  const displayMin = range === 0 ? minVal - 1 : minVal;
  const displayMax = range === 0 ? maxVal + 1 : maxVal;
  const displayRange = displayMax - displayMin;

  const width = 800;
  const height = 200; // Reduced to fit standard containers better
  const paddingLeft = 70;
  const paddingRight = 30;
  const paddingTop = 15;
  const paddingBottom = 35; // Adjusted to ensure labels fit within 200 units

  const getX = (index: number) => {
    return paddingLeft + (index / (points.length - 1 || 1)) * (width - paddingLeft - paddingRight);
  };

  const getY = (val: number) => {
    return height - paddingBottom - ((val - displayMin) / (displayRange || 1)) * (height - paddingTop - paddingBottom);
  };

  const svgPoints = points.map((val, i) => `${getX(i)},${getY(val)}`).join(' ');

  const barCount = points.length;
  const step = (width - paddingLeft - paddingRight) / (barCount || 1);
  const currentBarWidth = barCount > 1 ? Math.max(step * 0.7, 4) : 40;

  const bars = points.map((val, i) => {
    const x = barCount > 1 
      ? paddingLeft + i * step + (step - currentBarWidth) / 2
      : paddingLeft + (width - paddingLeft - paddingRight) / 2 - currentBarWidth / 2;
    const barHeight = ((val - displayMin) / (displayRange || 1)) * (height - paddingTop - paddingBottom);
    const y = height - paddingBottom - Math.max(barHeight, 4);

    return (
      <rect
        key={i}
        x={x}
        y={y}
        width={currentBarWidth}
        height={Math.max(barHeight, 4)}
        fill="#00FF9C"
        fillOpacity={selectedPoint === i ? 1 : 0.8}
        rx={Math.min(currentBarWidth / 4, 8)}
        className="cursor-pointer transition-all drop-shadow-[0_0_10px_rgba(0,255,156,0.3)] hover:fillOpacity-100"
        onClick={(e) => {
          e.stopPropagation();
          setSelectedPoint(selectedPoint === i ? null : i);
        }}
      />
    );
  });

  const getFormattedLabel = (d: any) => {
    if (!d) return '';
    const timeKey = ['timestamp', 'createdAt', 'time', 'date', 'updatedAt', 'created_at', 'updated_at', 'ts'].find(k => d[k]);
    if (!timeKey) return '';
    
    try {
      const date = new Date(d[timeKey]);
      if (isNaN(date.getTime())) return '';
      
      if (selectedRange === '24 Hours') {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      } else if (selectedRange === '7 Days') {
        return date.toLocaleDateString([], { weekday: 'short' });
      } else if (selectedRange === '1 Month') {
        return date.getDate().toString();
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    } catch (e) {
      return '';
    }
  };

  const labelsWithIndices = chartData.map((d: any, i: number) => ({ 
    label: getFormattedLabel(d), 
    index: i 
  })).filter(l => l.label !== '');

  const uniqueLabels = labelsWithIndices.filter((item, pos, self) => 
    self.findIndex(v => v.label === item.label) === pos
  );

  const finalLabelCount = Math.min(6, uniqueLabels.length);
  const finalLabels = [];
  if (uniqueLabels.length > 0) {
    for (let i = 0; i < finalLabelCount; i++) {
      const idx = Math.floor((i * (uniqueLabels.length - 1)) / (finalLabelCount - 1 || 1));
      finalLabels.push(uniqueLabels[idx]);
    }
  }

  return (
    <svg className="h-full w-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
        const val = displayMin + ratio * displayRange;
        const y = getY(val);
        return (
          <g key={`y-${idx}`}>
            <line 
              x1={paddingLeft} 
              y1={y} 
              x2={width - paddingRight} 
              y2={y} 
              stroke="white" 
              strokeOpacity={idx === 0 ? "0.2" : "0.05"} 
              strokeWidth={idx === 0 ? 2 : 1} 
            />
            <text 
              x={paddingLeft - 12} 
              y={y + 4} 
              fill="white" 
              fillOpacity="0.7" 
              fontSize="12" 
              fontWeight="900"
              textAnchor="end"
              className="select-none tabular-nums"
            >
              {val.toFixed(val > 10 ? 0 : 1)}{unit}
            </text>
          </g>
        );
      })}

      {finalLabels.map((l, i) => (
        <text
          key={`x-${i}`}
          x={getX(l.index)}
          y={height - 10}
          fill="white"
          fillOpacity="0.7" 
          fontSize="12" 
          fontWeight="900"
          textAnchor="middle"
          className="select-none"
        >
          {l.label}
        </text>
      ))}
      
      {chartType === 'line' ? (
        <g>
          {points.length > 1 ? (
            <polyline fill="none" stroke="#00FF9C" strokeWidth="4" points={svgPoints} className="drop-shadow-[0_0_15px_rgba(0,255,156,0.5)]" />
          ) : null}
          {points.map((val, i) => (
            <circle
              key={`dot-${i}`}
              cx={getX(i)}
              cy={getY(val)}
              r={selectedPoint === i ? 8 : 6}
              fill="#00FF9C"
              fillOpacity={selectedPoint === i ? 1 : 0.4}
              stroke="#00FF9C"
              strokeWidth={selectedPoint === i ? 2 : 0}
              className="cursor-pointer transition-all hover:fillOpacity-100"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPoint(selectedPoint === i ? null : i);
              }}
            />
          ))}
        </g>
      ) : (
        <g 
          onClick={() => setSelectedPoint(null)}
          className="h-full w-full"
        >
          {bars}
        </g>
      )}

      {/* Value Label Overlay */}
      {selectedPoint !== null && points[selectedPoint] !== undefined && (
        <g>
          <rect
            x={getX(selectedPoint) - 35}
            y={getY(points[selectedPoint]) - 40}
            width="70"
            height="30"
            rx="8"
            fill="#00FF9C"
            className="drop-shadow-[0_0_10px_rgba(0,255,156,0.5)]"
          />
          <path
            d={`M ${getX(selectedPoint) - 6} ${getY(points[selectedPoint]) - 10} L ${getX(selectedPoint)} ${getY(points[selectedPoint]) - 2} L ${getX(selectedPoint) + 6} ${getY(points[selectedPoint]) - 10} Z`}
            fill="#00FF9C"
          />
          <text
            x={getX(selectedPoint)}
            y={getY(points[selectedPoint]) - 20}
            fill="#0A0E14"
            fontSize="12"
            fontWeight="900"
            textAnchor="middle"
            className="select-none tabular-nums"
          >
            {points[selectedPoint].toFixed(1)}{unit}
          </text>
        </g>
      )}
    </svg>
  );
}

function SoilSensorDetail({ sensor, sensorId, onClose }: { sensor: any; sensorId?: string; onClose: () => void }) {
  const [selectedRange, setSelectedRange] = useState('24 Hours');
  const [chartData, setChartData] = useState<any[]>([]);
  const ranges = ['24 Hours', '7 Days', '1 Month'];

  const getMetricKey = (title: string) => {
    const map: Record<string, string | null> = {
      'Nitrogen': 'nitrogen',
      'Organic Carbon': 'organicCarbon',
      'Soil Temperature at Surface': 'soil_temperature',
      'Phosphorus': 'phosphorus',
      'Potassium': 'potassium',
      'PH Level': 'ph',
      'Soil Moisture at Surface': 'soil_moisture_1',
      'Wind Direction': 'wind_direction',
      'Wind Speed': 'wind_speed',
      'Rain Fall': 'rainfall',
      'Solar Radiation': 'solar_radiation',
      'PM 2.5': 'pm2_5',
      'PM 10': 'pm10',
      'CO2': 'co2',
      'Air Temperature': 'temperature',
      'VOC': 'voc',
      'CH2O': 'ch2o',
      'CO': 'co',
      'PM 1.0': 'pm1_0',
      'Temperature 1': 'temperature',
      'Temperature 2': 'soil_temperature',
      'Humidity 1': 'humidity',
      'Humidity 2': 'soil_moisture_1',
      'Leaf Wetness': 'leaf_wetness',
      'Humidity': 'humidity',
      'Air Pressure': 'pressure',
      'SO2': 'so2',
      'NO2': 'no2',
      'O3': 'o3'
    };
    return map[title] || null;
  };

  useEffect(() => {
    const fetchHistory = async () => {
      if (!sensorId) return;
      try {
        const metric = getMetricKey(sensor.title);
        if (!metric) {
          setChartData([]);
          return;
        }
        const rawData = await fetchNestChartData(sensorId, selectedRange, metric);
        setChartData(rawData);
      } catch (err) {
        console.error('Failed to fetch chart data:', err);
      }
    };
    fetchHistory();
  }, [sensorId, selectedRange, sensor.title]);

  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40 p-5 md:rounded-[2rem] md:p-6">
      <div className="mb-4 flex w-full items-start justify-between md:mb-5">
        <div className="z-20 flex flex-col items-start gap-3 md:gap-5">
          <div className="text-left">
            <h3 className="mb-1 text-2xl font-bold leading-none tracking-tight text-textHeading md:mb-1 md:text-xl">{sensor.title}</h3>
            <p className="text-[0.6rem] font-medium tracking-wide text-textHint md:text-xs">{selectedRange} Trend</p>
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

      <div className="relative mt-0 flex h-[200px] w-full items-end justify-center p-0 md:mt-1 md:h-[260px]">
        <RealDataChart data={chartData} unit={sensor.unit} selectedRange={selectedRange} metricKey={getMetricKey(sensor.title)} chartType={sensor?.title?.toLowerCase()?.includes('wind') ? 'line' : 'bar'} />
      </div>
    </div>
  );
}

function AirSensorDetail({ sensor, sensorId, onClose }: { sensor: any; sensorId?: string; onClose: () => void }) {
  const [selectedRange, setSelectedRange] = useState('24 Hours');
  const [chartData, setChartData] = useState<any[]>([]);
  const ranges = ['24 Hours', '7 Days', '1 Month'];

  const getMetricKey = (title: string) => {
    const map: Record<string, string | null> = {
      'Nitrogen': 'nitrogen',
      'Organic Carbon': 'organicCarbon',
      'Soil Temperature at Surface': 'soil_temperature',
      'Phosphorus': 'phosphorus',
      'Potassium': 'potassium',
      'PH Level': 'ph',
      'Soil Moisture at Surface': 'soil_moisture_1',
      'Wind Direction': 'wind_direction',
      'Wind Speed': 'wind_speed',
      'Rain Fall': 'rainfall',
      'Solar Radiation': 'solar_radiation',
      'PM 2.5': 'pm2_5',
      'PM 10': 'pm10',
      'CO2': 'co2',
      'Air Temperature': 'temperature',
      'VOC': 'voc',
      'CH2O': 'ch2o',
      'CO': 'co',
      'PM 1.0': 'pm1_0',
      'Temperature 1': 'temperature',
      'Temperature 2': 'soil_temperature',
      'Humidity 1': 'humidity',
      'Humidity 2': 'soil_moisture_1',
      'Leaf Wetness': 'leaf_wetness',
      'Humidity': 'humidity',
      'Air Pressure': 'pressure',
      'SO2': 'so2',
      'NO2': 'no2',
      'O3': 'o3'
    };
    return map[title] || null;
  };

  useEffect(() => {
    const fetchHistory = async () => {
      if (!sensorId) return;
      try {
        const metric = getMetricKey(sensor.title);
        if (!metric) {
          setChartData([]);
          return;
        }
        const rawData = await fetchNestChartData(sensorId, selectedRange, metric);
        setChartData(rawData);
      } catch (err) {
        console.error('Failed to fetch chart data:', err);
      }
    };
    fetchHistory();
  }, [sensorId, selectedRange, sensor.title]);

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

      <p className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white/40 md:hidden">{selectedRange} Trend</p>

      <div className="mb-8 hidden items-start justify-between md:flex">
        <div>
          <h3 className="mb-1 text-2xl font-bold leading-tight tracking-tight text-white md:text-[1.75rem]">{sensor.title}</h3>
          <p className="text-[0.75rem] font-medium uppercase tracking-widest text-white/40 md:text-[0.85rem]">{selectedRange} Trend</p>
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

      <div className="relative flex h-[220px] w-full items-end justify-center rounded-[1.5rem] border border-white/5 bg-white/[0.02] p-0 md:h-[300px]">
        <RealDataChart data={chartData} unit={sensor.unit} selectedRange={selectedRange} metricKey={getMetricKey(sensor.title)} chartType={sensor?.title?.toLowerCase()?.includes('wind') ? 'line' : 'bar'} />
      </div>
    </div>
  );
}

function NestSensorsModal({ isOpen, onClose, data }: { isOpen: boolean; onClose: () => void; data?: any }) {
  const [activeSensor, setActiveSensor] = useState<string | null>(null);

  const nestSensors = [
    { id: 'pm1_0', title: 'PM 1.0', value: data?.values?.pm1_0 ?? '0', unit: 'µg/m³', icon: Activity, color: '#3B82F6' },
    { id: 'pm2_5', title: 'PM 2.5', value: data?.values?.pm2_5 ?? '0', unit: 'µg/m³', icon: Activity, color: '#3B82F6' },
    { id: 'pm10', title: 'PM 10', value: data?.values?.pm10 ?? '0', unit: 'µg/m³', icon: Activity, color: '#22D3EE' },
    { id: 'co2', title: 'CO2', value: data?.values?.co2 ?? '0', unit: 'ppm', icon: Cloud, color: '#E5E7EB' },
    { id: 'voc', title: 'VOC', value: data?.values?.voc ?? '0', unit: 'ppb', icon: Activity, color: '#A855F7' },
    { id: 'ch2o', title: 'CH2O', value: data?.values?.ch2o ?? '0', unit: 'mg/m³', icon: Activity, color: '#F87171' },
    { id: 'co', title: 'CO', value: data?.values?.co ?? '0', unit: 'ppm', icon: Activity, color: '#F59E0B' },
    { id: 'no2', title: 'NO2', value: data?.values?.no2 ?? '0', unit: 'ppm', icon: Activity, color: '#F97316' },
    { id: 'o3', title: 'O3', value: data?.values?.o3 ?? '0', unit: 'ppm', icon: Activity, color: '#22C55E' },
    { id: 'temp1', title: 'Temperature 1', value: data?.values?.temperature ?? '0', unit: '°C', icon: Thermometer, color: '#F59E0B' },
    { id: 'temp2', title: 'Temperature 2', value: data?.values?.temperature2 ?? '0', unit: '°C', icon: Thermometer, color: '#F59E0B' },
    { id: 'hum1', title: 'Humidity 1', value: data?.values?.humidity ?? '0', unit: '%', icon: Droplets, color: '#3B82F6' },
    { id: 'hum2', title: 'Humidity 2', value: data?.values?.humidity2 ?? '0', unit: '%', icon: Droplets, color: '#3B82F6' },
    { id: 'leaf', title: 'Leaf Wetness', value: data?.values?.leaf ?? '0', unit: '%', icon: Leaf, color: '#22C55E' },
    { id: 'wind_speed', title: 'Wind Speed', value: data?.values?.wind_speed ?? '0', unit: 'm/s', icon: Wind, color: '#60A5FA' },
    { id: 'wind_dir', title: 'Wind Direction', value: data?.values?.wind_dir ?? '0', unit: '°', icon: Wind, color: '#60A5FA' },
  ];

  const gridGroups = [];
  for (let i = 0; i < nestSensors.length; i += 4) {
    gridGroups.push(nestSensors.slice(i, i + 4));
  }

  const activeSensorData = nestSensors.find((s) => s.id === activeSensor);
  const activeSensorIndex = nestSensors.findIndex((s) => s.id === activeSensor);

  const toggleSensor = (id: string) => {
    setActiveSensor(activeSensor === id ? null : id);
  };

  const isOnline = data?.isOnline ?? true;

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
            <div className="flex h-10 w-10 items-center justify-center rounded-[0.75rem] bg-[#00FF9C]/10 md:h-14 md:w-14 md:rounded-[1rem]">
              <Activity className="h-5 w-5 text-[#00FF9C] md:h-7 md:w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold leading-tight tracking-tight text-textHeading md:text-[1.6rem]">Nest Device Sensors</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'}`} />
                <p className={`text-[0.75rem] font-bold uppercase tracking-wider ${isOnline ? 'text-emerald-500' : 'text-red-500'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </p>
                <span className="text-white/20">|</span>
                <p className="text-[0.75rem] font-medium text-textHint md:text-[0.9rem]">{nestSensors.length} total sensors</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 transition-opacity hover:opacity-50">
            <X className="h-5 w-5 text-red-500 md:h-6 md:w-6" strokeWidth={2.5} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:px-14 md:py-8">
          {gridGroups.map((group, groupIdx) => (
            <React.Fragment key={groupIdx}>
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
                {group.map((sensor) => (
                  <div key={sensor.id} className="w-full">
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
                          {sensor.title}
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
                          <div className={`h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-[#00FF9C] shadow-[0_0_10px_#00FF9C]' : 'bg-white/20'} md:h-2 md:w-2`} />
                          <span className={`text-[0.65rem] font-bold uppercase tracking-widest leading-none ${isOnline ? 'text-[#00FF9C]' : 'text-white/30'} md:text-[0.75rem]`}>
                            {isOnline ? 'Operational' : 'No Signal'}
                          </span>
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
                          <AirSensorDetail sensor={sensor} sensorId={data?.sensorId || data?._id || data?.id || data?.deviceId} onClose={() => setActiveSensor(null)} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <AnimatePresence>
                {activeSensor && group.some(s => s.id === activeSensor) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="hidden overflow-hidden lg:block"
                  >
                    <AirSensorDetail sensor={activeSensorData} sensorId={data?.sensorId || data?._id || data?.id || data?.deviceId} onClose={() => setActiveSensor(null)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </React.Fragment>
          ))}
        </div>

        <div className="mt-auto shrink-0 px-6 pb-6 md:px-14 md:pb-8">
          <div className="flex flex-col gap-1 rounded-[1.25rem] border border-[#00FF9C]/10 bg-[#00FF9C]/5 px-6 py-3 md:rounded-[1.75rem] md:px-8 md:py-4">
            <div className="flex items-center gap-3">
              <div className={`h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-[#00FF9C] shadow-[0_0_10px_#00FF9C]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'} md:h-2 md:w-2`} />
              <p className={`text-[0.75rem] font-extrabold uppercase leading-none tracking-wider ${isOnline ? 'text-[#00FF9C]' : 'text-red-500'} md:text-[0.85rem]`}>
                {isOnline ? 'All sensors are operational' : 'Device connectivity issues detected'}
              </p>
            </div>
            <p className="ml-4.5 text-[0.6rem] font-medium tracking-tight text-textHint md:text-[0.7rem]">
              {data?.isHistorical ? 'Showing last valid readings from: ' : 'Last updated: '}
              {data?.timestamp ? new Date(data.timestamp).toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
