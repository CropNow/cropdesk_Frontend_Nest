import React, { useState } from 'react';
import {
  Activity,
  Wind,
  Thermometer,
  Droplets,
  Sun,
  RefreshCw,
  Zap,
  CloudRain,
  Brain,
  Layout,
  MessageSquare,
  Calendar as CalendarIcon,
  AlertCircle,
  CheckCircle,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  Volume2,
  PlayCircle,
  Image as ImageIcon,
  AlertTriangle,
  Bell,
  TrendingUp,
  Sprout,
} from 'lucide-react';

const SmartInfo = () => {
  const [activeAlertTab, setActiveAlertTab] = useState('Alerts');

  return (
    <main className="min-h-screen bg-black text-white pb-20 p-4 lg:p-6 font-sans">
      <div className="max-w-[1600px] mx-auto pt-16 md:pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Analyze Image Card */}
            <div className="bg-[#111] border border-white/5 rounded-3xl p-6 hover:bg-[#151515] transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-2xl text-green-500 group-hover:scale-110 transition-transform">
                  <ImageIcon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Analyze Image</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Detect crop photo
                  </p>
                </div>
              </div>
            </div>

            {/* AI Chat Assistant Card */}
            <div className="bg-[#111] border border-white/5 rounded-3xl p-6 hover:bg-[#151515] transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500 group-hover:scale-110 transition-transform">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">AI Chat Assistant</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Experience agride insights
                  </p>
                </div>
              </div>
            </div>

            {/* Calendar Widget */}
            <div className="bg-[#111] border border-white/5 rounded-3xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold">Dec 2025</h3>
                <div className="flex gap-2">
                  <ChevronUp
                    size={16}
                    className="text-muted-foreground cursor-pointer"
                  />
                  <ChevronDown
                    size={16}
                    className="text-muted-foreground cursor-pointer"
                  />
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-muted-foreground mb-4">
                <span>Su</span>
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span>Sa</span>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium">
                {[...Array(31)].map((_, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg cursor-pointer hover:bg-white/5 ${i + 1 === 12 ? 'bg-green-500 text-black font-bold' : ''}`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-4 text-[10px] font-bold text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>{' '}
                  Events
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>{' '}
                  Today
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-9 flex flex-col gap-6">
            {/* FIS ALERT ENGINE */}
            <div className="bg-[#111] border border-white/5 rounded-[40px] p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500 rounded-2xl text-white">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">FIS Alert Engine</h2>
                    <p className="text-xs text-muted-foreground mt-1 tracking-wide uppercase">
                      Smart monitoring & recommendations
                    </p>
                  </div>
                </div>
                <button className="px-6 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-white/90 transition-all">
                  Welcome AI
                </button>
              </div>

              <div className="flex gap-4 mb-8">
                {['Alerts', 'Warnings', 'Suggestions'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveAlertTab(tab)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-xs font-bold border transition-all ${
                      activeAlertTab === tab
                        ? 'bg-white/5 border-white/10 text-white'
                        : 'bg-transparent border-white/5 text-muted-foreground'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${tab === 'Alerts' ? 'bg-red-500' : tab === 'Warnings' ? 'bg-orange-500' : 'bg-green-500'}`}
                    ></span>
                    {tab}
                    <span className="ml-2 px-2 py-0.5 bg-white/10 rounded-full text-[10px]">
                      {tab === 'Alerts' ? 1 : tab === 'Warnings' ? 2 : 1}
                    </span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6">
                {/* Major Alert Card */}
                <div className="bg-[#0c0c0c] border border-red-500/20 rounded-3xl p-6 relative overflow-hidden">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4">
                      <div className="p-3 bg-red-500/10 rounded-2xl text-red-500 ring-1 ring-red-500/20">
                        <Wind size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">
                          Wind Speed Safety Alert
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Wind speed 5.2 m/s - Unsafe for pesticide spraying
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      1:08:32 pm
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="relative h-10 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div className="absolute inset-y-0 left-0 w-full bg-red-500 flex items-center px-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">
                          100% Continuous
                        </span>
                      </div>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Volume2 size={16} className="text-white/50" />
                      </div>
                    </div>

                    <div className="bg-[#111] rounded-2xl p-6 border border-white/5">
                      <div className="flex gap-4">
                        <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500 h-fit">
                          <Brain size={20} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-orange-500/80 uppercase tracking-widest mb-2">
                            AI Recommendation:
                          </h4>
                          <p className="text-sm text-gray-400 leading-relaxed">
                            Postpone spraying operations until wind speed drops
                            below 3 m/s. Weather forecast indicates calmer
                            conditions expected in 2-3 hours.
                          </p>
                        </div>
                      </div>
                      <button className="w-full mt-6 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-red-600/20">
                        Acknowledge & Take Action
                      </button>
                    </div>
                  </div>
                </div>

                {/* Minor Alert Card */}
                <div className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-6 flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500 ring-1 ring-orange-500/20">
                      <Droplets size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">
                        Soil Moisture Low
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Moisture level at 45% - Consider irrigation
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="px-4 py-2 bg-orange-500/10 rounded-full border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest">
                      75% Continuous
                    </div>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      1:10:12 pm
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* OVERALL FARM STATUS */}
              <div className="bg-[#111] border border-white/5 rounded-[40px] p-8">
                <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-xl text-green-500">
                      <Layout size={20} />
                    </div>
                    <h2 className="text-xl font-bold">Overall Farm Status</h2>
                  </div>
                  <div className="relative w-16 h-16">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        className="text-white/5"
                        strokeDasharray="100, 100"
                        strokeWidth="3"
                        fill="none"
                        stroke="currentColor"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-green-500"
                        strokeDasharray="90, 100"
                        strokeWidth="3"
                        strokeLinecap="round"
                        fill="none"
                        stroke="currentColor"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-bold">90%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <StatusMiniCard
                    icon={<Sun size={18} />}
                    label="45"
                    unit="klux"
                    color="orange"
                    trend="UV Index"
                  />
                  <StatusMiniCard
                    icon={<Thermometer size={18} />}
                    label="28"
                    unit="°C"
                    color="cyan"
                    trend="Temperature"
                  />
                  <StatusMiniCard
                    icon={<Activity size={18} />}
                    label="6.0"
                    unit="pH"
                    color="green"
                    trend="Soil pH"
                  />
                  <StatusMiniCard
                    icon={<Wind size={18} />}
                    label="5.0"
                    unit="m/s"
                    color="indigo"
                    trend="Wind Speed"
                  />
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <Droplets size={14} /> Irrigation
                  </button>
                  <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <RefreshCw size={14} /> Monitor
                  </button>
                  <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <Zap size={14} /> Alerts
                  </button>
                </div>
              </div>

              {/* AI INSIGHTS */}
              <div className="bg-[#111] border border-white/5 rounded-[40px] p-8 flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500">
                      <Brain size={20} />
                    </div>
                    <h2 className="text-xl font-bold">AI Insights</h2>
                  </div>
                  <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-muted-foreground hover:text-white transition-all">
                    <RefreshCw size={16} />
                  </button>
                </div>

                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">
                  Key Insights
                </h3>

                <div className="space-y-3 mb-8">
                  <InsightItem
                    icon={<Sprout size={16} className="text-orange-500" />}
                    label="Soil Conditions"
                    status="Optimal"
                  />
                  <InsightItem
                    icon={<CloudRain size={16} className="text-green-500" />}
                    label="Weather Conditions"
                    status="Excellent"
                  />
                  <InsightItem
                    icon={<Wind size={16} className="text-indigo-500" />}
                    label="Air Quality"
                    status="Good"
                  />
                </div>

                <div className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
                    <p className="text-[9px] text-muted-foreground font-medium uppercase">
                      Smart Analysis
                    </p>
                  </div>
                  <div className="space-y-4 mb-6">
                    <p className="text-xs text-gray-400 group flex items-start gap-4">
                      <Sun
                        size={14}
                        className="text-yellow-500/50 flex-shrink-0 mt-0.5"
                      />
                      <span>
                        Current conditions are optimal for crop growth. Soil
                        moisture levels are balanced, and temperature ranges
                        support healthy development.
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 group flex items-start gap-4">
                      <Droplets
                        size={14}
                        className="text-indigo-500/50 flex-shrink-0 mt-0.5"
                      />
                      <span>
                        Consider light irrigation in the next 24 hours to
                        maintain ideal moisture levels.
                      </span>
                    </p>
                  </div>
                  <button className="mt-auto w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2">
                    <MessageSquare size={16} /> Chat with AI Assistant
                  </button>
                </div>
              </div>
            </div>

            {/* BOTTOM ROW: WATER SAVINGS & ENVIRONMENTAL IMPACT */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#111] border border-white/5 rounded-[40px] p-8">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                      <Droplets size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Water Savings</h2>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        with NEST technology
                      </p>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/20 text-green-500 text-[10px] font-bold flex items-center gap-1">
                    <TrendingUp size={12} /> 25.8%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-white/5 rounded-3xl p-6">
                    <div className="flex items-center gap-2 text-blue-500 mb-2">
                      <Activity size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        This Month
                      </span>
                    </div>
                    <div className="text-2xl font-bold">250 L</div>
                    <p className="text-[10px] text-muted-foreground mt-1 tracking-wider uppercase font-bold">
                      Total Saved
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-white/5 rounded-3xl p-6 text-right">
                    <div className="flex items-center justify-end gap-2 text-green-500 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        Per Day
                      </span>
                      <CheckCircle size={14} />
                    </div>
                    <div className="text-2xl font-bold">8.3 L</div>
                    <p className="text-[10px] text-muted-foreground mt-1 tracking-wider uppercase font-bold">
                      Saved Average
                    </p>
                  </div>
                </div>

                <button className="w-full py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold text-muted-foreground hover:text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <Layout size={14} /> View Detailed Report{' '}
                  <ChevronDown size={14} />
                </button>
              </div>

              <div className="bg-[#111] border border-white/5 rounded-[40px] p-8">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-8 flex items-center gap-2">
                  <Zap size={14} className="text-green-500" /> Environmental
                  Impact
                </h3>

                <div className="space-y-6">
                  <ImpactItem
                    label="3,075 kg CO₂ saved"
                    sub="Total carbon footprint reduction"
                    icon={<TrendingUp size={16} className="text-green-500" />}
                  />
                  <div className="h-px bg-white/5"></div>
                  <ImpactItem
                    label="3.8 kWh energy saved"
                    sub="Smart irrigation efficiency"
                    icon={<Zap size={16} className="text-orange-500" />}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const StatusMiniCard = ({
  icon,
  label,
  unit,
  color,
  trend,
}: {
  icon: any;
  label: string;
  unit: string;
  color: string;
  trend: string;
}) => {
  const colorMap: any = {
    orange: 'from-orange-500/20 text-orange-500 border-orange-500/30',
    cyan: 'from-cyan-500/20 text-cyan-500 border-cyan-500/30',
    green: 'from-green-500/20 text-green-500 border-green-500/30',
    indigo: 'from-indigo-500/20 text-indigo-500 border-indigo-500/30',
  };

  return (
    <div
      className={`bg-gradient-to-br to-transparent border rounded-[28px] p-5 ${colorMap[color]}`}
    >
      <div className={`p-2 bg-white/5 rounded-xl w-fit mb-4`}>{icon}</div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-2xl font-bold">{label}</span>
        <span className="text-[10px] font-medium opacity-60">{unit}</span>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-black uppercase tracking-widest opacity-60">
          {trend}
        </p>
        <div className={`p-1 bg-white/10 rounded-full`}>
          <ArrowUpRight size={10} />
        </div>
      </div>
    </div>
  );
};

const InsightItem = ({
  icon,
  label,
  status,
}: {
  icon: any;
  label: string;
  status: string;
}) => (
  <div className="flex items-center justify-between p-4 bg-[#0c0c0c] border border-white/5 rounded-2xl group hover:border-white/10 transition-all cursor-pointer">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-sm font-bold">{label}</span>
    </div>
    <span className="text-[10px] px-3 py-1 bg-white/5 rounded-full text-muted-foreground font-bold uppercase tracking-wider">
      {status}
    </span>
  </div>
);

const ImpactItem = ({
  label,
  sub,
  icon,
}: {
  label: string;
  sub: string;
  icon: any;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-white/5 rounded-xl">{icon}</div>
      <div>
        <h4 className="text-sm font-bold mb-0.5">{label}</h4>
        <p className="text-[10px] text-muted-foreground">{sub}</p>
      </div>
    </div>
    <button className="p-2 text-muted-foreground hover:text-white transition-all">
      <MoreHorizontal size={18} />
    </button>
  </div>
);

export default SmartInfo;
