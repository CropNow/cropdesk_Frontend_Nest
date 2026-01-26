import React from 'react';
import { Sparkles, RefreshCw, MessageSquare, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIInsights = ({
  showEmptyState = false,
}: {
  showEmptyState?: boolean;
}) => {
  const navigate = useNavigate();

  const hasData = !showEmptyState;

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
          <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <RefreshCw size={16} className="text-gray-400" />
          </button>
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
                <div className={`p-1.5 rounded-md ${hasData ? 'bg-orange-500/10' : 'bg-gray-500/10'}`}>
                  <div className={`w-2 h-2 rounded-full ${hasData ? 'bg-orange-500' : 'bg-gray-500'}`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white mb-0.5">
                    Soil Conditions
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">
                    {hasData ? 'moderate moisture, ideal temperature' : 'No data available'}
                  </div>
                </div>
              </div>
              <div className={`px-2.5 py-1 rounded-md ml-2 shrink-0 ${hasData ? 'bg-orange-500/10' : 'bg-gray-500/10'}`}>
                <span className={`text-[10px] font-bold ${hasData ? 'text-orange-500' : 'text-gray-500'}`}>
                  {hasData ? 'Optimal' : '-'}
                </span>
              </div>
            </div>

            {/* Weather Conditions */}
            <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <div className={`p-1.5 rounded-md ${hasData ? 'bg-green-500/10' : 'bg-gray-500/10'}`}>
                  <div className={`w-2 h-2 rounded-full ${hasData ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white mb-0.5">
                    Weather Conditions
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">
                    {hasData ? 'UV safe, Wind: calm' : 'No data available'}
                  </div>
                </div>
              </div>
              <div className={`px-2.5 py-1 rounded-md ml-2 shrink-0 ${hasData ? 'bg-green-500/10' : 'bg-gray-500/10'}`}>
                <span className={`text-[10px] font-bold ${hasData ? 'text-green-500' : 'text-gray-500'}`}>
                  {hasData ? 'Excellent' : '-'}
                </span>
              </div>
            </div>

            {/* Air Quality */}
            <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <div className={`p-1.5 rounded-md ${hasData ? 'bg-cyan-500/10' : 'bg-gray-500/10'}`}>
                  <div className={`w-2 h-2 rounded-full ${hasData ? 'bg-cyan-500' : 'bg-gray-500'}`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white mb-0.5">
                    Air Quality
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">
                    {hasData ? 'excellent (100 ppm)' : 'No data available'}
                  </div>
                </div>
              </div>
              <div className={`px-2.5 py-1 rounded-md ml-2 shrink-0 ${hasData ? 'bg-cyan-500/10' : 'bg-gray-500/10'}`}>
                <span className={`text-[10px] font-bold ${hasData ? 'text-cyan-500' : 'text-gray-500'}`}>
                  {hasData ? 'Good' : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-center gap-1.5 mb-5 ml-0.5">
          <div className="w-1 h-1 rounded-full bg-blue-400"></div>
          <p className="text-[9px] text-gray-500">Last updated: {hasData ? '7:03:52 pm' : 'Never'}</p>
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
            {/* Analysis Item 1 */}
            <div className="flex items-start gap-2.5">
              <div className={`p-1 rounded-sm mt-0.5 shrink-0 ${hasData ? 'bg-yellow-500/10' : 'bg-gray-500/10'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${hasData ? 'bg-yellow-500' : 'bg-gray-500'}`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-gray-300 leading-relaxed mb-1">
                  {hasData ? <>Current conditions are <span className="text-white font-semibold">optimal for crop growth</span></> : 'Connect a device to receive analysis'}
                </div>
                <div className="text-[10px] text-gray-500 leading-relaxed">
                  {hasData ? 'Soil moisture levels are balanced, and temperature ranges support healthy development.' : ''}
                </div>
              </div>
            </div>

            {/* Analysis Item 2 */}
            <div className="flex items-start gap-2.5">
              <div className={`p-1 rounded-sm mt-0.5 shrink-0 ${hasData ? 'bg-green-500/10' : 'bg-gray-500/10'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${hasData ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-gray-300 leading-relaxed">
                  {hasData ? 'Consider light irrigation in the next 24 hours to maintain ideal moisture levels.' : 'AI will analyze your sensor data here.'}
                </div>
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
