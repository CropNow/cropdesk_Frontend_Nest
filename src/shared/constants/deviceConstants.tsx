export type DeviceType = "nest" | "seed" | "aero";

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

export const DEVICE_LIBRARY: Record<DeviceType, DeviceData[]> = {
  nest: [],
  seed: [],
  aero: [],
};

export const DEVICE_LABELS: Record<DeviceType, string> = {
  nest: "NEST",
  seed: "Seed",
  aero: "Aero Drone",
};

export const DEVICE_NAV_LINKS = [
  { label: "NEST", to: "/dashboard?device=nest" },
];
