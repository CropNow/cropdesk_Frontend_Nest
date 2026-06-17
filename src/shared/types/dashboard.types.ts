/**
 * Dashboard types
 */

export interface FarmHealth {
  farmId: string;
  overallHealth: number; // 0-100
  soilHealth: number;
  cropHealth: number;
  waterManagement: number;
  pestDiseaseRisk: number;
  lastUpdated: string;
}

export interface WaterSavingsData {
  period: 'day' | 'week' | 'month';
  savedVolume: number; // liters
  savedCost: number; // currency
  efficiency: number; // percentage
  comparisonWithPrevious: number; // percentage change
}

export interface DashboardMetrics {
  totalDevices: number;
  activeDevices: number;
  activeAlerts: number;
  criticalAlerts: number;
  lastSync: string;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  category: string;
  actionable: boolean;
  recommendation?: string;
  confidence: number; // 0-1
  createdAt: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  expectedImpact: string;
  estimatedTimeToImplement: number; // hours
  status: 'pending' | 'accepted' | 'dismissed';
  createdAt: string;
}
