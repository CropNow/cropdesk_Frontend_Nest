import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { AI_INSIGHTS } from '../../constants/deviceConstants';
import { StatusBadge } from '../ui/StatusBadge';

/**
 * AIInsightsSection - AI Insights card matching mockup UI
 */
export function AIInsightsSection({ data }: { data?: any }) {
  let insights = AI_INSIGHTS;
  
  if (Array.isArray(data) && data.length > 0) {
    insights = data;
  } else if (data && typeof data === 'object') {
    if (Array.isArray(data.data) && data.data.length > 0) insights = data.data;
    else if (Array.isArray(data.insights) && data.insights.length > 0) insights = data.insights;
  }

  // Fallback default insights to match mockup exactly if data is empty
  const displayInsights = insights.length > 0 ? insights : [
    { title: 'Irrigation', description: 'Irrigation efficiency improved by 18%', level: 'good' },
    { title: 'Fungal Risk', description: 'Fungal risk low in current conditions', level: 'good' },
    { title: 'Planting Window', description: 'Optimal planting window in 5 days', level: 'good' },
    { title: 'Soil Moisture', description: 'Soil moisture low in Field 2', level: 'warn' }
  ];

  const [showFullModal, setShowFullModal] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 }}
      className="card shadow-card p-6 flex flex-col justify-between bg-cardBg h-full min-h-[350px]"
    >
      <div>
        {/* Header row */}
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-scale-card font-bold tracking-tight text-textHeading leading-none">AI Insights</h4>
            <p className="text-scale-caption text-textSecondary mt-1 font-medium">AI-powered insights and recommendations</p>
          </div>
          <StatusBadge label="Live" variant="info" size="sm" />
        </div>

        {/* New Insights metric */}
        <div className="mt-4 flex flex-col">
          <span className="text-scale-metric-sm font-extrabold text-textHeading leading-none">
            {displayInsights.length}
          </span>
          <span className="text-scale-caption font-bold text-textSecondary uppercase tracking-wider mt-1">
            New Insights
          </span>
        </div>

        {/* Bullet list of insights styled with left vertical colored borders */}
        <div className="mt-4 space-y-3">
          {displayInsights.slice(0, 4).map((item: any, idx: number) => {
            const isWarning = item.level === 'warn' || item.level === 'warning' || item.description?.toLowerCase().includes('low') || item.description?.toLowerCase().includes('high');
            const borderColorClass = isWarning ? 'border-amber-500' : 'border-emerald-500';
            
            return (
              <div key={idx} className={`flex flex-col pl-3 border-l-2 ${borderColorClass}`}>
                <span className="text-scale-caption font-bold text-textHeading leading-none mb-1.5">
                  {item.title || (isWarning ? 'Warning' : 'Analysis')}
                </span>
                <p className="text-scale-caption font-medium text-textSecondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* View Full Insights button */}
      <div className="mt-4 pt-2">
        <button
          onClick={() => setShowFullModal(true)}
          className="flex items-center gap-1.5 text-scale-caption font-bold text-accentPrimary hover:text-accentHover transition hover:underline"
        >
          <span>View Full Insights</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Full Modal */}
      <AnimatePresence>
        {showFullModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <div className="absolute inset-0" onClick={() => setShowFullModal(false)} />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="relative z-10 w-full max-w-2xl overflow-hidden rounded-xl border border-borderColor bg-bgCard p-6 shadow-elevated"
              style={{ maxHeight: '90vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between border-b border-borderColor pb-4">
                <div>
                  <h3 className="text-scale-card font-bold leading-tight text-textHeading">All AI Insights</h3>
                  <p className="text-scale-caption text-textSecondary font-medium mt-1">Real-time analysis and suggestions for your blocks</p>
                </div>
                <button
                  onClick={() => setShowFullModal(false)}
                  className="rounded-lg p-2 transition hover:bg-bgInput text-textSecondary hover:text-textPrimary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="py-6 overflow-y-auto space-y-3" style={{ maxHeight: '60vh' }}>
                {displayInsights.map((item: any, idx: number) => {
                  const isWarning = item.level === 'warn' || item.level === 'warning';
                  return (
                    <div key={idx} className="rounded-lg border border-borderColor bg-bgInput p-4 flex gap-3">
                      <div className="mt-0.5">
                        {isWarning ? (
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-scale-body font-bold text-textHeading leading-none">{item.title}</h4>
                        <p className="text-scale-caption text-textSecondary font-medium mt-1.5 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
