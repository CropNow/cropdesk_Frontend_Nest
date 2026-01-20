import { http } from '@/services/http';
import { Farm } from '@/features/auth/auth.types';

// Define Farm Statistics Type
export interface FarmStatistics {
  farmId: string;
  overview: {
    totalSensors: number;
    activeSensors: number;
    totalCrops: number;
    totalArea: number;
  };
  currentConditions: {
    avgTemperature: number | null;
    avgHumidity: number | null;
    avgSoilMoisture: number | null;
  };
}

export const getFarms = async (
  page = 1,
  limit = 10
): Promise<{ farms: Farm[]; pagination: any }> => {
  const response = await http.get<{
    status: string;
    data: { farms: Farm[]; pagination: any };
  }>(`/farms?page=${page}&limit=${limit}`);
  return response.data.data;
};

export const getFarmById = async (id: string): Promise<Farm> => {
  const response = await http.get<Farm>(`/farms/${id}`);
  return response.data;
};

export const createFarm = async (data: Partial<Farm>): Promise<Farm> => {
  const response = await http.post<{ success: boolean; data: Farm }>(
    '/farms',
    data
  );
  return response.data.data;
};

export const updateFarm = async (
  id: string,
  data: Partial<Farm>
): Promise<Farm> => {
  const response = await http.patch<Farm>(`/farms/${id}`, data);
  return response.data;
};

export const deleteFarm = async (id: string): Promise<void> => {
  await http.delete(`/farms/${id}`);
};

export const getFarmStatistics = async (
  id: string
): Promise<FarmStatistics> => {
  const response = await http.get<{ status: string; data: FarmStatistics }>(
    `/farms/${id}/statistics`
  );
  return response.data.data;
};
