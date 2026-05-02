import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { FIS_CARDS } from '../../constants/deviceConstants';

/**
 * FISAlertSection - Field Intelligence System alerts (V2 design with linear progress bars)
 */
export function FISAlertSection({ data }: { data?: any }) {
  const cards = data?.cards || FIS_CARDS;
  const suggestion = data?.suggestion || {
    title: 'Suggestion',
    body: 'Deploy sub-surface irrigation now. Solar intensity is rising, hydrate early to maximize yield.',
    confidence: '98.4%',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.14 }}
      className="rounded-xl border border-cardBorder bg-cardBg/50 p-5 backdrop-blur-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold tracking-tight text-textHeading md:text-2xl">FIS Alert Engine</h3>
        <span className="rounded-full border border-accentPrimary/40 bg-accentPrimary/10 px-3 py-1 text-xs font-semibold text-accentPrimary dark:border-[#00FF9C]/30 dark:bg-[#00FF9C]/10 dark:text-[#00FF9C]">
          ACTIVE
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {cards.map((card: any) => {
          const IconComponent = typeof card.icon === 'function' || typeof card.icon === 'object' ? card.icon : (FIS_CARDS.find((c: any) => c.title === card.title)?.icon || Activity);
          return (
            <div key={card.title} className="rounded-[2.5rem] border border-cardBorder bg-cardBg/60 p-6 backdrop-blur-xl transition-all hover:bg-cardBg/80 dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.05]">
              <div className="mb-5 flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 backdrop-blur-md border border-cardBorder shadow-inner dark:border-white/5">
                  {IconComponent ? <IconComponent className="h-5 w-5 text-accentPrimary dark:text-[#00FF9C]" /> : null}
                </span>
                <h4 className="text-xl font-bold text-textHeading tracking-tight whitespace-nowrap">{card.title}</h4>
              </div>

              <p className="text-sm font-medium leading-relaxed text-textBody min-h-[48px] line-clamp-2 dark:text-white/60">
                {card.body}
              </p>

            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span
                  className={[
                    'inline-flex rounded-full px-3 py-1 text-[0.75rem] font-black uppercase tracking-widest',
                    card.status === 'Optimal' && 'bg-accentPrimary/10 text-accentPrimary border border-accentPrimary/30 dark:bg-[#00FF9C]/10 dark:text-[#00FF9C] dark:border-[#00FF9C]/20',
                    card.status === 'Warning' && 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-yellow-400/10 dark:text-yellow-300 dark:border-yellow-400/20',
                    card.status === 'Critical' && 'bg-red-100 text-red-800 border border-red-300 dark:bg-red-400/10 dark:text-red-300 dark:border-red-400/20',
                  ].join(' ')}
                >
                  {card.status}
                </span>
                <span className="text-xs font-black text-textMuted tracking-tighter dark:text-white/40">{card.value}%</span>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-cardBg/50 border border-cardBorder">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${card.value}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    card.status === 'Optimal' ? 'bg-accentPrimary' :
                    card.status === 'Warning' ? 'bg-warning' :
                    'bg-danger'
                  }`}
                />
              </div>
            </div>
          </div>
        );
      })}
      </div>

      <div className="mt-4 rounded-2xl border border-accentPrimary/30 bg-accentPrimary/5 p-4 dark:border-[#00FF9C]/25 dark:bg-[#00FF9C]/10">
        <p className="text-lg font-semibold text-textHeading">{suggestion.title || 'Prescription'}</p>
        <p className="mt-1 text-textBody">
          {suggestion.body}
        </p>
        <div className="mt-4 h-3 rounded-full bg-borderColor/60 dark:bg-black/30">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: suggestion.confidence }}
            transition={{ duration: 1.1, delay: 0.2 }}
            className="h-3 rounded-full bg-gradient-to-r from-accentPrimary to-accentSecondary dark:from-[#00FF9C] dark:to-emerald-300"
          />
        </div>
        <div className="mt-1 flex items-center justify-between text-xs text-textLabel">
          <span>Confidence</span>
          <span>{suggestion.confidence}</span>
        </div>

        <div className="mt-4 sm:hidden">
          <button
            type="button"
            className="w-full rounded-xl bg-accentPrimary/15 border border-accentPrimary/40 py-2.5 text-sm font-semibold text-accentPrimary transition hover:bg-accentPrimary/25 active:scale-[0.98] dark:bg-[#00FF9C]/20 dark:border-[#00FF9C]/40 dark:text-[#00FF9C] dark:hover:bg-[#00FF9C]/30"
          >
            Acknowledge
          </button>
        </div>

        <div className="hidden sm:mt-4 sm:flex sm:justify-end">
          <button
            type="button"
            className="rounded-lg border border-accentPrimary/40 bg-accentPrimary/10 px-4 py-1.5 text-sm font-semibold text-accentPrimary transition-all hover:bg-accentPrimary/20 active:scale-[0.98] dark:border-[#00FF9C]/30 dark:bg-[#00FF9C]/10 dark:text-[#00FF9C] dark:hover:bg-[#00FF9C]/20"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </motion.div>
  );
}
