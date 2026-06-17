import React from "react";
import { CloudSun, Droplets, Leaf, Sun, Thermometer, Wind } from "lucide-react";

export type FarmStatusMetric = {
  id: string;
  label: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  color: "emerald" | "cyan" | "amber" | "orange" | "violet" | "blue";
  min: number;
  max: number;
  status: "optimal" | "warning" | "critical";
};

export const FARM_STATUS_METRICS: FarmStatusMetric[] = [
  {
    id: "solar-radiation",
    label: "Solar Radiation",
    value: 0,
    unit: "W/m²",
    icon: <Sun className="h-5 w-5" />,
    color: "orange",
    min: 0,
    max: 1200,
    status: "optimal",
  },
  {
    id: "temperature",
    label: "Temperature",
    value: 0,
    unit: "°C",
    icon: <Thermometer className="h-5 w-5" />,
    color: "orange",
    min: 0,
    max: 50,
    status: "optimal",
  },
  {
    id: "wind-speed",
    label: "Wind speed",
    value: 0,
    unit: "m/s",
    icon: <Wind className="h-5 w-5" />,
    color: "blue",
    min: 0,
    max: 30,
    status: "optimal",
  },
  {
    id: "o3",
    label: "Ozone (O3)",
    value: 0,
    unit: "ppm",
    icon: <CloudSun className="h-5 w-5" />,
    color: "cyan",
    min: 0,
    max: 200,
    status: "optimal",
  },
  {
    id: "humidity",
    label: "Humidity",
    value: 0,
    unit: "%",
    icon: <Droplets className="h-5 w-5" />,
    color: "violet",
    min: 0,
    max: 100,
    status: "optimal",
  },
  {
    id: "leaf-wetness",
    label: "Leaf Wetness",
    value: 0,
    unit: "%",
    icon: <Leaf className="h-5 w-5" />,
    color: "emerald",
    min: 0,
    max: 100,
    status: "optimal",
  },
];
