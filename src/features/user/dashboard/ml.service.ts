/* eslint-disable no-console */
import { MLPrediction } from '@/types/ml.types';
import * as mlApi from '@/api/ml.api';

// Helper to get farmId from localStorage or context
const getFarmId = async (): Promise<string | null> => {
  try {
    // 1. Try explicit selection first
    const selectedFarmId = localStorage.getItem('selectedFarmId');
    if (
      selectedFarmId &&
      selectedFarmId !== 'null' &&
      selectedFarmId !== 'undefined'
    ) {
      return selectedFarmId;
    }

    // 2. Fallback to farms collection
    const farmsStr = localStorage.getItem('farms');
    if (farmsStr) {
      const farms = JSON.parse(farmsStr);
      if (farms && farms.length > 0) {
        const id = farms[0].id || farms[0]._id;
        if (id) return String(id);
      }
    }

    // 3. Fallback to user profile
    const userStr = localStorage.getItem('registeredUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      const farms = user?.farmerDetails?.farms;
      if (farms && farms.length > 0) {
        const id = farms[0].id || farms[0]._id;
        if (id) return String(id);
      }
    }
    return null;
  } catch (error) {
    console.warn('Failed to get farmId:', error);
    return null;
  }
};

// Helper to get fieldId from localStorage or context
const getFieldId = async (): Promise<string | null> => {
  try {
    // 1. Try explicit selection first
    const selectedFieldId = localStorage.getItem('selectedFieldId');
    if (
      selectedFieldId &&
      selectedFieldId !== 'null' &&
      selectedFieldId !== 'undefined'
    ) {
      return selectedFieldId;
    }

    // 2. Fallback to structured selection
    const selectedFieldStr = localStorage.getItem('selectedField');
    if (selectedFieldStr) {
      const field = JSON.parse(selectedFieldStr);
      const id = field.id || field._id;
      if (id) return String(id);
    }

    // 3. Fallback: get first field of first farm
    const farmsStr = localStorage.getItem('farms');
    if (farmsStr) {
      const farms = JSON.parse(farmsStr);
      if (farms && farms[0]?.fields?.length > 0) {
        const field = farms[0].fields[0];
        const id = field.id || field._id;
        if (id) return String(id);
      }
    }
    return null;
  } catch (error) {
    console.warn('Failed to get fieldId:', error);
    return null;
  }
};

export const getLatestPrediction = async (
  userId: string
): Promise<MLPrediction | null> => {
  try {
    const farmId = await getFarmId();
    if (!farmId) return null;

    // Fetch primary yield prediction
    const yieldData = await mlApi.getYieldPrediction(farmId);

    // If we only wanted yield, we return here, but for FIS Engine we need more.
    // However, the current structure expects a unified MLPrediction.
    // Let's return the yield data as the base.
    return yieldData as any;
  } catch (error) {
    console.warn('Failed to fetch latest prediction:', error);
  }
  return null;
};

// ... (sanitizePayload remains the same or similarly updated)
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
    const result = await mlApi.createPrediction(cleanPayload);
    // Return merged data to avoid loss in frontend (UI expects rich payload)
    return { ...cleanPayload, ...result };
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
    const fieldId = await getFieldId();

    if (!farmId || !fieldId) {
      throw new Error('Farm or Field context missing for FIS Analysis');
    }

    // Call FIS Enigen APIs in Parallel as requested
    console.log('Fetching FIS Engine results from multiple endpoints...');
    const [diseaseData, irrigationData, suggestionsData, soilData] =
      await Promise.allSettled([
        mlApi.getDiseasePrediction(fieldId),
        mlApi.getIrrigationRecommendation(fieldId),
        mlApi.getWeatherRecommendations({ ...sensorData, farmId }),
        mlApi.getSoilAnalysis(fieldId),
      ]);

    // Map the results back to the MLPrediction structure
    const prediction: Partial<MLPrediction> = {
      _id: `pred_external_${Date.now()}`,
      userId,
      generatedAt: new Date().toISOString(),
      generatedBy: 'manual',
      pest: {
        pest_risk_level:
          diseaseData.status === 'fulfilled'
            ? diseaseData.value.prediction.value === 'HIGH'
              ? 'HIGH'
              : 'LOW'
            : 'LOW',
        pest_risk_score:
          diseaseData.status === 'fulfilled'
            ? diseaseData.value.prediction.confidence
            : 0,
        light_intensity_lux: Number(sensorData.lightIntensity || 0),
        wind_speed: Number(sensorData.windSpeed || 0),
      },
      fungal_disease: {
        activity_level:
          diseaseData.status === 'fulfilled'
            ? diseaseData.value.prediction.value
            : 'LOW',
        risk_score:
          diseaseData.status === 'fulfilled'
            ? diseaseData.value.prediction.confidence
            : 0,
        leaf_wetness_pct: Number(sensorData.humidity || 0), // Proxy
        temperature: Number(sensorData.temperature || 0),
        humidity: Number(sensorData.humidity || 0),
        rainfall: Number(sensorData.rainfall || 0),
        recommendation:
          diseaseData.status === 'fulfilled'
            ? diseaseData.value.recommendations?.[0]?.action || ''
            : '',
      },
      irrigation: {
        irrigation_required:
          irrigationData.status === 'fulfilled'
            ? !!irrigationData.value.irrigationSchedule
            : false,
        water_requirement_mm:
          irrigationData.status === 'fulfilled'
            ? parseFloat(irrigationData.value.waterSavingEstimate) || 0
            : 0,
        soil_moisture: Number(sensorData.soilMoisture || 0),
        rainfall_mm: Number(sensorData.rainfall || 0),
        decision_basis:
          irrigationData.status === 'fulfilled'
            ? irrigationData.value.irrigationSchedule
            : '',
      },
      prescription: {
        actions:
          suggestionsData.status === 'fulfilled'
            ? suggestionsData.value.recommendations.map((r) => r.action)
            : [],
      },
      farm_status: {
        farm_health_percentage: 85, // Default/Calculated
        farm_condition:
          soilData.status === 'fulfilled'
            ? soilData.value.soilHealth
            : 'Monitoring',
        stress_breakdown: {
          pest_stress: 0,
          fungal_stress: 0,
          irrigation_stress: 0,
          aqi_stress: 0,
        },
      },
      aqi: {
        aqi: Number(sensorData.pm2_5 || 0),
        aqi_level: 'GOOD',
        dominant_pollutant: 'PM2.5',
        plant_impact: 'Normal growth expected',
      },
    };

    return prediction as MLPrediction;
  } catch (error: any) {
    console.error('FIS Engine Analysis Failed:', error);
    throw error;
  }
};
