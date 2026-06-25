/**
 * Farmers API endpoints
 */
import apiClient from "./apiClient";

interface FarmerAddress {
  village: string;
  district: string;
  state: string;
  country: string;
}

export interface CreateFarmerData {
  name: string;
  phone: string;
  email: string;
  address: FarmerAddress;
}

export interface UpdateFarmerData {
  name?: string;
  phone?: string;
  email?: string;
  address?: FarmerAddress;
}

export const farmersAPI = {
  /**
   * Create a new farmer
   */
  createFarmer: (data: CreateFarmerData) => apiClient.post("/farmers", data),

  /**
   * Get farmer by ID
   */
  getFarmer: (id: string) => apiClient.get(`/farmers/${id}`),

  /**
   * Update farmer
   */
  updateFarmer: (id: string, data: UpdateFarmerData) => apiClient.patch(`/farmers/${id}`, data),

  /**
   * Delete farmer
   */
  deleteFarmer: (id: string) => apiClient.delete(`/farmers/${id}`),
};
