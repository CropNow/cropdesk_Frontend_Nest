export interface PlanPricing {
  amount: number;
  currency: string;
  discount?: number;
}

export interface PlanFeatures {
  sensors: number;
  farms: number;
  fields: number;
  dataRetentionDays: number;
  predictions: boolean;
  aiRecommendations: boolean;
  apiAccess: boolean;
  customIntegrations: boolean;
  teamMembers: number;
  support: 'email' | 'priority' | 'dedicated';
  whatsappAlerts: boolean;
  smsAlerts: boolean;
  multiFieldDashboard: boolean;
  yieldPrediction: boolean;
  aiCropSuggestions: boolean;
}

export interface Plan {
  planId: string;
  name: string;
  description: string;
  pricing: {
    monthly: PlanPricing;
    yearly: PlanPricing;
  };
  features: PlanFeatures;
  isActive: boolean;
  isPopular?: boolean;
  displayOrder: number;
}

export const plans: Plan[] = [
  {
    planId: 'basic',
    name: 'Basic',
    description: 'Basic Monitoring & Analytics',
    pricing: {
      monthly: { amount: 1000, currency: 'INR' },
      yearly: { amount: 10000, currency: 'INR', discount: 15 },
    },
    features: {
      sensors: 3,
      farms: 3,
      fields: 3,
      dataRetentionDays: 90,
      predictions: true,
      aiRecommendations: false,
      apiAccess: false,
      customIntegrations: false,
      teamMembers: 1,
      support: 'email',
      whatsappAlerts: false,
      smsAlerts: true,
      multiFieldDashboard: false,
      yieldPrediction: true,
      aiCropSuggestions: false,
    },
    isActive: true,
    displayOrder: 1,
  },
  {
    planId: 'pro',
    name: 'Pro',
    description: 'Advanced Monitoring for Professional Farmers',
    pricing: {
      monthly: { amount: 2500, currency: 'INR' },
      yearly: { amount: 25000, currency: 'INR', discount: 15 },
    },
    features: {
      sensors: 5,
      farms: 3,
      fields: 5,
      dataRetentionDays: 365,
      predictions: true,
      aiRecommendations: true,
      apiAccess: false,
      customIntegrations: false,
      teamMembers: 5,
      support: 'priority',
      whatsappAlerts: true,
      smsAlerts: true,
      multiFieldDashboard: true,
      yieldPrediction: true,
      aiCropSuggestions: true,
    },
    isActive: true,
    isPopular: true,
    displayOrder: 2,
  },
  {
    planId: 'premium',
    name: 'Premium',
    description: 'Unlimited Power for Large Scale Operations',
    pricing: {
      monthly: { amount: 3000, currency: 'INR' },
      yearly: { amount: 30000, currency: 'INR', discount: 15 },
    },
    features: {
      sensors: 9999,
      farms: 10,
      fields: 20,
      dataRetentionDays: 730,
      predictions: true,
      aiRecommendations: true,
      apiAccess: true,
      customIntegrations: true,
      teamMembers: 20,
      support: 'dedicated',
      whatsappAlerts: true,
      smsAlerts: true,
      multiFieldDashboard: true,
      yieldPrediction: true,
      aiCropSuggestions: true,
    },
    isActive: true,
    displayOrder: 3,
  },
];
