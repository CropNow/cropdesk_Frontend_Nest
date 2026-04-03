import React from 'react';
import { Camera, Droplets, ThermometerSun, Leaf } from 'lucide-react';

const SeedSensors = () => {
  return (
    <main className="min-h-screen bg-background text-foreground pb-20 pt-16 md:pt-0">
      <div className="px-4 lg:px-6 mt-4 flex flex-col gap-4">
        {/* Header */}
        <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border">
          <h1 className="text-2xl font-bold mb-2">Live Rover Sensors</h1>
          <p className="text-muted-foreground">
            Real-time data feeds from your active Seed rovers.
          </p>
        </div>

        {/* Rover Video Feed Mock */}
        <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border min-h-[300px] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/40 z-0"></div>
          <div className="z-10 flex flex-col items-center">
            <Camera className="h-12 w-12 text-white/50 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Rover-01 Live Camera Feed
            </h3>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-sm text-white/80">REC</span>
            </div>
            <p className="text-sm text-white/50 mt-4">(Video Feed Mock Data)</p>
          </div>
        </div>

        {/* Environmental Sensors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Soil NPK Content
              </p>
              <h3 className="text-2xl font-bold mt-1 text-foreground">
                Optimum
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Leaf className="text-orange-500 h-6 w-6" />
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Surface Temp
              </p>
              <h3 className="text-2xl font-bold mt-1 text-yellow-500">24°C</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <ThermometerSun className="text-yellow-500 h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SeedSensors;
