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
    hourlyData: number[];
  }>;
}

import { useNavigate } from 'react-router-dom';

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

  if (showEmptyState) {
    return (
      <section className="flex flex-col gap-4 border border-border p-3 lg:p-4 rounded-2xl bg-gradient-to-br from-green-500/10 via-background to-background dark:bg-card relative overflow-hidden h-full min-h-[220px] items-center justify-center text-center">
        {/* Blurred Content Placeholder */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <button
            onClick={() => navigate('/register/farmer-details')}
            className="group flex flex-col items-center gap-4 transition-transform hover:scale-105 active:scale-95"
          >
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:shadow-green-500/40 transition-shadow">
              <Plus className="w-5 h-5 lg:w-8 lg:h-8 text-white" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-lg font-bold text-foreground">
                Add Farm Details
              </span>
              <span className="text-xs text-muted-foreground">
                Setup your IoT Dashboard
              </span>
            </div>
          </button>
        </div>
        <div className="opacity-20 blur-sm pointer-events-none w-full h-full flex items-center justify-center">
          <Activity size={64} className="text-muted-foreground" />
        </div>
      </section>
    );
  }

  const categories: SensorCategory[] = [
    {
      id: 'soil',
      name: 'Soil Sensors',
      count: 4,
      icon: (
        <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
          <Sprout size={20} />
        </div>
      ),
      color: 'green',
      previewSensors: [
        { name: 'Soil Moisture 1', value: '45%', icon: <Droplets size={12} /> },
        { name: 'Soil Temp 1', value: '24°C', icon: <Thermometer size={12} /> },
        { name: 'Soil Moisture 2', value: '42%', icon: <Droplets size={12} /> },
      ],
      details: [
        {
          name: 'Soil Moisture 1',
          value: '45',
          unit: '%',
          icon: <Droplets size={20} />,
          color: 'blue',
          status: 'Good',
          hourlyData: [
            45, 46, 47, 48, 50, 52, 50, 48, 46, 45, 44, 43, 42, 42, 43, 44, 45,
            46, 47, 48, 49, 48, 46, 45,
          ],
        },
        {
          name: 'Soil Moisture 2',
          value: '42',
          unit: '%',
          icon: <Droplets size={20} />,
          color: 'blue',
          status: 'Good',
          hourlyData: [
            40, 41, 42, 43, 45, 46, 45, 43, 42, 41, 40, 40, 41, 42, 43, 44, 45,
            44, 43, 42, 42, 41, 41, 42,
          ],
        },
        {
          name: 'Soil Temperature 1',
          value: '24',
          unit: '°C',
          icon: <Thermometer size={20} />,
          color: 'orange',
          status: 'Good',
          hourlyData: [
            22, 22, 23, 23, 24, 25, 26, 27, 28, 28, 27, 26, 25, 24, 23, 23, 22,
            22, 21, 21, 22, 23, 24, 24,
          ],
        },
        {
          name: 'Soil Temperature 2',
          value: '23',
          unit: '°C',
          icon: <Thermometer size={20} />,
          color: 'orange',
          status: 'Good',
          hourlyData: [
            21, 21, 22, 22, 23, 24, 25, 26, 27, 27, 26, 25, 24, 23, 22, 22, 21,
            21, 20, 20, 21, 22, 23, 23,
          ],
        },
      ],
    },
    {
      id: 'air',
      name: 'Air Quality Sensors',
      count: 6,
      icon: (
        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
          <Wind size={20} />
        </div>
      ),
      color: 'blue',
      previewSensors: [
        { name: 'PM 2.5', value: '35μg/m³', icon: <Activity size={12} /> },
        { name: 'CO2', value: '420ppm', icon: <CloudRain size={12} /> },
        { name: 'O2', value: '20.9%', icon: <Wind size={12} /> },
      ],
      details: [
        {
          name: 'PM 2.5',
          value: '35',
          unit: 'μg/m³',
          icon: <Activity size={20} />,
          color: 'blue',
          status: 'Good',
          hourlyData: [
            30, 32, 35, 38, 40, 42, 45, 48, 50, 48, 45, 42, 40, 38, 35, 33, 31,
            30, 32, 34, 36, 38, 40, 42,
          ],
        },
        {
          name: 'PM 10',
          value: '52',
          unit: 'μg/m³',
          icon: <Wind size={20} />,
          color: 'cyan',
          status: 'Warning',
          hourlyData: [
            45, 48, 52, 55, 58, 60, 65, 68, 70, 68, 65, 62, 60, 58, 55, 53, 51,
            50, 48, 46, 48, 50, 52, 54,
          ],
        },
        {
          name: 'O2',
          value: '20.9',
          unit: '%',
          icon: <Wind size={20} />,
          color: 'green',
          status: 'Good',
          hourlyData: [
            20.9, 20.8, 20.9, 21.0, 20.9, 20.9, 20.8, 20.9, 21.0, 20.9, 20.9,
            20.8, 20.9, 21.0, 20.9, 20.9, 20.8, 20.9, 21.0, 20.9, 20.9, 20.8,
            20.9, 21.0,
          ],
        },
        {
          name: 'SO2',
          value: '0.01',
          unit: 'ppm',
          icon: <Activity size={20} />,
          color: 'yellow',
          status: 'Good',
          hourlyData: [
            0.01, 0.01, 0.02, 0.01, 0.01, 0.01, 0.02, 0.02, 0.01, 0.01, 0.01,
            0.01, 0.02, 0.02, 0.01, 0.01, 0.01, 0.01, 0.02, 0.02, 0.01, 0.01,
            0.01, 0.01,
          ].map((v) => v * 100),
        },
        {
          name: 'NO2',
          value: '0.03',
          unit: 'ppm',
          icon: <CloudRain size={20} />,
          color: 'orange',
          status: 'Good',
          hourlyData: [
            0.02, 0.02, 0.03, 0.03, 0.04, 0.04, 0.03, 0.03, 0.02, 0.02, 0.03,
            0.03, 0.04, 0.04, 0.03, 0.03, 0.02, 0.02, 0.03, 0.03, 0.04, 0.04,
            0.03, 0.03,
          ].map((v) => v * 100),
        },
        {
          name: 'CO2',
          value: '420',
          unit: 'ppm',
          icon: <CloudRain size={20} />,
          color: 'gray',
          status: 'Good',
          hourlyData: [
            400, 405, 410, 415, 420, 425, 430, 435, 440, 435, 430, 425, 420,
            415, 410, 405, 400, 395, 400, 405, 410, 415, 420, 425,
          ].map((v) => v / 8),
        },
      ],
    },
    {
      id: 'weather',
      name: 'Weather Sensors',
      count: 6,
      icon: (
        <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-500">
          <Cloud size={20} />
        </div>
      ),
      color: 'cyan',
      previewSensors: [
        { name: 'Air Temp', value: '28°C', icon: <Thermometer size={12} /> },
        { name: 'Humidity', value: '68%', icon: <Droplets size={12} /> },
        { name: 'Wind', value: '3.3m/s', icon: <Wind size={12} /> },
      ],
      details: [
        {
          name: 'Air Temperature',
          value: '28',
          unit: '°C',
          icon: <Thermometer size={20} />,
          color: 'orange',
          status: 'Good',
          hourlyData: [
            24, 23, 22, 22, 23, 25, 27, 28, 30, 31, 32, 33, 33, 32, 31, 30, 28,
            27, 26, 25, 24, 24, 23, 23,
          ].map((v) => v * 2),
        },
        {
          name: 'Relative Humidity',
          value: '68',
          unit: '%',
          icon: <Droplets size={20} />,
          color: 'cyan',
          status: 'Good',
          hourlyData: [
            75, 78, 80, 82, 80, 75, 70, 68, 65, 62, 60, 58, 55, 53, 55, 58, 60,
            63, 65, 68, 70, 72, 74, 75,
          ],
        },
        {
          name: 'Atmosphere Pressure',
          value: '1013',
          unit: 'hPa',
          icon: <Activity size={20} />,
          color: 'blue',
          status: 'Good',
          hourlyData: [
            1010, 1011, 1012, 1013, 1014, 1013, 1012, 1011, 1010, 1011, 1012,
            1013, 1014, 1015, 1014, 1013, 1012, 1011, 1010, 1011, 1012, 1013,
            1014, 1013,
          ].map((v) => v / 15),
        },
        {
          name: 'Leaf Wetness',
          value: '15',
          unit: '%',
          icon: <Leaf size={20} />,
          color: 'green',
          status: 'Good',
          hourlyData: [
            0, 0, 5, 10, 20, 30, 40, 30, 20, 10, 5, 0, 0, 0, 0, 5, 10, 15, 20,
            25, 20, 15, 10, 5,
          ],
        },
        {
          name: 'Wind Speed',
          value: '3.3',
          unit: 'm/s',
          icon: <Wind size={20} />,
          color: 'blue',
          status: 'Good',
          hourlyData: [
            2, 2.5, 3, 3.2, 3.5, 3.3, 3.1, 2.8, 2.5, 2.2, 2, 2.5, 3, 3.5, 4,
            3.8, 3.5, 3.2, 3, 2.8, 2.5, 2.2, 2, 2.5,
          ],
        },
        {
          name: 'Wind Direction',
          value: 'NE',
          unit: '',
          icon: <Compass size={20} />,
          color: 'purple',
          status: 'Good',
          hourlyData: [
            45, 45, 50, 45, 40, 45, 50, 45, 45, 45, 50, 45, 40, 45, 50, 45, 45,
            45, 50, 45, 40, 45, 50, 45,
          ],
        },
      ],
    },
    {
      id: 'light',
      name: 'Light Sensors',
      count: 2,
      icon: (
        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
          <Sun size={20} />
        </div>
      ),
      color: 'yellow',
      previewSensors: [
        { name: 'UV Index', value: '4', icon: <Sun size={12} /> },
        { name: 'Solar Radiation', value: '680W/m²', icon: <Sun size={12} /> },
      ],
      details: [
        {
          name: 'UV Index',
          value: '4',
          unit: 'Index',
          icon: <Sun size={20} />,
          color: 'orange',
          status: 'Good',
          hourlyData: [
            0, 0, 0, 0, 1, 2, 4, 6, 8, 9, 8, 7, 6, 4, 2, 1, 0, 0, 0, 0, 0, 0, 0,
            0,
          ].map((v) => v * 10),
        },
        {
          name: 'Solar Radiation',
          value: '680',
          unit: 'W/m²',
          icon: <Sun size={20} />,
          color: 'yellow',
          status: 'Good',
          hourlyData: [
            0, 0, 0, 0, 50, 150, 300, 450, 600, 680, 750, 800, 850, 800, 700,
            550, 400, 250, 100, 20, 0, 0, 0, 0,
          ].map((v) => v / 12),
        },
      ],
    },
  ];

  return (
    <section className="flex flex-col gap-4 p-0 lg:p-4 rounded-2xl">
      <div className="bg-gradient-to-br from-background to-green-500/5 dark:bg-card rounded-2xl p-3 lg:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-border">
        <div className="flex justify-between items-start mb-3 lg:mb-8">
          <div className="flex gap-2 lg:gap-4">
            <div className="p-2 lg:p-4 bg-green-500/10 rounded-xl lg:rounded-2xl text-green-500 border border-green-500/20">
              <Wifi size={20} className="lg:hidden" />
              <Wifi size={32} className="hidden lg:block" />
            </div>
            <div>
              <h4 className="text-xs lg:text-lg font-medium text-foreground leading-none mb-1">
                {farmInfo.name}
              </h4>
              <p className="text-[10px] lg:text-xs text-muted-foreground uppercase tracking-wider">
                {farmInfo.location}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-3">
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
                value: '18',
                subValue: (
                  <div className="flex items-center gap-1 text-xs text-purple-400 mt-2 uppercase font-bold tracking-tighter">
                    <Activity size={12} /> Active
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
              {categories.map((cat) => (
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
      if (width >= 640)
        setCols(3); // sm
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
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3">
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
                      {selectedSensor === 'Wind Direction' ? (
                        <WindRadarChart
                          onClose={() => setSelectedSensor(null)}
                        />
                      ) : (
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
                          data={
                            category.details.find(
                              (s) => s.name === selectedSensor
                            )?.hourlyData || []
                          }
                          onClose={() => setSelectedSensor(null)}
                        />
                      )}
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

const WindRadarChart = ({ onClose }: { onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState('24 Hours');

  // Octagonal points calculation
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const radius = 100;
  const center = 120;

  const getPoint = (angle: number, r: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return `${center + r * Math.cos(rad)},${center + r * Math.sin(rad)}`;
  };

  // Sample data for the polygon based on active tab
  const getPointsData = () => {
    switch (activeTab) {
      case '7 Days':
        return [60, 40, 30, 50, 80, 70, 50, 55];
      case '1 Month':
        return [70, 50, 40, 60, 85, 80, 60, 65];
      case '24 Hours':
      default:
        return [50, 25, 25, 45, 95, 75, 45, 60];
    }
  };

  const pointsData = getPointsData();
  const polygonPath = directions
    .map((_, i) => getPoint(i * 45, pointsData[i] || 0))
    .join(' ');

  return (
    <ChartCard
      title="Wind Direction"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      valueDisplay={
        <span className="text-4xl sm:text-6xl font-bold text-red-500">NE</span>
      }
      onClose={onClose}
    >
      <div className="flex justify-center items-center py-4">
        <svg width="240" height="240" viewBox="0 0 240 240">
          {/* Grid lines (Concentric octagons) */}
          {[20, 40, 60, 80, 100].map((r) => (
            <polygon
              key={r}
              points={directions.map((_, i) => getPoint(i * 45, r)).join(' ')}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-border dark:text-white/10"
            />
          ))}

          {/* Axes lines */}
          {directions.map((_, i) => (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos((i * 45 - 90) * (Math.PI / 180))}
              y2={center + radius * Math.sin((i * 45 - 90) * (Math.PI / 180))}
              stroke="currentColor"
              strokeWidth="1"
              className="text-border dark:text-white/10"
            />
          ))}

          {/* Polygon data */}
          <polygon
            points={polygonPath}
            fill="rgba(239, 68, 68, 0.6)"
            stroke="rgb(239, 68, 68)"
            strokeWidth="2"
          />

          {/* Labels */}
          {directions.map((label, i) => {
            const pt = getPoint(i * 45, radius + 15).split(',');
            return (
              <text
                key={label}
                x={pt[0]}
                y={pt[1]}
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                alignmentBaseline="middle"
                className="fill-muted-foreground dark:fill-gray-500"
              >
                {label}
              </text>
            );
          })}
        </svg>
      </div>
    </ChartCard>
  );
};

const SensorTrendChart = ({
  sensorName,
  value,
  unit,
  data,
  onClose,
}: {
  sensorName: string;
  value: string;
  unit: string;
  data: number[];
  onClose: () => void;
}) => {
  const [activeTab, setActiveTab] = useState('24 Hours');

  // Generate data based on active tab
  const getChartData = () => {
    switch (activeTab) {
      case '7 Days':
        // Generate daily averages for 7 days
        return Array.from(
          { length: 7 },
          () => Math.floor(Math.random() * 40) + 10
        );
      case '1 Month':
        // Generate daily averages for 1 month
        return Array.from(
          { length: 30 },
          () => Math.floor(Math.random() * 40) + 10
        );
      case '24 Hours':
      default:
        // Use the hourly data passed as props
        return data;
    }
  };

  const currentData = getChartData();

  // Generate X-axis labels
  const getAxisLabels = () => {
    switch (activeTab) {
      case '7 Days':
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      case '1 Month':
        // Return 5 intervals for the month (e.g., Week 1, Week 2, ...)
        return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      case '24 Hours':
      default:
        return [
          '01:00',
          '03:00',
          '05:00',
          '07:00',
          '09:00',
          '11:00',
          '13:00',
          '15:00',
          '17:00',
          '19:00',
          '21:00',
          '23:00',
        ];
    }
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

            {currentData.map((height, i) => {
              // Normalize data for chart height (assuming max value ~100 for simplicity)
              // If data values are significantly different, this would need a scaling function.
              // For consistent visualization, we'll cap at 100%.
              const barHeight = Math.min(height, 100);

              return (
                <div
                  key={i}
                  className="flex-1 bg-red-500 hover:bg-red-600 transition-all cursor-pointer relative group rounded-t-[1px]"
                  style={{ height: `${barHeight}%` }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1.5 rounded border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold shadow-xl">
                    {height}
                    {unit}
                  </div>
                </div>
              );
            })}
          </div>

          {/* X-axis labels */}
          <div className="h-6 sm:h-8 flex justify-between items-center text-[9px] sm:text-[11px] font-bold text-muted-foreground dark:text-gray-600 pt-2 sm:pt-3 border-t border-border dark:border-white/10 overflow-hidden">
            {axisLabels.map((label, i) => (
              <span
                key={i}
                className={`flex-1 text-center ${activeTab === '24 Hours' && i % 2 !== 0 ? 'hidden xs:inline' : ''}`}
              >
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
