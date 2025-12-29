import React from 'react';
import {
  Cloud,
  Wind,
  Droplets,
  Eye,
  Calendar,
  CloudRain,
  Sun,
} from 'lucide-react';

const WeatherSection = () => {
  const forecast = [
    { day: 'Mon', icon: <Sun size={20} />, temp: '28°' },
    { day: 'Tue', icon: <CloudRain size={20} />, temp: '26°' },
    { day: 'Wed', icon: <Cloud size={20} />, temp: '27°' },
    { day: 'Thu', icon: <Sun size={20} />, temp: '29°' },
    { day: 'Fri', icon: <CloudRain size={20} />, temp: '25°' },
  ];

  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-xl font-semibold text-foreground">Weather Update</h3>

      <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h4 className="text-xl font-medium text-foreground">
              REVA University
            </h4>
            <p className="text-sm text-muted-foreground">
              Bangalore, Karnataka
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar size={14} />
            Dec 8, 2025
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-blue-500/10 rounded-xl text-blue-500 border border-blue-500/20">
            <Cloud size={40} />
          </div>
          <div>
            <div className="text-5xl font-bold text-foreground leading-tight">
              28<span className="text-2xl font-medium ml-1">°C</span>
            </div>
            <p className="text-muted-foreground">Partly Cloudy</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <MetricCard
            icon={<Wind size={16} />}
            label="Wind"
            value="12 km/h"
            color="cyan"
          />
          <MetricCard
            icon={<Droplets size={16} />}
            label="Humidity"
            value="68%"
            color="blue"
          />
          <MetricCard
            icon={<Eye size={16} />}
            label="Visibility"
            value="10 km"
            color="purple"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
          5-Day Forecast
        </p>
        <div className="flex sm:grid sm:grid-cols-5 gap-4 overflow-x-auto pb-2 sm:pb-0 custom-scrollbar">
          {forecast.map((item, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-24 sm:w-auto flex flex-col items-center gap-3 py-4 rounded-xl bg-background border border-border shadow-sm hover:shadow-md transition-all hover:bg-card group"
            >
              <span className="text-xs font-medium text-muted-foreground uppercase">
                {item.day}
              </span>
              <div className="text-yellow-500">{item.icon}</div>
              <span className="text-lg font-bold text-foreground">
                {item.temp}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="p-3 bg-green-500/10 rounded-xl text-green-500 border border-green-500/20">
          <CloudRain size={24} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h5 className="font-semibold text-foreground">Rainfall Expected</h5>
            <span className="text-[10px] font-bold bg-green-500/10 text-green-500 px-2 py-0.5 rounded border border-green-500/20">
              ALERT
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Light rain expected tomorrow afternoon. Plan irrigation accordingly.
          </p>
        </div>
      </div>
    </section>
  );
};

const MetricCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  color: 'cyan' | 'blue' | 'purple';
}) => {
  const colorClasses = {
    cyan: 'bg-cyan-500/5 border-cyan-500/10 text-cyan-500',
    blue: 'bg-blue-500/5 border-blue-500/10 text-blue-500',
    purple: 'bg-purple-500/5 border-purple-500/10 text-purple-500',
  };

  return (
    <div
      className={`p-3 rounded-xl border ${colorClasses[color].split(' ').slice(0, 2).join(' ')}`}
    >
      <div
        className={`flex items-center gap-2 mb-1 ${colorClasses[color].split(' ').slice(2).join(' ')}`}
      >
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  );
};

export default WeatherSection;
