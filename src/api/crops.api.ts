/**
 * Crops API endpoints
 */
import apiClient from './client';

export const cropsAPI = {
  /**
   * Create a new crop
   */
  createCrop: (data: any) => apiClient.post('/crops', data),

  /**
   * Get crop by ID
   */
  getCrop: (id: string) => apiClient.get(`/crops/${id}`),

  /**
   * Update crop
   */
  updateCrop: (id: string, data: any) => apiClient.patch(`/crops/${id}`, data),
};
