import { http } from '@/services/http';

export interface SensorLocation {
  type: 'Point';
  coordinates: [number, number];
}

export interface Sensor {
  id?: string;
  _id?: string;
  name: string;
  type: 'NEST' | 'SEED';
  location: {
    coordinates: SensorLocation;
  };
  unit: 'metric' | 'imperial';
  serialNumber?: string;
  status?: string;
  lastActiveAt?: string;
}

export interface CreateSensorDto {
  name: string;
  type: 'NEST' | 'SEED';
  location: {
    coordinates: SensorLocation;
  };
  unit: 'metric' | 'imperial';
}

export interface CalibrateSensorDto {
  offset: number;
  factor: number;
}

export interface SensorData {
  value: number;
  timestamp: string;
  unit: string;
  [key: string]: any;
}

// 1. Sensor APIs
export const createSensor = async (
  fieldId: string,
  data: CreateSensorDto
): Promise<Sensor> => {
  const response = await http.post<Sensor>(`/fields/${fieldId}/sensors`, data);
  return response.data;
};

export const getSensorDetails = async (sensorId: string): Promise<Sensor> => {
  const response = await http.get<Sensor>(`/sensors/${sensorId}`);
  return response.data;
};

export const updateSensor = async (
  sensorId: string,
  data: Partial<CreateSensorDto>
): Promise<Sensor> => {
  const response = await http.patch<Sensor>(`/sensors/${sensorId}`, data);
  return response.data;
};

export const deleteSensor = async (sensorId: string): Promise<void> => {
  await http.delete(`/sensors/${sensorId}`);
};

export const calibrateSensor = async (
  sensorId: string,
  data: CalibrateSensorDto
): Promise<void> => {
  await http.post(`/sensors/${sensorId}/calibrate`, data);
};

// 2. Sensor Data APIs
export const getLatestData = async (
  sensorId: string,
  count = 10
): Promise<SensorData[]> => {
  const response = await http.get(`/sensors/${sensorId}/data/latest`, {
    params: { count },
  });
  // Backend returns {success: true, data: [...]} or just [...]
  const data = response.data;
  return data.data || data || [];
};

export const getAggregatedData = async (
  sensorId: string,
  metric: string,
  range: string,
  aggregation: 'day' | 'hour' = 'day'
): Promise<any[]> => {
  const response = await http.get(`/sensors/${sensorId}/data/aggregate`, {
    params: { metric, range, aggregation },
  });
  const data = response.data;
  return data.data || data || [];
};

export const exportData = async (
  sensorId: string,
  startDate: string,
  endDate: string,
  format: 'csv' | 'json' = 'json'
): Promise<any> => {
  const response = await http.get(`/sensors/${sensorId}/data/export`, {
    params: { startDate, endDate, format },
    responseType: format === 'csv' ? 'blob' : 'json',
  });
  return response.data;
};
