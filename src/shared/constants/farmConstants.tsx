import React from "react";
import { Droplets, Eye, Leaf, Thermometer, Waves, Wind } from "lucide-react";

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
    id: "soil-moisture",
    label: "Soil moisture",
    value: 0,
    unit: "v/v",
    icon: <Waves className="h-5 w-5" />,
    color: "cyan",
    min: 0,
    max: 100,
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
    id: "visibility",
    label: "Visibility",
    value: 0,
    unit: "km",
    icon: <Eye className="h-5 w-5" />,
    color: "cyan",
    min: 0,
    max: 20,
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
