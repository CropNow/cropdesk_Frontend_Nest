/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import {
  Zap,
  Wind,
  Droplets,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Bug,
  Activity,
  Cloud,
  List,
} from 'lucide-react';
import { MLPrediction } from '@/types/ml.types';

interface Metric {
  label: string;
  value: string;
  unit: string;
  trend: string;
  progress: number;
}

interface Alert {
  id: string | number;
  type: 'Pest' | 'Fungal' | 'AQI' | 'Suggestions';
  title: string;
  message: string;
  time: string;
  confidence?: number;
  icon: any;
  color: string;
  recommendation?: {
    icon: any;
    color: string;
    title: string;
    text: string;
  } | null;
}

interface FISAlertEngineProps {
  metrics?: Metric[];
  prediction?: MLPrediction | null;
}

const FISAlertEngine = ({ metrics, prediction }: FISAlertEngineProps) => {
  const [activeTab, setActiveTab] = useState<
    'pest' | 'fungal' | 'aqi' | 'suggestions'
  >('pest');
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const newAlerts: Alert[] = [];
    const timeStr = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    // 1. Process Metrics (Legacy Logic)
    if (metrics && metrics.length > 0) {
      metrics.forEach((metric, idx) => {
        const val = parseFloat(metric.value);

        // Soil Moisture Rules
        if (metric.label === 'Soil Moisture') {
          if (val < 30) {
            newAlerts.push({
              id: `metric-soil-${idx}`,
              type: 'Suggestions',
              title: 'Soil Moisture Low',
              message: `Moisture level at ${metric.value}% - Consider irrigation`,
              time: timeStr,
              confidence: 85,
              icon: Droplets,
              color: 'red',
              recommendation: {
                icon: Lightbulb,
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
              id: `metric-wind-${idx}`,
              type: 'Suggestions',
              title: 'High Wind Alert',
              message: `Wind speed ${metric.value} m/s - Spraying unsafe`,
              time: timeStr,
              confidence: 90,
              icon: Wind,
              color: 'red',
              recommendation: {
                icon: Lightbulb,
                color: 'red',
                title: 'Safety Recommendation:',
                text: 'Do not spray pesticides. Waiting for wind speed to drop below 5 m/s is recommended.',
              },
            });
          }
        }
      });
    }

    // 2. Process New ML Structure
    if (prediction) {
      // A. Pest Risk
      if (prediction.pest) {
        const { pest_risk_level, pest_risk_score } = prediction.pest;
        let color = 'green';
        let icon = CheckCircle;

        if (pest_risk_level === 'HIGH' || pest_risk_score > 70) {
          color = 'red';
          icon = Bug;
        } else if (
          pest_risk_level === 'MEDIUM' ||
          (pest_risk_score > 30 && pest_risk_score <= 70)
        ) {
          color = 'yellow';
          icon = Bug;
        }

        newAlerts.push({
          id: 'ml-pest',
          type: 'Pest',
          title: 'Pest Analysis',
          message: `Risk Level: ${pest_risk_level} (${pest_risk_score}/100)`,
          time: timeStr,
          confidence: 85,
          icon: icon,
          color: color,
          recommendation: {
            icon: AlertTriangle,
            color: color,
            title: 'Pest Status:',
            text:
              color === 'red'
                ? 'Immediate scouting recommended.'
                : color === 'yellow'
                  ? 'Monitor closely for changes.'
                  : 'No immediate action required.',
          },
        });
      }

      // B. Irrigation
      if (prediction.irrigation) {
        const { irrigation_required, water_requirement_mm, decision_basis } =
          prediction.irrigation;
        if (irrigation_required) {
          newAlerts.push({
            id: 'ml-irrig',
            type: 'Suggestions',
            title: 'Irrigation Recommended',
            message: `Water Requirement: ${water_requirement_mm} mm`,
            time: timeStr,
            confidence: 90,
            icon: Droplets,
            color: 'blue',
            recommendation: {
              icon: Lightbulb,
              color: 'blue',
              title: 'Basis:',
              text:
                decision_basis ||
                'Based on soil moisture and weather forecast.',
            },
          });
        }
      }

      // C. Fungal Disease
      if (prediction.fungal_disease) {
        const { activity_level, risk_score, recommendation } =
          prediction.fungal_disease;
        let color = 'green';
        let icon = CheckCircle;

        if (activity_level === 'HIGH' || risk_score > 70) {
          color = 'red';
          icon = Activity;
        } else if (
          activity_level === 'MEDIUM' ||
          (risk_score > 30 && risk_score <= 70)
        ) {
          color = 'yellow';
          icon = Activity;
        }

        newAlerts.push({
          id: 'ml-fungal',
          type: 'Fungal',
          title: 'Fungal Activity',
          message: `Level: ${activity_level} (${risk_score}/100)`,
          time: timeStr,
          confidence: 80,
          icon: icon,
          color: color,
          recommendation: {
            icon: AlertTriangle,
            color: color,
            title: 'Fungal Advice:',
            text:
              recommendation ||
              (color === 'green'
                ? 'Conditions are healthy.'
                : 'Check for signs of disease.'),
          },
        });
      }

      // D. AQI
      if (prediction.aqi) {
        const { aqi, aqi_level, dominant_pollutant, plant_impact } =
          prediction.aqi;
        let color = 'green';

        if (aqi_level?.toUpperCase().includes('UNHEALTHY') || aqi > 100) {
          color = 'red';
        }

        newAlerts.push({
          id: 'ml-aqi',
          type: 'AQI',
          title: `Air Quality: ${aqi_level}`,
          message: `AQI: ${aqi} (${dominant_pollutant})`,
          time: timeStr,
          confidence: 95,
          icon: Cloud,
          color: color,
          recommendation: {
            icon: Lightbulb,
            color: color,
            title: 'Impact:',
            text: plant_impact,
          },
        });
      }

      // E. Prescriptions as Suggestions
      if (prediction.prescription && prediction.prescription.actions) {
        prediction.prescription.actions.forEach((action, i) => {
          newAlerts.push({
            id: `ml-rx-${i}`,
            type: 'Suggestions',
            title: 'AI Recommendation',
            message: action,
            time: timeStr,
            confidence: 0,
            icon: List,
            color: 'green',
            recommendation: null,
          });
        });
      }
    }

    setAlerts(newAlerts);
  }, [metrics, prediction]);

  const handleAction = async (
    actionName: string,
    alertId?: string | number
  ) => {
    console.log(`Action triggered: ${actionName}`);
    if (actionName === 'Acknowledge' && alertId) {
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    }
  };

  // Helper to resolve tailwind colors dynamically
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'red':
        return {
          bg: 'bg-red-500/10',
          text: 'text-red-500',
          border: 'border-red-500/20',
          solid: 'bg-red-500',
          light: 'bg-red-500/10',
        };
      case 'yellow':
        return {
          bg: 'bg-yellow-500/10',
          text: 'text-yellow-500',
          border: 'border-yellow-500/20',
          solid: 'bg-yellow-500',
          light: 'bg-yellow-500/10',
        };
      case 'green':
        return {
          bg: 'bg-green-500/10',
          text: 'text-green-500',
          border: 'border-green-500/20',
          solid: 'bg-green-500',
          light: 'bg-green-500/10',
        };
      case 'blue':
        return {
          bg: 'bg-blue-500/10',
          text: 'text-blue-500',
          border: 'border-blue-500/20',
          solid: 'bg-blue-500',
          light: 'bg-blue-500/10',
        };
      case 'orange':
        return {
          bg: 'bg-orange-500/10',
          text: 'text-orange-500',
          border: 'border-orange-500/20',
          solid: 'bg-orange-500',
          light: 'bg-orange-500/10',
        };
      case 'teal':
        return {
          bg: 'bg-teal-500/10',
          text: 'text-teal-500',
          border: 'border-teal-500/20',
          solid: 'bg-teal-500',
          light: 'bg-teal-500/10',
        };
      default:
        return {
          bg: 'bg-gray-500/10',
          text: 'text-gray-500',
          border: 'border-gray-500/20',
          solid: 'bg-gray-500',
          light: 'bg-gray-500/10',
        };
    }
  };

  const pestAlerts = alerts.filter((a) => a.type === 'Pest');
  const fungalAlerts = alerts.filter((a) => a.type === 'Fungal');
  const aqiAlerts = alerts.filter((a) => a.type === 'AQI');
  const suggestionAlerts = alerts.filter((a) => a.type === 'Suggestions');

  const getFilteredAlerts = () => {
    if (activeTab === 'pest') return pestAlerts;
    if (activeTab === 'fungal') return fungalAlerts;
    if (activeTab === 'aqi') return aqiAlerts;
    return suggestionAlerts;
  };

  const filteredAlerts = getFilteredAlerts();

  // Helper to determine tab color based on alert severity
  const getTabColor = (categoryAlerts: Alert[], defaultColor: string) => {
    if (categoryAlerts.length === 0) return defaultColor;

    // Check for High/Red alerts first
    if (categoryAlerts.some((a) => a.color === 'red')) return 'bg-red-500';

    // Check for Medium/Yellow/Orange alerts
    if (
      categoryAlerts.some((a) => a.color === 'yellow' || a.color === 'orange')
    )
      return 'bg-orange-500';

    // Check for Info/Blue alerts
    if (categoryAlerts.some((a) => a.color === 'blue')) return 'bg-blue-500';

    // Default to Green if all are green/good
    if (categoryAlerts.some((a) => a.color === 'green')) return 'bg-green-500';

    return defaultColor;
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-6 mb-6">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white">
              <Zap size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                FIS Alert Engine & AI
              </h2>
              <p className="text-xs text-muted-foreground">
                Smart monitoring & ML recommendations
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
            label="Pest"
            count={pestAlerts.length}
            color={getTabColor(pestAlerts, 'bg-green-500')}
            active={activeTab === 'pest'}
            onClick={() => setActiveTab('pest')}
          />
          <AlertTab
            label="Fungal"
            count={fungalAlerts.length}
            color={getTabColor(fungalAlerts, 'bg-green-500')}
            active={activeTab === 'fungal'}
            onClick={() => setActiveTab('fungal')}
          />
          <AlertTab
            label="Air Quality"
            count={aqiAlerts.length}
            color={getTabColor(aqiAlerts, 'bg-green-500')}
            active={activeTab === 'aqi'}
            onClick={() => setActiveTab('aqi')}
          />
          <AlertTab
            label="Suggestions"
            count={suggestionAlerts.length}
            color={getTabColor(suggestionAlerts, 'bg-blue-500')}
            active={activeTab === 'suggestions'}
            onClick={() => setActiveTab('suggestions')}
          />
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-3 min-h-[100px]">
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <div className="p-3 bg-muted rounded-full mb-2">
              <Zap size={16} className="opacity-50" />
            </div>
            <p className="text-xs">
              No {activeTab === 'aqi' ? 'Air Quality' : activeTab} insights at
              this time.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const styles = getColorClasses(alert.color);

            return (
              <div
                key={alert.id}
                className="bg-[#1a1a1a] border border-border/50 rounded-xl p-5 hover:border-border transition-all"
              >
                {/* Header */}
                <div className="flex justify-between items-start gap-3 mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`p-2 rounded-full ${styles.bg} ${styles.text}`}
                    >
                      {/* Icon Render */}
                      {alert.icon && <alert.icon size={18} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground">
                        {alert.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {alert.message.split('.')[0]}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {alert.time}
                  </span>
                </div>

                {/* Confidence Bar */}
                {alert.confidence && alert.confidence > 0 ? (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1.5">
                      <span
                        className={`text-[10px] font-bold uppercase ${styles.text}`}
                      >
                        Analysis Confidence
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {alert.confidence}%
                      </span>
                    </div>
                    <div className="relative h-6 w-full bg-muted/50 rounded-md overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 ${styles.solid} flex items-center px-3 transition-all duration-1000 ease-out`}
                        style={{ width: `${alert.confidence}%` }}
                      >
                        <span className="text-[10px] font-bold text-black/80">
                          {alert.confidence}% Confidence
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Recommendation Box */}
                {alert.recommendation && (
                  <div className="bg-black/20 border border-white/5 rounded-lg p-3 mb-4 flex gap-3 items-center">
                    <div
                      className={`p-2 rounded-full bg-transparent border border-white/10 ${styles.text} flex-shrink-0`}
                    >
                      <Lightbulb size={14} />
                    </div>
                    <div className="flex-1">
                      <h4
                        className={`text-[10px] font-bold ${styles.text} uppercase mb-0.5`}
                      >
                        {alert.recommendation.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {alert.recommendation.text}
                      </p>
                    </div>
                  </div>
                )}

                {/* Button */}
                <button
                  onClick={() => handleAction('Acknowledge', alert.id)}
                  className={`w-full py-3 ${styles.solid} hover:opacity-90 text-black text-xs font-bold rounded-lg transition-all uppercase tracking-wide`}
                >
                  Acknowledge
                </button>
              </div>
            );
          })
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
        ? `${color} border-${color.replace('bg-', '')} text-white`
        : 'bg-transparent border-border text-muted-foreground hover:text-foreground'
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
