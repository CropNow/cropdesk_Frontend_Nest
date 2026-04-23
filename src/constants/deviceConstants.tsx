import React from 'react';
import {
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
  nest: [
    {
      id: 1,
      deviceType: 'nest',
      name: 'NEST Tower A1',
      subtitle: 'IoT Field Intelligence Tower',
      image: '/NEST.png',
      area: '5.2 acres',
      location: 'Green Valley Farm',
      boundary: 'Polygon',
      soilType: 'Loamy',
      irrigationType: 'Drip',
      crops: ['Tomato', 'Onion', 'Chili'],
    },
    {
      id: 2,
      deviceType: 'nest',
      name: 'NEST Tower B2',
      subtitle: 'IoT Field Intelligence Tower',
      image: '/NEST.png',
      area: '4.6 acres',
      location: 'Valley Farm',
      boundary: 'Polygon',
      soilType: 'Sandy Loam',
      irrigationType: 'Sprinkler',
      crops: ['Corn', 'Cabbage'],
    },
  ],
  seed: [
    {
      id: 1,
      deviceType: 'seed',
      name: 'Seed Rover S1',
      subtitle: 'Autonomous Ground Scout',
      image: '/seed.png',
      area: '6.3 acres',
      location: 'Green Valley Farm - Sector 1',
      boundary: 'Linear Path',
      soilType: 'Loamy',
      irrigationType: 'Drip',
      crops: ['Tomato', 'Okra', 'Bean'],
    },
    {
      id: 2,
      deviceType: 'seed',
      name: 'Seed Rover S2',
      subtitle: 'Autonomous Ground Scout',
      image: '/seed.png',
      area: '7.0 acres',
      location: 'Green Valley Farm - Sector 2',
      boundary: 'Grid Path',
      soilType: 'Clay Loam',
      irrigationType: 'Furrow',
      crops: ['Potato', 'Pea'],
    },
  ],
  aero: [
    {
      id: 1,
      deviceType: 'aero',
      name: 'Aero Drone X1',
      subtitle: 'Aerial Monitoring System',
      image: '/kaptor_drone.png',
      area: '9.0 acres',
      location: 'South Block',
      boundary: 'Aerial Grid',
      soilType: 'Mixed',
      irrigationType: 'Mixed',
      crops: ['All Crops'],
    },
    {
      id: 2,
      deviceType: 'aero',
      name: 'Aero Drone X2',
      subtitle: 'Aerial Monitoring System',
      image: '/kaptor_drone.png',
      area: '11.4 acres',
      location: 'North Block',
      boundary: 'Aerial Grid',
      soilType: 'Silt Loam',
      irrigationType: 'Pivot',
      crops: ['Wheat', 'Millet'],
    },
  ],
};

// Device labels for UI
export const DEVICE_LABELS: Record<DeviceType, string> = {
  nest: 'NEST',
  seed: 'Seed',
  aero: 'Aero Drone',
};

// Sensor cards configuration
export const SENSOR_CARDS = [
  { title: 'Weather Sensors', icon: CloudSun, accent: 'from-cyan-500/20 to-sky-500/10' },
  { title: 'Soil Sensors', icon: Leaf, accent: 'from-lime-500/20 to-emerald-500/10' },
  { title: 'Air Sensors', icon: Wind, accent: 'from-indigo-500/20 to-blue-500/10' },
];

// FIS (Field Intelligence System) Cards
export const FIS_CARDS: Array<{ title: string; value: number; status: FisStatus; body: string; icon: React.ElementType }> = [
  {
    title: 'Pest Analysis',
    value: 85,
    status: 'Warning',
    body: 'Minor aphid clustering in Sector G-14. Migration projected in 48h.',
    icon: Bug,
  },
  {
    title: 'Fungal Activity',
    value: 12,
    status: 'Optimal',
    body: 'Spore counts low and environment currently limits propagation.',
    icon: ShieldCheck,
  },
  {
    title: 'Air Quality',
    value: 93,
    status: 'Optimal',
    body: 'CO2 at 415 ppm, humidity stable for healthy crop respiration.',
    icon: Wind,
  },
];

// AI insights data
export const AI_INSIGHTS: Array<{ title: string; description: string; level: 'good' | 'warn' }> = [
  { title: 'Irrigation', description: 'Moisture trend stable in the last 6h.', level: 'good' },
  { title: 'Fungal', description: 'Low risk under current temperature profile.', level: 'good' },
  { title: 'Pest', description: 'Localized hotspots detected in southern rows.', level: 'warn' },
  { title: 'AQI', description: 'Air quality within expected farm threshold.', level: 'good' },
];

// Farm status metrics with sensor data
export const FARM_STATUS_METRICS: FarmStatusMetric[] = [
  {
    id: 'soil-moisture',
    label: 'Soil moisture',
    value: 54.3,
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
    value: 27.5,
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
    id: 'humidity',
    label: 'Humidity',
    value: 53,
    unit: '%',
    icon: <Droplets className="h-5 w-5" />,
    color: 'violet',
    min: 0,
    max: 100,
    status: 'optimal',
  },
  {
    id: 'visibility',
    label: 'Visibility',
    value: 24.1,
    unit: 'km',
    icon: <Eye className="h-5 w-5" />,
    color: 'emerald',
    min: 0,
    max: 50,
    status: 'optimal',
  },
  {
    id: 'leaf-wetness',
    label: 'Leaf Wetness',
    value: 30,
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
  { label: 'Seed', to: '/dashboard?device=seed' },
  { label: 'Aero Drone', to: '/dashboard?device=aero' },
];
