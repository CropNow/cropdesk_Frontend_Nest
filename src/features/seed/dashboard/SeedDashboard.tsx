import React from 'react';
import { ShieldAlert, Battery, MapPin } from 'lucide-react';

const SeedDashboard = () => {
  return (
    <main className="min-h-screen bg-background text-foreground pb-20 pt-16 md:pt-0">
      <div className="px-4 lg:px-6 mt-4 flex flex-col gap-4">
        {/* Welcome */}
        <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border">
          <h1 className="text-2xl font-bold mb-2">Rover Fleet Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage your autonomous Seed rovers.
          </p>
        </div>

        {/* Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Active Rovers
              </p>
              <h3 className="text-3xl font-bold mt-1 text-primary">3</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldAlert className="text-primary h-6 w-6" />
            </div>
          </div>
          <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Avg Battery
              </p>
              <h3 className="text-3xl font-bold mt-1 text-green-500">82%</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <Battery className="text-green-500 h-6 w-6" />
            </div>
          </div>
          <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Total Area Scanned
              </p>
              <h3 className="text-3xl font-bold mt-1 text-blue-500">12.5 ha</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <MapPin className="text-blue-500 h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium text-foreground mb-2">
              Field Coverage Map
            </h3>
            <p className="text-sm text-muted-foreground">
              Visualizing rover trails... (Mock Data)
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SeedDashboard;
