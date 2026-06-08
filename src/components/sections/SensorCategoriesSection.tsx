import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  ChevronDown,
  Cloud,
  CloudRain,
  Droplets,
  Download,
  Gauge,
  Leaf,
  Sun,
  Thermometer,
  Wind,
  X,
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { SENSOR_CARDS } from '../../constants/deviceConstants';
import { useLockBodyScroll } from '../../hooks/common/useLockBodyScroll';
import { sensorsAPI } from '../../api/sensors.api';
import { StatusBadge } from '../ui/StatusBadge';

/**
 * SensorCategoriesSection - Interactive sensor insights
 */

export function SensorCategoriesSection({ data, lastFetchTime }: { data?: any, lastFetchTime?: Date | null }) {
  const { addToast } = useToast();
  const [showNestDetails, setShowNestDetails] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  const activeSensorsCount = data?.activeSensorsCount ?? 12;
  const isAnySensorModalOpen = showNestDetails;
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
        className="rounded-xl border border-cardBorder bg-cardBg p-6 shadow-card xl:col-span-1"
      >
        <div className="mb-6">
          <h3 className="text-scale-section font-bold text-textHeading">Sensor Insights</h3>
        </div>

        <div className="flex flex-col gap-4">
          {/* Mobile Connectivity Hub - 2x2 grid of 4 cards */}
          <div className="grid grid-cols-2 gap-3 sm:hidden max-w-[420px]">
            {/* Active Sensors Card */}
            <div className="rounded-lg border border-borderColor bg-bgInput p-4 shadow-sm flex flex-col justify-between h-28">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Activity className="h-4 w-4" />
                </span>
                <span className="text-scale-card font-extrabold text-textHeading">{activeSensorsCount}</span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-textSecondary mt-2">Active</p>
            </div>

            {/* Offline Sensors Card */}
            <div className="rounded-lg border border-borderColor bg-bgInput p-4 shadow-sm flex flex-col justify-between h-28">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                  <Cloud className="h-4 w-4" />
                </span>
                <span className="text-scale-card font-extrabold text-textHeading">
                  {Math.max(0, (data?.totalSensorsCount || 16) - activeSensorsCount)}
                </span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-textSecondary mt-2">Offline</p>
            </div>

            {/* Total Sensors Card */}
            <div className="rounded-lg border border-borderColor bg-bgInput p-4 shadow-sm flex flex-col justify-between h-28">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                  <Gauge className="h-4 w-4" />
                </span>
                <span className="text-scale-card font-extrabold text-textHeading">{data?.totalSensorsCount || 16}</span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-textSecondary mt-2">AI Sensors</p>
            </div>

            {/* Warnings/Alerts Card */}
            <div className="rounded-lg border border-borderColor bg-bgInput p-4 shadow-sm flex flex-col justify-between h-28">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                  <Activity className="h-4 w-4" />
                </span>
                <span className="text-scale-card font-extrabold text-textHeading">{data?.warningsCount || 0}</span>
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-textSecondary mt-2">Warnings</p>
            </div>
          </div>

          {/* Desktop Connectivity Hub Card */}
          <div className="hidden sm:block group relative overflow-hidden rounded-lg border border-borderColor bg-bgInput p-5 max-w-[420px]">
            <div className="relative z-10 flex flex-col gap-4">
              {/* System Status */}
              <div>
                <StatusBadge
                  label={data?.isOnline ? 'System Online' : 'System Offline'}
                  variant={data?.isOnline ? 'success' : 'danger'}
                  size="sm"
                />
              </div>

              {/* Title */}
              <h4 className="text-scale-body font-semibold tracking-tight text-textHeading">Connectivity Hub</h4>

              {/* Active Sensors */}
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-scale-metric font-extrabold text-textHeading">{activeSensorsCount}</span>
                  <span className="text-scale-body font-bold text-textSecondary">/ {data?.totalSensorsCount || 16}</span>
                </div>
                <p className="text-scale-caption font-bold uppercase tracking-wider text-textSecondary">ACTIVE SENSORS</p>
              </div>

              {/* Last Sync and Last Fetch Grid */}
              <div className="grid grid-cols-2 gap-4 mt-1 pt-4 border-t border-borderColor">
                <div>
                  <p className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">Last Sync</p>
                  <p className="text-scale-body font-bold tracking-tight text-textHeading">
                    {data?.timestamp && !isNaN(new Date(data.timestamp).getTime()) ? new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </p>
                  <p className="text-scale-caption font-medium text-textSecondary">
                    {data?.timestamp && !isNaN(new Date(data.timestamp).getTime()) ? new Date(data.timestamp).toLocaleDateString() : 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">Last Fetch</p>
                  <p className="text-scale-body font-bold tracking-tight text-textHeading">
                    {lastFetchTime && !isNaN(new Date(lastFetchTime).getTime()) ? new Date(lastFetchTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </p>
                  <p className="text-scale-caption font-medium text-textSecondary">
                    {lastFetchTime && !isNaN(new Date(lastFetchTime).getTime()) ? new Date(lastFetchTime).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Sensor Entry Cards */}
          {SENSOR_CARDS.map((card) => {
            const isNest = card.title === 'Nest Device Sensors';
            return (
              <React.Fragment key={card.title}>
                <div
                  onClick={() => { if (isNest) setShowNestDetails(true); }}
                  className="group relative cursor-pointer overflow-hidden rounded-lg border border-borderColor bg-bgInput p-5 transition-all hover:border-accentPrimary hover:bg-bgCard shadow-sm max-w-[420px]"
                >
                  <div className="relative z-10 flex items-center justify-between">
                    <h4 className="text-scale-card font-bold tracking-tight text-textHeading">{card.title}</h4>
                    <ChevronDown className="h-5 w-5 -rotate-90 text-textSecondary group-hover:text-accentPrimary transition-colors" />
                  </div>
                </div>

                {isNest && (
                  <div className="mt-2 max-w-[420px]">
                    <div className="relative">
                      <button
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        disabled={isExporting}
                        className="group flex w-full items-center justify-center gap-2 rounded-lg border border-accentPrimary/20 bg-accentPrimary/10 px-4 py-2.5 text-scale-caption font-bold text-accentPrimary transition-all hover:bg-accentPrimary/20 disabled:opacity-50"
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
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 bottom-full mb-2 w-56 rounded-lg border border-borderColor bg-bgCard p-2 shadow-elevated z-60"
                          >
                            <div className="text-scale-caption font-semibold text-textSecondary mb-2 px-2 pt-1">Select Range</div>
                            <button
                              onClick={() => handleExport('7d')}
                              className="w-full rounded-md px-3 py-2 text-left text-scale-caption font-medium transition-colors hover:bg-bgInput text-textPrimary"
                            >
                              Last 7 Days
                            </button>
                            <button
                              onClick={() => handleExport('15d')}
                              className="w-full rounded-md px-3 py-2 text-left text-scale-caption font-medium transition-colors hover:bg-bgInput text-textPrimary"
                            >
                              Last 15 Days
                            </button>
                            <button
                              onClick={() => handleExport('30d')}
                              className="w-full rounded-md px-3 py-2 text-left text-scale-caption font-medium transition-colors hover:bg-bgInput text-textPrimary"
                            >
                              Last 30 Days
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
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
  const height = 200;
  const paddingLeft = 70;
  const paddingRight = 30;
  const paddingTop = 15;
  const paddingBottom = 35;

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
        fill="var(--accent-primary)"
        fillOpacity={selectedPoint === i ? 1 : 0.8}
        rx={Math.min(currentBarWidth / 4, 8)}
        className="cursor-pointer transition-all hover:fillOpacity-100"
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
              stroke="var(--border-color)" 
              strokeOpacity={idx === 0 ? "0.3" : "0.15"} 
              strokeWidth={idx === 0 ? 2 : 1} 
            />
            <text 
              x={paddingLeft - 12} 
              y={y + 4} 
              fill="var(--text-secondary)" 
              fontSize="12" 
              fontWeight="600"
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
          fill="var(--text-secondary)"
          fontSize="12" 
          fontWeight="600"
          textAnchor="middle"
          className="select-none"
        >
          {l.label}
        </text>
      ))}
      
      {chartType === 'line' ? (
        <g>
          {points.length > 1 ? (
            <polyline fill="none" stroke="var(--accent-primary)" strokeWidth="3" points={svgPoints} />
          ) : null}
          {points.map((val, i) => (
            <circle
              key={`dot-${i}`}
              cx={getX(i)}
              cy={getY(val)}
              r={selectedPoint === i ? 7 : 5}
              fill="var(--accent-primary)"
              fillOpacity={selectedPoint === i ? 1 : 0.6}
              stroke="var(--accent-primary)"
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

      {/* Value Label Overlay (Tooltip) */}
      {selectedPoint !== null && points[selectedPoint] !== undefined && (
        <g>
          <rect
            x={getX(selectedPoint) - 35}
            y={getY(points[selectedPoint]) - 40}
            width="70"
            height="30"
            rx="8"
            fill="var(--accent-primary)"
          />
          <path
            d={`M ${getX(selectedPoint) - 6} ${getY(points[selectedPoint]) - 10} L ${getX(selectedPoint)} ${getY(points[selectedPoint]) - 2} L ${getX(selectedPoint) + 6} ${getY(points[selectedPoint]) - 10} Z`}
            fill="var(--accent-primary)"
          />
          <text
            x={getX(selectedPoint)}
            y={getY(points[selectedPoint]) - 20}
            fill="white"
            fontSize="12"
            fontWeight="bold"
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
      'O3': 'o3',
      'Soil Moisture 1': 'soil_moisture_1',
      'Soil Moisture 2': 'soil_moisture_2',
      'Soil Temp 1': 'soil_temperature',
      'Soil Temp 2': 'soil_temperature_2',
      'Air Humidity': 'humidity',
      'Pressure': 'pressure'
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
    const interval = setInterval(fetchHistory, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [sensorId, selectedRange, sensor.title]);

  return (
    <div className="relative flex w-full flex-col overflow-hidden rounded-xl border border-borderColor bg-bgCard p-5 shadow-card md:p-6">
      <div className="mb-4 flex w-full items-start justify-between md:mb-5">
        <div className="z-20 flex flex-col items-start gap-3 md:gap-5">
          <div className="text-left">
            <h3 className="mb-1 text-scale-card font-bold leading-none tracking-tight text-textHeading">{sensor.title}</h3>
            <p className="text-scale-caption font-medium tracking-wide text-textSecondary">{selectedRange} Trend</p>
          </div>

          <div className="hidden flex-wrap gap-2 md:flex">
            {ranges.map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`rounded-lg px-4 py-1.5 text-scale-caption font-semibold transition-all ${selectedRange === range ? 'bg-accentPrimary/10 text-accentPrimary border border-accentPrimary/30' : 'text-textSecondary border border-borderColor hover:border-textSecondary'}`}
              >
                {range}
              </button>
            ))}
          </div>

          <div className="relative w-full min-w-[140px] md:hidden">
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="w-full appearance-none cursor-pointer rounded-lg border border-borderColor bg-bgInput px-4 py-2.5 text-scale-caption font-bold text-accentPrimary outline-none"
            >
              {ranges.map((range) => (
                <option key={range} value={range} className="bg-bgCard text-textPrimary">{range}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <ChevronDown className="h-4 w-4 text-accentPrimary/60" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex flex-col items-end">
            <p className="text-scale-metric font-bold leading-none tracking-tighter" style={{ color: sensor.color }}>
              {sensor.value}
              <span className="ml-1 text-scale-body font-bold uppercase" style={{ color: sensor.color }}>{sensor.unit}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-borderColor bg-bgInput transition-all hover:bg-borderColor active:scale-95 md:h-9 md:w-9"
          >
            <X className="h-4 w-4 text-textSecondary" />
          </button>
        </div>
      </div>

      <div className="relative mt-2 flex h-[200px] w-full items-end justify-center p-0 md:h-[260px]">
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
      'O3': 'o3',
      'Soil Moisture 1': 'soil_moisture_1',
      'Soil Moisture 2': 'soil_moisture_2',
      'Soil Temp 1': 'soil_temperature',
      'Soil Temp 2': 'soil_temperature_2',
      'Air Humidity': 'humidity',
      'Pressure': 'pressure'
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
    const interval = setInterval(fetchHistory, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [sensorId, selectedRange, sensor.title]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-borderColor bg-bgCard p-5 shadow-card md:p-6">
      <div className="mb-4 flex items-center justify-between md:hidden">
        <div className="flex items-center gap-4">
          <h3 className="text-scale-card font-bold tracking-tight text-textHeading">{sensor.title}</h3>
          <p className="text-scale-card font-bold leading-none tracking-tighter text-accentPrimary">
            {sensor.value}
            <span className="ml-0.5 text-scale-caption font-bold uppercase">.{sensor.unit}</span>
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-borderColor bg-bgInput transition-all active:scale-95 group"
        >
          <X className="h-4 w-4 text-textSecondary" />
        </button>
      </div>

      <p className="mb-4 text-scale-caption font-bold uppercase tracking-[0.2em] text-textSecondary md:hidden">{selectedRange} Trend</p>

      <div className="mb-8 hidden items-start justify-between md:flex">
        <div>
          <h3 className="mb-1 text-scale-section font-bold leading-tight tracking-tight text-textHeading">{sensor.title}</h3>
          <p className="text-scale-caption font-medium uppercase tracking-widest text-textSecondary">{selectedRange} Trend</p>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <p className="text-scale-metric font-bold leading-none tracking-tighter text-accentPrimary">
            {sensor.value}
            <span className="ml-0.5 text-scale-helper font-bold uppercase">.{sensor.unit}</span>
          </p>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-borderColor bg-bgInput transition-all hover:bg-borderColor active:scale-95 group md:h-10 md:w-10"
          >
            <X className="h-4 w-4 text-textSecondary" />
          </button>
        </div>
      </div>

      <div className="mb-6 max-w-[200px] md:mb-8 md:max-w-[180px]">
        <div className="relative">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="w-full appearance-none cursor-pointer rounded-lg border border-borderColor bg-bgInput px-4 py-2 text-scale-caption font-bold text-accentPrimary outline-none transition-colors hover:bg-borderColor md:px-5 md:py-2.5"
          >
            {ranges.map((range) => (
              <option key={range} value={range} className="bg-bgCard text-textPrimary uppercase">
                {range}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
            <ChevronDown className="h-4 w-4 text-accentPrimary/60" />
          </div>
        </div>
      </div>

      <div className="relative flex h-[220px] w-full items-end justify-center rounded-lg border border-borderColor bg-bgInput p-2 md:h-[300px]">
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
    { id: 'temperature', title: 'Air Temperature', value: data?.values?.temperature ?? '0', unit: '°C', icon: Thermometer, color: '#F59E0B' },
    { id: 'humidity', title: 'Air Humidity', value: data?.values?.humidity ?? '0', unit: '%', icon: Droplets, color: '#3B82F6' },
    { id: 'soil_temp1', title: 'Soil Temp 1', value: data?.values?.soil_temperature ?? '0', unit: '°C', icon: Thermometer, color: '#F97316' },
    { id: 'soil_temp2', title: 'Soil Temp 2', value: data?.values?.soil_temperature_2 ?? '0', unit: '°C', icon: Thermometer, color: '#F97316' },
    { id: 'soil_mois1', title: 'Soil Moisture 1', value: data?.values?.soil_moisture_1 !== undefined ? (Number(data.values.soil_moisture_1) / 100).toFixed(2) : '0', unit: 'v/v', icon: Droplets, color: '#06B6D4' },
    { id: 'soil_mois2', title: 'Soil Moisture 2', value: data?.values?.soil_moisture_2 !== undefined ? (Number(data.values.soil_moisture_2) / 100).toFixed(2) : '0', unit: 'v/v', icon: Droplets, color: '#06B6D4' },
    { id: 'leaf', title: 'Leaf Wetness', value: data?.values?.leaf ?? '0', unit: '%', icon: Leaf, color: '#22C55E' },
    { id: 'wind_speed', title: 'Wind Speed', value: data?.values?.wind_speed ?? '0', unit: 'm/s', icon: Wind, color: '#60A5FA' },
    { id: 'wind_dir', title: 'Wind Direction', value: data?.values?.wind_dir ?? '0', unit: '°', icon: Wind, color: '#60A5FA' },
    { id: 'pressure', title: 'Pressure', value: data?.values?.pressure ?? '0', unit: 'hPa', icon: Gauge, color: '#8B5CF6' },
    { id: 'solar_radiation', title: 'Solar Radiation', value: data?.values?.solar_radiation ?? '0', unit: 'W/m²', icon: Sun, color: '#FBBF24' },
    { id: 'rainfall', title: 'Rainfall', value: data?.values?.rainfall ?? '0', unit: 'mm', icon: CloudRain, color: '#3B82F6' },
  ];

  const gridGroups = [];
  for (let i = 0; i < nestSensors.length; i += 4) {
    gridGroups.push(nestSensors.slice(i, i + 4));
  }

  const activeSensorData = nestSensors.find((s) => s.id === activeSensor);
  const toggleSensor = (id: string) => {
    setActiveSensor(activeSensor === id ? null : id);
  };

  const isOnline = data?.isOnline ?? true;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="flex max-h-[90vh] w-[94vw] flex-col overflow-hidden rounded-xl border border-borderColor bg-bgCard shadow-elevated md:max-w-[1280px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-borderColor px-6 py-4 md:px-10 md:py-4">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accentPrimary/10 text-accentPrimary md:h-12 md:w-12">
              <Activity className="h-5 w-5 text-accentPrimary md:h-6 md:w-6" />
            </div>
            <div>
              <h2 className="text-scale-card font-bold leading-tight tracking-tight text-textHeading">Nest Device Sensors</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <StatusBadge
                  label={isOnline ? 'Online' : 'Offline'}
                  variant={isOnline ? 'success' : 'danger'}
                  size="sm"
                />
                <span className="text-borderColor">|</span>
                <p className="text-scale-caption font-medium text-textSecondary">{nestSensors.length} total sensors</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 transition hover:text-red-500">
            <X className="h-5 w-5 text-textSecondary" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:px-10 md:py-8">
          {gridGroups.map((group, groupIdx) => (
            <React.Fragment key={groupIdx}>
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
                {group.map((sensor) => (
                  <div key={sensor.id} className="w-full">
                    <div
                      onClick={() => toggleSensor(sensor.id)}
                      className={`flex h-[12.5rem] cursor-pointer flex-col justify-between rounded-lg border px-6 py-5 transition-all md:h-[13rem] md:px-8 md:py-6 ${activeSensor === sensor.id ? 'border-accentPrimary bg-accentPrimary/5 shadow-sm' : 'border-borderColor bg-bgInput shadow-sm hover:border-accentPrimary/30 hover:bg-bgCard active:scale-95'}`}
                    >
                      <div>
                        <div
                          className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg md:mb-6"
                          style={{ backgroundColor: `${sensor.color}1A` }}
                        >
                          <sensor.icon className="h-6 w-6" style={{ color: sensor.color }} />
                        </div>
                        <p className="mb-1 text-scale-caption font-bold uppercase tracking-wider text-textSecondary">
                          {sensor.title}
                        </p>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-scale-card font-extrabold leading-none tracking-tight text-textHeading">
                            {sensor.value}
                          </span>
                          <span className="mb-0.5 text-scale-caption font-bold tracking-wider text-textSecondary">
                            {sensor.unit}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-1.5 w-1.5 rounded-full ${isOnline ? 'bg-accentPrimary' : 'bg-textMuted'} md:h-2 md:w-2`} />
                          <span className={`text-scale-caption font-bold uppercase tracking-widest leading-none ${isOnline ? 'text-accentPrimary' : 'text-textSecondary'}`}>
                            {isOnline ? 'Operational' : 'No Signal'}
                          </span>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-textSecondary transition-transform ${activeSensor === sensor.id ? 'rotate-180' : ''}`} />
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

        <div className="mt-auto shrink-0 px-6 pb-6 md:px-10 md:pb-8">
          <div className="flex flex-col gap-1 rounded-lg border border-borderColor bg-bgInput px-6 py-4 md:px-8">
            <div className="flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-accentPrimary' : 'bg-danger'}`} />
              <p className={`text-scale-caption font-extrabold uppercase leading-none tracking-wider ${isOnline ? 'text-accentPrimary' : 'text-danger'}`}>
                {isOnline ? 'All sensors are operational' : 'Device connectivity issues detected'}
              </p>
            </div>
            <p className="ml-5 text-scale-caption font-medium tracking-tight text-textSecondary">
              {data?.isHistorical ? 'Showing last valid readings from: ' : 'Last updated: '}
              {data?.timestamp ? new Date(data.timestamp).toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
