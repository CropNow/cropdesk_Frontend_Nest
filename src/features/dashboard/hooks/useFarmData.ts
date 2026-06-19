import { useEffect, useState } from "react";
import { DeviceType } from "@shared/constants/deviceConstants";
import { FARM_STATUS_METRICS } from "@shared/constants/farmConstants";
import { dashboardAPI } from "@features/dashboard/api/dashboard.api";
import { sensorsAPI } from "@features/sensors/api/sensors.api";
import {
  saveDashboardCache,
  loadDashboardCache,
  saveFarmsCache,
  loadFarmsCache,
  getLastSyncTimestamp,
} from "@shared/utils/dashboardCache";

interface UseFarmDataProps {
  isOnline: boolean;
  selectedDeviceType: DeviceType;
  currentDeviceIndex: number;
}

export function useFarmData({
  isOnline,
  selectedDeviceType,
  currentDeviceIndex,
}: UseFarmDataProps) {
  const [farms, setFarms] = useState<any[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendDevices, setBackendDevices] = useState<any[]>([]);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  const [isCached, setIsCached] = useState(false);

  // 1. Initial Load: Get Farms
  useEffect(() => {
    const initFarms = async () => {
      if (!isOnline || !navigator.onLine) {
        console.log(
          "[Offline Mode Active] Initial load: getting farms from cache",
        );
        const { farms: cachedFarms, selectedFarmId: cachedFarmId } =
          loadFarmsCache();
        if (cachedFarms.length > 0) {
          console.log(
            "[Cache Loaded] Loaded cached farms. Setting selectedFarmId to:",
            cachedFarmId || cachedFarms[0].id || cachedFarms[0]._id,
          );
          setFarms(cachedFarms);
          setSelectedFarmId(
            cachedFarmId || cachedFarms[0].id || cachedFarms[0]._id,
          );
          setIsCached(true);
        } else {
          console.log("[Offline Mode Active] No cached farms found.");
          setIsLoading(false);
        }
        return;
      }

      try {
        setIsLoading(true);
        const res = await dashboardAPI.getFarms();
        const data = res.data?.data;
        const farmsList =
          data?.farms ||
          (Array.isArray(data)
            ? data
            : Array.isArray(res.data)
              ? res.data
              : []);

        setFarms(farmsList);

        if (farmsList.length > 0) {
          const firstFarm = farmsList[0];
          const firstFarmId = firstFarm.id || firstFarm._id;
          setSelectedFarmId(firstFarmId);
          saveFarmsCache(farmsList, firstFarmId);
          console.log("[Cache Saved] Saved farms list to cache.");
        } else {
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error("Farms Fetch Error, attempting cache fallback:", err);
        console.log(
          "[Offline Mode Active] Farms Fetch Error. Using cache fallback...",
        );
        const { farms: cachedFarms, selectedFarmId: cachedFarmId } =
          loadFarmsCache();
        if (cachedFarms.length > 0) {
          console.log(
            "[Cache Loaded] Loaded cached farms. Setting selectedFarmId to:",
            cachedFarmId || cachedFarms[0].id || cachedFarms[0]._id,
          );
          setFarms(cachedFarms);
          setSelectedFarmId(
            cachedFarmId || cachedFarms[0].id || cachedFarms[0]._id,
          );
          setIsCached(true);
          setError(null);
        } else {
          setError(err.message || "Failed to fetch farms");
          setIsLoading(false);
        }
      }
    };
    initFarms();
  }, [isOnline]);

  // 2. Fetch Farm Data: When farmId, selectedDeviceType, or currentDeviceIndex changes, or when isOnline changes
  useEffect(() => {
    if (!selectedFarmId) return;

    const fetchFarmData = async () => {
      setIsLoading(true);

      if (!isOnline || !navigator.onLine) {
        console.log(
          `[Offline Mode Active] Fetching farm data from cache for farm: ${selectedFarmId}, deviceType: ${selectedDeviceType}, index: ${currentDeviceIndex}`,
        );
        const cached = loadDashboardCache(
          selectedFarmId,
          selectedDeviceType,
          currentDeviceIndex,
        );
        if (cached) {
          console.log("[Cache Loaded] Using cached dashboard data.");
          console.log(
            "[Using cached dashboard data] Successfully loaded dashboard state.",
          );
          setDashboardData(cached.dashboardData);
          setBackendDevices(cached.backendDevices);
          const syncTimestamp = getLastSyncTimestamp();
          setLastFetchTime(
            syncTimestamp
              ? new Date(syncTimestamp)
              : new Date(cached.timestamp),
          );
          setIsCached(true);
          setError(null);
        } else {
          console.log(
            "[Offline Mode Active] No cached dashboard data found. Falling back to Empty Dashboard.",
          );
          setDashboardData(null);
          setBackendDevices([]);
          setLastFetchTime(null);
          setIsCached(false);
        }
        setIsLoading(false);
        return;
      }

      try {
        const [devicesRes, sensorsRes] = await Promise.all([
          dashboardAPI
            .getFarmDevices(selectedFarmId)
            .catch(() => ({ data: null })),
          sensorsAPI
            .getSensors({ type: selectedDeviceType.toUpperCase() })
            .catch(() => ({ data: null })),
        ]);

        if (!devicesRes || devicesRes.data === null) {
          throw new Error("Network error: failed to fetch devices");
        }

        let devices: any[] = [];
        const addDevices = (res: any) => {
          if (!res || !res.data) return;
          const data =
            res.data?.data ||
            res.data?.devices ||
            (Array.isArray(res.data) ? res.data : []);
          if (Array.isArray(data)) {
            data.forEach((d: any) => {
              if (
                d &&
                !devices.some(
                  (existing: any) =>
                    (existing.id || existing._id) === (d.id || d._id),
                )
              ) {
                devices.push(d);
              }
            });
          }
        };
        addDevices(devicesRes);
        addDevices(sensorsRes);
        setBackendDevices(devices);

        const hasDevices = devices.length > 0;
        const primaryDevice =
          devices[currentDeviceIndex % (devices.length || 1)] || devices[0];
        const deviceId = primaryDevice?.id || primaryDevice?._id;
        const serialNumber =
          primaryDevice?.serialNumber || primaryDevice?.deviceId;

        const now = new Date();
        const todayDate = [
          now.getFullYear(),
          String(now.getMonth() + 1).padStart(2, "0"),
          String(now.getDate()).padStart(2, "0"),
        ].join("/");

        const [overviewRes, alertsRes, statsRes, latestRes, aiRes] =
          await Promise.all([
            dashboardAPI.getDashboardOverview().catch(() => ({ data: null })),
            dashboardAPI.getAlerts().catch(() => ({ data: null })),
            hasDevices
              ? dashboardAPI
                  .getFarmStatistics(selectedFarmId)
                  .catch(() => ({ data: null }))
              : Promise.resolve({ data: null }),
            serialNumber
              ? sensorsAPI
                  .getNestDeviceData(serialNumber, todayDate)
                  .catch(() => ({ data: null }))
              : Promise.resolve({ data: null }),
            deviceId
              ? dashboardAPI
                  .getAIInsights(selectedFarmId, deviceId)
                  .catch(() => ({ data: null }))
              : hasDevices
                ? dashboardAPI
                    .getAIInsights(selectedFarmId)
                    .catch(() => ({ data: null }))
                : Promise.resolve({ data: null }),
          ]);

        const overview = overviewRes?.data?.overview;
        const stats = statsRes?.data?.data || statsRes?.data;
        const alertsData = alertsRes?.data?.data || alertsRes?.data || [];

        let actualSensorId = null;
        try {
          const allSensorsRes = await sensorsAPI.getSensors();
          const allSensors =
            allSensorsRes.data?.data || allSensorsRes.data || [];
          if (allSensors.length > 0) {
            actualSensorId = allSensors[0]._id || allSensors[0].id;
          }
        } catch (err) {
          console.error("Failed to fetch sensors", err);
        }

        let sensorLatestData = null;
        const nestResponse = latestRes?.data;
        const isDeviceOnline = nestResponse?.status === "online";

        const apiTimestamp =
          nestResponse?.data?.timestamp ||
          nestResponse?.data?.time ||
          nestResponse?.timestamp ||
          stats?.latestData?.timestamp ||
          overview?.lastUpdate;

        if (nestResponse?.success && nestResponse?.data) {
          sensorLatestData = {
            ...nestResponse.data,
            deviceId: serialNumber || deviceId,
            sensorId: actualSensorId,
            isOnline: isDeviceOnline,
            timestamp: apiTimestamp,
          };
        }

        const aiDataRaw =
          aiRes?.data?.data || aiRes?.data?.insights || aiRes?.data;
        const aiData = Array.isArray(aiDataRaw)
          ? aiDataRaw
          : typeof aiDataRaw === "object" && aiDataRaw !== null
            ? []
            : [];

        const isHistorical = nestResponse?.isHistorical === true;
        let hasNoIncomingData = !sensorLatestData;
        if (!sensorLatestData) {
          sensorLatestData = {
            deviceId:
              serialNumber ||
              primaryDevice?.id ||
              primaryDevice?._id ||
              actualSensorId ||
              "none",
            sensorId: actualSensorId || "none",
            isOnline: isDeviceOnline,
            timestamp: apiTimestamp,
            values: {
              pm1_0: 0,
              pm2_5: 0,
              pm10: 0,
              co2: 0,
              voc: 0,
              temperature: 0,
              humidity: 0,
              temperature2: 0,
              humidity2: 0,
              leaf: 0,
              wind_speed: 0,
              wind_dir: 0,
              ch2o: 0,
              co: 0,
              o3: 0,
              no2: 0,
            },
          };
        }

        const mappedMetrics = FARM_STATUS_METRICS.map((m) => {
          const liveSolarRadiation =
            sensorLatestData?.values?.solar_radiation ?? 0;
          const liveTemp =
            sensorLatestData?.values?.temperature ||
            sensorLatestData?.values?.temperature2 ||
            0;
          const liveHumidity =
            sensorLatestData?.values?.humidity ||
            sensorLatestData?.values?.humidity2 ||
            0;
          const liveWindSpeed = sensorLatestData?.values?.wind_speed;
          const liveLeafWetness =
            sensorLatestData?.values?.leaf ??
            aiRes?.data?.raw?.pest?.leaf_wetness_pct ??
            0;
          const liveO3 = sensorLatestData?.values?.o3 ?? 0;

          if (m.id === "solar-radiation") {
            const val =
              liveSolarRadiation !== undefined && liveSolarRadiation !== null
                ? liveSolarRadiation
                : 0;
            if (val !== undefined && val !== null) return { ...m, value: val };
          }
          if (m.id === "temperature") {
            const val =
              liveTemp !== undefined && liveTemp !== null
                ? liveTemp
                : stats?.currentConditions?.avgTemperature;
            if (val !== undefined && val !== null) return { ...m, value: val };
          }
          if (m.id === "humidity") {
            const val =
              liveHumidity !== undefined && liveHumidity !== null
                ? liveHumidity
                : stats?.currentConditions?.avgHumidity;
            if (val !== undefined && val !== null) return { ...m, value: val };
          }
          if (m.id === "wind-speed") {
            const val =
              liveWindSpeed !== undefined && liveWindSpeed !== null
                ? liveWindSpeed
                : stats?.currentConditions?.avgWindSpeed;
            if (val !== undefined && val !== null) return { ...m, value: val };
          }
          if (m.id === "o3") {
            const val = liveO3 !== undefined && liveO3 !== null ? liveO3 : 0;
            if (val !== undefined && val !== null) return { ...m, value: val };
          }
          if (m.id === "leaf-wetness") {
            const val =
              liveLeafWetness !== undefined && liveLeafWetness !== null
                ? liveLeafWetness
                : 0;
            if (val !== undefined && val !== null) return { ...m, value: val };
          }
          return m;
        });

        const finalDashboardData = {
          onboarding: overviewRes?.data?.onboarding || {
            isComplete: overviewRes?.data?.isComplete ?? true,
            hasSensor:
              overviewRes?.data?.hasSensor ??
              (devices.length > 0 || backendDevices.length > 0),
          },
          farm:
            farms.find((f) => (f.id || f._id) === selectedFarmId) ||
            primaryDevice?.farm ||
            (overview?.farmName ? { name: overview.farmName } : null),
          health: {
            overallHealth: hasNoIncomingData
              ? 0
              : aiRes?.data?.raw?.farm_status?.farm_health_percentage ||
                overview?.performance?.healthScore ||
                stats?.overallStatus ||
                85,
            condition: hasNoIncomingData
              ? "UNKNOWN"
              : aiRes?.data?.raw?.farm_status?.farm_condition || "NORMAL",
            stressBreakdown: hasNoIncomingData
              ? null
              : aiRes?.data?.raw?.farm_status?.stress_breakdown,
            metrics: mappedMetrics,
          },
          sensors: {
            activeSensorsCount: hasNoIncomingData
              ? 0
              : sensorLatestData?.values
                ? Object.values(sensorLatestData.values).filter(
                    (v: any) => v !== undefined && v !== null && v !== 0,
                  ).length
                : 0,
            totalSensorsCount: 22,
            latestData: hasNoIncomingData ? null : sensorLatestData,
            deviceId:
              serialNumber ||
              primaryDevice?.id ||
              primaryDevice?._id ||
              sensorLatestData?.deviceId,
            sensorId:
              actualSensorId ||
              sensorLatestData?.sensorId ||
              sensorLatestData?.id ||
              sensorLatestData?._id,
            serialNumber: serialNumber || null,
            isOnline: isDeviceOnline,
            isHistorical: isHistorical,
            timestamp: apiTimestamp,
          },
          alerts: {
            cards: hasNoIncomingData
              ? []
              : aiRes?.data?.raw
                ? [
                    ...(aiRes.data.raw.pest
                      ? [
                          {
                            title: "Pest Analysis",
                            value: Math.round(
                              aiRes.data.raw.pest.pest_risk_score || 0,
                            ),
                            status:
                              aiRes.data.raw.pest.pest_risk_level?.toUpperCase() ===
                              "LOW"
                                ? "Optimal"
                                : aiRes.data.raw.pest.pest_risk_level?.toUpperCase() ===
                                    "MODERATE"
                                  ? "Warning"
                                  : "Critical",
                            body:
                              aiRes.data.raw.pest.recommendation ||
                              `Pest risk is ${aiRes.data.raw.pest.pest_risk_level}. Leaf wetness: ${aiRes.data.raw.pest.leaf_wetness_pct}%.`,
                            icon: "Bug",
                          },
                        ]
                      : []),
                    ...(aiRes.data.raw.fungal_disease
                      ? [
                          {
                            title: "Fungal Activity",
                            value: Math.round(
                              aiRes.data.raw.fungal_disease.risk_score || 0,
                            ),
                            status:
                              aiRes.data.raw.fungal_disease.activity_level?.toUpperCase() ===
                              "LOW"
                                ? "Optimal"
                                : aiRes.data.raw.fungal_disease.activity_level?.toUpperCase() ===
                                    "MODERATE"
                                  ? "Warning"
                                  : "Critical",
                            body:
                              aiRes.data.raw.fungal_disease.recommendation ||
                              aiRes.data.raw.fungal_disease.likely_disease ||
                              "Monitor closely",
                            icon: "ShieldCheck",
                          },
                        ]
                      : []),
                    ...(aiRes.data.raw.irrigation
                      ? [
                          {
                            title: "Irrigation Analysis",
                            value: aiRes.data.raw.irrigation.confidence
                              ? Math.round(
                                  aiRes.data.raw.irrigation.confidence * 100,
                                )
                              : aiRes.data.raw.irrigation.decision ===
                                  "no_irrigation"
                                ? 100
                                : Math.max(
                                    0,
                                    100 -
                                      Math.round(
                                        (aiRes.data.raw.irrigation
                                          .water_requirement_mm || 0) * 2,
                                      ),
                                  ),
                            status:
                              aiRes.data.raw.irrigation.decision ===
                              "no_irrigation"
                                ? "Optimal"
                                : "Warning",
                            body:
                              aiRes.data.raw.irrigation.advisory ||
                              (aiRes.data.raw.irrigation.decision ===
                              "no_irrigation"
                                ? "Soil moisture is optimal. No irrigation needed."
                                : `Irrigation recommended: ${aiRes.data.raw.irrigation.water_requirement_mm}mm required.`),
                            icon: "Droplets",
                          },
                        ]
                      : []),
                  ]
                : aiRes?.data?.cards
                  ? aiRes.data.cards.map((c: any) => ({
                      ...c,
                      status:
                        c.status?.toUpperCase() === "LOW" ||
                        c.status?.toLowerCase() === "low stress" ||
                        c.status?.toLowerCase() === "optimal"
                          ? "Optimal"
                          : c.status?.toUpperCase() === "MODERATE" ||
                              c.status?.toLowerCase() === "moderate"
                            ? "Warning"
                            : "Critical",
                    }))
                  : alertsData,
            activeCount: hasNoIncomingData
              ? 0
              : aiRes?.data?.raw
                ? (aiRes.data.raw.pest ? 1 : 0) +
                  (aiRes.data.raw.fungal_disease ? 1 : 0) +
                  (aiRes.data.raw.irrigation ? 1 : 0)
                : aiRes?.data?.cards?.length ||
                  overview?.activeAlerts ||
                  alertsData.length ||
                  0,
            suggestion: hasNoIncomingData
              ? {
                  title: "No Data",
                  body: "No alerts for this device.",
                  confidence: "0%",
                }
              : aiRes?.data?.raw?.prescription
                ? {
                    title: `Prescription (${aiRes.data.raw.prescription.priority || "Normal"})`,
                    body:
                      aiRes.data.raw.prescription.actions?.join(" ") ||
                      "No critical prescription actions.",
                    confidence: aiRes.data.raw.irrigation?.confidence
                      ? `${Math.round(aiRes.data.raw.irrigation.confidence * 100)}%`
                      : "95%",
                  }
                : undefined,
          },
          waterSavings:
            overview?.waterSavings ||
            (() => {
              const irrigation = aiRes?.data?.raw?.irrigation;
              if (!irrigation || hasNoIncomingData)
                return { percent: "0.0%", total: "0 L", daily: "0 L" };
              const req = irrigation.water_requirement_mm || 0;
              const areaAcres =
                parseFloat(primaryDevice?.field?.area || "1") || 1;
              const litres = Math.round(req * 4.047 * areaAcres);
              const dailyLitres = Math.round(litres / 1);
              const saved =
                irrigation.decision === "no_irrigation"
                  ? 100
                  : Math.max(0, 100 - Math.round((req / 50) * 100));
              return {
                percent: `${saved}%`,
                total: `${litres} L`,
                daily: `${dailyLitres} L`,
              };
            })(),
          aiInsights: hasNoIncomingData
            ? [
                {
                  title: "Irrigation",
                  description: "Nil prediction - no sensor data.",
                  level: "warn",
                },
                {
                  title: "Fungal",
                  description: "Nil prediction - no sensor data.",
                  level: "warn",
                },
                {
                  title: "Pest",
                  description: "Nil prediction - no sensor data.",
                  level: "warn",
                },
                {
                  title: "Air Quality",
                  description: "Nil prediction - no sensor data.",
                  level: "warn",
                },
              ]
            : aiRes?.data?.raw
              ? [
                  ...(aiRes.data.raw.irrigation
                    ? [
                        {
                          title: "Irrigation",
                          description:
                            aiRes.data.raw.irrigation.advisory ||
                            (aiRes.data.raw.irrigation.decision ===
                            "no_irrigation"
                              ? "No irrigation needed."
                              : `Requires ${aiRes.data.raw.irrigation.water_requirement_mm}mm of water.`),
                          level:
                            aiRes.data.raw.irrigation.decision ===
                            "no_irrigation"
                              ? "good"
                              : "warn",
                        },
                      ]
                    : []),
                  ...(aiRes.data.raw.fungal_disease
                    ? [
                        {
                          title: "Fungal",
                          description:
                            aiRes.data.raw.fungal_disease.recommendation ||
                            aiRes.data.raw.fungal_disease.likely_disease ||
                            "Monitor closely for fungal pressure.",
                          level:
                            aiRes.data.raw.fungal_disease.activity_level?.toLowerCase() ===
                            "low"
                              ? "good"
                              : "warn",
                        },
                      ]
                    : []),
                  ...(aiRes.data.raw.pest
                    ? [
                        {
                          title: "Pest",
                          description:
                            aiRes.data.raw.pest.recommendation ||
                            `Risk Level: ${aiRes.data.raw.pest.pest_risk_level}. Leaf wetness: ${aiRes.data.raw.pest.leaf_wetness_pct}%.`,
                          level:
                            aiRes.data.raw.pest.pest_risk_level?.toLowerCase() ===
                            "low"
                              ? "good"
                              : "warn",
                        },
                      ]
                    : []),
                  ...(aiRes.data.raw.aqi
                    ? [
                        {
                          title: "Air Quality",
                          description: `AQI: ${Math.round(aiRes.data.raw.aqi.aqi || 0)}${aiRes.data.raw.aqi.dominant_pollutant ? `. Dominant Pollutant: ${aiRes.data.raw.aqi.dominant_pollutant.toUpperCase().replace("_", ".")}` : ""}`,
                          level:
                            aiRes.data.raw.aqi.aqi_category?.toLowerCase() ===
                              "low stress" ||
                            aiRes.data.raw.aqi.aqi_category?.toLowerCase() ===
                              "optimal"
                              ? "good"
                              : "warn",
                          farmer_advisory: aiRes.data.raw.aqi.farmer_advisory,
                          plant_impact: aiRes.data.raw.aqi.plant_impact,
                        },
                      ]
                    : []),
                ]
              : aiRes?.data?.cards && Array.isArray(aiRes.data.cards)
                ? aiRes.data.cards
                    .filter(
                      (c: any) =>
                        !c.title?.toLowerCase().includes("farm status"),
                    )
                    .map((c: any) => ({
                      title: c.title,
                      description: c.body,
                      level:
                        c.status?.toUpperCase() === "LOW" ||
                        c.status?.toLowerCase() === "low stress" ||
                        c.status?.toLowerCase() === "optimal" ||
                        c.status === "Optimal"
                          ? "good"
                          : "warn",
                      farmer_advisory: c.farmer_advisory,
                      plant_impact: c.plant_impact,
                    }))
                : aiData,
          currentDevice: primaryDevice
            ? {
                name: primaryDevice.name,
                serialNumber: primaryDevice.serialNumber,
                deviceType: primaryDevice.type?.toLowerCase() || "nest",
                subtitle: "IoT Field Intelligence Tower",
                image:
                  primaryDevice.type?.toLowerCase() === "seed"
                    ? "/seed.png"
                    : "/NEST.png",
                soilType:
                  primaryDevice.field?.soil?.type ||
                  primaryDevice.field?.soilType
                    ? String(
                        primaryDevice.field?.soil?.type ||
                          primaryDevice.field?.soilType,
                      )
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())
                    : "N/A",
                area: primaryDevice.field?.area
                  ? `${primaryDevice.field.area} acres`
                  : "N/A",
                location: primaryDevice.farm?.name || "N/A",
                irrigationType:
                  primaryDevice.field?.irrigation?.type ||
                  primaryDevice.field?.irrigationType
                    ? String(
                        primaryDevice.field?.irrigation?.type ||
                          primaryDevice.field?.irrigationType,
                      )
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())
                    : "N/A",
                boundary: "Polygon",
                crops: primaryDevice.crops?.map((c: any) => c.name) || [],
              }
            : null,
        };

        setDashboardData(finalDashboardData);
        saveDashboardCache(
          selectedFarmId,
          selectedDeviceType,
          currentDeviceIndex,
          finalDashboardData,
          devices,
        );
        console.log(
          `[Cache Saved] Saved dashboard data to cache for farm: ${selectedFarmId}, deviceType: ${selectedDeviceType}, index: ${currentDeviceIndex}`,
        );
        setLastFetchTime(new Date());
        setIsCached(false);
        setError(null);
      } catch (err: any) {
        console.error(
          "Dashboard Data Fetch Error, attempting cache fallback:",
          err,
        );
        console.log(
          "[Offline Mode Active] Dashboard Data Fetch Error. Using cache fallback...",
        );
        const cached = loadDashboardCache(
          selectedFarmId,
          selectedDeviceType,
          currentDeviceIndex,
        );
        if (cached) {
          console.log("[Cache Loaded] Using cached dashboard data.");
          console.log(
            "[Using cached dashboard data] Successfully loaded dashboard state.",
          );
          setDashboardData(cached.dashboardData);
          setBackendDevices(cached.backendDevices);
          const syncTimestamp = getLastSyncTimestamp();
          setLastFetchTime(
            syncTimestamp
              ? new Date(syncTimestamp)
              : new Date(cached.timestamp),
          );
          setIsCached(true);
          setError(null);
        } else {
          setError(err.message || "Failed to fetch dashboard data");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFarmData();

    let intervalId: any = null;
    if (isOnline && navigator.onLine) {
      intervalId = setInterval(fetchFarmData, 30 * 60 * 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [selectedFarmId, selectedDeviceType, currentDeviceIndex, isOnline]);

  return {
    farms,
    selectedFarmId,
    setSelectedFarmId,
    dashboardData,
    isLoading,
    error,
    backendDevices,
    lastFetchTime,
    isCached,
  };
}
