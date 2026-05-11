import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { FIS_CARDS } from '../../constants/deviceConstants';
import { alertsAPI } from '../../api/alerts.api';

/**
 * FISAlertSection - Field Intelligence System alerts (V2 design with linear progress bars)
 */
export function FISAlertSection({ data }: { data?: any }) {
  const cards = Array.isArray(data?.cards) ? data.cards : FIS_CARDS;
  const suggestion = data?.suggestion || {
    title: 'Suggestion',
    body: 'Deploy sub-surface irrigation now. Solar intensity is rising, hydrate early to maximize yield.',
    confidence: '98.4%',
  };

  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkAcknowledgment = () => {
      const ackTimestamp = localStorage.getItem('fis_alert_acknowledged_at');
      if (ackTimestamp) {
        const timestamp = parseInt(ackTimestamp, 10);
        const now = Date.now();
        const thirtyMinutes = 30 * 60 * 1000;

        if (now - timestamp < thirtyMinutes) {
          setIsAcknowledged(true);
          // Set a timer to reset after the remaining time
          const remainingTime = thirtyMinutes - (now - timestamp);
          const timer = setTimeout(() => {
            setIsAcknowledged(false);
            localStorage.removeItem('fis_alert_acknowledged_at');
          }, remainingTime);
          return () => clearTimeout(timer);
        } else {
          localStorage.removeItem('fis_alert_acknowledged_at');
        }
      }
    };

    checkAcknowledgment();
  }, []);

  const handleAcknowledge = async () => {
    if (isAcknowledged || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await alertsAPI.createAlert({
        title: suggestion.title || 'FIS Suggestion',
        message: suggestion.body,
        type: 'FIS_ACK',
        severity: 'info',
        status: 'acknowledged'
      });

      const now = Date.now();
      localStorage.setItem('fis_alert_acknowledged_at', now.toString());
      setIsAcknowledged(true);

      // Reset after 30 minutes
      setTimeout(() => {
        setIsAcknowledged(false);
        localStorage.removeItem('fis_alert_acknowledged_at');
      }, 30 * 60 * 1000);
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-6 backdrop-blur-2xl xl:col-span-3"
    >
      {/* Decorative Background Element */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#00FF9C]/5 blur-[100px]" />

      <div className="mb-6 flex items-center justify-between px-2">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-3xl font-extrabold tracking-tight text-white/90">FIS Alert Engine</h3>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-white/40">Intelligence Core Active</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[#00FF9C]/20 bg-[#00FF9C]/10 px-4 py-2 shadow-[0_0_20px_rgba(0,255,156,0.1)]">
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#00FF9C]" />
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#00FF9C]">Live Monitor</span>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {cards.map((card: any) => {
          const IconComponent = typeof card.icon === 'function' || typeof card.icon === 'object' ? card.icon : (FIS_CARDS.find((c: any) => c.title === card.title)?.icon || Activity);
          
          const statusColors = {
            Optimal: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20',
            Warning: 'from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/20',
            Critical: 'from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/20'
          };

          const barColors = {
            Optimal: 'from-emerald-400 to-emerald-600 shadow-emerald-500/40',
            Warning: 'from-amber-400 to-amber-600 shadow-amber-500/40',
            Critical: 'from-rose-400 to-rose-600 shadow-rose-500/40'
          };

          return (
            <motion.div
              key={card.title}
              layout
              whileHover={{ y: -4, scale: 1.01 }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.03] p-6 transition-all duration-300 hover:bg-white/[0.05] hover:border-white/10"
            >
              <div className="relative z-10">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/5 shadow-inner">
                    {IconComponent && <IconComponent className="h-5 w-5 text-[#00FF9C]" />}
                  </div>
                  <span className={`rounded-lg border px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.25em] ${statusColors[card.status as keyof typeof statusColors]}`}>
                    {card.status}
                  </span>
                </div>

                <h4 className="mb-2 text-xl font-bold tracking-tight text-white/90">{card.title}</h4>
                <motion.p layout="position" className="min-h-[3.5rem] text-[0.9rem] font-medium leading-[1.6] text-white/50 line-clamp-2 transition-all duration-300 group-hover:line-clamp-none">
                  {card.body}
                </motion.p>
              </div>

              <div className="relative z-10 mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/30">Risk Factor</span>
                  <span className="text-sm font-bold tabular-nums text-white/70">{card.value}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/5 border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${card.value}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full rounded-full bg-gradient-to-r shadow-lg ${barColors[card.status as keyof typeof barColors]}`}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 overflow-hidden rounded-[2rem] border border-[#00FF9C]/20 bg-gradient-to-br from-[#00FF9C]/10 via-transparent to-transparent p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#00FF9C]/20 border border-[#00FF9C]/30 shadow-[0_0_15px_rgba(0,255,156,0.1)]">
                <Activity className="h-5 w-5 text-[#00FF9C]" />
              </div>
              <div className="flex flex-col">
                <p className="text-lg font-bold tracking-tight text-white/90">{suggestion.title || 'AI Prescription'}</p>
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-[#00FF9C]/60">Expert Recommendation</p>
              </div>
            </div>
            
            <button
              onClick={handleAcknowledge}
              disabled={isAcknowledged || isSubmitting}
              className={`hidden sm:flex items-center gap-2 rounded-xl px-7 py-2.5 text-sm font-bold transition-all active:scale-95 disabled:opacity-50 ${
                isAcknowledged 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-[#00FF9C] text-black hover:shadow-[0_0_20px_rgba(0,255,156,0.4)]'
              }`}
            >
              {isAcknowledged ? (
                <>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Acknowledged
                </>
              ) : (isSubmitting ? 'Processing...' : 'Acknowledge')}
            </button>
          </div>

          <p className="text-[0.95rem] font-medium leading-[1.7] text-white/80">
            {suggestion.body}
          </p>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/30">System Confidence</span>
              <span className="text-sm font-bold text-[#00FF9C] tabular-nums">{suggestion.confidence}</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/20 border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: suggestion.confidence }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="h-full rounded-full bg-gradient-to-r from-[#00FF9C] to-emerald-400 shadow-[0_0_15px_rgba(0,255,156,0.2)]"
              />
            </div>
          </div>

          <button
            onClick={handleAcknowledge}
            disabled={isAcknowledged || isSubmitting}
            className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all active:scale-95 disabled:opacity-50 sm:hidden ${
              isAcknowledged 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                : 'bg-[#00FF9C] text-black'
            }`}
          >
            {isAcknowledged ? 'Acknowledged' : (isSubmitting ? 'Acknowledge' : 'Acknowledge')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
