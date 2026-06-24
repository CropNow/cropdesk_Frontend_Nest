/**
 * Farms API endpoints
 */
import apiClient from "./apiClient";

export const farmsAPI = {
  /**
   * Create a new farm
   */
  createFarm: (data: any) => apiClient.post("/farms", data),

  /**
   * Get farm by ID
   */
  getFarm: (id: string) => apiClient.get(`/farms/${id}`),

  /**
   * Update farm
   */
  updateFarm: (id: string, data: any) => apiClient.patch(`/farms/${id}`, data),

  /**
   * Delete farm
   */
  deleteFarm: (id: string) => apiClient.delete(`/farms/${id}`),
};
