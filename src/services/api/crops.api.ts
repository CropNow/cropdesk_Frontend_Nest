/**
 * Crops API endpoints
 */
import apiClient from "./apiClient";

export interface CreateCropData {
  fieldId: string;
  name: string;
  plantingDate: string;
  expectedHarvestDate: string;
  area: number;
}

export interface UpdateCropData {
  name?: string;
  plantingDate?: string;
  expectedHarvestDate?: string;
  area?: number;
}

export const cropsAPI = {
  /**
   * Create a new crop
   */
  createCrop: (data: CreateCropData) => apiClient.post("/crops", data),

  /**
   * Get crop by ID
   */
  getCrop: (id: string) => apiClient.get(`/crops/${id}`),

  /**
   * Update crop
   */
  updateCrop: (id: string, data: UpdateCropData) => apiClient.patch(`/crops/${id}`, data),

  /**
   * Delete crop
   */
  deleteCrop: (id: string) => apiClient.delete(`/crops/${id}`),
};
