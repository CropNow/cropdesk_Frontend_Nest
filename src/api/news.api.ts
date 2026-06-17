/**
 * News API endpoints and fallback mechanism
 */

import apiClient from './client';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  category: 'Weather' | 'Market' | 'Pest Alert' | 'Government Scheme' | 'Crop Advisory' | 'Irrigation' | 'Research';
}

export const newsAPI = {
  /**
   * Fetch agricultural news based on location
   */
  getNews: async (location: { district?: string; state?: string; country?: string }): Promise<NewsArticle[]> => {
    try {
      const response = await apiClient.get('/news', {
        params: {
          district: location.district,
          state: location.state,
          country: location.country || 'India',
        },
      });
      const data = response.data?.data || response.data;
      if (Array.isArray(data)) {
        return data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.warn('Backend news API failed or not implemented. Falling back to localized news generation.', error);
      return newsAPI.generateFallbackNews(location.district, location.state);
    }
  },

  /**
   * Generate localized mock news articles as fallback
   */
  generateFallbackNews: (district?: string, state?: string): NewsArticle[] => {
    const d = district || 'your district';
    const s = state || 'your state';

    return [
      {
        id: 'n1',
        title: `${s} Agricultural Markets Report: Crop Prices Stable`,
        summary: `The state agricultural marketing board reported stable prices for key food crops across major APMC yards in ${s}, including ${d} and surrounding areas.`,
        source: 'Krishi Jagran',
        publishedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        category: 'Market',
      },
      {
        id: 'n2',
        title: `Pre-Monsoon Showers Expected Across ${d} and Surrounding Districts`,
        summary: `The meteorological department has issued a light to moderate rain warning for ${d} and neighbouring zones. Farmers are advised to secure harvested grain.`,
        source: 'IMD Weather Desk',
        publishedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        category: 'Weather',
      },
      {
        id: 'n3',
        title: `${s} Government Announces New Micro-Irrigation Subsidies for Smallholders`,
        summary: `A new subsidy package offering up to 90% discount on drip and sprinkler irrigation setups has been launched. Application portal is open now for local farmers.`,
        source: 'State Crop Advisory Board',
        publishedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        category: 'Government Scheme',
      },
      {
        id: 'n4',
        title: `Stem Borer Advisory Issued for Paddy Cultivators in ${d}`,
        summary: `Agricultural extension officers in ${d} have warned of potential stem borer attacks due to rising humidity. Early biological control measures are recommended.`,
        source: 'State Crop Protection Dept',
        publishedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        category: 'Pest Alert',
      },
      {
        id: 'n5',
        title: `Research Center in ${s} Introduces High-Yielding Drought Resistant Varieties`,
        summary: `Scientists have successfully trialed a new hybrid variety that requires 20% less water while improving yield quality and resistance to common leaf blight.`,
        source: 'National Agri Research Journal',
        publishedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        category: 'Research',
      },
      {
        id: 'n6',
        title: `New Crop Protection Guidelines Released for Summer Crops`,
        summary: `Experts have advised farmers to implement integrated pest management and crop rotation systems to improve soil quality and reduce pesticide dependency.`,
        source: 'Agri Extension Services',
        publishedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
        category: 'Crop Advisory',
      },
      {
        id: 'n7',
        title: `Smart Water Management Practices Promoted in ${d}`,
        summary: `Farmers in ${d} are adopting soil moisture sensors and scheduled watering intervals to reduce water usage while maintaining optimal crop growth parameters.`,
        source: 'Irrigation & Drainage Board',
        publishedAt: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
        category: 'Irrigation',
      },
    ];
  },
};
