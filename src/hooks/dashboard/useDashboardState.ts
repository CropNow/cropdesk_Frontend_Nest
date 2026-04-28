import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEVICE_LIBRARY, DeviceType, FARM_STATUS_METRICS } from '../../constants/deviceConstants';
import { isDeviceType } from '../../utils/deviceUtils';
import { normalizeAIInsights } from '../../utils/aiInsights';
import { dashboardAPI } from '../../api/dashboard.api';

export function useDashboardState() {
  const [searchParams, setSearchParams] = useSearchParams();
  const deviceFromQuery = searchParams.get('device');
  const initialType: DeviceType = isDeviceType(deviceFromQuery) ? deviceFromQuery : 'nest';

  const [selectedDeviceType, setSelectedDeviceType] = useState<DeviceType>(initialType);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // ─── API Data Fetching ───
  const [farms, setFarms] = useState<any[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Initial Load: Get Farms
  useEffect(() => {
    const initFarms = async () => {
      try {
        setIsLoading(true);
        const res = await dashboardAPI.getFarms();
        // Backend returns { status: 'success', data: { farms: [...] } }
        const data = res.data?.data;
        const farmsList = data?.farms || (Array.isArray(data) ? data : (Array.isArray(res.data) ? res.data : []));
        
        setFarms(farmsList);
        
        if (farmsList.length > 0) {
          const firstFarm = farmsList[0];
          setSelectedFarmId(firstFarm.id || firstFarm._id);
        } else {
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error('Farms Fetch Error:', err);
        setError(err.message || 'Failed to fetch farms');
        setIsLoading(false);
      }
    };
    initFarms();
  }, []);

  // 2. Fetch Farm Data: When farmId changes
  useEffect(() => {
    if (!selectedFarmId) return;

    const fetchFarmData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch from dashboard specific endpoints + statistics fallback
        const [overviewRes, statsRes, devicesRes, alertsRes, aiRes] = await Promise.all([
          dashboardAPI.getDashboardOverview().catch(() => ({ data: null })),
          dashboardAPI.getFarmStatistics(selectedFarmId).catch(() => ({ data: null })),
          dashboardAPI.getFarmDevices(selectedFarmId).catch(() => ({ data: null })),
          dashboardAPI.getAlerts().catch(() => ({ data: null })),
          dashboardAPI.getAIInsights(selectedFarmId).catch(() => ({ data: null })),
        ]);

        const overview = overviewRes.data?.overview;
        const stats = statsRes.data?.data || statsRes.data;
        const devices = devicesRes.data?.data || [];
        const alertsData = alertsRes.data?.data || alertsRes.data || [];
        const aiData = normalizeAIInsights(aiRes.data);

        // Find current device (Nest)
        // If there's only one nest, it will be the first one in the list
        const primaryDevice = devices[0];

        // Map metrics from statistics or fallback
        const mappedMetrics = FARM_STATUS_METRICS.map(m => {
          if (m.id === 'soil-moisture' && stats?.currentConditions?.avgSoilMoisture !== null) {
            return { ...m, value: stats.currentConditions.avgSoilMoisture };
          }
          if (m.id === 'temperature' && stats?.currentConditions?.avgTemperature !== null) {
            return { ...m, value: stats.currentConditions.avgTemperature };
          }
          if (m.id === 'humidity' && stats?.currentConditions?.avgHumidity !== null) {
            return { ...m, value: stats.currentConditions.avgHumidity };
          }
          return m;
        });

        setDashboardData({
          farm: farms.find(f => (f.id || f._id) === selectedFarmId) || primaryDevice?.farm,
          health: {
            overallHealth: overview?.performance?.healthScore || 85,
            metrics: mappedMetrics,
          },
          sensors: {
            activeSensorsCount: stats?.overview?.activeSensors || (devices.filter((d: any) => d.status === 'active').length) || 0,
            totalSensorsCount: stats?.overview?.totalSensors || devices.length || 0,
          },
          alerts: { 
            cards: alertsData,
            activeCount: overview?.activeAlerts || alertsData.length || 0
          },
          waterSavings: null, // Endpoint not yet identified in backend
          aiInsights: aiData,
          currentDevice: primaryDevice ? {
            name: primaryDevice.name,
            serialNumber: primaryDevice.serialNumber,
            deviceType: primaryDevice.type?.toLowerCase() || 'nest',
            subtitle: 'IoT Field Intelligence Tower',
            image: primaryDevice.type?.toLowerCase() === 'seed' ? '/seed.png' : '/NEST.png',
            soilType: primaryDevice.field?.soilType || 'N/A',
            area: primaryDevice.field?.area ? `${primaryDevice.field.area} acres` : 'N/A',
            location: primaryDevice.farm?.name || 'N/A',
            irrigationType: primaryDevice.field?.irrigationType || 'N/A',
            boundary: 'Polygon',
            crops: primaryDevice.crops?.map((c: any) => c.name) || []
          } : null,
        });
        
        setError(null);
      } catch (err: any) {
        console.error('Dashboard Data Fetch Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFarmData();
  }, [selectedFarmId, farms]);

  // ─── UI Logic ───
  // Update time every minute
  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  // Sync device type from URL query params
  useEffect(() => {
    const value = searchParams.get('device');
    if (isDeviceType(value) && value !== selectedDeviceType) {
      setSelectedDeviceType(value);
      setCurrentDeviceIndex(0);
    }
  }, [searchParams, selectedDeviceType]);

  const deviceList = DEVICE_LIBRARY[selectedDeviceType];
  const currentDevice = deviceList[currentDeviceIndex % deviceList.length];

  const cycleDevice = (direction: 1 | -1) => {
    setCurrentDeviceIndex((prev) => {
      const next = prev + direction;
      if (next < 0) return deviceList.length - 1;
      if (next >= deviceList.length) return 0;
      return next;
    });
  };

  const onTypeChange = (type: DeviceType) => {
    setSelectedDeviceType(type);
    setCurrentDeviceIndex(0);
    setSearchParams({ device: type });
  };

  const weatherSummary = useMemo(() => {
    return {
      city: 'Kallakurichi, IN',
      temp: '30 C',
      condition: 'Partly cloudy',
    };
  }, []);

  return {
    selectedDeviceType,
    currentDeviceIndex,
    isLoading,
    currentTime,
    currentDevice,
    deviceList,
    cycleDevice,
    onTypeChange,
    weatherSummary,
    error,
    dashboardData,
    farms,
    selectedFarmId,
    setSelectedFarmId,
  };
}
