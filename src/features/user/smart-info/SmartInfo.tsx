import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Sprout,
  TrendingUp,
  TrendingDown,
  Thermometer,
  Sun,
  Wind,
  Sparkles,
} from 'lucide-react';
import FISAlertEngine from './FISAlertEngine';
import { getCalendarStatus, DailyStatus } from './smart-info.api';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { Button } from '@/components/ui/button';
import { getLatestPrediction } from '../dashboard/ml.service';
import { MLPrediction } from '@/types/ml.types';

const SmartInfo = () => {
  const navigate = useNavigate();
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [calendarData, setCalendarData] = useState<DailyStatus[]>([]);
  const [mlPrediction, setMlPrediction] = useState<MLPrediction | null>(null);

  const { user } = useAuth();

  React.useEffect(() => {
    const checkProfileStatus = async () => {
      if (user) {
        // Optimistic check (from session)
        if (
          (user.farmers && user.farmers.length > 0) ||
          (user.farmerDetails && Object.keys(user.farmerDetails).length > 0)
        ) {
          setIsProfileComplete(true);
          return;
        }

        // Deep check (from Backend)
        try {
          const { getAllFarmers } =
            await import('@/features/auth/api/farmer.api');
          const farmers = await getAllFarmers();

          if (farmers && farmers.length > 0) {
            const myFarmer = farmers.find((f: any) => {
              const fUserId =
                f.userId && typeof f.userId === 'object'
                  ? f.userId._id
                  : f.userId;
              return (
                String(fUserId) === String(user.id) ||
                String(f.farmerUserId) === String(user.id)
              );
            });

            if (myFarmer) {
              setIsProfileComplete(true);
            }
          }
        } catch (e) {
          console.error('SmartInfo: Failed to verify profile status', e);
        }
      }
    };
    checkProfileStatus();
  }, [user]);

  // Fetch Calendar Data when month changes
  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const data = await getCalendarStatus(
          currentDate.getFullYear(),
          currentDate.getMonth()
        );
        setCalendarData(data);
      } catch (error) {
        console.error('Failed to fetch calendar status', error);
      }
    };
    fetchCalendarData();
  }, [currentDate]);

  // Check for device/profile completeness
  const [hasDevices, setHasDevices] = useState(false);

  useEffect(() => {
    const checkDevices = () => {
      const devices = localStorage.getItem('connected_devices');
      if (devices && JSON.parse(devices).length > 0) {
        setHasDevices(true);
      } else {
        setHasDevices(false);
      }
    };
    checkDevices();
  }, []);

  // Fetch real IoT Data (shared with IOTDashboard)
  const [realIotData, setRealIotData] = useState<any>(null);

  const loadIotData = React.useCallback(() => {
    const dataStr = localStorage.getItem('iot_device_data');
    if (dataStr) {
      try {
        const parsed = JSON.parse(dataStr);
        setRealIotData(parsed);
      } catch (e) {
        console.error('SmartInfo: Failed to parse IoT Data');
      }
    }
  }, []);

  useEffect(() => {
    loadIotData();
    window.addEventListener('iot-data-updated', loadIotData);
    return () => window.removeEventListener('iot-data-updated', loadIotData);
  }, [loadIotData]);

  const hasData = isProfileComplete && hasDevices && realIotData;

  // Helper to extract value safely
  const getSensorValue = (category: string, sensorName: string): string => {
    if (!realIotData) return '0';
    const cat = realIotData.find((c: any) => c.id === category);
    if (!cat) return '0';
    const sens = cat.details.find((d: any) => d.name.includes(sensorName));
    return sens ? sens.value : '0';
  };

  // Helper to average sensor values (e.g. Root + Surface)
  const getAverageSensorValue = (
    category: string,
    sensorNames: string[]
  ): string => {
    if (!realIotData) return '0';
    const cat = realIotData.find((c: any) => c.id === category);
    if (!cat) return '0';

    let total = 0;
    let count = 0;

    sensorNames.forEach((name) => {
      const sens = cat.details.find((d: any) => d.name.includes(name));
      if (sens && !isNaN(parseFloat(sens.value))) {
        total += parseFloat(sens.value);
        count++;
      }
    });

    return count > 0 ? (total / count).toFixed(1) : '0';
  };

  // Extract readings
  // Averaging Soil Moisture (Surface + Root)
  const soilMoisture = getAverageSensorValue('soil', [
    'Soil Moisture at Surface',
    'Soil Moisture at Root',
  ]);
  // Averaging Soil Temperature (Surface + Root)
  const soilTemp = getAverageSensorValue('soil', [
    'Soil Temperature at Surface',
    'Soil Temperature at Root',
  ]);
  const windSpeed = getSensorValue('weather', 'Wind Speed');
  // UV is not in our default "Weather" category (we have Wind, Rain).
  // We have "Light" category with "Radiation".
  const uvIndex = getSensorValue('light', 'Radiation'); // Using Radiation as proxy for UV or placeholder

  // Fetch ML Prediction
  useEffect(() => {
    const fetchML = async () => {
      if (user && user.id) {
        try {
          // 1. Try to get latest from DB
          const pred = await getLatestPrediction(user.id);

          // 2. If we have real IoT data and the DB prediction is mock/missing/old,
          //    run a fresh analysis against the external ML Model.
          if (realIotData && (!pred || pred._id?.startsWith('pred_mock'))) {
            console.log('Fetching fresh analysis from ML Model...');
            const { analyzeCropHealth } =
              await import('../dashboard/ml.service');

            // Let's construct a cleaner payload
            const analysisPayload = {
              soilTemperature: soilTemp,
              soilMoisture: soilMoisture,
              windSpeed: windSpeed,
              // Add others if available or let them default
              temperature: getSensorValue('weather', 'Temperature'),
              humidity: getSensorValue('weather', 'Humidity'),
              rainfall: getSensorValue('weather', 'Rain'),
              pm2_5: getSensorValue('air', 'PM 2.5'),
              pm10: getSensorValue('air', 'PM 10'),
              co2: getSensorValue('air', 'CO2'),
              lightIntensity: getSensorValue('light', 'Light'),
              solarRadiation: getSensorValue('light', 'Radiation'),
            };

            const externalPred = await analyzeCropHealth(
              analysisPayload,
              user.id
            );

            // Try to assign real farmId if available
            if (user.farmers && user.farmers.length > 0) {
              const fId = (user.farmers[0] as any).farmId; // Cast to any to avoid potential type mismatch if type is incomplete
              if (fId)
                externalPred.farmId = typeof fId === 'object' ? fId._id : fId;
            }

            setMlPrediction(externalPred);
            return;
          }

          // Only set if different to avoid loops if objects are new refs
          setMlPrediction((prev) => {
            if (prev?._id === pred?._id) return prev;
            return pred;
          });
        } catch (e) {
          console.error('Failed to fetch ML prediction', e);
        }
      }
    };
    if (user) {
      fetchML();
    }
  }, [user, realIotData]); // Added realIotData dependency

  // Metric Data - Zeroed if no data
  const metrics = React.useMemo(
    () => [
      {
        icon: <Droplets size={18} />,
        value: hasData ? soilMoisture : '0',
        unit: '%',
        label: 'Soil Moisture',
        color: 'orange',
        trend: '', // Removed hardcoded label
        progress: hasData ? parseInt(soilMoisture) || 0 : 0,
      },
      {
        icon: <Thermometer size={18} />,
        value: hasData ? soilTemp : '0',
        unit: '°C',
        label: 'Temperature',
        color: 'cyan',
        trend: '', // Removed hardcoded label
        progress: hasData ? parseInt(soilTemp) || 0 : 0,
      },
      {
        icon: <Sun size={18} />,
        value: hasData ? uvIndex : '0',
        unit: '',
        label: 'UV Index',
        color: 'green',
        trend: '', // Removed hardcoded label
        progress: hasData ? parseInt(uvIndex) || 0 : 0,
      },
      {
        icon: <Wind size={18} />,
        value: hasData ? windSpeed : '0',
        unit: 'm/s',
        label: 'Wind Speed',
        color: 'indigo',
        trend: '', // Removed hardcoded label
        progress: hasData ? parseInt(windSpeed) || 0 : 0,
      },
    ],
    [hasData, soilMoisture, soilTemp, uvIndex, windSpeed]
  );

  // Calculate Overall Status
  const [averageScore, statusText, statusStyles] = React.useMemo(() => {
    // If we have ML prediction, derive logic from that first
    if (mlPrediction?.farm_status) {
      const score = mlPrediction.farm_status.farm_health_percentage;
      const condition = mlPrediction.farm_status.farm_condition.toUpperCase();

      // Request: Green if Healthy, Red if Unhealthy
      if (
        score >= 70 ||
        condition.includes('HEALTH') ||
        condition.includes('GOOD')
      ) {
        return [
          score,
          mlPrediction.farm_status.farm_condition,
          {
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            border: 'border-green-500/20',
          },
        ];
      } else {
        return [
          score,
          mlPrediction.farm_status.farm_condition,
          {
            color: 'text-red-500',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20',
          },
        ];
      }
    }

    // Fallback Legacy Calculation
    const totalProgress = metrics.reduce((acc, curr) => acc + curr.progress, 0);
    const avg = metrics.length ? Math.round(totalProgress / metrics.length) : 0;

    let text = 'Unknown';
    let styles = {
      color: 'text-muted-foreground',
      bg: 'bg-muted',
      border: 'border-border',
    };

    if (avg >= 90) {
      text = 'Excellent';
      styles = {
        color: 'text-green-500',
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
      };
    } else if (avg >= 70) {
      text = 'Good';
      styles = {
        color: 'text-teal-400',
        bg: 'bg-teal-400/10',
        border: 'border-teal-400/20',
      };
    } else if (avg >= 50) {
      text = 'Average';
      styles = {
        color: 'text-yellow-500',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
      };
    } else if (avg >= 30) {
      text = 'Bad';
      styles = {
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
      };
    } else {
      text = 'Very Bad';
      styles = {
        color: 'text-red-500',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
      };
    }

    return [avg, text, styles];
  }, [metrics, mlPrediction]);

  const {
    color: statusColor,
    bg: statusBg,
    border: statusBorder,
  } = statusStyles;

  // Sync Prediction & Status to Backend
  useEffect(() => {
    const syncToBackend = async () => {
      if (!user || !user.id || !mlPrediction || !hasData) return;

      const isTemporary =
        mlPrediction._id?.startsWith('pred_mock') ||
        mlPrediction._id?.startsWith('pred_external');

      if (mlPrediction.generatedBy === 'automatic' && !isTemporary) return;

      try {
        const { createPrediction } = await import('../dashboard/ml.service');
        console.log('Syncing Prediction & Farm Status...');
        const realPred = await createPrediction({
          ...mlPrediction,
          userId: user.id,
        });
        setMlPrediction(realPred);
      } catch (e) {
        console.error('Sync failed', e);
      }
    };

    const timeout = setTimeout(syncToBackend, 2000); // Debounce check
    return () => clearTimeout(timeout);
  }, [user, mlPrediction, hasData]);

  const handleInteraction = () => {
    if (!hasData) {
      navigate('/profile', { state: { openAddDevice: true } });
    }
  };

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  /* ... rest of calendar logic ... */
  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  return (
    <main className="min-h-screen bg-background text-foreground pb-20 pt-20 lg:pt-8 p-4 lg:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Calendar Widget */}
            <div className="bg-card border border-border rounded-3xl p-3 lg:p-6">
              <div className="flex justify-between items-center mb-3 lg:mb-6">
                <div className="flex items-center gap-2">
                  <CalendarIcon size={16} className="text-orange-500" />
                  <h3 className="font-bold text-sm lg:text-base">
                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h3>
                </div>
                <div className="flex gap-2 lg:gap-3">
                  <ChevronLeft
                    size={14}
                    onClick={handlePrevMonth}
                    className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  />
                  <ChevronRight
                    size={14}
                    onClick={handleNextMonth}
                    className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 lg:gap-2 text-center text-[10px] lg:text-xs font-medium text-muted-foreground mb-2 lg:mb-4">
                <span>Su</span>
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span>Sa</span>
              </div>

              <div className="grid grid-cols-7 gap-1 lg:gap-2 text-center text-xs lg:text-sm">
                {Array(firstDayOfMonth)
                  .fill(null)
                  .map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                  // Find status for this date from fetched data
                  const statusObj = calendarData.find(
                    (d) => d.date === dateStr
                  );

                  let dotColor = null;
                  if (statusObj) {
                    if (statusObj.status === 'Good') dotColor = 'bg-green-500';
                    else if (statusObj.status === 'Average')
                      dotColor = 'bg-yellow-500';
                    else if (statusObj.status === 'Bad')
                      dotColor = 'bg-red-500';
                  }

                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedDay(day)}
                      className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all hover:bg-muted relative text-[11px] lg:text-sm ${
                        selectedDay === day
                          ? 'bg-primary/10 text-primary font-bold border border-primary/20'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {day}
                      {dotColor && (
                        <span
                          className={`absolute bottom-0.5 lg:bottom-1 w-1 h-1 rounded-full ${dotColor}`}
                        ></span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 lg:mt-6 flex flex-wrap items-center gap-3 lg:gap-4 text-[9px] lg:text-[10px] font-bold uppercase text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>{' '}
                  Good
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>{' '}
                  Average
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>{' '}
                  Bad
                </div>
              </div>
            </div>

            {/* Overall Farm Status */}
            <div
              onClick={handleInteraction}
              className={`bg-card border border-border rounded-3xl p-4 lg:p-6 ${!hasData ? 'cursor-pointer hover:border-primary/50 transition-colors' : ''}`}
            >
              <div className="flex justify-between items-start mb-4 lg:mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 lg:p-3 rounded-xl ${statusColor} ${statusBg}`}
                  >
                    <Sprout size={20} />
                  </div>
                  <div>
                    <h2 className="text-base lg:text-lg font-bold">
                      Overall Farm Status
                    </h2>
                    <p className="text-[10px] text-muted-foreground">
                      Real-time monitoring
                    </p>
                  </div>
                </div>
                <div
                  className={`${statusBg} border ${statusBorder} rounded-xl px-3 py-1.5 lg:px-4 lg:py-2 flex items-center gap-2`}
                >
                  <TrendingUp size={14} className={statusColor} />
                  <div className="text-center">
                    <div className="text-sm lg:text-base font-bold text-foreground">
                      {averageScore}%
                    </div>
                    <div
                      className={`text-[9px] lg:text-[10px] font-bold ${statusColor} uppercase`}
                    >
                      {statusText}
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 gap-2 lg:gap-3">
                {metrics.map((metric, idx) => (
                  <MetricCard
                    key={idx}
                    icon={metric.icon}
                    value={metric.value}
                    unit={metric.unit}
                    label={metric.label}
                    color={metric.color}
                    trend={metric.trend}
                    progress={metric.progress}
                  />
                ))}
              </div>

              {/* Actions Footer */}
            </div>
          </div>

          <div className="lg:col-span-9 flex flex-col gap-6">
            <div
              onClick={handleInteraction}
              className={!hasData ? 'cursor-pointer' : ''}
            >
              {/* ML Prediction Summary Card - visible if prediction exists */}

              <FISAlertEngine metrics={metrics} prediction={mlPrediction} />
            </div>

            {/* BOTTOM SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LEFT COLUMN: Water Savings */}
              <div className="flex flex-col gap-6">
                {/* WATER SAVINGS */}
                <div
                  onClick={handleInteraction}
                  className={`bg-card border border-border rounded-3xl p-4 lg:p-8 ${!hasData ? 'cursor-pointer hover:border-primary/50 transition-colors' : ''}`}
                >
                  <div className="flex justify-between items-center mb-4 lg:mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2 lg:p-3 bg-cyan-500/10 rounded-xl text-cyan-500">
                        <Droplets size={20} />
                      </div>
                      <div>
                        <h2 className="text-base lg:text-xl font-bold">
                          Water Savings
                        </h2>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2">
                      <TrendingUp size={12} className="text-green-500" />
                      <span className="text-xs font-bold text-green-500">
                        {hasData ? '15.0%' : '0%'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 lg:gap-6 mb-4 lg:mb-8">
                    <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-900/10 border border-border/50 rounded-2xl p-4 lg:p-6 flex flex-col items-center justify-center text-center">
                      <div className="flex items-center gap-2 text-cyan-400 mb-2">
                        <Droplets size={14} />
                        <span className="text-[10px] lg:text-xs font-bold uppercase">
                          Total Saved
                        </span>
                      </div>
                      <div className="text-2xl lg:text-4xl font-bold text-cyan-400 mb-1">
                        {hasData ? '0 L' : '0 L'}
                      </div>
                      <div className="text-[10px] lg:text-xs text-muted-foreground">
                        This Month
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/20 to-green-900/10 border border-border/50 rounded-2xl p-4 lg:p-6 flex flex-col items-center justify-center text-center">
                      <div className="flex items-center gap-2 text-green-400 mb-2">
                        <TrendingDown size={14} />
                        <span className="text-[10px] lg:text-xs font-bold uppercase">
                          Daily Average
                        </span>
                      </div>
                      <div className="text-2xl lg:text-4xl font-bold text-green-400 mb-1">
                        {hasData ? '0 L' : '0 L'}
                      </div>
                      <div className="text-[10px] lg:text-xs text-muted-foreground">
                        Per Day
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

// Helper Components

const MetricCard = ({
  icon,
  value,
  unit,
  label,
  color,
  trend,
  progress,
}: any) => {
  const colorMap: any = {
    orange: 'text-orange-500 bg-orange-500/10',
    cyan: 'text-cyan-500 bg-cyan-500/10',
    green: 'text-green-500 bg-green-500/10',
    indigo: 'text-indigo-500 bg-indigo-500/10',
  };

  const barColorMap: any = {
    orange: 'bg-orange-500',
    cyan: 'bg-cyan-500',
    green: 'bg-green-500',
    indigo: 'bg-indigo-500',
  };

  return (
    <div className="bg-muted border border-border rounded-2xl p-3 lg:p-5">
      <div className="flex justify-between items-start mb-3 lg:mb-4">
        <div className={`p-2 lg:p-2.5 rounded-lg ${colorMap[color]}`}>
          {icon}
        </div>
        {trend && (
          <div className="px-2 py-1 bg-background/50 rounded-full text-[10px] lg:text-xs font-bold text-muted-foreground">
            {trend}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-xl lg:text-2xl font-bold text-foreground">
          {value}
        </span>
        <span className="text-xs lg:text-sm font-medium text-muted-foreground">
          {unit}
        </span>
      </div>
      <p className="text-[10px] lg:text-xs font-bold text-muted-foreground uppercase mb-3 lg:mb-4">
        {label}
      </p>

      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="h-1.5 w-full bg-background/50 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${barColorMap[color]}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default SmartInfo;
