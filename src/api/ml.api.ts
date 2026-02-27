import { http } from '@/services/http';

export interface YieldPrediction {
  type: 'yield';
  farmId: string;
  prediction: { value: number; unit: string; confidence: number };
  generatedBy: string;
}

export interface DiseasePrediction {
  type: 'disease';
  prediction: { value: string; confidence: number };
  recommendations: Array<{ action: string; priority: string }>;
}

export interface WeatherRecommendation {
  recommendations: Array<{ action: string; reason: string }>;
}

export interface SoilAnalysis {
  soilHealth: string;
  nutrients: { nitrogen: string; [key: string]: string };
  recommendation: string;
}

export interface IrrigationRecommendation {
  irrigationSchedule: string;
  waterSavingEstimate: string;
}

// 3. Machine Learning (ML) & Prediction APIs
export const getYieldPrediction = async (
  farmId: string
): Promise<YieldPrediction> => {
  const response = await http.get<YieldPrediction>(
    `/predictions/yield/${farmId}`
  );
  return response.data;
};

export const getDiseasePrediction = async (
  fieldId: string
): Promise<DiseasePrediction> => {
  const response = await http.get<DiseasePrediction>(
    `/predictions/disease/${fieldId}`
  );
  return response.data;
};

export const getWeatherRecommendations = async (
  payload: any
): Promise<WeatherRecommendation> => {
  const response = await http.post<WeatherRecommendation>(
    '/predictions/weather/recommendations',
    payload
  );
  return response.data;
};

export const getSoilAnalysis = async (
  fieldId: string
): Promise<SoilAnalysis> => {
  const response = await http.get<SoilAnalysis>(
    `/predictions/soil/${fieldId}/analysis`
  );
  return response.data;
};

export const getIrrigationRecommendation = async (
  fieldId: string
): Promise<IrrigationRecommendation> => {
  const response = await http.get<IrrigationRecommendation>(
    `/predictions/irrigation/${fieldId}/recommendation`
  );
  return response.data;
};

// 4. Internal / IoT APIs
export const triggerManualSync = async (apiKey?: string): Promise<void> => {
  await http.post('/internal/iot/sync', { apiKey });
};

export const ingestData = async (payload: any): Promise<void> => {
  await http.post('/internal/iot/ingest', payload);
};

// 5. Aggregated / Latest Prediction APIs - using correct endpoints
export const getLatestPrediction = async (
  farmId: string
): Promise<any | null> => {
  try {
    const response = await http.get(`/predictions/yield/${farmId}`);
    return response.data;
  } catch (error) {
    console.warn('Failed to fetch yield prediction:', error);
    return null;
  }
};

export const createPrediction = async (data: any): Promise<any> => {
  const response = await http.post('/predictions', data);
  return response.data;
};

export const analyzeCropHealth = async (
  sensorData: any,
  farmId: string
): Promise<any> => {
  return await getWeatherRecommendations({
    ...sensorData,
    farmId,
  });
};
