import { http } from '@/services/http';
import { Field } from '@/features/auth/auth.types';

export const getFields = async (query: any = {}): Promise<Field[]> => {
  const params = new URLSearchParams(query).toString();
  const response = await http.get<Field[]>(`/fields?${params}`);
  return response.data;
};

export const getFieldById = async (id: string): Promise<Field> => {
  const response = await http.get<Field>(`/fields/${id}`);
  return response.data;
};

// Create Field is nested under Farm
export const createField = async (
  farmId: string,
  data: Partial<Field>
): Promise<Field> => {
  const response = await http.post<{ success: boolean; data: Field }>(
    `/farms/${farmId}/fields`,
    data
  );
  return response.data.data;
};

export const updateField = async (
  id: string,
  data: Partial<Field>
): Promise<Field> => {
  const response = await http.patch<Field>(`/fields/${id}`, data);
  return response.data;
};

export const deleteField = async (id: string): Promise<void> => {
  await http.delete(`/fields/${id}`);
};
