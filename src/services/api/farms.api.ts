/**
 * Farms API endpoints
 */
import apiClient from "./apiClient";

interface FarmLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface CreateFarmData {
  farmerId: string;
  name: string;
  location: FarmLocation;
  area: number;
  unit: string;
  soilType: string;
  irrigationType: string;
  farmingType: string;
}

export interface UpdateFarmData {
  name?: string;
  location?: FarmLocation;
  soilType?: string;
  irrigationType?: string;
  farmingType?: string;
}

export const farmsAPI = {
  /**
   * Create a new farm
   */
  createFarm: (data: CreateFarmData) => apiClient.post("/farms", data),

  /**
   * Get farm by ID
   */
  getFarm: (id: string) => apiClient.get(`/farms/${id}`),

  /**
   * Update farm
   */
  updateFarm: (id: string, data: UpdateFarmData) => apiClient.patch(`/farms/${id}`, data),

  /**
   * Delete farm
   */
  deleteFarm: (id: string) => apiClient.delete(`/farms/${id}`),
};
