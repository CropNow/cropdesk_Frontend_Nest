import React from 'react';
import {
  Activity,
  Bug,
  CloudSun,
  Droplets,
  Eye,
  Leaf,
  ShieldCheck,
  Thermometer,
  Waves,
  Wind,
} from 'lucide-react';

export type DeviceType = 'nest' | 'seed' | 'aero';
export type FisStatus = 'Optimal' | 'Warning' | 'Critical';

export type DeviceData = {
  id: number;
  deviceType: DeviceType;
  name: string;
  subtitle: string;
  image: string;
  area: string;
  location: string;
  boundary: string;
  soilType: string;
  irrigationType: string;
  crops: string[];
};

export type FarmStatusMetric = {
  id: string;
  label: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  color: 'emerald' | 'cyan' | 'amber' | 'orange' | 'violet' | 'blue';
  min: number;
  max: number;
  status: 'optimal' | 'warning' | 'critical';
};

// Device library with all device data
export const DEVICE_LIBRARY: Record<DeviceType, DeviceData[]> = {
  nest: [],
  seed: [],
  aero: [],
};

// Device labels for UI
export const DEVICE_LABELS: Record<DeviceType, string> = {
  nest: 'NEST',
  seed: 'Seed',
  aero: 'Aero Drone',
};

// Sensor cards configuration
export const SENSOR_CARDS = [
  { title: 'Nest Device Sensors', icon: Activity, accent: 'from-[#00FF9C]/20 to-emerald-500/10' },
];

// FIS (Field Intelligence System) Cards
export const FIS_CARDS: Array<{ title: string; value: number; status: FisStatus; body: string; icon: React.ElementType }> = [
  { title: 'Pest Analysis', value: 0, status: 'Optimal', body: '', icon: Bug },
  { title: 'Fungal Activity', value: 0, status: 'Optimal', body: '', icon: ShieldCheck },
  { title: 'Irrigation Analysis', value: 0, status: 'Optimal', body: '', icon: Droplets },
];

// AI insights data
export const AI_INSIGHTS: Array<{ title: string; description: string; level: 'good' | 'warn' }> = [];

// Farm status metrics with sensor data
export const FARM_STATUS_METRICS: FarmStatusMetric[] = [
  {
    id: 'soil-moisture',
    label: 'Soil moisture',
    value: 0,
    unit: 'v/v',
    icon: <Waves className="h-5 w-5" />,
    color: 'cyan',
    min: 0,
    max: 100,
    status: 'optimal',
  },
  {
    id: 'temperature',
    label: 'Temperature',
    value: 0,
    unit: '°C',
    icon: <Thermometer className="h-5 w-5" />,
    color: 'orange',
    min: 0,
    max: 50,
    status: 'optimal',
  },
  {
    id: 'wind-speed',
    label: 'Wind speed',
    value: 0,
    unit: 'm/s',
    icon: <Wind className="h-5 w-5" />,
    color: 'blue',
    min: 0,
    max: 30,
    status: 'optimal',
  },
  {
    id: 'o3',
    label: 'Ozone (O3)',
    value: 0,
    unit: 'ppb',
    icon: <CloudSun className="h-5 w-5" />,
    color: 'cyan',
    min: 0,
    max: 200,
    status: 'optimal',
  },
  {
    id: 'humidity',
    label: 'Humidity',
    value: 0,
    unit: '%',
    icon: <Droplets className="h-5 w-5" />,
    color: 'violet',
    min: 0,
    max: 100,
    status: 'optimal',
  },
  {
    id: 'leaf-wetness',
    label: 'Leaf Wetness',
    value: 0,
    unit: '%',
    icon: <Leaf className="h-5 w-5" />,
    color: 'emerald',
    min: 0,
    max: 100,
    status: 'optimal',
  },
];

// Device navigation links
export const DEVICE_NAV_LINKS = [
  { label: 'NEST', to: '/dashboard?device=nest' },
];
