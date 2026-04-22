const fs = require('fs');
const path = 'c:\\Users\\Admin\\Desktop\\CropNow\\cropnow_combined_project\\src\\pages\\Dashboard2.tsx';
let content = fs.readFileSync(path, 'utf8');

const darkModalCode = `function WeatherSensorsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="w-full max-w-[1200px] bg-[#0A0E14]/95 rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-14 py-5 border-b border-white/5">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-[1rem] bg-[#00FF9C]/10 flex items-center justify-center">
              <Cloud className="w-7 h-7 text-[#00FF9C]" />
            </div>
            <div>
              <h2 className="text-[1.6rem] font-bold text-white leading-tight tracking-tight">Weather Sensors</h2>
              <p className="text-white/40 text-[0.9rem] font-medium mt-0.5 whitespace-nowrap">3 active sensors</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 transition-opacity hover:opacity-50"
          >
            <X className="w-6 h-6 text-white/40" strokeWidth={2.5} />
          </button>
        </div>

        {/* Content - Left Aligned */}
        <div className="px-14 py-8 flex flex-wrap justify-start gap-8">
          {/* Wind Direction */}
          <div className="w-[18rem] p-8 rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex flex-col justify-between h-[15rem] transition-all hover:border-[#00FF9C]/30 hover:bg-white/[0.05]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center mb-6">
                <Wind className="w-6 h-6 text-[#A855F7]" />
              </div>
              <p className="text-[0.65rem] font-bold text-white/30 tracking-[0.15em] uppercase mb-1">Wind Direction</p>
              <p className="text-[2.6rem] font-bold text-white leading-none tracking-tighter">0<span className="text-[1.2rem] ml-1 font-bold text-white/20">°</span></p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00FF9C] shadow-[0_0_8px_#00FF9C]" />
                <span className="text-[0.8rem] font-bold text-[#00FF9C] uppercase tracking-widest">Good</span>
              </div>
              <ChevronDown className="w-4 h-4 text-white/20" />
            </div>
          </div>

          {/* Wind Speed */}
          <div className="w-[18rem] p-8 rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex flex-col justify-between h-[15rem] transition-all hover:border-[#00FF9C]/30 hover:bg-white/[0.05]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center mb-6">
                <Wind className="w-6 h-6 text-[#22D3EE]" />
              </div>
              <p className="text-[0.65rem] font-bold text-white/30 tracking-[0.15em] uppercase mb-1">Wind Speed</p>
              <p className="text-[2.6rem] font-bold text-white leading-none tracking-tighter">0<span className="text-[1.1rem] ml-1 font-bold text-white/20">m/s</span></p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00FF9C] shadow-[0_0_8px_#00FF9C]" />
                <span className="text-[0.8rem] font-bold text-[#00FF9C] uppercase tracking-widest">Good</span>
              </div>
              <ChevronDown className="w-4 h-4 text-white/20" />
            </div>
          </div>

          {/* Rain Fall */}
          <div className="w-[18rem] p-8 rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex flex-col justify-between h-[15rem] transition-all hover:border-[#00FF9C]/30 hover:bg-white/[0.05]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center mb-6">
                <CloudRain className="w-6 h-6 text-[#00FF9C]" />
              </div>
              <p className="text-[0.65rem] font-bold text-white/30 tracking-[0.15em] uppercase mb-1">Rain Fall</p>
              <p className="text-[2.6rem] font-bold text-white leading-none tracking-tighter">0.5<span className="text-[1.1rem] ml-1 font-bold text-white/20">mm</span></p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00FF9C] shadow-[0_0_8px_#00FF9C]" />
                <span className="text-[0.8rem] font-bold text-[#00FF9C] uppercase tracking-widest">Good</span>
              </div>
              <ChevronDown className="w-4 h-4 text-white/20" />
            </div>
          </div>
        </div>

        {/* Footer Area - Dark Theme */}
        <div className="px-14 pb-8">
          <div className="bg-white/[0.02] rounded-[1.75rem] py-4 px-8 flex flex-col gap-1 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#00FF9C] shadow-[0_0_10px_#00FF9C]" />
              <p className="text-[0.85rem] font-extrabold text-[#00FF9C] uppercase tracking-wider leading-none">All sensors are operational</p>
            </div>
            <p className="text-[0.7rem] text-white/30 font-medium ml-5 tracking-tight">Last updated: 12/10/2025, 1:08:07 PM</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}`;

// Search for the function definition and replace it completely
const regex = /function WeatherSensorsModal[\s\S]*?}\s*(?=\/\/\s*─── Radial Device Layout|$)/i;
const updatedContent = content.replace(regex, darkModalCode + '\n\n');

fs.writeFileSync(path, updatedContent, 'utf8');
console.log('Successfully updated Dashboard2.tsx to Dark Holographic theme');
