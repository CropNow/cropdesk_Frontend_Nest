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
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

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
import { useProfile } from '../profile/context/useProfile';
import {
  connectDevice,
  getHistoricalData,
  downloadSensorData,
  VALID_SERIAL_NUMBER,
} from '../profile/device.service';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const IOTDashboard = ({
  showEmptyState = false,
}: {
  showEmptyState?: boolean;
}) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<SensorCategory | null>(null);

  // Alert State
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'info' | 'warning' | 'error';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
  });

  const { selectedField } = useProfile();

  const closeAlert = () =>
    setAlertConfig((prev) => ({ ...prev, isOpen: false }));

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

    const lastActive = localStorage.getItem('iot_last_active_at');
    if (lastActive) {
      // Check if it's a timestamp string or ISO string
      // New logic stores ISO string usually from API, but let's be safe.
      // Actually 'lastActiveAt' is likely ISO.
      const dateObj = new Date(lastActive);
      if (!isNaN(dateObj.getTime())) {
        setLastUpdated(dateObj.toLocaleString());
      } else {
        setLastUpdated(lastActive); // Fallback
      }
    } else {
      // Fallback for migration: use old refresh time if new one not present
      const lastRefresh = localStorage.getItem('last_iot_refresh');
      if (lastRefresh) {
        setLastUpdated(new Date(parseInt(lastRefresh)).toLocaleString());
      }
    }
  }, []);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Manual Refresh Logic
  const handleRefresh = async () => {
    const lastRefresh = localStorage.getItem('last_iot_refresh');
    const now = Date.now();
    const cooldown = 30 * 1000; // Reduced to 30 seconds for easier recovery

    if (lastRefresh && now - parseInt(lastRefresh) < cooldown) {
      const remaining = Math.ceil(
        (cooldown - (now - parseInt(lastRefresh))) / 60000
      );
      setAlertConfig({
        isOpen: true,
        title: 'Refresh Cooldown',
        message: `Please wait ${remaining} minutes before refreshing again. API limits apply.`,
        type: 'info',
      });
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

            // Handle Last Active Time
            const lastActive = response.device.lastActiveAt;
            if (lastActive) {
              localStorage.setItem('iot_last_active_at', lastActive);
              // Convert UTC timestamp to local readable string
              const dateObj = new Date(lastActive);
              setLastUpdated(dateObj.toLocaleString()); // Use device time
            } else {
              // Fallback if no device time (shouldn't happen with new logic)
              const nowStr = Date.now().toString();
              setLastUpdated(new Date(parseInt(nowStr)).toLocaleString());
            }

            const nowStr = Date.now().toString();

            localStorage.setItem('last_iot_refresh', nowStr);

            window.dispatchEvent(new Event('iot-data-updated'));

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

            // Show success alert
            setAlertConfig({
              isOpen: true,
              title: 'Data Refreshed',
              message: 'Sensor data refreshed successfully from the device.',
              type: 'info',
            });
          }
        }
      }
    } catch (e) {
      console.error('Refresh failed', e);
      setAlertConfig({
        isOpen: true,
        title: 'Refresh Failed',
        message:
          'Failed to refresh sensor data. Please check connection and try again.',
        type: 'error',
      });
    }
  };

  useEffect(() => {
    // Auto-Fetch if we have devices but no data (Persistence Restoration)
    const checkAndFetch = async () => {
      let storedDevices = localStorage.getItem('connected_devices');
      const storedData = localStorage.getItem('iot_device_data');

      // 1. If no devices in localStorage, try to sync from backend via Profile Context
      if (!storedDevices && selectedField?.id) {
        console.log(
          'IOTDashboard: No devices in storage, syncing from backend for field:',
          selectedField.id
        );
        const { getDevicesForField } =
          await import('@/features/user/profile/device.service');
        const fetchedDevices = await getDevicesForField(selectedField.id);
        const devicesArray = Array.isArray(fetchedDevices)
          ? fetchedDevices
          : fetchedDevices?.data || [];

        if (devicesArray.length > 0) {
          const mapped = devicesArray.map((d: any) => ({
            ...d,
            serialNumber: d.serialNumber || d.code || d.id,
            status: d.status || (d.isOnline ? 'Active' : 'Offline'),
            connectedAt: d.createdAt || new Date().toISOString(),
          }));
          localStorage.setItem('connected_devices', JSON.stringify(mapped));
          storedDevices = JSON.stringify(mapped);
        }
      }

      if (storedDevices && JSON.parse(storedDevices).length > 0) {
        if (!storedData || JSON.parse(storedData).length === 0) {
          console.log(
            'IOTDashboard: Devices found but no data. Auto-fetching...'
          );

          try {
            const devices = JSON.parse(storedDevices);
            const serial =
              devices[0].apiKey ||
              devices[0].serialNumber ||
              VALID_SERIAL_NUMBER;

            // We'll reuse fetchFreshData logic here
            setIsRefreshing(true);
            await fetchFreshData();
            setIsRefreshing(false);
          } catch (e) {
            console.error('Auto-fetch failed', e);
            setIsRefreshing(false);
          }
        }
      }
    };

    // Run after a short delay to allow storage and profile context to settle
    const timer = setTimeout(checkAndFetch, 1500);
    return () => clearTimeout(timer);
  }, [selectedField]);

  const hasData = !showEmptyState && sensorCategories.length > 0;

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
                  Last Synced: {new Date(lastUpdated).toLocaleString()}
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
                className={`lg:hidden ${
                  isOnline ? 'text-green-500' : 'text-red-500'
                }`}
              />
              <Signal
                size={24}
                className={`hidden lg:block ${
                  isOnline ? 'text-green-500' : 'text-red-500'
                }`}
              />
              <div className="flex items-center gap-1">
                <Battery
                  size={18}
                  className={`lg:hidden ${
                    battery.charging ? 'text-green-500' : ''
                  }`}
                />
                <Battery
                  size={24}
                  className={`hidden lg:block ${
                    battery.charging ? 'text-green-500' : ''
                  }`}
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

      {/* Alert Dialog Component */}
      <AlertDialog open={alertConfig.isOpen} onOpenChange={closeAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertConfig.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertConfig.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={closeAlert}>Okay</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

                  {/* Wind Direction Chart */}
                  {isRowActive &&
                    selectedSensor &&
                    (selectedSensor.includes('Wind Direction') ||
                      selectedSensor.includes('Compass')) && (
                      <div className="mt-3 animate-in slide-in-from-top-4 fade-in duration-500 cursor-default">
                        <WindDirectionChart
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
                          sensorId={
                            localStorage.getItem('connected_devices')
                              ? JSON.parse(
                                  localStorage.getItem('connected_devices') ||
                                    '[]'
                                )[0]?.sensorId
                              : null
                          }
                          onClose={() => setSelectedSensor(null)}
                        />
                      </div>
                    )}

                  {/* Standard Expanded Graph Row (Exclude Wind Direction) */}
                  {isRowActive &&
                    selectedSensor &&
                    !selectedSensor.includes('Wind Direction') &&
                    !selectedSensor.includes('Compass') && (
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
                          sensorId={
                            localStorage.getItem('connected_devices')
                              ? JSON.parse(
                                  localStorage.getItem('connected_devices') ||
                                    '[]'
                                )[0]?.sensorId
                              : null
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
  tabs = ['24 Hours', '7 Days', '1 Month'],
  onExport,
  isExporting,
  children,
}: {
  title: string;
  subTitle?: string;
  valueDisplay: React.ReactNode;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs?: string[];
  onExport?: ((format: 'csv' | 'json') => void | Promise<any>) | undefined;
  isExporting?: boolean | undefined;
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
          {onExport && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport('csv')}
                disabled={isExporting}
                className="text-[10px] font-bold h-8"
              >
                {isExporting ? (
                  <RefreshCw className="animate-spin" size={12} />
                ) : (
                  'CSV'
                )}
              </Button>
            </div>
          )}
          <button
            onClick={onClose}
            className="p-1.5 bg-red-500/10 rounded-full text-red-500 hover:bg-red-500/20 transition-all"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-10">
        {tabs.map((tab) => (
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

const WindDirectionChart = ({
  sensorName,
  value,
  unit,
  readings,
  sensorId,
  onClose,
}: {
  sensorName: string;
  value: string;
  unit: string;
  readings: { value: number; timestamp: string }[];
  sensorId?: string | null;
  onClose: () => void;
}) => {
  const [activeTab, setActiveTab] = useState('24 Hours');
  const [chartData, setChartData] = useState<
    { value: number; timestamp: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const tabs = ['24 Hours', '7 Days', '1 Month'];

  // Fetch data effect
  useEffect(() => {
    const fetchData = async () => {
      if (!sensorId) {
        // Fallback to local readings
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        let startTime = now - oneDay;
        if (activeTab === '7 Days') startTime = now - 7 * oneDay;
        else if (activeTab === '1 Month') startTime = now - 30 * oneDay;

        const filtered = readings.filter(
          (r) => new Date(r.timestamp).getTime() >= startTime
        );
        setChartData(filtered);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getHistoricalData(
          sensorId,
          'Wind Direction',
          activeTab
        );
        if (data && data.length > 0) {
          setChartData(data);
        } else {
          // Fallback
          setChartData([]);
        }
      } catch (err) {
        console.error('Failed to fetch historical wind data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [sensorId, activeTab, readings]);

  // Process data into frequency bins for Radar
  // Directions: N, NE, E, SE, S, SW, W, NW (0, 45, 90, 135, 180, 225, 270, 315)
  // We'll use 8 bins.
  // Each bin covers +/- 22.5 degrees.
  const bins = [0, 0, 0, 0, 0, 0, 0, 0];
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

  chartData.forEach((r) => {
    // Normalize degree 0-360
    let deg = r.value % 360;
    if (deg < 0) deg += 360;

    // Shift so N (0) is at index 0 (which corresponds to -22.5 to 22.5)
    // Formula: round(deg / 45) % 8
    const binIdx = Math.round(deg / 45) % 8;
    if (bins[binIdx] !== undefined) {
      bins[binIdx]++;
    }
  });

  const maxCount = Math.max(...bins) || 1;
  const normalizedBins = bins.map((c) => c / maxCount);

  // Parse current value for display
  let currentVal = parseFloat(value);
  if (isNaN(currentVal)) currentVal = 0;
  const currentDirIdx = Math.round(currentVal / 45) % 8;
  const currentDir = directions[currentDirIdx] || 'N';

  // Generate Polygon Path
  const generatePath = (data: number[]) => {
    if (data.every((v) => v === 0)) return 'M 100,100 Z';

    const points = data
      .map((val, i) => {
        // SVGs have 0 degrees at 3 o'clock (Right). We want 0 at Top (N).
        // So subtract 90 degrees.
        const angle = (i * 45 - 90) * (Math.PI / 180);
        const r = val * 80;
        const x = 100 + r * Math.cos(angle);
        const y = 100 + r * Math.sin(angle);
        return `${x},${y}`;
      })
      .join(' ');
    return `M ${points} Z`;
  };

  return (
    <ChartCard
      title="Wind Direction"
      subTitle="Direction Distribution"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onExport={
        sensorId
          ? (format: 'csv' | 'json') => {
              downloadSensorData(
                sensorId,
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                new Date().toISOString(),
                format
              );
            }
          : undefined
      }
      tabs={tabs}
      valueDisplay={
        <div className="flex flex-col items-end">
          <span className="text-3xl sm:text-5xl font-bold text-purple-500">
            {currentDir}
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <span className="font-mono">{value}°</span>
            <Wind
              size={12}
              className="text-purple-500"
              style={{ transform: `rotate(${value}deg)` }}
            />
          </div>
        </div>
      }
      onClose={onClose}
    >
      <div className="flex justify-center items-center h-56 sm:h-72 w-full mt-4">
        <svg viewBox="0 0 200 200" className="w-full h-full max-w-[280px]">
          {/* Grid Polygons */}
          {[0.25, 0.5, 0.75, 1].map((scale, idx) => (
            <polygon
              key={scale}
              points={Array.from({ length: 8 }, (_, i) => {
                const angle = (i * 45 - 90) * (Math.PI / 180);
                const r = 80 * scale;
                return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`;
              }).join(' ')}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.1 + idx * 0.1}
              className="text-border dark:text-gray-700"
              strokeWidth="1"
            />
          ))}

          {/* Axes */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i * 45 - 90) * (Math.PI / 180);
            return (
              <line
                key={i}
                x1="100"
                y1="100"
                x2={100 + 85 * Math.cos(angle)}
                y2={100 + 85 * Math.sin(angle)}
                stroke="currentColor"
                strokeOpacity="0.2"
                className="text-border dark:text-gray-700"
                strokeWidth="1"
              />
            );
          })}

          {/* Labels */}
          {directions.map((d, i) => {
            const angle = (i * 45 - 90) * (Math.PI / 180);
            const x = 100 + 98 * Math.cos(angle);
            const y = 100 + 98 * Math.sin(angle);
            return (
              <text
                key={d}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[8px] font-bold fill-muted-foreground uppercase"
              >
                {d}
              </text>
            );
          })}

          {/* Data Polygon */}
          <motion.path
            initial={{ d: 'M 100 100 Z' }}
            animate={{ d: generatePath(normalizedBins) }}
            transition={{ duration: 0.8, ease: 'backOut' }}
            fill="rgba(168, 85, 247, 0.3)"
            stroke="#a855f7"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </ChartCard>
  );
};

const SensorTrendChart = ({
  sensorName,
  value,
  unit,
  readings,
  sensorId,
  onClose,
}: {
  sensorName: string;
  value: string;
  unit: string;
  readings: { value: number; timestamp: string }[];
  sensorId?: string | null;
  onClose: () => void;
}) => {
  const [activeTab, setActiveTab] = useState('24 Hours');
  const [chartData, setChartData] = useState<
    { value: number; timestamp: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch data effect
  useEffect(() => {
    const fetchData = async () => {
      if (!sensorId || activeTab === '24 Hours') {
        // Use local readings for real-time/latest
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        let startTime = now - oneDay;
        if (activeTab === '7 Days') startTime = now - 7 * oneDay;
        else if (activeTab === '1 Month') startTime = now - 30 * oneDay;

        const sorted = [...(readings || [])].sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        const filtered = sorted.filter(
          (r) => new Date(r.timestamp).getTime() >= startTime
        );
        setChartData(filtered);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getHistoricalData(sensorId, sensorName, activeTab);
        if (data && data.length > 0) {
          setChartData(data);
        } else {
          setChartData([]);
        }
      } catch (err) {
        console.error('Failed to fetch historical sensor data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [sensorId, activeTab, readings, sensorName]);

  const handleExport = async (format: 'csv' | 'json') => {
    if (!sensorId) return;
    setIsExporting(true);
    try {
      const endDate = new Date().toISOString();
      const startDate = new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000
      ).toISOString(); // Last 30 days
      await downloadSensorData(sensorId, startDate, endDate, format);
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setIsExporting(false);
    }
  };

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
      onExport={
        sensorId ? (format: 'csv' | 'json') => handleExport(format) : undefined
      }
      isExporting={isExporting}
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
