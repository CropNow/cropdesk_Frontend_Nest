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
  const [prediction, setPrediction] = React.useState<MLPrediction | null>(null);

  React.useEffect(() => {
    const fetchPrediction = async () => {
      if (user && user.id) {
        try {
          const data = await getLatestPrediction(user.id);
          setPrediction(data);
        } catch (error) {
          console.error('Failed to fetch AI prediction:', error);
        }
      }
    };
    fetchPrediction();
  }, [user]);

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
      <div className="bg-[#0f0f0f]/90 backdrop-blur-sm rounded-2xl p-5">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
              <Sparkles size={18} className="text-blue-400" />
            </div>
            <h4 className="text-base font-bold text-white">AI Insights</h4>
          </div>
        </div>

        {/* Key Insights Section */}
        <div className="mb-5">
          <h5 className="text-[9px] font-bold text-gray-500 uppercase tracking-wider mb-3 ml-0.5">
            KEY INSIGHTS
          </h5>

          <div className="space-y-2.5">
            {/* Soil Conditions */}
            <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`p-1.5 rounded-md ${hasData && prediction?.irrigation?.irrigation_required ? 'bg-orange-500/10' : 'bg-green-500/10'}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${hasData && prediction?.irrigation?.irrigation_required ? 'bg-orange-500' : 'bg-green-500'}`}
                  ></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white mb-0.5">
                    Soil Conditions
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">
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

            {/* Disease Risk (formerly Weather) */}
            <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`p-1.5 rounded-md ${hasData && (prediction?.fungal_disease?.activity_level === 'HIGH' || prediction?.pest?.pest_risk_level === 'HIGH') ? 'bg-red-500/10' : 'bg-green-500/10'}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${hasData && (prediction?.fungal_disease?.activity_level === 'HIGH' || prediction?.pest?.pest_risk_level === 'HIGH') ? 'bg-red-500' : 'bg-green-500'}`}
                  ></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white mb-0.5">
                    Disease Risk
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">
                    {hasData && prediction?.fungal_disease
                      ? `Fungal: ${prediction.fungal_disease.activity_level}, Pest: ${prediction.pest?.pest_risk_level}`
                      : 'No data available'}
                  </div>
                </div>
              </div>
              <div
                className={`px-2.5 py-1 rounded-md ml-2 shrink-0 ${hasData ? 'bg-green-500/10' : 'bg-gray-500/10'}`}
              >
                <span
                  className={`text-[10px] font-bold ${hasData ? 'text-green-500' : 'text-gray-500'}`}
                >
                  {hasData &&
                  prediction?.fungal_disease?.activity_level === 'LOW' &&
                  prediction?.pest?.pest_risk_level === 'LOW'
                    ? 'Low Risk'
                    : 'Monitor'}
                </span>
              </div>
            </div>

            {/* Air Quality */}
            <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`p-1.5 rounded-md ${hasData && prediction?.aqi?.aqi_level === 'GOOD' ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${hasData && prediction?.aqi?.aqi_level === 'GOOD' ? 'bg-green-500' : 'bg-yellow-500'}`}
                  ></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white mb-0.5">
                    Air Quality
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">
                    {hasData && prediction?.aqi
                      ? `AQI: ${prediction.aqi.aqi.toFixed(0)} (${prediction.aqi.dominant_pollutant})`
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
          <p className="text-[9px] text-gray-500">
            Last updated:{' '}
            {hasData && prediction?.generatedAt
              ? new Date(prediction.generatedAt).toLocaleTimeString()
              : 'Never'}
          </p>
        </div>

        {/* Smart Analysis Section */}
        <div className="mb-5">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-1.5 bg-blue-600/20 rounded-md border border-blue-500/30">
              <Sparkles size={14} className="text-blue-400" />
            </div>
            <h5 className="text-xs font-bold text-white">Smart Analysis</h5>
          </div>

          <div className="space-y-3">
            {/* Analysis Item 1 - Farm Status */}
            <div className="flex items-start gap-2.5">
              <div
                className={`p-1 rounded-sm mt-0.5 shrink-0 ${hasData ? 'bg-indigo-500/10' : 'bg-gray-500/10'}`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${hasData ? 'bg-indigo-500' : 'bg-gray-500'}`}
                ></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-gray-300 leading-relaxed mb-1">
                  {hasData && prediction?.farm_status ? (
                    <>
                      Farm Health:{' '}
                      <span className="text-white font-semibold">
                        {prediction.farm_status.farm_health_percentage}%
                      </span>
                      <span className="ml-2 text-[10px] text-gray-400">
                        ({prediction.farm_status.farm_condition})
                      </span>
                    </>
                  ) : (
                    'Connect a device to receive analysis'
                  )}
                </div>
                <div className="text-[10px] text-gray-500 leading-relaxed">
                  {hasData && prediction?.farm_status
                    ? `Stress Analysis: AQI (${prediction.farm_status.stress_breakdown.aqi_stress}%), Water (${prediction.farm_status.stress_breakdown.irrigation_stress}%)`
                    : ''}
                </div>
              </div>
            </div>

            {/* Analysis Item 2 - Recommendations */}
            <div className="flex items-start gap-2.5">
              <div
                className={`p-1 rounded-sm mt-0.5 shrink-0 ${hasData ? 'bg-green-500/10' : 'bg-gray-500/10'}`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${hasData ? 'bg-green-500' : 'bg-gray-500'}`}
                ></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-gray-300 leading-relaxed">
                  {hasData && prediction?.prescription?.actions?.length ? (
                    <>
                      Action:{' '}
                      <span className="text-white">
                        {prediction.prescription.actions[0]}
                      </span>
                    </>
                  ) : hasData ? (
                    'No urgent actions required.'
                  ) : (
                    'AI will analyze your sensor data here.'
                  )}
                </div>
                {hasData && prediction?.prescription?.actions?.length > 1 && (
                  <div className="text-[10px] text-gray-500 mt-1">
                    + {prediction.prescription.actions.length - 1} more
                    recommendations
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Chat with AI Assistant Button */}
        <button
          disabled
          className="w-full py-3 bg-white/5 text-gray-400 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-not-allowed border border-white/5 hover:bg-white/10"
        >
          <MessageSquare size={14} />
          Chat with AI Assistant (Coming Soon)
        </button>
      </div>
    </section>
  );
};

export default AIInsights;
