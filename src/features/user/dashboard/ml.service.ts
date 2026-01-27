/* eslint-disable no-console */
import { MLPrediction } from '@/types/ml.types';
import { http } from '@/services/http';
import axios from 'axios';

// External ML Service URL
// Using Vite Proxy '/ml-api' -> 'https://services.cropdesk.in' to avoid CORS
const ML_API_URL = '/ml-api';

export const getLatestPrediction = async (
  userId: string
): Promise<MLPrediction | null> => {
  try {
    const response = await http.get(`/predictions/latest?userId=${userId}`);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    // Suppress 404/500 errors for latest prediction as it might just mean no history
    console.warn('No previous prediction found or failed to fetch:', error);
  }
  return null;
};

// Helper to ensure payload matches Schema strictly
const sanitizePayload = (data: any): any => {
  return {
    // Top level fields
    userId: data.userId,
    farmId: data.farmId,
    generatedAt: data.generatedAt || new Date().toISOString(),
    generatedBy: data.generatedBy || 'automatic',
    validUntil: data.validUntil,

    // Nested Objects - strictly pick fields
    pest: data.pest
      ? {
          pest_risk_level: data.pest.pest_risk_level || 'LOW',
          pest_risk_score: Number(data.pest.pest_risk_score || 0),
          light_intensity_lux: Number(data.pest.light_intensity_lux || 0),
          wind_speed: Number(data.pest.wind_speed || 0),
        }
      : undefined,

    irrigation: data.irrigation
      ? {
          irrigation_required: Boolean(data.irrigation.irrigation_required),
          water_requirement_mm: Number(
            data.irrigation.water_requirement_mm || 0
          ),
          soil_moisture: Number(data.irrigation.soil_moisture || 0),
          rainfall_mm: Number(data.irrigation.rainfall_mm || 0),
          decision_basis: data.irrigation.decision_basis || '',
        }
      : undefined,

    fungal_disease: data.fungal_disease
      ? {
          activity_level: data.fungal_disease.activity_level || 'LOW',
          risk_score: Number(data.fungal_disease.risk_score || 0),
          leaf_wetness_pct: Number(data.fungal_disease.leaf_wetness_pct || 0),
          temperature: Number(data.fungal_disease.temperature || 0),
          humidity: Number(data.fungal_disease.humidity || 0),
          rainfall: Number(data.fungal_disease.rainfall || 0),
          recommendation: data.fungal_disease.recommendation || '',
        }
      : undefined,

    aqi: data.aqi
      ? {
          aqi: Number(data.aqi.aqi || 0),
          aqi_level: data.aqi.aqi_level || 'GOOD',
          dominant_pollutant: data.aqi.dominant_pollutant || '',
          plant_impact: data.aqi.plant_impact || '',
        }
      : undefined,

    prescription: data.prescription
      ? {
          actions: Array.isArray(data.prescription.actions)
            ? data.prescription.actions
            : [],
        }
      : undefined,

    farm_status: data.farm_status
      ? {
          farm_health_percentage: Number(
            data.farm_status.farm_health_percentage || 0
          ),
          farm_condition: data.farm_status.farm_condition || 'Unknown',
          stress_breakdown: {
            pest_stress: Number(
              data.farm_status.stress_breakdown?.pest_stress || 0
            ),
            fungal_stress: Number(
              data.farm_status.stress_breakdown?.fungal_stress || 0
            ),
            irrigation_stress: Number(
              data.farm_status.stress_breakdown?.irrigation_stress || 0
            ),
            aqi_stress: Number(
              data.farm_status.stress_breakdown?.aqi_stress || 0
            ),
          },
        }
      : undefined,
  };
};

export const createPrediction = async (data: any) => {
  try {
    const cleanPayload = sanitizePayload(data);
    console.log('Sanitized Payload for DB:', cleanPayload);
    const response = await http.post('/predictions', cleanPayload);
    return response.data;
  } catch (error) {
    console.error('Failed to create prediction:', error);
    throw error;
  }
};

// Start of Robustness Helpers
const safeFloat = (value: any, defaultValue: number = 0): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const analyzeCropHealth = async (
  sensorData: any,
  userId: string
): Promise<MLPrediction> => {
  try {
    const now = new Date();

    // 1. Map Application Data to ML API Schema (SensorInput) with Robust Sanitization
    const payload = {
      temperature: safeFloat(sensorData.temperature),
      humidity: safeFloat(sensorData.humidity),
      wind_speed: safeFloat(sensorData.windSpeed),
      wind_direction: safeFloat(sensorData.windDirection),
      pressure: safeFloat(sensorData.pressure),
      rainfall: safeFloat(sensorData.rainfall) / 60, // Adjusted as per user request history interaction

      soil_temperature: safeFloat(sensorData.soilTemperature),
      soil_moisture: safeFloat(sensorData.soilMoisture),
      leaf_wetness: safeFloat(sensorData.leafWetness),

      solar_radiation: safeFloat(sensorData.solarRadiation),
      light_intensity: safeFloat(sensorData.lightIntensity),

      pm2_5: safeFloat(sensorData.pm2_5),
      pm10: safeFloat(sensorData.pm10),
      so2: safeFloat(sensorData.so2),
      no2: safeFloat(sensorData.no2),
      o3: safeFloat(sensorData.o3),

      hour: now.getHours(),
      day: now.getDate(),
      month: now.getMonth() + 1,
    };

    console.log('Sending sanitized payload to ML Model:', payload);

    // 2. Call External ML API
    try {
      const response = await axios.post(`${ML_API_URL}/predict`, payload);
      const result = response.data;
      console.log('ML Model Response Success:', result);

      // 3. Transform Response to match MLPrediction interface
      const predictionData: any = {
        _id: 'pred_external_' + Date.now(),
        userId: userId,
        // Direct mapping of the new response structure
        pest: result.pest,
        irrigation: result.irrigation,
        fungal_disease: result.fungal_disease,
        aqi: result.aqi,
        prescription: result.prescription,
        farm_status: result.farm_status,

        generatedAt: new Date().toISOString(),
        generatedBy: 'automatic',
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Valid for 24h
        prediction: {
          confidence: 85, // Fallback generic confidence if not provided globally
        },
      };

      return predictionData as MLPrediction;
    } catch (apiError: any) {
      console.error('ML API Call Failed:', {
        status: apiError.response?.status,
        statusText: apiError.response?.statusText,
        data: apiError.response?.data,
        message: apiError.message,
      });
      throw new Error(
        `ML Service Error: ${apiError.response?.data?.detail || apiError.message}`
      );
    }
  } catch (error: any) {
    console.error('ML Analysis Process Failed:', error);
    throw error;
  }
};
