import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Battery,
  Signal,
  Activity,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Droplets,
  Thermometer,
  Wind,
  Sun,
  X,
  TrendingUp,
  CloudRain,
  Cloud,
  Compass,
  Leaf,
  Sprout,
  RefreshCw,
  Plus,
} from 'lucide-react';

interface SensorCategory {
  id: string;
  name: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  previewSensors: Array<{ name: string; value: string; icon: React.ReactNode }>;
  details: Array<{
    name: string;
    value: string;
    unit: string;
    icon: React.ReactNode;
    color: string;
    status: 'Good' | 'Warning' | 'Critical';
    hourlyData?: number[];
    readings?: { value: number; timestamp: string }[];
  }>;
}

import { useNavigate } from 'react-router-dom';
import { connectDevice } from '../profile/device.service';

const IOTDashboard = ({
  showEmptyState = false,
}: {
  showEmptyState?: boolean;
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<SensorCategory | null>(null);

  const [farmInfo, setFarmInfo] = useState({
    name: 'My Farm',
    location: 'Unknown Location',
  });
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  React.useEffect(() => {
    const userStr = localStorage.getItem('registeredUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.farmDetails) {
          const loc = user.farmDetails.location;
          const locationString = loc.city
            ? `${loc.city}, ${loc.country || ''}`
            : loc.address || 'Unknown Location';
          setFarmInfo({
            name: user.farmDetails.farmName || 'My Farm',
            location: locationString,
          });
        }
      } catch (e) {
        console.error('Error parsing user data for IOT Dashboard', e);
      }
    }
  }, []);

  // Battery Hook
  const [battery, setBattery] = useState({ level: 1, charging: false });
  useEffect(() => {
    // @ts-ignore
    if (navigator.getBattery) {
      // @ts-ignore
      navigator.getBattery().then((bat) => {
        const updateBattery = () => {
          setBattery({ level: bat.level, charging: bat.charging });
        };
        updateBattery();
        bat.addEventListener('levelchange', updateBattery);
        bat.addEventListener('chargingchange', updateBattery);
      });
    }
  }, []);

  // Network Hook
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Icon Hydration Helper
  const resolveIcon = (name: string, size: number = 20) => {
    const iconProps = { size, className: 'text-current' };
    if (name.includes('Rain')) return <CloudRain {...iconProps} />;
    if (name.includes('Wind')) return <Wind {...iconProps} />;
    if (name.includes('Temp')) return <Thermometer {...iconProps} />;
    if (name.includes('Moist') || name.includes('Humidity'))
      return <Droplets {...iconProps} />;
    if (
      name.includes('PM') ||
      name.includes('Pressure') ||
      name.includes('Activity')
    )
      return <Activity {...iconProps} />;
    if (
      name.includes('Sun') ||
      name.includes('UV') ||
      name.includes('Radiation')
    )
      return <Sun {...iconProps} />;
    if (name.includes('Leaf')) return <Leaf {...iconProps} />;
    if (name.includes('Compass') || name.includes('Dir'))
      return <Compass {...iconProps} />;
    if (
      name.includes('CO2') ||
      name.includes('O2') ||
      name.includes('NO2') ||
      name.includes('SO2')
    )
      return <Cloud {...iconProps} />;
    return <Activity {...iconProps} />;
  };

  const resolveCategoryIcon = (id: string, size: number = 20) => {
    if (id === 'weather') return <Cloud size={size} />;
    if (id === 'soil') return <Sprout size={size} />;
    if (id === 'air') return <Wind size={size} />;
    if (id === 'light') return <Sun size={size} />;
    return <Activity size={size} />;
  };

  const [sensorCategories, setSensorCategories] = useState<SensorCategory[]>(
    []
  );

  useEffect(() => {
    const storedData = localStorage.getItem('iot_device_data');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        // Hydrate Icons
        const hydratedData = parsedData.map((cat: any) => ({
          ...cat,
          icon: (
            <div
              className={`p-2 bg-${cat.color}-500/10 rounded-lg text-${cat.color}-500`}
            >
              {resolveCategoryIcon(cat.id)}
            </div>
          ),
          previewSensors: cat.previewSensors.map((s: any) => ({
            ...s,
            icon: resolveIcon(s.name, 12),
          })),
          details: cat.details.map((d: any) => ({
            ...d,
            icon: resolveIcon(d.name, 20),
          })),
        }));
        setSensorCategories(hydratedData);
      } catch (e) {
        console.error('Failed to parse IoT Data', e);
      }
    }

    const lastRefresh = localStorage.getItem('last_iot_refresh');
    if (lastRefresh) {
      setLastUpdated(new Date(parseInt(lastRefresh)).toLocaleString());
    }
  }, []);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Manual Refresh Logic
  const handleRefresh = async () => {
    const lastRefresh = localStorage.getItem('last_iot_refresh');
    const now = Date.now();
    const cooldown = 45 * 60 * 1000; // 45 minutes

    if (lastRefresh && now - parseInt(lastRefresh) < cooldown) {
      const remaining = Math.ceil(
        (cooldown - (now - parseInt(lastRefresh))) / 60000
      );
      alert(`Please wait ${remaining} minutes before refreshing again.`);
      return;
    }

    setIsRefreshing(true);
    await fetchFreshData();
    setIsRefreshing(false);
  };

  const fetchFreshData = async () => {
    try {
      const storedDevices = localStorage.getItem('connected_devices');
      if (storedDevices) {
        const devices = JSON.parse(storedDevices);
        if (devices.length > 0) {
          // Use API Key if available (for external fetch), otherwise serial (fallback)
          const serial = devices[0].apiKey || devices[0].serialNumber;
          // Fetch fresh data
          // @ts-ignore
          const response: any = await connectDevice(serial, devices[0]);
          if (response.success) {
            // Update Local Storage
            localStorage.setItem(
              'iot_device_data',
              JSON.stringify(response.sensorData)
            );
            const nowStr = Date.now().toString();
            localStorage.setItem('last_iot_refresh', nowStr);
            setLastUpdated(new Date(parseInt(nowStr)).toLocaleString());

            // Manually trigger the parsing logic again or just set state directly?
            // We can replicate the parsing logic here or better yet, make the parsing logic a function.
            // For now, let's just duplicate the hydration logic to ensure it updates.

            const storedData = JSON.stringify(response.sensorData);
            const parsedData = JSON.parse(storedData);

            const hydratedData = parsedData.map((cat: any) => ({
              ...cat,
              icon: (
                <div
                  className={`p-2 bg-${cat.color}-500/10 rounded-lg text-${cat.color}-500`}
                >
                  {resolveCategoryIcon(cat.id)}
                </div>
              ),
              previewSensors: cat.previewSensors.map((s: any) => ({
                ...s,
                icon: resolveIcon(s.name, 12),
              })),
              details: cat.details.map((d: any) => ({
                ...d,
                icon: resolveIcon(d.name, 20),
              })),
            }));
            setSensorCategories(hydratedData);
            alert('Sensor data refreshed successfully.');
          }
        }
      }
    } catch (e) {
      console.error('Refresh failed', e);
      alert('Failed to refresh data. Please try again.');
    }
  };

  // Initial Fetch on Mount (ONLY if never fetched or stale? No, user requested manual refresh control)
  // But we should probably load what we have. We already load from localStorage in the first useEffect.
  // So we don't strictly need to auto-fetch on mount if we trust the localStorage cache from the last profile load.
  // HOWEVER, if the user just logged in, we might want fresh data.
  // Let's keep the initial fetch but maybe update the timestamp?
  // User said: "if i open the iot dashbord and click refresh then again... alert"
  // This implies the standard load doesn't count as a "refresh" action that blocks them, OR it does?
  // "if a person refreshedd the page at 11:00 am... from then only it will be considered"
  // This usually implies explicit action. Let's stick to explicit button click for the cooldown constraint.
  // Removing auto-poll.

  useEffect(() => {
    // Optional: We could do one initial check if data is totally missing?
    // For now, relying on the hydration useEffect above.
  }, []);

  // Use the loaded categories if available, otherwise check if we should show empty state
  // If showEmptyState is explicitly passed (e.g. from Dashboard Home which might want to force it), we respect it.
  // BUT: if we are on the dedicated IOT page, we want to show empty state if NO DATA is present.

  // Ensure profile is complete before showing real data
  // const [isProfileComplete, setIsProfileComplete] = React.useState(false);

  // React.useEffect(() => {
  //   const userStr = localStorage.getItem('user');
  //   if (userStr) {
  //     try {
  //       const user = JSON.parse(userStr);
  //       // Simple check: does the user have at least one farmer, farm, field, crop?
  //       // Or checking derived flags if available.
  //       // Based on Profile.tsx logic:
  //       const hasFarmer = user.farmers && user.farmers.length > 0;
  //       const hasFarm = user.farms && user.farms.length > 0;
  //       const hasField = user.fields && user.fields.length > 0;
  //       const hasCrop = user.crops && user.crops.length > 0;

  //       // Checking legacy/flat structure just in case or strict hierarchy
  //       const complete = hasFarmer && hasFarm && hasField && hasCrop;
  //       // setIsProfileComplete(complete);
  //     } catch (e) {
  //       // setIsProfileComplete(false);
  //     }
  //   } else {
  //     // setIsProfileComplete(false);
  //   }
  // }, []);

  const hasData = sensorCategories.length > 0;

  const finalCategories = hasData
    ? sensorCategories
    : [
        {
          id: 'weather',
          name: 'Weather Station',
          count: 0,
          color: 'blue',
          icon: <Cloud size={20} />,
          previewSensors: [
            {
              name: 'Temperature',
              value: '0°C',
              icon: <Thermometer size={12} />,
            },
            { name: 'Humidity', value: '0%', icon: <Droplets size={12} /> },
          ],
          details: [
            {
              name: 'Wind Direction',
              value: '0',
              unit: '°',
              icon: <Compass size={20} />,
              color: 'purple',
              status: 'Good' as const,
            },
            {
              name: 'Wind Speed',
              value: '0',
              unit: 'm/s',
              icon: <Wind size={20} />,
              color: 'blue',
              status: 'Good' as const,
            },
            {
              name: 'Rain Fall',
              value: '0',
              unit: 'mm',
              icon: <CloudRain size={20} />,
              color: 'cyan',
              status: 'Good' as const,
            },
          ],
        },
        {
          id: 'soil',
          name: 'Soil Sensors',
          count: 0,
          color: 'green',
          icon: <Sprout size={20} />,
          previewSensors: [
            { name: 'Moisture', value: '0%', icon: <Droplets size={12} /> },
            { name: 'pH Level', value: '0.0', icon: <Activity size={12} /> },
          ],
          details: [
            {
              name: 'Soil Temperature at Surface',
              value: '0',
              unit: '°C',
              icon: <Thermometer size={20} />,
              color: 'orange',
              status: 'Good' as const,
            },
            {
              name: 'Soil Moisture at Surface',
              value: '0',
              unit: '%',
              icon: <Droplets size={20} />,
              color: 'blue',
              status: 'Good' as const,
            },
            {
              name: 'Soil Temperature at Root',
              value: '0',
              unit: '°C',
              icon: <Thermometer size={20} />,
              color: 'orange',
              status: 'Good' as const,
            },
            {
              name: 'Soil Moisture at Root',
              value: '0',
              unit: '%',
              icon: <Droplets size={20} />,
              color: 'blue',
              status: 'Good' as const,
            },
          ],
        },
        {
          id: 'air',
          name: 'Air Sensors',
          count: 0,
          color: 'blue',
          icon: <Wind size={20} />,
          previewSensors: [
            { name: 'PM 2.5', value: '0µg', icon: <Activity size={12} /> },
            { name: 'CO2', value: '0ppm', icon: <Cloud size={12} /> },
            { name: 'Temp', value: '0°C', icon: <Thermometer size={12} /> },
          ],
          details: [
            {
              name: 'PM 2.5',
              value: '0',
              unit: 'µg/m³',
              icon: <Activity size={20} />,
              color: 'blue',
              status: 'Good' as const,
            },
            {
              name: 'PM 10',
              value: '0',
              unit: 'µg/m³',
              icon: <Activity size={20} />,
              color: 'cyan',
              status: 'Good' as const,
            },
            {
              name: 'CO2',
              value: '0',
              unit: 'ppm',
              icon: <Cloud size={20} />,
              color: 'gray',
              status: 'Good' as const,
            },
            {
              name: 'Air Temperature',
              value: '0',
              unit: '°C',
              icon: <Thermometer size={20} />,
              color: 'orange',
              status: 'Good' as const,
            },
            {
              name: 'Humidity',
              value: '0',
              unit: '%',
              icon: <Droplets size={20} />,
              color: 'cyan',
              status: 'Good' as const,
            },
            {
              name: 'Air Pressure',
              value: '0',
              unit: 'hPa',
              icon: <Activity size={20} />,
              color: 'blue',
              status: 'Good' as const,
            },
            {
              name: 'SOX',
              value: '0',
              unit: 'ppm',
              icon: <Cloud size={20} />,
              color: 'yellow',
              status: 'Good' as const,
            },
            {
              name: 'NOX',
              value: '0',
              unit: 'ppm',
              icon: <Cloud size={20} />,
              color: 'orange',
              status: 'Good' as const,
            },
            {
              name: 'O3',
              value: '0',
              unit: 'ppm',
              icon: <Cloud size={20} />,
              color: 'green',
              status: 'Good' as const,
            },
            {
              name: 'Leaf Wetness',
              value: '0',
              unit: '%',
              icon: <Leaf size={20} />,
              color: 'green',
              status: 'Good' as const,
            },
          ],
        },
        {
          id: 'light',
          name: 'Light Sensors',
          count: 0,
          color: 'yellow',
          icon: <Sun size={20} />,
          previewSensors: [
            { name: 'Light', value: '0 Lux', icon: <Sun size={12} /> },
            { name: 'Radiation', value: '0 W/m²', icon: <Sun size={12} /> },
          ],
          details: [
            {
              name: 'Light',
              value: '0',
              unit: 'Lux',
              icon: <Sun size={20} />,
              color: 'orange',
              status: 'Good' as const,
            },
            {
              name: 'Radiation',
              value: '0',
              unit: 'W/m²',
              icon: <Sun size={20} />,
              color: 'yellow',
              status: 'Good' as const,
            },
          ],
        },
      ];

  return (
    <section className={`flex flex-col gap-4 p-0 lg:p-4 rounded-2xl`}>
      <div className="bg-gradient-to-br from-background to-green-500/5 dark:bg-card rounded-2xl p-3 lg:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-border">
        <div className="flex justify-between items-start mb-3 lg:mb-8">
          <div className="flex gap-2 lg:gap-4">
            <div className="p-2 lg:p-4 bg-green-500/10 rounded-xl lg:rounded-2xl text-green-500 border border-green-500/20">
              <Wifi size={20} className="lg:hidden" />
              <Wifi size={32} className="hidden lg:block" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs lg:text-lg font-medium text-foreground leading-none mb-1">
                  {farmInfo.name}
                </h4>
              </div>
              <p className="text-[10px] lg:text-xs text-muted-foreground uppercase tracking-wider">
                {farmInfo.location}
              </p>
              {lastUpdated && (
                <p className="text-[9px] lg:text-[10px] text-green-500 font-medium">
                  Last updated: {lastUpdated}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`p-2 rounded-full bg-background border border-border hover:bg-muted transition-colors ${
                isRefreshing
                  ? 'animate-spin text-primary'
                  : 'text-muted-foreground'
              }`}
              title="Refresh Sensor Data"
            >
              <RefreshCw size={18} />
            </button>
            <div className="flex items-center gap-2 lg:gap-3 text-muted-foreground">
              <Signal
                size={18}
                className={`lg:hidden ${isOnline ? 'text-green-500' : 'text-red-500'}`}
              />
              <Signal
                size={24}
                className={`hidden lg:block ${isOnline ? 'text-green-500' : 'text-red-500'}`}
              />
              <div className="flex items-center gap-1">
                <Battery
                  size={18}
                  className={`lg:hidden ${battery.charging ? 'text-green-500' : ''}`}
                />
                <Battery
                  size={24}
                  className={`hidden lg:block ${battery.charging ? 'text-green-500' : ''}`}
                />
                <span className="text-sm lg:text-lg font-bold">
                  {Math.round(battery.level * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 lg:gap-6">
          {/* Sensors Count Card */}
          <div className="w-full sm:w-auto shrink-0">
            {[
              {
                icon: <Activity size={32} />,
                label: 'Sensors',
                value: hasData ? '19' : '0',
                subValue: (
                  <div className="flex items-center gap-1 text-xs text-purple-400 mt-2 uppercase font-bold tracking-tighter">
                    <Activity size={12} /> {hasData ? 'Active' : 'No Devices'}
                  </div>
                ),
              },
            ].map((item, idx) => (
              <StatusCard
                key={idx}
                icon={item.icon}
                label={item.label}
                value={item.value}
                subValue={item.subValue}
              />
            ))}
          </div>

          {/* Sensor Categories Card */}
          <div className="flex-1 bg-background border border-border rounded-xl p-3 lg:p-5 shadow-sm hover:shadow-md transition-shadow">
            <h5 className="text-[10px] lg:text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 lg:mb-4 flex items-center gap-2">
              <Activity size={12} className="lg:hidden" />
              <Activity size={16} className="hidden lg:block" />
              Sensor Categories
            </h5>
            <div className="grid grid-cols-2 gap-2 lg:gap-3">
              {finalCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className="flex flex-col items-center justify-center p-2 lg:p-4 rounded-lg lg:rounded-xl bg-card hover:bg-muted/50 border border-border hover:border-primary/20 transition-all text-center group"
                >
                  <div className={`text-${cat.color}-500 mb-1 lg:mb-2`}>
                    {React.isValidElement(cat.icon)
                      ? React.cloneElement(
                          cat.icon as React.ReactElement<any>,
                          { size: 24 }
                        )
                      : cat.icon}
                  </div>
                  <span className="text-[10px] lg:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedCategory && (
        <SensorCategoryModal
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </section>
  );
};

const SensorCategoryModal = ({
  category,
  onClose,
}: {
  category: SensorCategory;
  onClose: () => void;
}) => {
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const [cols, setCols] = useState(1);

  // Determine grid columns based on window width to handle "Row Expansion"
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // if (width >= 1024) setCols(4); // lg -> 4 cols (User Request)
      // else if (width >= 768) setCols(3); // md -> 3 cols
      // else if (width >= 480) setCols(2); // xs -> 2 cols
      // else setCols(1);

      // Actually, let's just make it 4 columns on large screens as requested.
      if (width >= 1024) setCols(4);
      else if (width >= 768)
        setCols(3); // md
      else if (width >= 480)
        setCols(2); // xs (approx)
      else setCols(1);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Chunk sensors into rows
  const rows = [];
  for (let i = 0; i < category.details.length; i += cols) {
    rows.push(category.details.slice(i, i + cols));
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl w-full max-w-[85vw] h-auto max-h-[85vh] overflow-hidden shadow-2xl animate-in zoom-in duration-300 flex flex-col">
        <div className="p-6 border-b border-border flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl bg-${category.color}-500/10 text-${category.color}-500`}
            >
              {category.icon}
            </div>
            <div>
              <h4 className="text-2xl font-bold text-foreground">
                {category.name}
              </h4>
              <p className="text-md text-muted-foreground">
                {category.count} active sensors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-red-500/10 text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col gap-3 mb-6">
            {rows.map((rowSensors, rowIdx) => {
              const isRowActive = rowSensors.some(
                (s) => s.name === selectedSensor
              );

              return (
                <React.Fragment key={rowIdx}>
                  {/* Grid Row */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {rowSensors.map((sensor, idx) => {
                      const isSelected = selectedSensor === sensor.name;
                      return (
                        <div
                          key={idx}
                          onClick={() =>
                            setSelectedSensor(isSelected ? null : sensor.name)
                          }
                          className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-background border transition-all cursor-pointer group shadow-sm w-full ${
                            isSelected
                              ? 'border-primary ring-1 ring-primary/20 bg-primary/5 shadow-md'
                              : 'border-border hover:border-primary/50 hover:shadow-md'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2 lg:mb-3">
                            <div
                              className={`p-2 lg:p-4 rounded-lg lg:rounded-xl bg-${sensor.color}-500/10 text-${sensor.color}-500 border border-${sensor.color}-500/20`}
                            >
                              {React.isValidElement(sensor.icon)
                                ? React.cloneElement(
                                    sensor.icon as React.ReactElement<any>,
                                    { size: 24 }
                                  )
                                : sensor.icon}
                            </div>
                          </div>
                          <p className="text-[10px] lg:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 lg:mb-2 truncate">
                            {sensor.name}
                          </p>
                          <div className="flex items-baseline gap-1 mb-1 lg:mb-2">
                            <span className="text-xl lg:text-3xl font-bold text-foreground">
                              {sensor.value}
                            </span>
                            <span className="text-xs lg:text-sm font-medium text-muted-foreground">
                              {sensor.unit}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-1">
                            <span
                              className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${
                                sensor.status === 'Good'
                                  ? 'bg-green-500'
                                  : sensor.status === 'Warning'
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                              }`}
                            ></span>
                            <span
                              className={`text-[10px] lg:text-xs font-bold uppercase ${
                                sensor.status === 'Good'
                                  ? 'text-green-500'
                                  : sensor.status === 'Warning'
                                    ? 'text-yellow-500'
                                    : 'text-red-500'
                              }`}
                            >
                              {sensor.status}
                            </span>
                            <ChevronDown
                              size={10}
                              className={`ml-auto text-muted-foreground transition-transform duration-300 ${
                                isSelected ? 'rotate-180' : ''
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Expanded Graph Row */}
                  {isRowActive && selectedSensor && (
                    <div className="mt-3 animate-in slide-in-from-top-4 fade-in duration-500 cursor-default">
                      <SensorTrendChart
                        sensorName={selectedSensor}
                        value={
                          category.details.find(
                            (s) => s.name === selectedSensor
                          )?.value || ''
                        }
                        unit={
                          category.details.find(
                            (s) => s.name === selectedSensor
                          )?.unit || ''
                        }
                        readings={
                          category.details.find(
                            (s) => s.name === selectedSensor
                          )?.readings || []
                        }
                        onClose={() => setSelectedSensor(null)}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="p-4 border-t border-border mt-auto bg-green-500/5 rounded-b-3xl">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-green-500 uppercase">
                All sensors are operational
              </span>
            </div>
            <p className="text-[9px] text-muted-foreground ml-3.5">
              Last updated: 12/10/2025, 1:08:07 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChartCard = ({
  title,
  subTitle = '24-Hour Trend',
  valueDisplay,
  onClose,
  activeTab,
  onTabChange,
  children,
}: {
  title: string;
  subTitle?: string;
  valueDisplay: React.ReactNode;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="bg-card dark:bg-[#0a0a0a] border border-border dark:border-white/5 rounded-2xl p-4 sm:p-8 relative overflow-hidden shadow-2xl ring-1 ring-border/50 dark:ring-white/5">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h5 className="text-xl sm:text-2xl font-bold text-foreground dark:text-white tracking-tight">
            {title}
          </h5>
          <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-500 mt-1 font-medium">
            {subTitle}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-0.5">{valueDisplay}</div>
          <button
            onClick={onClose}
            className="p-1.5 bg-red-500/10 rounded-full text-red-500 hover:bg-red-500/20 transition-all"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-10">
        {['24 Hours', '7 Days', '1 Month'].map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all ${
              activeTab === tab
                ? 'bg-primary/10 text-primary ring-1 ring-primary/20 dark:bg-[#15231c] dark:text-[#4ade80] dark:ring-[#4ade80]/20'
                : 'text-muted-foreground hover:text-foreground dark:text-gray-500 dark:hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {children}
    </div>
  );
};

const SensorTrendChart = ({
  sensorName,
  value,
  unit,
  readings,
  onClose,
}: {
  sensorName: string;
  value: string;
  unit: string;
  readings: { value: number; timestamp: string }[];
  onClose: () => void;
}) => {
  const [activeTab, setActiveTab] = useState('24 Hours');

  // Helper to parse and sort readings
  const sortedReadings = [...(readings || [])].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const getFilteredData = () => {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    let startTime = now.getTime();

    if (activeTab === '24 Hours') {
      startTime = now.getTime() - oneDay;
    } else if (activeTab === '7 Days') {
      startTime = now.getTime() - 7 * oneDay;
    } else if (activeTab === '1 Month') {
      startTime = now.getTime() - 30 * oneDay;
    }

    return sortedReadings.filter(
      (r) => new Date(r.timestamp).getTime() >= startTime
    );
  };

  const chartData = getFilteredData();

  // Generate X-axis labels dynamically
  const getAxisLabels = () => {
    if (chartData.length === 0) return ['No Data'];
    // If sparse data (like 1 point), show the exact time
    return chartData.map((d) => {
      const date = new Date(d.timestamp);
      if (activeTab === '24 Hours') {
        return date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
      } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      }
    });
  };

  const axisLabels = getAxisLabels();

  return (
    <ChartCard
      title={sensorName}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      valueDisplay={
        <>
          <span className="text-3xl sm:text-5xl font-bold text-red-500">
            {value.split('.')[0]}
          </span>
          <span className="text-lg sm:text-xl font-medium text-red-500/80 mt-2">
            .{unit}
          </span>
        </>
      }
      onClose={onClose}
    >
      <div className="relative h-48 sm:h-64 w-full mt-4 pr-1 sm:pr-2">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-6 sm:bottom-8 flex flex-col justify-between text-[9px] sm:text-[11px] font-bold text-muted-foreground dark:text-gray-600 pr-2 sm:pr-4 w-8 sm:w-10 text-right">
          <span>80</span>
          <span>60</span>
          <span>40</span>
          <span>20</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="ml-10 sm:ml-12 h-full flex flex-col">
          <div className="flex-1 flex items-end justify-between gap-0.5 sm:gap-1.5 pb-2 relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-full border-t border-dashed border-border dark:border-white/10"
                ></div>
              ))}
            </div>

            {chartData.map((point, i) => {
              // Normalize data for chart height.
              // Since values vary wildly (CO2 vs Temp), we need relative height.
              // Find max value in current set.
              const maxVal = Math.max(...chartData.map((d) => d.value)) || 100;
              // Add buffer
              const ceiling = maxVal * 1.2;

              const barHeight = (point.value / ceiling) * 100;

              return (
                <div
                  key={i}
                  className="flex-1 bg-red-500 hover:bg-red-600 transition-all cursor-pointer relative group rounded-t-[1px] mx-1 sm:mx-2 min-w-[20px]"
                  style={{ height: `${barHeight}%` }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1.5 rounded border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold shadow-xl">
                    {point.value}
                    {unit}
                    <div className="text-[8px] opacity-70 font-normal">
                      {new Date(point.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* X-axis labels */}
          <div className="h-6 sm:h-8 flex justify-around items-center text-[9px] sm:text-[11px] font-bold text-muted-foreground dark:text-gray-600 pt-2 sm:pt-3 border-t border-border dark:border-white/10 overflow-hidden">
            {axisLabels.map((label, i) => (
              <span key={i} className="text-center truncate px-1">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ChartCard>
  );
};

const StatusCard = ({
  icon,
  label,
  value,
  subValue,
}: {
  icon: any;
  label: string;
  value: string;
  subValue: React.ReactNode;
}) => (
  <div className="p-4 rounded-xl bg-gradient-to-br from-background to-secondary/30 border border-border shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-2 text-muted-foreground mb-2">
      {icon}
      <span className="text-[10px] font-medium uppercase tracking-wider">
        {label}
      </span>
    </div>
    <div className="text-2xl font-bold text-foreground leading-tight">
      {value}
    </div>
    {subValue}
  </div>
);

export default IOTDashboard;
