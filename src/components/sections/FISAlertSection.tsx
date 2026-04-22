import React from 'react';
import { motion } from 'framer-motion';
import { CircularGauge } from '../common/CircularGauge';
import { FIS_CARDS } from '../../constants/deviceConstants';

/**
 * FISAlertSection - Field Intelligence System alerts
 */
export function FISAlertSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.14 }}
      className="rounded-3xl border border-accentPrimary/20 bg-gradient-to-br from-accentPrimary/10 via-cardBg to-transparent p-5 backdrop-blur-xl xl:col-span-3"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-3xl font-bold">FIS Alert Engine</h3>
        <span className="rounded-full border border-accentPrimary/30 bg-accentPrimary/10 px-3 py-1 text-xs font-semibold text-accentPrimary">
          ACTIVE
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {FIS_CARDS.map((card) => (
          <div
            key={card.title}
            className="rounded-3xl border border-cardBorder bg-black/10 dark:bg-black/20 p-4"
          >
            <div className="mb-3 flex items-start justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-cardBg">
                <card.icon className="h-5 w-5 text-accentPrimary" />
              </span>
              <CircularGauge value={card.value} />
            </div>
            <p className="text-xl font-bold">{card.title}</p>
            <p className="mt-2 min-h-[72px] text-sm text-textLabel">{card.body}</p>
            <span
              className={[
                'mt-3 inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold',
                card.status === 'Optimal' && 'bg-accentPrimary/15 text-accentPrimary',
                card.status === 'Warning' && 'bg-yellow-400/15 text-yellow-300',
                card.status === 'Critical' && 'bg-red-400/15 text-red-300',
              ].join(' ')}
            >
              {card.status}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-accentPrimary/25 bg-accentPrimary/10 p-4">
        <p className="text-lg font-semibold">Suggestion</p>
        <p className="mt-1 text-textBody">
          Deploy sub-surface irrigation now. Solar intensity is rising, hydrate early to maximize yield.
        </p>
        <div className="mt-4 h-3 rounded-full bg-black/30">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '98.4%' }}
            transition={{ duration: 1.1, delay: 0.2 }}
            className="h-3 rounded-full bg-gradient-to-r from-accentPrimary to-emerald-300"
          />
        </div>
        <div className="mt-1 flex items-center justify-between text-xs text-textLabel">
          <span>Confidence</span>
          <span>98.4%</span>
        </div>

        <div className="mt-4 sm:hidden">
          <button
            type="button"
            className="w-full rounded-xl border border-accentPrimary/40 bg-accentPrimary/20 py-2.5 text-sm font-semibold text-accentPrimary transition hover:bg-accentPrimary/30 active:scale-[0.98]"
          >
            Acknowledge
          </button>
        </div>

        <div className="hidden sm:mt-4 sm:flex sm:justify-end">
          <button
            type="button"
            className="rounded-lg border border-accentPrimary/30 bg-accentPrimary/10 px-4 py-1.5 text-sm font-semibold text-accentPrimary transition-all hover:bg-accentPrimary/20 active:scale-[0.98]"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </motion.div>
  );
}
