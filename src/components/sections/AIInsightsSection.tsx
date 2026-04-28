import { motion } from 'framer-motion';
import { normalizeAIInsights } from '../../utils/aiInsights';

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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 }}
      className="rounded-xl border border-cardBorder bg-cardBg/50 p-5 backdrop-blur-sm"
    >
      <h3 className="mb-4 text-xl font-semibold tracking-tight text-textHeading md:text-2xl">AI Insights</h3>
      <div className="space-y-3">
        {insights.map((item: any) => (
          <motion.div
            key={item.title}
            whileHover={{ x: 3 }}
            className="flex items-center justify-between rounded-xl border border-cardBorder bg-cardBg/30 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div
                className={[
                  'h-3 w-3 rounded-full',
                  item.level === 'good' ? 'bg-accentPrimary' : 'bg-yellow-300',
                ].join(' ')}
              />
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-textSecondary">{item.description}</p>
              </div>
            </div>
            <span className="text-sm text-textMuted">-</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
