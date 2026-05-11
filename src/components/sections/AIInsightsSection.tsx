import React from 'react';
import { motion } from 'framer-motion';
import { AI_INSIGHTS } from '../../constants/deviceConstants';

/**
 * AIInsightsSection - AI-generated insights about farm conditions
 */
export function AIInsightsSection({ data }: { data?: any }) {
  let insights = AI_INSIGHTS;
  
  if (Array.isArray(data) && data.length > 0) {
    insights = data;
  } else if (data && typeof data === 'object') {
    if (Array.isArray(data.data) && data.data.length > 0) insights = data.data;
    else if (Array.isArray(data.insights) && data.insights.length > 0) insights = data.insights;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 }}
      className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-6 backdrop-blur-2xl lg:col-span-2"
    >
      {/* Decorative Glow */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#00FF9C]/5 blur-[100px]" />

      <div className="mb-6 flex items-center justify-between px-2">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-3xl font-extrabold tracking-tight text-white/90">AI Insights</h3>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-white/40">Real-time Farm Analysis</p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((item: any, idx: number) => {
          const isWarning = item.level === 'warning' || item.description?.toLowerCase().includes('low') || item.description?.toLowerCase().includes('high');
          const isOptimal = item.level === 'good' || item.level === 'optimal';
          
          return (
            <motion.div
              key={item.title + idx}
              layout
              whileHover={{ x: 4, scale: 1.005 }}
              className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition-all hover:bg-white/[0.05] hover:border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`h-3 w-3 rounded-full ${isOptimal ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : isWarning ? 'bg-amber-400 shadow-[0_0_10px_#fbbf24]' : 'bg-rose-500 shadow-[0_0_10px_#f43f5e]'}`} />
                  <div className={`absolute inset-0 h-3 w-3 animate-ping rounded-full opacity-20 ${isOptimal ? 'bg-emerald-500' : isWarning ? 'bg-amber-400' : 'bg-rose-500'}`} />
                </div>
                
                <div className="flex flex-col">
                  <p className="text-[1.05rem] font-bold tracking-tight text-white/90">{item.title}</p>
                  <motion.p layout="position" className="text-[0.85rem] font-medium leading-relaxed text-white/50 line-clamp-1 transition-all duration-300 group-hover:line-clamp-none">{item.description}</motion.p>
                </div>
              </div>

              {item.advice && (
                <div className="hidden sm:block">
                  <span className="rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-white/40 opacity-0 transition-opacity group-hover:opacity-100">
                    ADVICE READY
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {insights.length === 0 && (
        <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-white/10">
          <p className="text-sm font-medium text-white/20">Analyzing data for insights...</p>
        </div>
      )}
    </motion.div>
  );
}
