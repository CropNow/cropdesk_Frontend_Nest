/**
 * Fields API endpoints
 */
import apiClient from './client';

export const fieldsAPI = {
  /**
   * Create a new field
   */
  createField: (data: any) => apiClient.post('/fields', data),

  /**
   * Get field by ID
   */
  getField: (id: string) => apiClient.get(`/fields/${id}`),

  /**
   * Update field
   */
  updateField: (id: string, data: any) => apiClient.patch(`/fields/${id}`, data),
};
