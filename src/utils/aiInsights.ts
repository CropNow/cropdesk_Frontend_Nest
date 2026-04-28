import { AI_INSIGHTS } from '../constants/deviceConstants';

export type AIInsightCard = {
  title: string;
  description: string;
  level: 'good' | 'warn';
};

const insightArrayCandidates = (value: any) => [
  value,
  value?.data,
  value?.data?.data,
  value?.insights,
  value?.data?.insights,
  value?.predictions,
  value?.data?.predictions,
  value?.items,
  value?.data?.items,
];

const toInsightLevel = (value: any): 'good' | 'warn' => {
  const normalized = String(value ?? '').toLowerCase();

  if (
    normalized === 'good' ||
    normalized === 'low' ||
    normalized === 'optimal' ||
    normalized === 'ok' ||
    normalized === 'normal' ||
    normalized === 'healthy' ||
    normalized === 'success'
  ) {
    return 'good';
  }

  return 'warn';
};

export const normalizeAIInsights = (value: any): AIInsightCard[] => {
  const rawInsights = insightArrayCandidates(value).find(Array.isArray);

  if (!rawInsights || rawInsights.length === 0) {
    return AI_INSIGHTS;
  }

  return rawInsights.map((item: any, index: number) => {
    if (typeof item === 'string') {
      return {
        title: `Insight ${index + 1}`,
        description: item,
        level: 'good',
      };
    }

    return {
      title: item?.title || item?.name || item?.category || item?.type || `Insight ${index + 1}`,
      description:
        item?.description ||
        item?.recommendation ||
        item?.summary ||
        item?.message ||
        item?.details ||
        'No additional details available.',
      level: toInsightLevel(item?.level ?? item?.impact ?? item?.severity ?? item?.status),
    };
  });
};
