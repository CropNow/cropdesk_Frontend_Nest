import { http } from '@/services/http';
import { Farmer } from '@/features/auth/auth.types';

// Define the response type if different, otherwise assume it returns the Farmer object
// generic API response wrapper might be needed if backend wraps in { data: ... } but controller shows res.json(farmer) directly.

export const getAllFarmers = async (): Promise<Farmer[]> => {
  const response = await http.get<Farmer[]>('/farmers');
  return response.data;
};

export const getFarmerById = async (id: string): Promise<Farmer> => {
  const response = await http.get<Farmer>(`/farmers/${id}`);
  return response.data;
};

export const createFarmer = async (data: Partial<Farmer>): Promise<Farmer> => {
  const response = await http.post<Farmer>('/farmers', data);
  return response.data;
};

export const updateFarmer = async (
  id: string,
  data: Partial<Farmer>
): Promise<Farmer> => {
  const response = await http.patch<Farmer>(`/farmers/${id}`, data);
  return response.data;
};

export const deleteFarmer = async (id: string): Promise<void> => {
  await http.delete(`/farmers/${id}`);
};
