const fs = require('fs');
const path = 'c:\\Users\\Admin\\Desktop\\CropNow\\cropnow_combined_project\\src\\pages\\Dashboard2.tsx';
let content = fs.readFileSync(path, 'utf8');

// The mangled part starts near line 710 and ends near 820
// We'll use a broad match for the WeatherSensorsModal function and the syntax error
const newModal = `function WeatherSensorsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-[1px]"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="w-full max-w-5xl bg-white rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-12 py-10 border-b border-gray-100">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[1.25rem] bg-cyan-50 flex items-center justify-center">
              <Cloud className="w-8 h-8 text-cyan-500" />
            </div>
            <div>
              <h2 className="text-[1.8rem] font-bold text-gray-900 leading-tight tracking-tight">Weather Sensors</h2>
              <p className="text-gray-400 text-[1rem] font-medium mt-1">3 active sensors</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 transition-opacity hover:opacity-50"
          >
            <X className="w-7 h-7 text-red-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-12 py-24 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Wind Direction */}
          <div className="p-11 rounded-[2.5rem] border border-[#00FF9C]/30 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[18.5rem] hover:border-[#00FF9C]/60 transition-colors">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#F3E5F5] flex items-center justify-center mb-8">
                <Wind className="w-8 h-8 text-[#BA68C8]" />
              </div>
              <p className="text-[0.7rem] font-bold text-gray-400 tracking-[0.1em] uppercase mb-2">Wind Direction</p>
              <p className="text-[3rem] font-[900] text-[#111827] leading-none">0<span className="text-[1.5rem] ml-1 font-bold text-gray-400">°</span></p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#00D26A]" />
                <span className="text-[0.9rem] font-bold text-[#00D26A] uppercase tracking-widest">Good</span>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-300" />
            </div>
          </div>

          {/* Wind Speed */}
          <div className="p-11 rounded-[2.5rem] border border-[#00FF9C]/30 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[18.5rem] hover:border-[#00FF9C]/60 transition-colors">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#E3F2FD] flex items-center justify-center mb-8">
                <Wind className="w-8 h-8 text-[#42A5F5]" />
              </div>
              <p className="text-[0.7rem] font-bold text-gray-400 tracking-[0.1em] uppercase mb-2">Wind Speed</p>
              <p className="text-[3rem] font-[900] text-[#111827] leading-none">0<span className="text-[1.2rem] ml-2 font-bold text-gray-400">m/s</span></p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#00D26A]" />
                <span className="text-[0.9rem] font-bold text-[#00D26A] uppercase tracking-widest">Good</span>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-300" />
            </div>
          </div>

          {/* Rain Fall */}
          <div className="p-11 rounded-[2.5rem] border border-[#00FF9C]/30 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[18.5rem] hover:border-[#00FF9C]/60 transition-colors">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#E0F2F1] flex items-center justify-center mb-8">
                <CloudRain className="w-8 h-8 text-[#26A69A]" />
              </div>
              <p className="text-[0.7rem] font-bold text-gray-400 tracking-[0.1em] uppercase mb-2">Rain Fall</p>
              <p className="text-[3rem] font-[900] text-[#111827] leading-none">0.5<span className="text-[1.2rem] ml-2 font-bold text-gray-400">mm</span></p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#00D26A]" />
                <span className="text-[0.9rem] font-bold text-[#00D26A] uppercase tracking-widest">Good</span>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-300" />
            </div>
          </div>
        </div>

        {/* Footer Area */}
        <div className="px-12 pb-24">
          <div className="bg-[#EFFAF3] rounded-[2.5rem] py-8 px-10 flex flex-col gap-2 border border-[#D5F5E3]/40 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-[#00D26A] shadow-[0_0_10px_rgba(0,210,106,0.3)]" />
              <p className="text-[1.1rem] font-extrabold text-[#00B95D] uppercase tracking-wider leading-none">All sensors are operational</p>
            </div>
            <p className="text-[0.85rem] text-gray-400 font-medium ml-7 tracking-tight">Last updated: 12/10/2025, 1:08:07 PM</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}`;

// Use regex to find and replace the entire faulty block
// It starts after 'main' and 'AnimatePresence' and ends before 'Radial Device Layout'
const regex = /<\/main>\s*\);\s*(function WeatherSensorsModal[\s\S]*?)\s*\/\/ ─── Radial Device Layout/i;
const updatedContent = content.replace(regex, '<\/main>\n  );\n}\n\n' + newModal + '\n\n// ─── Radial Device Layout');

fs.writeFileSync(path, updatedContent, 'utf8');
console.log('Successfully fixed Dashboard2.tsx');
