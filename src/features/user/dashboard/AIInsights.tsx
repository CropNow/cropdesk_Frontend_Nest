import React from 'react';
import { Sparkles, RefreshCw, MessageSquare, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIInsights = ({
  showEmptyState = false,
}: {
  showEmptyState?: boolean;
}) => {
  const navigate = useNavigate();

  if (showEmptyState) {
    return (
      <section className="flex flex-col gap-4 border border-border p-3 lg:p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 via-background to-background dark:bg-card relative overflow-hidden h-full min-h-[220px] items-center justify-center text-center">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <button
            onClick={() => navigate('/register/farmer-details')}
            className="group flex flex-col items-center gap-4 transition-transform hover:scale-105 active:scale-95"
          >
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
              <Plus className="w-5 h-5 lg:w-8 lg:h-8 text-white" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-lg font-bold text-foreground">
                Add Farm Details
              </span>
              <span className="text-xs text-muted-foreground">
                Unlock AI-powered insights
              </span>
            </div>
          </button>
        </div>
        <div className="opacity-20 blur-sm pointer-events-none w-full h-full flex items-center justify-center">
          <Sparkles size={64} className="text-muted-foreground" />
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
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
                <div className="p-1.5 bg-orange-500/10 rounded-md">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white mb-0.5">
                    Soil Conditions
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">
                    moderate moisture, ideal temperature
                  </div>
                </div>
              </div>
              <div className="px-2.5 py-1 bg-orange-500/10 rounded-md ml-2 shrink-0">
                <span className="text-[10px] font-bold text-orange-500">
                  Optimal
                </span>
              </div>
            </div>

            {/* Weather Conditions */}
            <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-1.5 bg-green-500/10 rounded-md">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white mb-0.5">
                    Weather Conditions
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">
                    UV safe, Wind: calm
                  </div>
                </div>
              </div>
              <div className="px-2.5 py-1 bg-green-500/10 rounded-md ml-2 shrink-0">
                <span className="text-[10px] font-bold text-green-500">
                  Excellent
                </span>
              </div>
            </div>

            {/* Air Quality */}
            <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-1.5 bg-cyan-500/10 rounded-md">
                  <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white mb-0.5">
                    Air Quality
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">
                    excellent (100 ppm)
                  </div>
                </div>
              </div>
              <div className="px-2.5 py-1 bg-cyan-500/10 rounded-md ml-2 shrink-0">
                <span className="text-[10px] font-bold text-cyan-500">
                  Good
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="flex items-center gap-1.5 mb-5 ml-0.5">
          <div className="w-1 h-1 rounded-full bg-blue-400"></div>
          <p className="text-[9px] text-gray-500">Last updated: 7:03:52 pm</p>
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
              <div className="p-1 bg-yellow-500/10 rounded-sm mt-0.5 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-gray-300 leading-relaxed mb-1">
                  Current conditions are{' '}
                  <span className="text-white font-semibold">
                    optimal for crop growth
                  </span>
                </div>
                <div className="text-[10px] text-gray-500 leading-relaxed">
                  Soil moisture levels are balanced, and temperature ranges
                  support healthy development.
                </div>
              </div>
            </div>

            {/* Analysis Item 2 */}
            <div className="flex items-start gap-2.5">
              <div className="p-1 bg-green-500/10 rounded-sm mt-0.5 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-gray-300 leading-relaxed">
                  Consider light irrigation in the next 24 hours to maintain
                  ideal moisture levels.
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
