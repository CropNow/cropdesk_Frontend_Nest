/**
 * Farmers API endpoints
 */
import apiClient from './client';

export const farmersAPI = {
  /**
   * Create a new farmer
   */
  createFarmer: (data: any) => apiClient.post('/farmers', data),

  /**
   * Get farmer by ID
   */
  getFarmer: (id: string) => apiClient.get(`/farmers/${id}`),

  /**
   * Update farmer
   */
  updateFarmer: (id: string, data: any) => apiClient.patch(`/farmers/${id}`, data),
};
