import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEVICE_LIBRARY, DeviceType, FARM_STATUS_METRICS } from '../../constants/deviceConstants';
import { isDeviceType } from '../../utils/deviceUtils';
import { dashboardAPI } from '../../api/dashboard.api';
import { sensorsAPI } from '../../api/sensors.api';

export function useDashboardState() {
  const [searchParams, setSearchParams] = useSearchParams();
  const deviceFromQuery = searchParams.get('device');
  const initialType: DeviceType = isDeviceType(deviceFromQuery) ? deviceFromQuery : 'nest';

  const [selectedDeviceType, setSelectedDeviceType] = useState<DeviceType>(initialType);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshTick, setRefreshTick] = useState(0);

  // ─── API Data Fetching ───
  const [farms, setFarms] = useState<any[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendDevices, setBackendDevices] = useState<any[]>([]);

  // Refs let the heavy fetch effect read the latest farms/backendDevices
  // without listing them as dependencies (which caused 2-3x re-fetch loops).
  const farmsRef = useRef<any[]>([]);
  const backendDevicesRef = useRef<any[]>([]);
  useEffect(() => { farmsRef.current = farms; }, [farms]);
  useEffect(() => { backendDevicesRef.current = backendDevices; }, [backendDevices]);

  const fetchBackendDevices = async () => {
    try {
      const typeParam = selectedDeviceType.toUpperCase();
      const res = await sensorsAPI.getSensors({ type: typeParam });
      const data = res.data?.data || res.data || [];
      if (Array.isArray(data)) {
        setBackendDevices(data);
      }
    } catch (e) {
      console.error('Failed to fetch backend devices:', e);
    }
  };

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

  // 2. Fetch Farm Data: When farmId or selected device type changes.
  // Reads farms / backendDevices via refs to avoid the dep-loop that previously
  // caused this effect to fire 2-3x per page load (the >3000ms regression).
  useEffect(() => {
    if (!selectedFarmId) return;

    const fetchFarmData = async () => {
      try {
        setIsLoading(true);

        // Run ALL initial calls in parallel — including the previously-serial
        // unfiltered getSensors used to derive actualSensorId.
        const [overviewRes, statsRes, devicesRes, alertsRes, aiRes, sensorsRes, allSensorsRes] = await Promise.all([
          dashboardAPI.getDashboardOverview().catch(() => ({ data: null })),
          dashboardAPI.getFarmStatistics(selectedFarmId).catch(() => ({ data: null })),
          dashboardAPI.getFarmDevices(selectedFarmId).catch(() => ({ data: null })),
          dashboardAPI.getAlerts().catch(() => ({ data: null })),
          dashboardAPI.getAIInsights(selectedFarmId).catch(() => ({ data: null })),
          sensorsAPI.getSensors({ type: selectedDeviceType.toUpperCase() }).catch(() => ({ data: null })),
          sensorsAPI.getSensors().catch(() => ({ data: null })),
        ]);

        const overview = overviewRes.data?.overview;
        const stats = statsRes.data?.data || statsRes.data;

        const devices: any[] = [];
        const addDevices = (res: any) => {
          if (!res || !res.data) return;
          const data = res.data?.data || res.data?.devices || (Array.isArray(res.data) ? res.data : []);
          if (Array.isArray(data)) {
            data.forEach((d: any) => {
              if (d && !devices.some((existing: any) => (existing.id || existing._id) === (d.id || d._id))) {
                devices.push(d);
              }
            });
          }
        };
        addDevices(devicesRes);
        addDevices(sensorsRes); // Add backend sensors as devices

        const alertsData = alertsRes.data?.data || alertsRes.data || [];
        const aiDataRaw = aiRes.data?.data || aiRes.data?.insights || aiRes.data;
        const aiData = Array.isArray(aiDataRaw) ? aiDataRaw : (typeof aiDataRaw === 'object' && aiDataRaw !== null ? [] : []);

        // Read latest snapshots without re-triggering this effect.
        const backendDevicesNow = backendDevicesRef.current;
        const farmsNow = farmsRef.current;

        // Find current device (Nest). Match index from available devices.
        const primaryDevice = backendDevicesNow[currentDeviceIndex % (backendDevicesNow.length || 1)] ||
                             devices[currentDeviceIndex % (devices.length || 1)] ||
                             devices[0];

        // Derive actualSensorId from the parallel allSensors response (no extra round-trip).
        const allSensors = allSensorsRes.data?.data || allSensorsRes.data || [];
        const actualSensorId = Array.isArray(allSensors) && allSensors.length > 0
          ? (allSensors[0]._id || allSensors[0].id)
          : null;

        // Fetch the single latest sensor reading. Pick the best available id once
        // and call /latest only one time instead of trying primaryDevice then falling back.
        const latestId = (primaryDevice && (primaryDevice.id || primaryDevice._id)) || actualSensorId;
        let sensorLatestData: any = null;
        if (latestId) {
          try {
            const latestRes = await sensorsAPI.getLatestReading(latestId);
            const latestDataArr = latestRes.data?.data || latestRes.data;
            if (Array.isArray(latestDataArr) && latestDataArr.length > 0) {
              sensorLatestData = { ...latestDataArr[0], deviceId: latestId, sensorId: actualSensorId };
            } else if (!Array.isArray(latestDataArr) && latestDataArr) {
              sensorLatestData = { ...latestDataArr, deviceId: latestId, sensorId: actualSensorId };
            }
          } catch (e) {
            console.error('Failed to fetch latest sensor data', e);
          }
        }

        // Map metrics from statistics or fallback
        const mappedMetrics = FARM_STATUS_METRICS.map(m => {
          const liveMoisture = sensorLatestData?.values?.soil_moisture_1 || sensorLatestData?.values?.soil_moisture || sensorLatestData?.soil_moisture;
          const liveTemp = sensorLatestData?.values?.soil_temperature || sensorLatestData?.values?.temperature || sensorLatestData?.temperature;
          const liveHumidity = sensorLatestData?.values?.humidity || sensorLatestData?.humidity;
          const liveWindSpeed = sensorLatestData?.values?.wind_speed || sensorLatestData?.wind_speed;

          if (m.id === 'soil-moisture') {
            const val = liveMoisture !== undefined && liveMoisture !== null ? liveMoisture : stats?.currentConditions?.avgSoilMoisture;
            if (val !== undefined && val !== null) return { ...m, value: val };
          }
          if (m.id === 'temperature') {
            const val = liveTemp !== undefined && liveTemp !== null ? liveTemp : stats?.currentConditions?.avgTemperature;
            if (val !== undefined && val !== null) return { ...m, value: val };
          }
          if (m.id === 'humidity') {
            const val = liveHumidity !== undefined && liveHumidity !== null ? liveHumidity : stats?.currentConditions?.avgHumidity;
            if (val !== undefined && val !== null) return { ...m, value: val };
          }
          if (m.id === 'wind-speed') {
            const val = liveWindSpeed !== undefined && liveWindSpeed !== null ? liveWindSpeed : stats?.currentConditions?.avgWindSpeed;
            if (val !== undefined && val !== null) return { ...m, value: val };
          }
          return m;
        });

        setDashboardData({
          farm: farmsNow.find((f: any) => (f.id || f._id) === selectedFarmId) || primaryDevice?.farm || (overview?.farmName ? { name: overview.farmName } : null),
          health: {
            overallHealth: aiRes.data?.raw?.farm_status?.farm_health_percentage || overview?.performance?.healthScore || stats?.overallStatus || 85,
            metrics: mappedMetrics,
          },
          sensors: {
            activeSensorsCount: sensorLatestData?.values ? Object.keys(sensorLatestData.values).filter(k => sensorLatestData.values[k] !== undefined && sensorLatestData.values[k] !== null).length : (stats?.overview?.activeSensors || (Array.isArray(devices) ? devices.filter((d: any) => d.status === 'active').length : 0) || overview?.sensors || 0),
            totalSensorsCount: stats?.overview?.totalSensors || (Array.isArray(devices) ? devices.length : 0) || overview?.sensors || 0,
            latestData: sensorLatestData,
            deviceId: primaryDevice?.id || primaryDevice?._id || sensorLatestData?.deviceId || sensorLatestData?.sensorId || sensorLatestData?.id || sensorLatestData?._id,
            sensorId: actualSensorId || sensorLatestData?.sensorId || sensorLatestData?.id || sensorLatestData?._id,
          },
          alerts: { 
            cards: aiRes.data?.cards || alertsData,
            activeCount: aiRes.data?.cards?.length || overview?.activeAlerts || alertsData.length || 0,
            suggestion: aiRes.data?.raw?.prescription ? {
              title: `Prescription (${aiRes.data.raw.prescription.priority || 'Normal'})`,
              body: aiRes.data.raw.prescription.actions?.join(' ') || 'No critical prescription actions.',
              confidence: aiRes.data.raw.aqi?.confidence ? `${Math.round(aiRes.data.raw.aqi.confidence * 100)}%` : '95%',
            } : undefined
          },
          waterSavings: null,
          aiInsights: aiRes.data?.raw ? [
            ...(aiRes.data.raw.irrigation ? [{
              title: 'Irrigation',
              description: aiRes.data.raw.irrigation.advisory,
              level: aiRes.data.raw.irrigation.decision === 'no_irrigation' ? 'good' : 'warn'
            }] : []),
            ...(aiRes.data.raw.fungal_disease ? [{
              title: 'Fungal',
              description: aiRes.data.raw.fungal_disease.recommendation,
              level: aiRes.data.raw.fungal_disease.activity_level?.toLowerCase() === 'low' ? 'good' : 'warn'
            }] : []),
            ...(aiRes.data.raw.pest ? [{
              title: 'Pest',
              description: aiRes.data.raw.pest.recommendation,
              level: aiRes.data.raw.pest.pest_risk_level?.toLowerCase() === 'low' ? 'good' : 'warn'
            }] : []),
            ...(aiRes.data.raw.aqi ? [{
              title: 'AQI',
              description: aiRes.data.raw.aqi.plant_impact,
              level: (aiRes.data.raw.aqi.aqi_category?.toLowerCase() === 'low stress' || aiRes.data.raw.aqi.aqi_category?.toLowerCase() === 'optimal') ? 'good' : 'warn'
            }] : [])
          ] : aiData,
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
          } : {
            name: overview?.farmName || stats?.farmName || 'Sunrise Farm',
            serialNumber: 'N/A',
            deviceType: 'nest',
            subtitle: 'IoT Field Intelligence Tower',
            image: '/NEST.png',
            soilType: overview?.soilType || stats?.soilType || 'Sandy Loam',
            area: overview?.area || stats?.area || '4.6 acres',
            location: overview?.location || stats?.location || 'Hassan',
            irrigationType: overview?.irrigation || stats?.irrigation || 'Sprinkler',
            boundary: overview?.boundary || stats?.boundary || 'Polygon',
            crops: overview?.crops || stats?.crops || ['Corn', 'Cabbage']
          },
        });
        
        setError(null);
      } catch (err: any) {
        console.error('Dashboard Data Fetch Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFarmData();
    // Heavy effect deps now exclude `farms` and `backendDevices` — they're read
    // via refs so a state update in either does NOT retrigger this whole fetch.
  }, [selectedFarmId, selectedDeviceType, currentDeviceIndex, refreshTick]);

  // Poll every 10 minutes — separate effect so the polling timer is only torn
  // down when the farm actually changes, not on every dashboard re-render.
  useEffect(() => {
    if (!selectedFarmId) return;
    const intervalId = setInterval(() => setRefreshTick((t) => t + 1), 10 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [selectedFarmId]);

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

  useEffect(() => {
    fetchBackendDevices();
  }, [selectedDeviceType]);

  const deviceList = useMemo(() => {
    const mockList = DEVICE_LIBRARY[selectedDeviceType] || [];
    
    if (backendDevices.length > 0) {
      const mappedBackend = backendDevices.map((d, idx) => ({
        id: d.id || d._id || `backend-${idx}`,
        deviceType: selectedDeviceType,
        name: d.name || d.deviceId || `Device ${idx + 1}`,
        subtitle: 'IoT Field Intelligence Tower',
        image: selectedDeviceType === 'seed' ? '/seed.png' : '/NEST.png',
        area: d.field?.area ? `${d.field.area} acres` : '4.6 acres',
        location: d.farm?.name || 'Sunrise Farm',
        boundary: 'Polygon',
        soilType: d.field?.soilType || 'Loamy',
        irrigationType: d.field?.irrigationType || 'Sprinkler',
        crops: d.crops?.map((c: any) => c.name) || ['Corn', 'Cabbage'],
        raw: d
      }));

      const combined = [...mappedBackend];
      mockList.forEach((mockItem, index) => {
        if (combined.length < 3) {
          combined.push({
            ...mockItem,
            id: `mock-${mockItem.id || index}`,
            name: `${mockItem.name} (Demo)`
          });
        }
      });

      return combined;
    }
    return mockList;
  }, [backendDevices, selectedDeviceType]);

  const currentDevice = deviceList[currentDeviceIndex % (deviceList.length || 1)] || {
    name: 'Sunrise Farm',
    deviceType: 'nest',
    subtitle: 'IoT Field Intelligence Tower',
    image: '/NEST.png',
    soilType: 'Sandy Loam',
    area: '4.6 acres',
    location: 'Hassan',
    irrigationType: 'Sprinkler',
    boundary: 'Polygon',
    crops: ['Corn', 'Cabbage']
  };

  const cycleDevice = (direction: 1 | -1) => {
    // Refresh the backend device list (fire-and-forget — no await, so the
    // index update isn't blocked). The heavy effect re-runs on
    // currentDeviceIndex change for the dashboard data refresh.
    fetchBackendDevices();
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
