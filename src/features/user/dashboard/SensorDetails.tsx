import React from 'react';
import {
  ArrowLeft,
  Activity,
  Thermometer,
  Droplets,
  Wind,
  Sun,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SensorDetails = () => {
  const navigate = useNavigate();

  const sensors = [
    {
      id: 'S-001',
      type: 'Soil Moisture',
      value: '42%',
      status: 'Active',
      icon: <Droplets size={20} />,
      color: 'blue',
    },
    {
      id: 'S-002',
      type: 'Temperature',
      value: '28.4°C',
      status: 'Active',
      icon: <Thermometer size={20} />,
      color: 'orange',
    },
    {
      id: 'S-003',
      type: 'Humidity',
      value: '65%',
      status: 'Active',
      icon: <Activity size={20} />,
      color: 'cyan',
    },
    {
      id: 'S-004',
      type: 'Wind Speed',
      value: '12 km/h',
      status: 'Active',
      icon: <Wind size={20} />,
      color: 'gray',
    },
    {
      id: 'S-005',
      type: 'Solar Intensity',
      value: '850 W/m²',
      status: 'Active',
      icon: <Sun size={20} />,
      color: 'yellow',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-1">Sensor Readings</h1>
            <p className="text-muted-foreground uppercase tracking-widest text-xs font-semibold">
              NEST-001-AGR • Real-time Data
            </p>
          </div>
          <div className="p-3 bg-primary/10 text-primary border border-primary/20 rounded-2xl">
            <Activity size={32} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sensors.map((sensor) => (
            <div
              key={sensor.id}
              className="p-6 rounded-2xl bg-card border border-border transition-all hover:border-primary/50 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`p-3 rounded-xl bg-${sensor.color}-500/10 text-${sensor.color}-500 border border-${sensor.color}-500/20`}
                >
                  {sensor.icon}
                </div>
                <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  {sensor.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                  {sensor.type}
                </p>
                <div className="text-2xl font-bold group-hover:text-primary transition-colors">
                  {sensor.value}
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Sensor ID: {sensor.id}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SensorDetails;
