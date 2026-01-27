export interface PestData {
  pest_risk_level: string; // 'LOW' | 'MEDIUM' | 'HIGH'
  pest_risk_score: number;
  light_intensity_lux: number;
  wind_speed: number;
}

export interface IrrigationData {
  irrigation_required: boolean;
  water_requirement_mm: number;
  soil_moisture: number;
  rainfall_mm: number;
  decision_basis: string;
}

export interface FungalData {
  activity_level: string; // 'LOW' | 'MEDIUM' | 'HIGH'
  risk_score: number;
  leaf_wetness_pct: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  recommendation: string;
}

export interface AqiData {
  aqi: number;
  aqi_level: string; // 'UNHEALTHY' | 'GOOD' etc
  dominant_pollutant: string;
  plant_impact: string;
}

export interface FarmStatusData {
  farm_health_percentage: number;
  farm_condition: string;
  stress_breakdown: {
    pest_stress: number;
    fungal_stress: number;
    irrigation_stress: number;
    aqi_stress: number;
  };
}

export interface MLPrediction {
  _id?: string;
  userId: string;
  farmId?: string;

  // New Structured Data
  pest: PestData;
  irrigation: IrrigationData;
  fungal_disease: FungalData;
  aqi: AqiData;
  prescription: {
    actions: string[];
  };
  farm_status: FarmStatusData;

  // Metadata
  generatedAt: string;
  generatedBy: 'automatic' | 'manual';
  validUntil?: string;

  // Legacy / Optional fields for backward compat or generic display
  prediction?: {
    confidence: number;
  };
}
