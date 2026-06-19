import { useMemo } from "react";
import { DeviceType } from "@shared/constants/deviceConstants";

interface UseDeviceCarouselProps {
  backendDevices: any[];
  selectedDeviceType: DeviceType;
  setSelectedDeviceType: (type: DeviceType) => void;
  currentDeviceIndex: number;
  setCurrentDeviceIndex: React.Dispatch<React.SetStateAction<number>>;
  setSearchParams: (
    nextInit:
      | URLSearchParams
      | string
      | Record<string, string>
      | [string, string][]
      | ((prev: URLSearchParams) => URLSearchParams),
    navigateOptions?: { replace?: boolean; state?: any },
  ) => void;
  dashboardData: any;
}

export function useDeviceCarousel({
  backendDevices,
  selectedDeviceType,
  setSelectedDeviceType,
  currentDeviceIndex,
  setCurrentDeviceIndex,
  setSearchParams,
  dashboardData,
}: UseDeviceCarouselProps) {
  const deviceList = useMemo(() => {
    if (backendDevices && backendDevices.length > 0) {
      return backendDevices.map((d, idx) => ({
        id: d.id || d._id || `backend-${idx}`,
        deviceType: selectedDeviceType,
        name: d.name || d.deviceId || `Device ${idx + 1}`,
        subtitle: "IoT Field Intelligence Tower",
        image: selectedDeviceType === "seed" ? "/seed.png" : "/NEST.png",
        area: d.field?.area ? `${d.field.area} acres` : "N/A",
        location: d.farm?.name || "N/A",
        boundary: "Polygon",
        soilType:
          d.field?.soil?.type || d.field?.soilType
            ? String(d.field?.soil?.type || d.field?.soilType)
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())
            : "N/A",
        irrigationType:
          d.field?.irrigation?.type || d.field?.irrigationType
            ? String(d.field?.irrigation?.type || d.field?.irrigationType)
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())
            : "N/A",
        crops: d.crops?.map((c: any) => c.name) || [],
        raw: d,
      }));
    }
    return [];
  }, [backendDevices, selectedDeviceType]);

  const currentDevice = useMemo(() => {
    const listLen = deviceList.length;
    if (listLen === 0) return null;
    const device = deviceList[currentDeviceIndex % listLen] || null;
    if (device && dashboardData?.sensors) {
      return { ...device, isOnline: dashboardData.sensors.isOnline };
    }
    return device
      ? {
          ...device,
          isOnline:
            device.raw?.status === "online" || device.raw?.status === "active",
        }
      : null;
  }, [deviceList, currentDeviceIndex, dashboardData]);

  const cycleDevice = async (direction: 1 | -1) => {
    setCurrentDeviceIndex((prev) => {
      const listLen = deviceList.length;
      if (listLen === 0) return 0;
      const next = prev + direction;
      if (next < 0) return listLen - 1;
      if (next >= listLen) return 0;
      return next;
    });
  };

  const onTypeChange = (type: DeviceType) => {
    setSelectedDeviceType(type);
    setCurrentDeviceIndex(0);
    setSearchParams({ device: type });
  };

  return {
    deviceList,
    currentDevice,
    cycleDevice,
    onTypeChange,
  };
}
