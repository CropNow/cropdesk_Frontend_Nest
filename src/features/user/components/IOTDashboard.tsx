import React, { useState } from 'react';
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

const IOTDashboard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<SensorCategory | null>(null);

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
        { name: 'Soil Moisture', value: '62%', icon: <Droplets size={12} /> },
        { name: 'Soil Temp', value: '24°C', icon: <Thermometer size={12} /> },
        { name: 'pH Level', value: '6.8pH', icon: <Droplets size={12} /> },
      ],
      details: [
        {
          name: 'Soil Moisture',
          value: '62',
          unit: '%',
          icon: <Droplets size={20} />,
          color: 'blue',
          status: 'Good',
          hourlyData: [
            55, 58, 62, 60, 57, 55, 53, 52, 55, 58, 60, 62, 63, 62, 60, 58, 55,
            53, 52, 54, 56, 58, 60, 62,
          ],
        },
        {
          name: 'Soil Temp',
          value: '24',
          unit: '°C',
          icon: <Thermometer size={20} />,
          color: 'orange',
          status: 'Good',
          hourlyData: [
            22, 21, 20, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 29, 28, 27, 26,
            25, 24, 23, 23, 22, 22, 22,
          ],
        },
        {
          name: 'pH Level',
          value: '6.8',
          unit: 'pH',
          icon: <Activity size={20} />,
          color: 'cyan',
          status: 'Good',
          hourlyData: [
            6.7, 6.7, 6.8, 6.8, 6.8, 6.8, 6.8, 6.9, 6.9, 6.8, 6.8, 6.8, 6.7,
            6.7, 6.7, 6.8, 6.8, 6.8, 6.9, 6.9, 6.8, 6.8, 6.7, 6.8,
          ].map((v) => v * 10),
        },
        {
          name: 'EC Level',
          value: '1.2',
          unit: 'mS/cm',
          icon: <Activity size={20} />,
          color: 'yellow',
          status: 'Good',
          hourlyData: [
            1.1, 1.1, 1.2, 1.2, 1.2, 1.2, 1.3, 1.3, 1.4, 1.4, 1.3, 1.3, 1.2,
            1.2, 1.2, 1.1, 1.1, 1.1, 1.2, 1.2, 1.2, 1.2, 1.3, 1.3,
          ].map((v) => v * 40),
        },
      ],
    },
    {
      id: 'air',
      name: 'Air Quality Sensors',
      count: 8,
      icon: (
        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
          <Wind size={20} />
        </div>
      ),
      color: 'blue',
      previewSensors: [
        { name: 'PM2.5', value: '35μg/m³', icon: <Activity size={12} /> },
        { name: 'PM10', value: '52μg/m³', icon: <Wind size={12} /> },
        { name: 'CO2', value: '420ppm', icon: <CloudRain size={12} /> },
      ],
      details: [
        {
          name: 'PM2.5',
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
          name: 'PM10',
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
        {
          name: 'VOC',
          value: '8',
          unit: 'ppb',
          icon: <Activity size={20} />,
          color: 'purple',
          status: 'Good',
          hourlyData: [
            5, 6, 8, 10, 12, 10, 8, 7, 5, 4, 3, 5, 8, 10, 12, 14, 12, 10, 8, 7,
            6, 8, 9, 8,
          ].map((v) => v * 5),
        },
        {
          name: 'Ozone',
          value: '5.2',
          unit: 'ppb',
          icon: <Activity size={20} />,
          color: 'blue',
          status: 'Good',
          hourlyData: [
            4, 4.5, 5, 5.2, 5.5, 6, 6.5, 7, 7.5, 7, 6.5, 6, 5.5, 5.2, 5, 4.8,
            4.5, 4.2, 4, 4.5, 5, 5.2, 5.5, 5.8,
          ].map((v) => v * 10),
        },
        {
          name: 'NO2',
          value: '12',
          unit: 'ppb',
          icon: <Wind size={20} />,
          color: 'red',
          status: 'Good',
          hourlyData: [
            8, 10, 12, 14, 16, 18, 20, 22, 24, 22, 20, 18, 16, 14, 12, 11, 10,
            9, 8, 9, 10, 11, 12, 13,
          ].map((v) => v * 3),
        },
        {
          name: 'Humidity',
          value: '68',
          unit: '%',
          icon: <Droplets size={20} />,
          color: 'blue',
          status: 'Good',
          hourlyData: [
            60, 62, 65, 68, 70, 72, 75, 78, 80, 78, 75, 72, 70, 68, 65, 63, 61,
            60, 62, 64, 66, 68, 70, 72,
          ],
        },
        {
          name: 'Pressure',
          value: '1013',
          unit: 'hPa',
          icon: <Activity size={20} />,
          color: 'green',
          status: 'Good',
          hourlyData: [
            1008, 1009, 1010, 1013, 1015, 1014, 1013, 1012, 1011, 1010, 1011,
            1012, 1013, 1014, 1015, 1014, 1013, 1012, 1011, 1010, 1011, 1012,
            1013, 1014,
          ].map((v) => v / 15),
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
        {
          name: 'Air Pressure',
          value: '1013hPa',
          icon: <Activity size={12} />,
        },
        { name: 'Humidity', value: '68%', icon: <Droplets size={12} /> },
      ],
      details: [
        {
          name: 'Air Temp',
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
          name: 'Air Pressure',
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
          name: 'Humidity',
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
          name: 'Wind Speed',
          value: '12',
          unit: 'km/h',
          icon: <Wind size={20} />,
          color: 'blue',
          status: 'Good',
          hourlyData: [
            10, 12, 15, 12, 10, 8, 9, 12, 14, 15, 12, 10, 8, 9, 10, 12, 15, 18,
            15, 12, 10, 12, 14, 12,
          ].map((v) => v * 4),
        },
        {
          name: 'Wind Dir',
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
        {
          name: 'Rainfall',
          value: '2.5',
          unit: 'mm',
          icon: <CloudRain size={20} />,
          color: 'blue',
          status: 'Good',
          hourlyData: [
            0, 0, 0, 0.5, 1.2, 2.5, 1.0, 0.5, 0.2, 0, 0, 0, 0, 0, 0.5, 1.0, 1.5,
            2.0, 2.5, 1.5, 0.5, 0, 0, 0,
          ].map((v) => v * 30),
        },
      ],
    },
    {
      id: 'light',
      name: 'Light Sensors',
      count: 4,
      icon: (
        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
          <Sun size={20} />
        </div>
      ),
      color: 'yellow',
      previewSensors: [
        { name: 'Sun Light', value: '45klux', icon: <Sun size={12} /> },
        { name: 'UV Sensor', value: '7UV Index', icon: <Sun size={12} /> },
        { name: 'Solar Rad', value: '680W/m²', icon: <Sun size={12} /> },
      ],
      details: [
        {
          name: 'Sun Light',
          value: '45',
          unit: 'klux',
          icon: <Sun size={20} />,
          color: 'yellow',
          status: 'Good',
          hourlyData: [
            0, 0, 0, 0, 5, 15, 30, 45, 60, 75, 85, 90, 95, 90, 80, 70, 55, 40,
            20, 5, 0, 0, 0, 0,
          ].map((v) => v * 0.8),
        },
        {
          name: 'UV Sensor',
          value: '7',
          unit: 'UV Index',
          icon: <Sun size={20} />,
          color: 'orange',
          status: 'Warning',
          hourlyData: [
            0, 0, 0, 0, 0, 1, 2, 4, 6, 7, 8, 9, 10, 9, 8, 7, 5, 3, 1, 0, 0, 0,
            0, 0,
          ].map((v) => v * 8),
        },
        {
          name: 'Solar Rad',
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
        {
          name: 'PAR',
          value: '1450',
          unit: 'μmol/m²/s',
          icon: <Leaf size={20} />,
          color: 'green',
          status: 'Good',
          hourlyData: [
            0, 0, 0, 0, 100, 300, 600, 900, 1200, 1450, 1600, 1700, 1800, 1700,
            1500, 1200, 900, 600, 200, 50, 0, 0, 0, 0,
          ],
        },
      ],
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-foreground">IOT Dashboard</h3>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-bold text-green-500 uppercase tracking-wider">
          <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></span>
          Live
        </span>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-start mb-8">
          <div className="flex gap-4">
            <div className="p-3 bg-green-500/10 rounded-xl text-green-500 border border-green-500/20">
              <Wifi size={24} />
            </div>
            <div>
              <h4 className="text-lg font-medium text-foreground leading-none mb-1">
                NEST-001-AGR
              </h4>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Plot A-12 • REVA University
              </p>
            </div>
          </div>
          <button className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors">
            <RotateCcw size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatusCard
            icon={<Battery size={16} />}
            label="Battery"
            value="78%"
            subValue={
              <div className="w-full h-1 bg-muted rounded-full mt-2 overflow-hidden">
                <div className="w-[78%] h-full bg-green-500 rounded-full"></div>
              </div>
            }
          />
          <StatusCard
            icon={<Signal size={16} />}
            label="Signal"
            value="Good"
            subValue={
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full ${i <= 3 ? 'bg-blue-500' : 'bg-muted'}`}
                  ></div>
                ))}
              </div>
            }
          />
          <StatusCard
            icon={<Activity size={16} />}
            label="Sensors"
            value="18"
            subValue={
              <div className="flex items-center gap-1 text-[10px] text-purple-400 mt-2 uppercase font-bold tracking-tighter">
                <Activity size={10} /> Active
              </div>
            }
          />
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex justify-between items-center py-4 border-t border-border text-sm text-muted-foreground font-medium hover:text-primary transition-colors group"
        >
          Sensor Readings
          {isExpanded ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown
              size={16}
              className="group-hover:translate-y-0.5 transition-transform"
            />
          )}
        </button>

        {isExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border mt-0 animate-in fade-in slide-in-from-top-4 duration-300">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className="bg-background border border-border rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-all hover:bg-card hover:shadow-md group"
              >
                <div className="flex items-center gap-3 mb-4">
                  {cat.icon}
                  <div>
                    <h5 className="text-sm font-semibold text-foreground leading-tight">
                      {cat.name}
                    </h5>
                    <p className="text-[10px] text-muted-foreground">
                      {cat.count} sensors
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {cat.previewSensors.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-[11px]"
                    >
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {s.icon}
                        <span>{s.name}</span>
                      </div>
                      <span className="font-bold text-foreground">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
                  <span className="text-[10px] text-muted-foreground">
                    +{cat.count - 3} more sensors
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
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

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl bg-${category.color}-500/10 text-${category.color}-500`}
            >
              {category.icon}
            </div>
            <div>
              <h4 className="text-xl font-bold text-foreground">
                {category.name}
              </h4>
              <p className="text-xs text-muted-foreground">
                {category.count} active sensors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {category.details.map((sensor, idx) => (
              <div
                key={idx}
                onClick={() =>
                  setSelectedSensor(
                    selectedSensor === sensor.name ? null : sensor.name
                  )
                }
                className={`p-4 rounded-2xl bg-background border transition-all cursor-pointer group shadow-sm ${
                  selectedSensor === sensor.name
                    ? 'border-primary ring-1 ring-primary/20 bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/50 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div
                    className={`p-2 rounded-lg bg-${sensor.color}-500/10 text-${sensor.color}-500 border border-${sensor.color}-500/20`}
                  >
                    {sensor.icon}
                  </div>
                  <TrendingUp size={14} className="text-green-500 opacity-60" />
                </div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 truncate">
                  {sensor.name}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-foreground">
                    {sensor.value}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {sensor.unit}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${sensor.status === 'Good' ? 'bg-green-500' : sensor.status === 'Warning' ? 'bg-yellow-500' : 'bg-red-500'}`}
                  ></span>
                  <span
                    className={`text-[10px] font-bold uppercase ${sensor.status === 'Good' ? 'text-green-500' : sensor.status === 'Warning' ? 'text-yellow-500' : 'text-red-500'}`}
                  >
                    {sensor.status}
                  </span>
                  <ChevronDown
                    size={12}
                    className={`ml-auto text-muted-foreground transition-transform duration-300 ${selectedSensor === sensor.name ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>
            ))}
          </div>

          {selectedSensor && (
            <div className="animate-in slide-in-from-top-4 fade-in duration-500">
              {selectedSensor === 'Wind Dir' ? (
                <WindRadarChart onClose={() => setSelectedSensor(null)} />
              ) : (
                <SensorTrendChart
                  sensorName={selectedSensor}
                  value={
                    category.details.find((s) => s.name === selectedSensor)
                      ?.value || ''
                  }
                  unit={
                    category.details.find((s) => s.name === selectedSensor)
                      ?.unit || ''
                  }
                  data={
                    category.details.find((s) => s.name === selectedSensor)
                      ?.hourlyData || []
                  }
                  onClose={() => setSelectedSensor(null)}
                />
              )}
            </div>
          )}

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

  // Sample data for the polygon
  const pointsData = [80, 60, 40, 70, 90, 60, 50, 75];
  const polygonPath = directions
    .map((_, i) => getPoint(i * 45, pointsData[i] || 0))
    .join(' ');

  return (
    <div className="bg-card dark:bg-[#0a0a0a] border border-border dark:border-white/5 rounded-2xl p-4 sm:p-8 relative overflow-hidden shadow-2xl ring-1 ring-border/50 dark:ring-white/5">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h5 className="text-xl sm:text-3xl font-bold text-foreground dark:text-white tracking-tight">
            Wind Dir
          </h5>
          <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-500 mt-1 font-medium">
            24-Hour Trend
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-4xl sm:text-6xl font-bold text-red-500">
            NE
          </span>
          <button
            onClick={onClose}
            className="p-1.5 bg-white/10 dark:bg-white/5 rounded-full text-white hover:bg-white/20 transition-all"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-10">
        {['24 Hours', '7 Weeks', '1 Month'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
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
    </div>
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

  // Data comes from props

  const hours = [
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

  return (
    <div className="bg-card dark:bg-[#0a0a0a] border border-border dark:border-white/5 rounded-2xl p-4 sm:p-8 relative overflow-hidden shadow-2xl ring-1 ring-border/50 dark:ring-white/5">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h5 className="text-xl sm:text-3xl font-bold text-foreground dark:text-white tracking-tight">
            {sensorName}
          </h5>
          <p className="text-xs sm:text-sm text-muted-foreground dark:text-gray-500 mt-1 font-medium">
            24-Hour Trend
          </p>
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-3xl sm:text-5xl font-bold text-red-500">
            {value.split('.')[0]}
          </span>
          <span className="text-lg sm:text-xl font-medium text-red-500/80 mt-2">
            .{unit}
          </span>
          <button
            onClick={onClose}
            className="ml-2 sm:ml-4 text-muted-foreground hover:text-foreground dark:text-gray-600 dark:hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-4 mb-6 sm:mb-10">
        {['24 Hours', '7 Weeks', '1 Month'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
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

            {data.map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-red-500 hover:bg-red-600 transition-all cursor-pointer relative group rounded-t-[1px]"
                style={{ height: `${height}%` }}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1.5 rounded border border-border opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold shadow-xl">
                  {height}
                  {unit}
                </div>
              </div>
            ))}
          </div>

          {/* X-axis labels */}
          <div className="h-6 sm:h-8 flex justify-between items-center text-[9px] sm:text-[11px] font-bold text-muted-foreground dark:text-gray-600 pt-2 sm:pt-3 border-t border-border dark:border-white/10 overflow-hidden">
            {hours.map((hour, i) => (
              <span
                key={i}
                className={`flex-1 text-center ${i % 2 !== 0 ? 'hidden xs:inline' : ''}`}
              >
                {hour}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
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
  <div className="p-4 rounded-xl bg-background border border-border shadow-sm hover:shadow-md transition-shadow">
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
