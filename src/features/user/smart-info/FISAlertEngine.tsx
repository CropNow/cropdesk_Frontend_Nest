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
  const [showSuggestions, setShowSuggestions] = useState(true); // Default open for visibility
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

  const filteredAlerts = alerts;
  const getCount = () => alerts.length;

  if (filteredAlerts.length === 0) {
    // Optional: Render nothing or a "No active alerts" state
    // render generic container
  }

  return (
    <div className="bg-card border border-border rounded-3xl p-8 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-600 rounded-2xl text-white shadow-lg shadow-red-600/20">
            <Zap size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              FIS Alert Engine
            </h2>
          </div>
        </div>
        {filteredAlerts.length > 0 && (
          <AlertTab
            label="Suggestions"
            count={getCount()}
            color="bg-red-600"
            active={showSuggestions}
            onClick={() => setShowSuggestions(!showSuggestions)}
          />
        )}
      </div>

      {/* Alert Cards */}
      {showSuggestions && (
        <div className="space-y-4 min-h-[100px] animate-in fade-in slide-in-from-top-4 duration-300">
          {filteredAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <div className="p-4 bg-muted rounded-full mb-3">
                <Zap size={20} className="opacity-50" />
              </div>
              <p className="text-sm">
                No active suggestions based on current sensor data.
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-muted border border-border rounded-2xl p-6 hover:border-border transition-all hover:shadow-lg"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2.5 rounded-xl bg-red-600/10 text-red-600`}
                    >
                      {alert.icon === 'wind' ? (
                        <Wind size={18} />
                      ) : alert.icon === 'droplets' ? (
                        <Droplets size={18} />
                      ) : alert.icon === 'thermometer' ? (
                        <Thermometer size={18} />
                      ) : (
                        <Sun size={18} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">
                        {alert.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {alert.confidence && (
                      <div
                        className={`px-4 py-2 text-white text-xs font-bold rounded-full bg-red-600`}
                      >
                        {alert.confidence}% Confidence
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {alert.time}
                    </span>
                  </div>
                </div>

                {alert.confidence && (
                  <div className="relative h-10 bg-background rounded-xl overflow-hidden mb-6 group">
                    <div
                      className={`absolute inset-y-0 left-0 bg-red-600 flex items-center justify-between px-6 transition-all duration-1000 ease-out`}
                      style={{ width: `${alert.confidence}%` }}
                    >
                      <span className="text-xs font-bold text-white">
                        {alert.confidence}% Confidence
                      </span>
                    </div>
                  </div>
                )}

                {alert.recommendation && (
                  <div className="bg-background border border-border rounded-2xl p-6 mb-6 shadow-sm">
                    <div className="flex gap-4">
                      <div className="p-2.5 bg-red-600/10 rounded-xl text-red-600">
                        <Lightbulb size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-red-600 uppercase mb-2">
                          {alert.recommendation.title}
                        </h4>
                        <p className="text-sm text-foreground font-medium leading-relaxed">
                          {alert.recommendation.text}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleAction('Acknowledge', alert.id)}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-all"
                >
                  Acknowledge & Take Action
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const AlertTab = ({ label, count, color, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-bold uppercase border transition-all ${
      active
        ? 'bg-muted border-border text-foreground'
        : 'bg-transparent border-border text-muted-foreground hover:text-foreground'
    }`}
  >
    <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
    {label}
    <span
      className={`px-2.5 py-1 rounded-full text-xs ${
        active
          ? 'bg-red-500/20 text-red-400'
          : 'bg-background text-muted-foreground'
      }`}
    >
      {count}
    </span>
  </button>
);

export default FISAlertEngine;
