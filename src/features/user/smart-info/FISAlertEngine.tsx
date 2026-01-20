import React, { useState, useEffect } from 'react';
import { Zap, Wind, Droplets, Lightbulb, Thermometer, Sun } from 'lucide-react';

interface Metric {
  label: string;
  value: string;
  unit: string;
  trend: string;
  progress: number;
}

interface Alert {
  id: number;
  type: 'Suggestions' | 'Warning' | 'Critical';
  title: string;
  message: string;
  time: string;
  confidence?: number;
  icon: string;
  color: string;
  recommendation?: {
    icon: string;
    color: string;
    title: string;
    text: string;
  } | null;
}

const FISAlertEngine = ({ metrics }: { metrics: Metric[] }) => {
  const [activeTab, setActiveTab] = useState<
    'alerts' | 'warnings' | 'suggestions'
  >('suggestions');
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    if (!metrics || metrics.length === 0) return;

    const newAlerts: Alert[] = [];
    const timeStr = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    metrics.forEach((metric, idx) => {
      const val = parseFloat(metric.value);

      // Soil Moisture Rules
      if (metric.label === 'Soil Moisture') {
        if (val < 30) {
          newAlerts.push({
            id: 100 + idx,
            type: 'Suggestions',
            title: 'Soil Moisture Low',
            message: `Moisture level at ${metric.value}% - Consider irrigation`,
            time: timeStr,
            confidence: 85,
            icon: 'droplets',
            color: 'red',
            recommendation: {
              icon: 'lightbulb',
              color: 'red',
              title: 'Irrigation Advice:',
              text: 'Schedule irrigation for early morning to minimize evaporation. Target 60% soil moisture for optimal growth.',
            },
          });
        }
      }

      // Wind Speed Rules
      if (metric.label === 'Wind Speed') {
        if (val > 10) {
          newAlerts.push({
            id: 200 + idx,
            type: 'Warning',
            title: 'High Wind Alert',
            message: `Wind speed ${metric.value} m/s - Spraying unsafe`,
            time: timeStr,
            confidence: 90,
            icon: 'wind',
            color: 'red',
            recommendation: {
              icon: 'lightbulb',
              color: 'red',
              title: 'Safety Recommendation:',
              text: 'Do not spray pesticides. Waiting for wind speed to drop below 5 m/s is recommended.',
            },
          });
        }
      }

      // Temperature Rules
      if (metric.label === 'Temperature') {
        if (val > 35) {
          newAlerts.push({
            id: 300 + idx,
            type: 'Warning',
            title: 'Heat Stress Risk',
            message: `High temperature ${metric.value}°C detected`,
            time: timeStr,
            confidence: 80,
            icon: 'thermometer',
            color: 'orange',
            recommendation: null,
          });
        }
      }

      // UV Index Rules
      if (metric.label === 'UV Index') {
        if (val > 8) {
          newAlerts.push({
            id: 400 + idx,
            type: 'Suggestions',
            title: 'High UV Index',
            message: `UV level ${metric.value} - Protect sensitive crops`,
            time: timeStr,
            confidence: 75,
            icon: 'sun',
            color: 'orange',
            recommendation: null,
          });
        }
      }
    });

    // If no specific alerts, maybe add a "All Systems Nominal" or just empty
    // For demo purposes, if empty, we might want to show a default "Good" message or nothing
    // But the user wants "based on updates... give suggestions".

    setAlerts(newAlerts);
  }, [metrics]);

  const handleAction = async (actionName: string, alertId?: number) => {
    console.log(`Action triggered: ${actionName}`);
    if (actionName === 'Acknowledge' && alertId) {
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    }
  };

  const criticalAlerts = alerts.filter((a) => a.type === 'Critical');
  const warnings = alerts.filter((a) => a.type === 'Warning');
  const suggestions = alerts.filter((a) => a.type === 'Suggestions');

  const getFilteredAlerts = () => {
    if (activeTab === 'alerts') return criticalAlerts;
    if (activeTab === 'warnings') return warnings;
    return suggestions;
  };

  const filteredAlerts = getFilteredAlerts();

  return (
    <div className="bg-card border border-border rounded-3xl p-6 mb-6">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-600 rounded-xl text-white">
              <Zap size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                FIS Alert Engine
              </h2>
              <p className="text-xs text-muted-foreground">
                Smart monitoring & recommendations
              </p>
            </div>
          </div>
          <button className="text-xs text-primary hover:underline">
            View All
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          <AlertTab
            label="Alerts"
            count={criticalAlerts.length}
            color="bg-red-600"
            active={activeTab === 'alerts'}
            onClick={() => setActiveTab('alerts')}
          />
          <AlertTab
            label="Warnings"
            count={warnings.length}
            color="bg-orange-500"
            active={activeTab === 'warnings'}
            onClick={() => setActiveTab('warnings')}
          />
          <AlertTab
            label="Suggestions"
            count={suggestions.length}
            color="bg-green-500"
            active={activeTab === 'suggestions'}
            onClick={() => setActiveTab('suggestions')}
          />
        </div>
      </div>

      {/* Alert Cards */}
      {/* The original `showSuggestions` state is replaced by `activeTab` logic,
          but the instruction only replaces the header and tab rendering.
          To make this section functional with `activeTab`,
          the outer conditional `showSuggestions &&` should be removed or adapted.
          However, adhering strictly to the instruction, only the specified block is changed.
          The `filteredAlerts` variable is now correctly derived      {/* Alert Cards */}
      <div className="space-y-3 min-h-[100px]">
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <div className="p-3 bg-muted rounded-full mb-2">
              <Zap size={16} className="opacity-50" />
            </div>
            <p className="text-xs">No {activeTab} at this time.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-muted border border-border rounded-xl p-4 hover:border-border transition-all"
            >
              <div className="flex justify-between items-start gap-3 mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg bg-red-600/10 text-red-600`}>
                    {alert.icon === 'wind' ? (
                      <Wind size={16} />
                    ) : alert.icon === 'droplets' ? (
                      <Droplets size={16} />
                    ) : alert.icon === 'thermometer' ? (
                      <Thermometer size={16} />
                    ) : (
                      <Sun size={16} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-foreground">
                      {alert.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {alert.message}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {alert.time}
                </span>
              </div>

              {alert.confidence && (
                <div className="relative h-8 bg-background rounded-lg overflow-hidden mb-3">
                  <div
                    className={`absolute inset-y-0 left-0 bg-red-600 flex items-center justify-between px-3 transition-all duration-1000 ease-out`}
                    style={{ width: `${alert.confidence}%` }}
                  >
                    <span className="text-[10px] font-bold text-white">
                      {alert.confidence}% Confidence
                    </span>
                  </div>
                </div>
              )}

              {alert.recommendation && (
                <div className="bg-background border border-border rounded-lg p-3 mb-3">
                  <div className="flex gap-3">
                    <div className="p-2 bg-red-600/10 rounded-lg text-red-600 flex-shrink-0">
                      <Lightbulb size={16} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[10px] font-bold text-red-600 uppercase mb-1">
                        {alert.recommendation.title}
                      </h4>
                      <p className="text-xs text-foreground leading-relaxed">
                        {alert.recommendation.text}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => handleAction('Acknowledge', alert.id)}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-all"
              >
                Acknowledge & Take Action
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const AlertTab = ({ label, count, color, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
      active
        ? 'bg-red-600 border-red-600 text-white'
        : 'bg-transparent border-border text-muted-foreground hover:text-foreground hover:border-red-600/50'
    }`}
  >
    <div
      className={`w-2 h-2 rounded-full ${color} ${active ? 'opacity-100' : 'opacity-50'}`}
    ></div>
    {label}
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
        active ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
      }`}
    >
      {count}
    </span>
  </button>
);

export default FISAlertEngine;
