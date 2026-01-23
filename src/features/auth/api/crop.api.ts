import { http } from '@/services/http';
import { Crop } from '@/features/auth/auth.types';

export interface CropTimeline {
  plantingDate: string;
  expectedHarvestDate: string;
  actualHarvestDate?: string;
  stage: string;
}

export const getCropsByField = async (fieldId: string): Promise<Crop[]> => {
  const response = await http.get<Crop[]>(`/fields/${fieldId}/crops`);
  return response.data;
};

export const getCropById = async (id: string): Promise<Crop> => {
  const response = await http.get<Crop>(`/crops/${id}`);
  return response.data;
};

// Create Crop is nested under Field
export const createCrop = async (
  fieldId: string,
  data: Partial<Crop>
): Promise<Crop> => {
  const response = await http.post<{ success: boolean; data: Crop }>(
    `/fields/${fieldId}/crops`,
    data
  );
  return response.data.data;
};

export const updateCrop = async (
  id: string,
  data: Partial<Crop>
): Promise<Crop> => {
  const response = await http.patch<Crop>(`/crops/${id}`, data);
  return response.data;
};

export const deleteCrop = async (id: string): Promise<void> => {
  await http.delete(`/crops/${id}`);
};

export const harvestCrop = async (
  id: string,
  data: any
): Promise<{ message: string; crop: Crop }> => {
  const response = await http.patch<{ message: string; crop: Crop }>(
    `/crops/${id}/harvest`,
    data
  );
  return response.data;
};

export const getCropTimeline = async (id: string): Promise<CropTimeline> => {
  const response = await http.get<CropTimeline>(`/crops/${id}/timeline`);
  return response.data;
};
