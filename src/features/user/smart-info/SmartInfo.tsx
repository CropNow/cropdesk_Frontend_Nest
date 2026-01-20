import React, { useState, useEffect } from 'react';
import {
  Camera,
  MessageSquare,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Zap,
  Wind,
  Droplets,
  Leaf,
  ChevronDown,
  Eye,
  AlertTriangle,
  Sprout,
  TrendingUp,
  TrendingDown,
  Thermometer,
  Sun,
  Plus,
} from 'lucide-react';
import FISAlertEngine from './FISAlertEngine';
import { getCalendarStatus, DailyStatus } from './smart-info.api';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { Button } from '@/components/ui/button';

const SmartInfo = () => {
  const navigate = useNavigate();
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [calendarData, setCalendarData] = useState<DailyStatus[]>([]);

  const handleAction = async (actionName: string) => {
    console.log(`Action triggered: ${actionName}`);
    // Simulate backend call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

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

  if (!isProfileComplete) {
    return (
      <div className="min-h-screen bg-background text-foreground p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Smart Information Unavailable</h1>
          <p className="text-muted-foreground">
            Please complete your profile to access smart insights and alerts.
          </p>
          <Button
            onClick={() => navigate('/register/farmer-details')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all"
          >
            <Plus size={20} />
            Complete Profile
          </Button>
        </div>
      </div>
    );
  }

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

  // Metric Data
  const metrics = [
    {
      icon: <Droplets size={18} />,
      value: '45',
      unit: '%',
      label: 'Soil Moisture',
      color: 'orange',
      trend: 'Low',
      progress: 45,
    },
    {
      icon: <Thermometer size={18} />,
      value: '28',
      unit: '°C',
      label: 'Temperature',
      color: 'cyan',
      trend: 'Optimal',
      progress: 70,
    },
    {
      icon: <Sun size={18} />,
      value: '6.0',
      unit: '',
      label: 'UV Index',
      color: 'green',
      trend: 'Safe',
      progress: 60,
    },
    {
      icon: <Wind size={18} />,
      value: '5.0',
      unit: 'm/s',
      label: 'Wind Speed',
      color: 'indigo',
      trend: 'High',
      progress: 85,
    },
  ];

  // Calculate Overall Status
  const totalProgress = metrics.reduce((acc, curr) => acc + curr.progress, 0);
  const averageScore = Math.round(totalProgress / metrics.length);

  let statusText = 'Unknown';
  let statusColor = 'text-muted-foreground';
  let statusBg = 'bg-muted';
  let statusBorder = 'border-border';

  if (averageScore >= 90) {
    statusText = 'Excellent';
    statusColor = 'text-green-500';
    statusBg = 'bg-green-500/10';
    statusBorder = 'border-green-500/20';
  } else if (averageScore >= 70) {
    statusText = 'Good';
    statusColor = 'text-teal-400';
    statusBg = 'bg-teal-400/10';
    statusBorder = 'border-teal-400/20';
  } else if (averageScore >= 50) {
    statusText = 'Average';
    statusColor = 'text-yellow-500';
    statusBg = 'bg-yellow-500/10';
    statusBorder = 'border-yellow-500/20';
  } else if (averageScore >= 30) {
    statusText = 'Bad';
    statusColor = 'text-orange-500';
    statusBg = 'bg-orange-500/10';
    statusBorder = 'border-orange-500/20';
  } else {
    statusText = 'Very Bad';
    statusColor = 'text-red-500';
    statusBg = 'bg-red-500/10';
    statusBorder = 'border-red-500/20';
  }

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
            <div className="bg-card border border-border rounded-3xl p-4 lg:p-6">
              <div className="flex justify-between items-start mb-4 lg:mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 lg:p-3 bg-green-500/10 rounded-xl text-green-500">
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
            <FISAlertEngine metrics={metrics} />

            {/* BOTTOM SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LEFT COLUMN: Water Savings */}
              <div className="flex flex-col gap-6">
                {/* WATER SAVINGS */}
                <div className="bg-card border border-border rounded-3xl p-4 lg:p-8">
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
                        15.0%
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
                        250 L
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
                        8.3 L
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
        <div className="px-2 py-1 bg-background/50 rounded-full text-[10px] lg:text-xs font-bold text-muted-foreground">
          {trend}
        </div>
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
