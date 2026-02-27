/* eslint-disable no-console */
import React from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { getLatestPrediction } from './ml.service';
import { MLPrediction } from '@/types/ml.types';

const AIInsights = ({
  showEmptyState = false,
}: {
  showEmptyState?: boolean;
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // Fetch real IoT Data (shared with IOTDashboard)
  const [realIotData, setRealIotData] = React.useState<any>(null);
  const [prediction, setPrediction] = React.useState<MLPrediction | null>(null);

  const loadData = React.useCallback(() => {
    const dataStr = localStorage.getItem('iot_device_data');
    if (dataStr) {
      try {
        const parsed = JSON.parse(dataStr);
        setRealIotData(parsed);
      } catch (e) {
        console.error('Failed to parse IoT Data');
      }
    }
  }, []);

  React.useEffect(() => {
    loadData();

    const handleUpdate = () => {
      console.log('AIInsights: Received IoT update event');
      loadData();
    };

    window.addEventListener('iot-data-updated', handleUpdate);
    return () => window.removeEventListener('iot-data-updated', handleUpdate);
  }, [loadData]);

  React.useEffect(() => {
    const fetchPrediction = async () => {
      if (user && user.id) {
        try {
          // 1. Try to get latest from DB
          const pred = await getLatestPrediction(user.id);

          // 2. If we have real IoT data and the DB prediction is mock/missing/old,
          //    OR if the server prediction lacks structured data, run fresh analysis.
          const needsFreshAnalysis =
            !pred ||
            pred._id?.startsWith('pred_mock') ||
            !pred.pest ||
            !pred.irrigation;

          if (realIotData && needsFreshAnalysis) {
            // Need to allow time for component to mount/check
            const { analyzeCropHealth } = await import('./ml.service');

            // Helper to extract value safely (mini version of what SmartInfo has)
            const getSensorValue = (catId: string, sensorName: string) => {
              const cat = realIotData.find((c: any) => c.id === catId);
              if (!cat) return '0';
              const sens = cat.details.find((d: any) =>
                d.name.toLowerCase().includes(sensorName.toLowerCase())
              );
              return sens && sens.value ? sens.value : '0';
            };

            // Construct Payload
            const analysisPayload = {
              soilTemperature: getSensorValue('soil', 'Soil Temperature'),
              soilMoisture: getSensorValue('soil', 'Soil Moisture'),
              windSpeed: getSensorValue('weather', 'Wind Speed'),
              temperature: getSensorValue('weather', 'Temperature'),
              humidity: getSensorValue('weather', 'Humidity'),
              rainfall: getSensorValue('weather', 'Rain Fall'),
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
            setPrediction(externalPred);
            return;
          }

          setPrediction(pred);
        } catch (error) {
          console.error('Failed to fetch AI prediction:', error);
        }
      }
    };
    fetchPrediction();
  }, [user, realIotData]);

  const hasData = !showEmptyState && !!prediction;

  const handleInteraction = () => {
    if (!hasData) {
      navigate('/profile', { state: { openAddDevice: true } });
    }
  };

  return (
    <section
      onClick={handleInteraction}
      className={`flex flex-col gap-4 ${!hasData ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
    >
      <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-5 border border-border">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
              <Sparkles size={18} className="text-blue-400" />
            </div>
            <h4 className="text-base font-bold text-card-foreground">
              AI Insights
            </h4>
          </div>
        </div>

        {/* Key Insights Section */}
        <div className="mb-5">
          <h5 className="text-[9px] font-bold uppercase tracking-wider mb-3 ml-0.5 text-muted-foreground">
            KEY INSIGHTS
          </h5>

          <div className="space-y-2.5">
            {/* Irrigation */}
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 border-border hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`p-1.5 rounded-md ${hasData && prediction?.irrigation?.irrigation_required ? 'bg-orange-500/10' : 'bg-green-500/10'}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${hasData && prediction?.irrigation?.irrigation_required ? 'bg-orange-500' : 'bg-green-500'}`}
                  ></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold mb-0.5 text-card-foreground">
                    Irrigation
                  </div>
                  <div className="text-[10px] truncate text-muted-foreground">
                    {hasData && prediction?.irrigation
                      ? `Moisture: ${(prediction.irrigation.soil_moisture * 100).toFixed(0)}%, Water Req: ${prediction.irrigation.water_requirement_mm}mm`
                      : 'No data available'}
                  </div>
                </div>
              </div>
              <div
                className={`px-2.5 py-1 rounded-md ml-2 shrink-0 ${hasData && prediction?.irrigation?.irrigation_required ? 'bg-orange-500/10' : 'bg-green-500/10'}`}
              >
                <span
                  className={`text-[10px] font-bold ${hasData && prediction?.irrigation?.irrigation_required ? 'text-orange-500' : 'text-green-500'}`}
                >
                  {hasData && prediction?.irrigation
                    ? prediction.irrigation.irrigation_required
                      ? 'Water Ready'
                      : 'Optimal'
                    : '-'}
                </span>
              </div>
            </div>

            {/* Fungal */}
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 border-border hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`p-1.5 rounded-md ${hasData && prediction?.fungal_disease?.activity_level === 'HIGH' ? 'bg-red-500/10' : 'bg-green-500/10'}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${hasData && prediction?.fungal_disease?.activity_level === 'HIGH' ? 'bg-red-500' : 'bg-green-500'}`}
                  ></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold mb-0.5 text-card-foreground">
                    Fungal
                  </div>
                  <div className="text-[10px] truncate text-muted-foreground">
                    {hasData && prediction?.fungal_disease
                      ? `Activity: ${prediction.fungal_disease.activity_level}, Risk: ${prediction.fungal_disease.risk_score}%`
                      : 'No data available'}
                  </div>
                </div>
              </div>
              <div
                className={`px-2.5 py-1 rounded-md ml-2 shrink-0 ${hasData && prediction?.fungal_disease?.activity_level === 'HIGH' ? 'bg-red-500/10' : 'bg-green-500/10'}`}
              >
                <span
                  className={`text-[10px] font-bold ${hasData && prediction?.fungal_disease?.activity_level === 'HIGH' ? 'text-red-500' : 'text-green-500'}`}
                >
                  {hasData && prediction?.fungal_disease?.activity_level
                    ? prediction.fungal_disease.activity_level
                    : '-'}
                </span>
              </div>
            </div>

            {/* Pest */}
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 border-border hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`p-1.5 rounded-md ${hasData && prediction?.pest?.pest_risk_level === 'HIGH' ? 'bg-red-500/10' : 'bg-green-500/10'}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${hasData && prediction?.pest?.pest_risk_level === 'HIGH' ? 'bg-red-500' : 'bg-green-500'}`}
                  ></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold mb-0.5 text-card-foreground">
                    Pest
                  </div>
                  <div className="text-[10px] truncate text-muted-foreground">
                    {hasData && prediction?.pest
                      ? `Risk Level: ${prediction.pest.pest_risk_level}, Score: ${prediction.pest.pest_risk_score}%`
                      : 'No data available'}
                  </div>
                </div>
              </div>
              <div
                className={`px-2.5 py-1 rounded-md ml-2 shrink-0 ${hasData && prediction?.pest?.pest_risk_level === 'HIGH' ? 'bg-red-500/10' : 'bg-green-500/10'}`}
              >
                <span
                  className={`text-[10px] font-bold ${hasData && prediction?.pest?.pest_risk_level === 'HIGH' ? 'text-red-500' : 'text-green-500'}`}
                >
                  {hasData && prediction?.pest?.pest_risk_level
                    ? prediction.pest.pest_risk_level
                    : '-'}
                </span>
              </div>
            </div>

            {/* AQI */}
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 border-border hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`p-1.5 rounded-md ${hasData && prediction?.aqi?.aqi_level === 'GOOD' ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${hasData && prediction?.aqi?.aqi_level === 'GOOD' ? 'bg-green-500' : 'bg-yellow-500'}`}
                  ></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold mb-0.5 text-card-foreground">
                    AQI
                  </div>
                  <div className="text-[10px] truncate text-muted-foreground">
                    {hasData && prediction?.aqi
                      ? `Level: ${prediction.aqi.aqi.toFixed(0)} (${prediction.aqi.dominant_pollutant})`
                      : 'No data available'}
                  </div>
                </div>
              </div>
              <div
                className={`px-2.5 py-1 rounded-md ml-2 shrink-0 ${hasData && prediction?.aqi?.aqi_level === 'GOOD' ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}
              >
                <span
                  className={`text-[10px] font-bold ${hasData && prediction?.aqi?.aqi_level === 'GOOD' ? 'text-green-500' : 'text-yellow-500'}`}
                >
                  {hasData && prediction?.aqi ? prediction.aqi.aqi_level : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-center gap-1.5 mb-5 ml-0.5">
          <div className="w-1 h-1 rounded-full bg-blue-400"></div>
          <p className="text-[9px] text-muted-foreground">
            Last updated:{' '}
            {localStorage.getItem('last_iot_refresh')
              ? new Date(
                  parseInt(localStorage.getItem('last_iot_refresh')!)
                ).toLocaleString()
              : hasData && prediction?.generatedAt
                ? new Date(prediction.generatedAt).toLocaleString()
                : 'Never'}
          </p>
        </div>

        {/* AI Farm Health Analysis Card */}
        <div className="mb-5">
          <h5 className="text-[9px] font-bold tracking-wider mb-3 ml-0.5 text-muted-foreground">
            AI Farm Health Analysis
          </h5>
          <div className="rounded-xl p-4 relative overflow-hidden shadow-lg border bg-muted/30 transition-all text-card-foreground">
            <div className="relative z-10">
              <div className="flex flex-col gap-4">
                {/* Score & Condition */}
                <div>
                  <h2 className="text-3xl font-bold mb-1 text-card-foreground">
                    {hasData && prediction?.farm_status
                      ? prediction.farm_status.farm_health_percentage
                      : '--'}
                    %{' '}
                    <span className="text-sm font-medium text-muted-foreground">
                      Score
                    </span>
                  </h2>
                  <div className="text-[11px] flex items-center gap-1.5 text-muted-foreground">
                    <span>Condition:</span>
                    <span
                      className={`font-bold uppercase ${
                        hasData && prediction?.farm_status
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {hasData && prediction?.farm_status
                        ? prediction.farm_status.farm_condition
                        : 'Unknown'}
                    </span>
                    <span className="mx-1 opacity-50">•</span>
                    <span className="text-muted-foreground">
                      Valid until{' '}
                      {hasData && prediction?.validUntil
                        ? new Date(prediction.validUntil).toLocaleDateString()
                        : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none bg-primary/10"></div>
          </div>
        </div>

        {/* Chat with AI Assistant Button */}
        <button
          disabled
          className="w-full py-3 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-not-allowed border bg-muted text-muted-foreground border-border hover:bg-muted/80"
        >
          <MessageSquare size={14} />
          Chat with AI Assistant (Coming Soon)
        </button>
      </div>
    </section>
  );
};

export default AIInsights;
