import React from 'react';
import { Settings, Wrench, Radio, Plus } from 'lucide-react';

const SeedProfile = () => {
  return (
    <main className="min-h-screen bg-background text-foreground pb-20 pt-16 md:pt-0">
      <div className="px-4 lg:px-6 mt-4 flex flex-col gap-4 max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Rover Fleet Management</h1>
            <p className="text-muted-foreground">
              Manage your hardware and assign missions.
            </p>
          </div>
          <button className="h-10 px-4 bg-primary text-primary-foreground font-medium rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Rover</span>
          </button>
        </div>

        {/* Rover List */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border flex flex-col md:flex-row gap-6 items-center md:items-start justify-between">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center border border-border shrink-0">
                <Radio className="text-primary h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Rover-01 (Alpha)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Assigned to: North Field
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  <span className="text-xs text-muted-foreground">
                    Status: Active
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none h-10 px-4 border border-border bg-card hover:bg-muted text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors">
                <Settings className="h-4 w-4" />
                Configure
              </button>
              <button className="flex-1 md:flex-none h-10 px-4 border border-border bg-card hover:bg-muted text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors">
                <Wrench className="h-4 w-4" />
                Maintenance
              </button>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border flex flex-col md:flex-row gap-6 items-center md:items-start justify-between opacity-80">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center border border-border shrink-0">
                <Radio className="text-muted-foreground h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Rover-02 (Bravo)
                </h3>
                <p className="text-sm text-muted-foreground">
                  Assigned to: South Field
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                  <span className="text-xs text-muted-foreground">
                    Status: Charging
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none h-10 px-4 border border-border bg-card hover:bg-muted text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors">
                <Settings className="h-4 w-4" />
                Configure
              </button>
              <button className="flex-1 md:flex-none h-10 px-4 border border-border bg-card hover:bg-muted text-sm font-medium rounded-xl flex items-center justify-center gap-2 transition-colors">
                <Wrench className="h-4 w-4" />
                Maintenance
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SeedProfile;
