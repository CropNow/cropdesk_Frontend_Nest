import { useEffect, useMemo, useState } from 'react';
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

  // ─── API Data Fetching ───
  const [farms, setFarms] = useState<any[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendDevices, setBackendDevices] = useState<any[]>([]);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);


  // Consolidated Fetcher logic inside useEffect below

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
        setLastFetchTime(new Date());
        
        // Fetch devices and latest readings in parallel where possible
        // 1. Fetch devices first to establish if we have any sensors
        const [devicesRes, sensorsRes] = await Promise.all([
          dashboardAPI.getFarmDevices(selectedFarmId).catch(() => ({ data: null })),
          sensorsAPI.getSensors({ type: selectedDeviceType.toUpperCase() }).catch(() => ({ data: null })),
        ]);

        let devices: any[] = [];
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
        addDevices(sensorsRes);
        setBackendDevices(devices); // Sync state for deviceList memo

        // 2. Decide which APIs to call based on device presence
        const hasDevices = devices.length > 0;
        const primaryDevice = devices[currentDeviceIndex % (devices.length || 1)] || devices[0];
        const deviceId = primaryDevice?.id || primaryDevice?._id;
        const serialNumber = primaryDevice?.serialNumber || primaryDevice?.deviceId;

        // Format today's date as YYYY/MM/DD for nest-device API
        const now = new Date();
        const todayDate = [
          now.getFullYear(),
          String(now.getMonth() + 1).padStart(2, '0'),
          String(now.getDate()).padStart(2, '0')
        ].join('/');

        const [overviewRes, alertsRes, statsRes, latestRes, aiRes] = await Promise.all([
          dashboardAPI.getDashboardOverview().catch(() => ({ data: null })),
          dashboardAPI.getAlerts().catch(() => ({ data: null })),
          hasDevices 
            ? dashboardAPI.getFarmStatistics(selectedFarmId).catch(() => ({ data: null }))
            : Promise.resolve({ data: null }),
          serialNumber
            ? sensorsAPI.getNestDeviceData(serialNumber, todayDate).catch(() => ({ data: null }))
            : Promise.resolve({ data: null }),
          deviceId
            ? dashboardAPI.getAIInsights(selectedFarmId, deviceId).catch(() => ({ data: null }))
            : (hasDevices 
                ? dashboardAPI.getAIInsights(selectedFarmId).catch(() => ({ data: null }))
                : Promise.resolve({ data: null })
              )
        ]);

        const overview = overviewRes?.data?.overview;
        const stats = statsRes?.data?.data || statsRes?.data;
        const alertsData = alertsRes?.data?.data || alertsRes?.data || [];

        // Fetch sensor ID for aggregates
        let actualSensorId = null;
        try {
          const allSensorsRes = await sensorsAPI.getSensors();
          const allSensors = allSensorsRes.data?.data || allSensorsRes.data || [];
          if (allSensors.length > 0) {
            actualSensorId = allSensors[0]._id || allSensors[0].id;
          }
        } catch (err) {
          console.error('Failed to fetch sensors', err);
        }

        // Parse nest-device/data response
        // Response: { success, status: 'online'|'offline', data: { deviceId, time, timestamp, values: {...} } }
        let sensorLatestData = null;
        const nestResponse = latestRes?.data;
        const isDeviceOnline = nestResponse?.status === 'online';
        
        // Robust timestamp extraction
        const apiTimestamp = nestResponse?.data?.timestamp || nestResponse?.data?.time || nestResponse?.timestamp || stats?.latestData?.timestamp || overview?.lastUpdate;

        if (nestResponse?.success && nestResponse?.data) {
          sensorLatestData = {
            ...nestResponse.data,
            deviceId: serialNumber || deviceId,
            sensorId: actualSensorId,
            isOnline: isDeviceOnline,
            timestamp: apiTimestamp // Ensure it's explicitly set here
          };
        }
        
        const aiDataRaw = aiRes?.data?.data || aiRes?.data?.insights || aiRes?.data;
        const aiData = Array.isArray(aiDataRaw) ? aiDataRaw : (typeof aiDataRaw === 'object' && aiDataRaw !== null ? [] : []);

        const isHistorical = nestResponse?.isHistorical === true;
        let hasNoIncomingData = !sensorLatestData;
        if (!sensorLatestData) {
          sensorLatestData = {
            deviceId: serialNumber || primaryDevice?.id || primaryDevice?._id || actualSensorId || 'none',
            sensorId: actualSensorId || 'none',
            isOnline: isDeviceOnline, // Use the status from the top level response
            timestamp: apiTimestamp, // Use extracted timestamp
            values: {
              pm1_0: 0, pm2_5: 0, pm10: 0, co2: 0, voc: 0,
              temperature: 0, humidity: 0, temperature2: 0, humidity2: 0,
              leaf: 0, wind_speed: 0, wind_dir: 0, ch2o: 0, co: 0, o3: 0, no2: 0
            }
          };
        }

        // Map metrics from statistics or fallback
        // nest-device values: temperature, humidity, wind_speed, wind_dir, pm2_5, pm10, co2, o3, no2, leaf
        const mappedMetrics = FARM_STATUS_METRICS.map(m => {
          const liveMoisture = sensorLatestData?.values?.soil_moisture_1 || sensorLatestData?.values?.soil_moisture || sensorLatestData?.values?.leaf || 0;
          const liveTemp = sensorLatestData?.values?.temperature || sensorLatestData?.values?.temperature2 || 0;
          const liveHumidity = sensorLatestData?.values?.humidity || sensorLatestData?.values?.humidity2 || 0;
          const liveWindSpeed = sensorLatestData?.values?.wind_speed || 0;
          const liveLeafWetness = sensorLatestData?.values?.leaf ?? aiRes.data?.raw?.pest?.leaf_wetness_pct ?? 0;
          const liveVisibility = stats?.currentConditions?.avgVisibility ?? overview?.weather?.visibility ?? overview?.weather?.visibilityKm ?? 0;

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
          if (m.id === 'visibility') {
            const val = liveVisibility !== undefined && liveVisibility !== null ? liveVisibility : 0;
            if (val !== undefined && val !== null) return { ...m, value: val };
          }
          if (m.id === 'leaf-wetness') {
            const val = liveLeafWetness !== undefined && liveLeafWetness !== null ? liveLeafWetness : 0;
            if (val !== undefined && val !== null) return { ...m, value: val };
          }
          return m;
        });

        setDashboardData({
          onboarding: overviewRes.data?.onboarding || {
            isComplete: overviewRes.data?.isComplete ?? true,
            hasSensor: overviewRes.data?.hasSensor ?? (devices.length > 0 || backendDevices.length > 0)
          },
          farm: farms.find(f => (f.id || f._id) === selectedFarmId) || primaryDevice?.farm || (overview?.farmName ? { name: overview.farmName } : null),
          health: {
            overallHealth: hasNoIncomingData ? 0 : (aiRes.data?.raw?.farm_status?.farm_health_percentage || overview?.performance?.healthScore || stats?.overallStatus || 85),
            condition: hasNoIncomingData ? 'UNKNOWN' : (aiRes.data?.raw?.farm_status?.farm_condition || 'NORMAL'),
            stressBreakdown: hasNoIncomingData ? null : aiRes.data?.raw?.farm_status?.stress_breakdown,
            metrics: mappedMetrics,
          },
          sensors: {
            activeSensorsCount: hasNoIncomingData ? 0 : (sensorLatestData?.values ? Object.values(sensorLatestData.values).filter((v: any) => v !== undefined && v !== null && v !== 0).length : 0),
            totalSensorsCount: stats?.overview?.totalSensors || (Array.isArray(devices) ? devices.length : 0) || overview?.sensors || 0,
            latestData: hasNoIncomingData ? null : sensorLatestData,
            deviceId: serialNumber || primaryDevice?.id || primaryDevice?._id || sensorLatestData?.deviceId,
            sensorId: actualSensorId || sensorLatestData?.sensorId || sensorLatestData?.id || sensorLatestData?._id,
            serialNumber: serialNumber || null,
            isOnline: isDeviceOnline,
            isHistorical: isHistorical,
            timestamp: apiTimestamp,
          },
          alerts: { 
            cards: hasNoIncomingData ? [] : (aiRes.data?.raw ? [
              ...(aiRes.data.raw.pest ? [{
                title: 'Pest Analysis',
                value: Math.round(aiRes.data.raw.pest.pest_risk_score || 0),
                status: aiRes.data.raw.pest.pest_risk_level?.toUpperCase() === 'LOW' ? 'Optimal' : aiRes.data.raw.pest.pest_risk_level?.toUpperCase() === 'MODERATE' ? 'Warning' : 'Critical',
                body: aiRes.data.raw.pest.recommendation || `Pest risk is ${aiRes.data.raw.pest.pest_risk_level}. Leaf wetness: ${aiRes.data.raw.pest.leaf_wetness_pct}%.`,
                icon: 'Bug'
              }] : []),
              ...(aiRes.data.raw.fungal_disease ? [{
                title: 'Fungal Activity',
                value: Math.round(aiRes.data.raw.fungal_disease.risk_score || 0),
                status: aiRes.data.raw.fungal_disease.activity_level?.toUpperCase() === 'LOW' ? 'Optimal' : aiRes.data.raw.fungal_disease.activity_level?.toUpperCase() === 'MODERATE' ? 'Warning' : 'Critical',
                body: aiRes.data.raw.fungal_disease.recommendation || aiRes.data.raw.fungal_disease.likely_disease || 'Monitor closely',
                icon: 'ShieldCheck'
              }] : []),
              ...(aiRes.data.raw.irrigation ? [{
                title: 'Irrigation Analysis',
                value: aiRes.data.raw.irrigation.decision === 'no_irrigation' ? 100 : Math.max(0, 100 - Math.round((aiRes.data.raw.irrigation.water_requirement_mm || 0) * 2)),
                status: aiRes.data.raw.irrigation.decision === 'no_irrigation' ? 'Optimal' : 'Warning',
                body: aiRes.data.raw.irrigation.advisory || (aiRes.data.raw.irrigation.decision === 'no_irrigation' ? 'Soil moisture is optimal. No irrigation needed.' : `Irrigation recommended: ${aiRes.data.raw.irrigation.water_requirement_mm}mm required.`),
                icon: 'Droplets'
              }] : [])
            ] : (aiRes.data?.cards ? aiRes.data.cards.map((c: any) => ({
              ...c,
              status: (c.status?.toUpperCase() === 'LOW' || c.status?.toLowerCase() === 'low stress' || c.status?.toLowerCase() === 'optimal') ? 'Optimal' : (c.status?.toUpperCase() === 'MODERATE' || c.status?.toLowerCase() === 'moderate') ? 'Warning' : 'Critical'
            })) : alertsData)),
            activeCount: hasNoIncomingData ? 0 : (aiRes.data?.raw ? (
              (aiRes.data.raw.pest ? 1 : 0) + (aiRes.data.raw.fungal_disease ? 1 : 0) + (aiRes.data.raw.irrigation ? 1 : 0)
            ) : (aiRes.data?.cards?.length || overview?.activeAlerts || alertsData.length || 0)),
            suggestion: hasNoIncomingData ? {
              title: 'No Data',
              body: 'No alerts for this device.',
              confidence: '0%',
            } : (aiRes.data?.raw?.prescription ? {
              title: `Prescription (${aiRes.data.raw.prescription.priority || 'Normal'})`,
              body: aiRes.data.raw.prescription.actions?.join(' ') || 'No critical prescription actions.',
              confidence: aiRes.data.raw.irrigation?.confidence ? `${Math.round(aiRes.data.raw.irrigation.confidence * 100)}%` : '95%',
            } : undefined)
          },
          waterSavings: (() => {
            const irrigation = aiRes.data?.raw?.irrigation;
            if (!irrigation || hasNoIncomingData) return { percent: '0.0%', total: '0 L', daily: '0 L' };
            const req = irrigation.water_requirement_mm || 0;
            // Convert mm to approx litres (assume 1 acre = ~4047 m², 1mm = 4047 L/acre)
            const areaAcres = parseFloat(primaryDevice?.field?.area || '1') || 1;
            const litres = Math.round(req * 4.047 * areaAcres);
            const dailyLitres = Math.round(litres / 1);
            const saved = irrigation.decision === 'no_irrigation' ? 100 : Math.max(0, 100 - Math.round((req / 50) * 100));
            return {
              percent: `${saved}%`,
              total: `${litres} L`,
              daily: `${dailyLitres} L`,
            };
          })(),
          aiInsights: hasNoIncomingData ? [
            { title: 'Irrigation', description: 'Nil prediction - no sensor data.', level: 'warn' },
            { title: 'Fungal', description: 'Nil prediction - no sensor data.', level: 'warn' },
            { title: 'Pest', description: 'Nil prediction - no sensor data.', level: 'warn' },
            { title: 'Air Quality', description: 'Nil prediction - no sensor data.', level: 'warn' }
          ] : (aiRes.data?.raw ? [
            ...(aiRes.data.raw.irrigation ? [{
              title: 'Irrigation',
              description: aiRes.data.raw.irrigation.advisory || (aiRes.data.raw.irrigation.decision === 'no_irrigation' ? 'No irrigation needed.' : `Requires ${aiRes.data.raw.irrigation.water_requirement_mm}mm of water.`),
              level: aiRes.data.raw.irrigation.decision === 'no_irrigation' ? 'good' : 'warn'
            }] : []),
            ...(aiRes.data.raw.fungal_disease ? [{
              title: 'Fungal',
              description: aiRes.data.raw.fungal_disease.recommendation || aiRes.data.raw.fungal_disease.likely_disease || 'Monitor closely for fungal pressure.',
              level: aiRes.data.raw.fungal_disease.activity_level?.toLowerCase() === 'low' ? 'good' : 'warn'
            }] : []),
            ...(aiRes.data.raw.pest ? [{
              title: 'Pest',
              description: aiRes.data.raw.pest.recommendation || `Risk Level: ${aiRes.data.raw.pest.pest_risk_level}. Leaf wetness: ${aiRes.data.raw.pest.leaf_wetness_pct}%.`,
              level: aiRes.data.raw.pest.pest_risk_level?.toLowerCase() === 'low' ? 'good' : 'warn'
            }] : []),
            ...(aiRes.data.raw.aqi ? [{
              title: 'Air Quality',
              description: `AQI: ${Math.round(aiRes.data.raw.aqi.aqi || 0)}. ${aiRes.data.raw.aqi.farmer_advisory || aiRes.data.raw.aqi.plant_impact || `Dominant Pollutant: ${aiRes.data.raw.aqi.dominant_pollutant}`}`,
              level: (aiRes.data.raw.aqi.aqi_category?.toLowerCase() === 'low stress' || aiRes.data.raw.aqi.aqi_category?.toLowerCase() === 'optimal') ? 'good' : 'warn'
            }] : [])
          ] : (aiRes.data?.cards && Array.isArray(aiRes.data.cards) ? aiRes.data.cards.filter((c: any) => !c.title?.toLowerCase().includes('farm status')).map((c: any) => ({
            title: c.title,
            description: c.body,
            level: (c.status?.toUpperCase() === 'LOW' || c.status?.toLowerCase() === 'low stress' || c.status?.toLowerCase() === 'optimal' || c.status === 'Optimal') ? 'good' : 'warn'
          })) : aiData)),
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
    
    const intervalId = setInterval(fetchFarmData, 30 * 60 * 1000); // Poll every 30 minutes
    return () => clearInterval(intervalId);
  }, [selectedFarmId, selectedDeviceType, currentDeviceIndex]);

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

  // Devices are now fetched within fetchFarmData to ensure consistent state

  const deviceList = useMemo(() => {
    const mockList = DEVICE_LIBRARY[selectedDeviceType] || [];
    
    if (backendDevices.length > 0) {
      return backendDevices.map((d, idx) => ({
        id: d.id || d._id || `backend-${idx}`,
        deviceType: selectedDeviceType,
        name: d.name || d.deviceId || `Device ${idx + 1}`,
        subtitle: 'IoT Field Intelligence Tower',
        image: selectedDeviceType === 'seed' ? '/seed.png' : '/NEST.png',
        area: d.field?.area ? `${d.field.area} acres` : 'N/A',
        location: d.farm?.name || 'N/A',
        boundary: 'Polygon',
        soilType: d.field?.soilType || 'N/A',
        irrigationType: d.field?.irrigationType || 'N/A',
        crops: d.crops?.map((c: any) => c.name) || [],
        raw: d
      }));
    }
    return [];
  }, [backendDevices, selectedDeviceType]);

  const currentDevice = deviceList[currentDeviceIndex % (deviceList.length || 1)] || null;

  const cycleDevice = async (direction: 1 | -1) => {
    // Trigger API on click (handled by useEffect via currentDeviceIndex change)
    
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
    const farm = farms[0];
    const city = farm?.location?.city || farm?.location?.district || farm?.name || 'N/A';
    const country = farm?.location?.country || 'IN';
    return {
      city: city !== 'N/A' ? `${city}, ${country}` : 'N/A',
      temp: '--',
      condition: 'Unknown',
    };
  }, [farms]);

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
    backendDevices,
    selectedFarmId,
    setSelectedFarmId,
    lastFetchTime,
  };
}
