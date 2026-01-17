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
} from 'lucide-react';
import FISAlertEngine from './FISAlertEngine';
import { getCalendarStatus, DailyStatus } from './smart-info.api';

import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

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

  React.useEffect(() => {
    const userStr = localStorage.getItem('registeredUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.farmerDetails && user.farmDetails) {
          setIsProfileComplete(true);
        }
      } catch (e) {}
    }
  }, []);

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
          <button
            onClick={() => navigate('/register/farmer-details')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all"
          >
            <Plus size={20} />
            Complete Profile
          </button>
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
    <main className="min-h-screen bg-background text-foreground pb-20 p-4 lg:p-8 font-sans">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Calendar Widget */}
            <div className="bg-card border border-border rounded-3xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <CalendarIcon size={18} className="text-orange-500" />
                  <h3 className="font-bold text-base">
                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h3>
                </div>
                <div className="flex gap-3">
                  <ChevronLeft
                    size={16}
                    onClick={handlePrevMonth}
                    className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  />
                  <ChevronRight
                    size={16}
                    onClick={handleNextMonth}
                    className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-muted-foreground mb-4">
                <span>Su</span>
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span>Sa</span>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center text-sm">
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
                      className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all hover:bg-muted relative ${
                        selectedDay === day
                          ? 'bg-primary/10 text-primary font-bold border border-primary/20'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {day}
                      {dotColor && (
                        <span
                          className={`absolute bottom-1 w-1 h-1 rounded-full ${dotColor}`}
                        ></span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase text-muted-foreground">
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
            <div className="bg-card border border-border rounded-3xl p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
                    <Sprout size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Overall Farm Status</h2>
                  </div>
                </div>
                <div
                  className={`${statusBg} border ${statusBorder} rounded-xl px-4 py-2 flex items-center gap-3`}
                >
                  <TrendingUp size={16} className={statusColor} />
                  <div className="text-center">
                    <div className="text-base font-bold text-foreground">
                      {averageScore}%
                    </div>
                    <div
                      className={`text-[10px] font-bold ${statusColor} uppercase`}
                    >
                      {statusText}
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 gap-3">
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
                <div className="bg-card border border-border rounded-3xl p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500">
                        <Droplets size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">Water Savings</h2>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-900/10 border border-border/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                      <div className="flex items-center gap-2 text-cyan-400 mb-2">
                        <Droplets size={16} />
                        <span className="text-xs font-bold uppercase">
                          Total Saved
                        </span>
                      </div>
                      <div className="text-4xl font-bold text-cyan-400 mb-1">
                        250 L
                      </div>
                      <div className="text-xs text-muted-foreground">
                        This Month
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/20 to-green-900/10 border border-border/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                      <div className="flex items-center gap-2 text-green-400 mb-2">
                        <TrendingDown size={16} />
                        <span className="text-xs font-bold uppercase">
                          Daily Average
                        </span>
                      </div>
                      <div className="text-4xl font-bold text-green-400 mb-1">
                        8.3 L
                      </div>
                      <div className="text-xs text-muted-foreground">
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
    <div className="bg-muted border border-border rounded-2xl p-5">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-lg ${colorMap[color]}`}>{icon}</div>
        <div className="px-2 py-1 bg-background/50 rounded-full text-xs font-bold text-muted-foreground">
          {trend}
        </div>
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        <span className="text-sm font-medium text-muted-foreground">
          {unit}
        </span>
      </div>
      <p className="text-xs font-bold text-muted-foreground uppercase mb-4">
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
