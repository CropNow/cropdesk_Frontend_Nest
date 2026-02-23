/* eslint-disable no-console */
import { MLPrediction } from '@/types/ml.types';
import * as mlApi from '@/api/ml.api';

// Helper to get farmId from localStorage or context
const getFarmId = async (): Promise<string | null> => {
  try {
    // Try to get from localStorage first
    const farmsStr = localStorage.getItem('farms');
    if (farmsStr) {
      const farms = JSON.parse(farmsStr);
      if (farms && farms.length > 0) {
        return farms[0].id || farms[0]._id || null;
      }
    }

    // Try to get from registeredUser
    const userStr = localStorage.getItem('registeredUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.farmerDetails?.farms?.length > 0) {
        return (
          user.farmerDetails.farms[0].id ||
          user.farmerDetails.farms[0]._id ||
          null
        );
      }
    }

    return null;
  } catch (error) {
    console.warn('Failed to get farmId:', error);
    return null;
  }
};

export const getLatestPrediction = async (
  userId: string
): Promise<MLPrediction | null> => {
  try {
    const farmId = await getFarmId();
    if (!farmId) {
      console.warn('No farmId available for prediction');
      return null;
    }
    return await mlApi.getLatestPrediction(farmId);
  } catch (error) {
    console.warn('No previous prediction found or failed to fetch:', error);
  }
  return null;
};

// Helper to ensure payload matches Schema strictly
const sanitizePayload = (data: any): any => {
  const payload: any = {
    userId: data.userId,
    generatedAt: data.generatedAt || new Date().toISOString(),
    generatedBy: data.generatedBy || 'automatic',
    validUntil: data.validUntil,
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
  return payload;
};

export const createPrediction = async (data: any) => {
  try {
    const cleanPayload = sanitizePayload(data);
    return await mlApi.createPrediction(cleanPayload);
  } catch (error) {
    console.error('Failed to create prediction:', error);
    throw error;
  }
};

export const analyzeCropHealth = async (
  sensorData: any,
  userId: string
): Promise<MLPrediction> => {
  try {
    const farmId = await getFarmId();
    if (!farmId) {
      throw new Error('No farmId available for crop health analysis');
    }
    return await mlApi.analyzeCropHealth(sensorData, farmId);
  } catch (error: any) {
    console.error('ML Analysis Request Failed:', error);
    throw error;
  }
};
