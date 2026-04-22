/**
 * AI API endpoints
 * AI insights and recommendations
 */

import apiClient from './client';

export const aiAPI = {
  /**
   * Get AI insights for a farm
   */
  getInsights: (farmId: string) =>
    apiClient.get(`/ai/insights/${farmId}`),

  /**
   * Get AI recommendations
   */
  getRecommendations: (farmId: string, category?: string) =>
    apiClient.get(`/ai/recommendations/${farmId}`, { params: { category } }),

  /**
   * Get AI analysis on specific metrics
   */
  analyzeMetrics: (farmId: string, metrics: string[]) =>
    apiClient.post(`/ai/analyze/${farmId}`, { metrics }),

  /**
   * Accept AI recommendation
   */
  acceptRecommendation: (recommendationId: string) =>
    apiClient.post(`/ai/recommendations/${recommendationId}/accept`),

  /**
   * Dismiss AI recommendation
   */
  dismissRecommendation: (recommendationId: string, reason?: string) =>
    apiClient.post(`/ai/recommendations/${recommendationId}/dismiss`, { reason }),
};
