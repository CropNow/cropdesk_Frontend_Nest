import { motion } from 'framer-motion';
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
        <span className="rounded-full border border-[#00FF9C]/30 bg-[#00FF9C]/10 px-3 py-1 text-xs font-semibold text-[#00FF9C]">
          ACTIVE
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {cards.map((card: any) => (
          <div key={card.title} className="rounded-xl border border-cardBorder bg-cardBg/30 p-6 transition-all hover:bg-cardBg/50">
            <div className="mb-5 flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-cardBg/50 border border-cardBorder">
                <card.icon className="h-5 w-5 text-[#00FF9C]" />
              </span>
              <h4 className="text-xl font-bold text-white tracking-tight whitespace-nowrap">{card.title}</h4>
            </div>

            <p className="text-sm font-medium leading-relaxed text-white/60 min-h-[48px] line-clamp-2">
              {card.body}
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span
                  className={[
                    'inline-flex rounded-full px-3 py-1 text-[0.75rem] font-black uppercase tracking-widest',
                    card.status === 'Optimal' && 'bg-[#00FF9C]/10 text-[#00FF9C] border border-[#00FF9C]/20',
                    card.status === 'Warning' && 'bg-yellow-400/10 text-yellow-300 border border-yellow-400/20',
                    card.status === 'Critical' && 'bg-red-400/10 text-red-300 border border-red-400/20',
                  ].join(' ')}
                >
                  {card.status}
                </span>
                <span className="text-xs font-black text-white/40 tracking-tighter">{card.value}%</span>
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
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-cardBorder bg-cardBg/30 p-4">
        <p className="text-lg font-semibold">Suggestion</p>
        <p className="mt-1 text-textBody">
          Deploy sub-surface irrigation now. Solar intensity is rising, hydrate early to maximize yield.
        </p>
        <div className="mt-4 h-3 rounded-full bg-black/30">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: suggestion.confidence }}
            transition={{ duration: 1.1, delay: 0.2 }}
            className="h-3 rounded-full bg-gradient-to-r from-[#00FF9C] to-emerald-300"
          />
        </div>
        <div className="mt-1 flex items-center justify-between text-xs text-textLabel">
          <span>Confidence</span>
          <span>{suggestion.confidence}</span>
        </div>

        <div className="mt-4 sm:hidden">
          <button
            type="button"
            className="w-full rounded-xl bg-[#00FF9C]/20 border border-[#00FF9C]/40 py-2.5 text-sm font-semibold text-[#00FF9C] transition hover:bg-[#00FF9C]/30 active:scale-[0.98]"
          >
            Acknowledge
          </button>
        </div>

        <div className="hidden sm:mt-4 sm:flex sm:justify-end">
          <button
            type="button"
            className="rounded-lg border border-[#00FF9C]/30 bg-[#00FF9C]/10 px-4 py-1.5 text-sm font-semibold text-[#00FF9C] transition-all hover:bg-[#00FF9C]/20 active:scale-[0.98]"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </motion.div>
  );
}
