/**
 * Fields API endpoints
 */
import apiClient from "./apiClient";

interface FieldBoundary {
  type: string;
  coordinates: number[][][];
}

export interface CreateFieldData {
  farmId: string;
  name: string;
  area: number;
  soil: { type: string };
  irrigation: { type: string };
  boundary?: FieldBoundary;
}

export interface UpdateFieldData {
  name?: string;
  area?: number;
  soil?: { type: string };
  irrigation?: { type: string };
}

export const fieldsAPI = {
  /**
   * Create a new field
   */
  createField: (data: CreateFieldData) => apiClient.post("/fields", data),

  /**
   * Get field by ID
   */
  getField: (id: string) => apiClient.get(`/fields/${id}`),

  /**
   * Update field
   */
  updateField: (id: string, data: UpdateFieldData) =>
    apiClient.patch(`/fields/${id}`, data),

  /**
   * Delete field
   */
  deleteField: (id: string) => apiClient.delete(`/fields/${id}`),
};
