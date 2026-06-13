import { isValidElement, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, X } from 'lucide-react';
import { FIS_CARDS } from '../../constants/deviceConstants';
import { alertsAPI } from '../../api/alerts.api';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { StatusBadge } from '../ui/StatusBadge';

/**
 * FISAlertSection - Field Intelligence System alerts (Redesigned visual layer matching AI Insights)
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
  const [selectedCard, setSelectedCard] = useState<any | null>(null);
  const { theme } = useTheme();
  const { addToast } = useToast();

  useEffect(() => {
    const checkAcknowledgment = () => {
      const ackTimestamp = localStorage.getItem('fis_alert_acknowledged_at');
      if (ackTimestamp) {
        const timestamp = parseInt(ackTimestamp, 10);
        const now = Date.now();
        const thirtyMinutes = 30 * 60 * 1000;

        if (now - timestamp < thirtyMinutes) {
          setIsAcknowledged(true);
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
      addToast({ message: 'Prescription Acknowledged Successfully', type: 'success' });

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
      className="card shadow-card p-6 flex flex-col justify-between bg-cardBg xl:col-span-4"
    >
      <div>
        {/* Header row */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="text-scale-section font-bold tracking-tight text-textHeading">FIS Alert Engine</h3>
            <p className="text-scale-caption font-semibold uppercase tracking-wider text-textMuted mt-1">Intelligence Core Active</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-borderColor bg-bgInput px-3 py-1">
            <div className="h-2 w-2 animate-pulse rounded-full bg-accentPrimary" />
            <span className="text-scale-caption font-bold uppercase tracking-wider text-accentPrimary">Live Monitor</span>
          </div>
        </div>

        {/* Grid of Alert cards styled like AI Insights sub-cards */}
        <div className="grid gap-5 lg:grid-cols-3">
          {cards.map((card: any) => {
            const rawIcon = card.icon;
            const isComponent = typeof rawIcon === 'function';
            const isElement = isValidElement(rawIcon);
            const IconComponent = isComponent
              ? rawIcon
              : (FIS_CARDS.find((c: any) => c.title === card.title)?.icon || Activity);
            
            const badgeVariant = 
              card.status === 'Optimal' ? 'success' :
              card.status === 'Warning' ? 'warning' : 'danger';

            const barColorClass =
              card.status === 'Optimal' ? 'bg-emerald-500' :
              card.status === 'Warning' ? 'bg-amber-500' : 'bg-red-500';

            const isViewableCard = ['Pest Analysis', 'Fungal Activity', 'Irrigation Analysis'].includes(card.title);

            return (
              <div
                key={card.title}
                className="rounded-xl border border-borderColor bg-bgInput p-5 flex flex-col justify-between shadow-sm"
              >
                <div>
                  {/* Icon & Title Row */}
                  <div className="mb-4 flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-bgCard border border-borderColor text-accentPrimary">
                        {isElement ? rawIcon : (IconComponent && <IconComponent className="h-4.5 w-4.5" />)}
                      </div>
                      <h4 className="text-scale-body font-bold text-textHeading leading-snug">{card.title}</h4>
                    </div>
                    <StatusBadge label={card.status} variant={badgeVariant} size="sm" />
                  </div>

                  <p className="mb-4 text-scale-caption font-medium leading-relaxed text-textSecondary line-clamp-2">
                    {typeof card.body === 'object' && card.body !== null ? JSON.stringify(card.body) : card.body}
                  </p>
                </div>

                <div>
                  <div className="hidden sm:block">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">Metrics</span>
                      <span className="text-scale-caption font-bold text-textHeading">{card.value}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-bgCard border border-borderColor mb-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${card.value}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className={`h-full rounded-full ${barColorClass}`}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-4 mt-2 sm:mt-0">
                    {isViewableCard ? (
                      <button
                        onClick={() => setSelectedCard(card)}
                        className="rounded-lg border border-borderColor bg-bgCard px-4 py-1.5 text-scale-caption font-bold text-textSecondary transition hover:bg-bgCardHover hover:text-textPrimary hover:border-textSecondary/40"
                      >
                        View More
                      </button>
                    ) : (
                      <span className="text-scale-caption font-bold text-textMuted uppercase tracking-wider">Metrics</span>
                    )}

                    <span className="text-scale-body font-bold text-textHeading">{card.value}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggestion / AI Prescription Panel */}
      <div className="mt-6 rounded-xl border border-borderColor bg-bgInput p-5 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bgCard border border-borderColor text-accentPrimary">
                <Activity className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <p className="text-scale-body font-bold text-textHeading">{suggestion.title || 'AI Prescription'}</p>
                <p className="text-scale-caption font-bold uppercase tracking-wider text-accentPrimary/80">Expert Recommendation</p>
              </div>
            </div>
            
            <button
              onClick={handleAcknowledge}
              disabled={isAcknowledged || isSubmitting}
              className={`hidden sm:flex items-center gap-2 rounded-lg px-6 py-2.5 text-scale-caption font-bold transition-all disabled:opacity-50 ${
                isAcknowledged 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                  : 'bg-accentPrimary hover:bg-accentHover text-white'
              }`}
            >
              {isAcknowledged ? (
                <>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Acknowledged
                </>
              ) : (isSubmitting ? 'Processing...' : 'Acknowledge')}
            </button>
          </div>

          <p className="text-scale-caption font-medium leading-relaxed text-textSecondary">
            {typeof suggestion.body === 'object' && suggestion.body !== null ? JSON.stringify(suggestion.body) : suggestion.body}
          </p>

          <button
            onClick={handleAcknowledge}
            disabled={isAcknowledged || isSubmitting}
            className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 text-scale-caption font-bold transition-all disabled:opacity-50 sm:hidden ${
              isAcknowledged 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                : 'bg-accentPrimary hover:bg-accentHover text-white'
            }`}
          >
            {isAcknowledged ? 'Acknowledged' : (isSubmitting ? 'Processing...' : 'Acknowledge')}
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <div className="absolute inset-0" onClick={() => setSelectedCard(null)} />
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
                <div className="max-w-[85%]">
                  <h3 className="text-scale-card font-bold leading-tight text-textHeading">{selectedCard.title}</h3>
                  <p className="text-scale-caption text-textSecondary font-medium mt-2 leading-relaxed">{selectedCard.body}</p>
                </div>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="rounded-lg p-2 transition hover:bg-bgInput text-textSecondary hover:text-textPrimary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="py-6 overflow-y-auto" style={{ maxHeight: '60vh' }}>
                {selectedCard.title === 'Pest Analysis' && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-borderColor bg-bgInput p-4">
                      <h4 className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">Pest Risk Score</h4>
                      <p className="mt-1.5 text-scale-metric-sm font-bold text-textHeading">{selectedCard.value ?? 'N/A'}%</p>
                    </div>
                    <div className="rounded-lg border border-borderColor bg-bgInput p-4">
                      <h4 className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">Rainfall</h4>
                      <p className="mt-1.5 text-scale-metric-sm font-bold text-textHeading">{selectedCard.rainfall_mm ?? selectedCard.rainfall ?? 'N/A'} mm</p>
                    </div>
                    <div className="rounded-lg border border-borderColor bg-bgInput p-4 sm:col-span-2">
                      <h4 className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">Recommendation</h4>
                      <p className="mt-1.5 text-scale-caption font-medium text-textSecondary leading-relaxed">{selectedCard.recommendation ?? selectedCard.body ?? 'N/A'}</p>
                    </div>
                  </div>
                )}

                {selectedCard.title === 'Irrigation Analysis' && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-borderColor bg-bgInput p-4">
                      <h4 className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">Confidence</h4>
                      <p className="mt-1.5 text-scale-metric-sm font-bold text-textHeading">{selectedCard.confidence ?? data?.suggestion?.confidence ?? 'N/A'}</p>
                    </div>
                    <div className="rounded-lg border border-borderColor bg-bgInput p-4">
                      <h4 className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">Decision</h4>
                      <p className="mt-1.5 text-scale-body font-bold text-textHeading">{selectedCard.decision ?? 'N/A'}</p>
                    </div>
                    <div className="rounded-lg border border-borderColor bg-bgInput p-4 sm:col-span-2">
                      <h4 className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">Water Requirement</h4>
                      <p className="mt-1.5 text-scale-metric-sm font-bold text-textHeading">{selectedCard.water_requirement_mm ?? selectedCard.water_requirement ?? 'N/A'} mm</p>
                    </div>
                  </div>
                )}

                {selectedCard.title === 'Fungal Activity' && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-borderColor bg-bgInput p-4">
                      <h4 className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">Activity Level</h4>
                      <p className="mt-1.5 text-scale-metric-sm font-bold text-textHeading">{selectedCard.activity_level ?? selectedCard.activity ?? 'N/A'}</p>
                    </div>
                    <div className="rounded-lg border border-borderColor bg-bgInput p-4">
                      <h4 className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">Dew Point</h4>
                      <p className="mt-1.5 text-scale-metric-sm font-bold text-textHeading">{selectedCard.dew_point ?? 'N/A'}°C</p>
                    </div>
                    <div className="rounded-lg border border-borderColor bg-bgInput p-4">
                      <h4 className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">Leaf Wetness</h4>
                      <p className="mt-1.5 text-scale-metric-sm font-bold text-textHeading">{selectedCard.leaf_wetness_pct ?? selectedCard.leaf ?? 'N/A'}%</p>
                    </div>
                    <div className="rounded-lg border border-borderColor bg-bgInput p-4">
                      <h4 className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">Likely Disease</h4>
                      <p className="mt-1.5 text-scale-body font-bold text-textHeading">{selectedCard.likely_disease ?? 'N/A'}</p>
                    </div>
                    <div className="rounded-lg border border-borderColor bg-bgInput p-4 sm:col-span-2">
                      <h4 className="text-scale-caption font-bold uppercase tracking-wider text-textMuted">Recommendation</h4>
                      <p className="mt-1.5 text-scale-caption font-medium text-textSecondary leading-relaxed">{selectedCard.recommendation ?? selectedCard.body ?? 'N/A'}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
