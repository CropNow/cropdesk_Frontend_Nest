import React from 'react';
import { Lightbulb, AlertTriangle, Activity } from 'lucide-react';

const SeedInsights = () => {
  return (
    <main className="min-h-screen bg-background text-foreground pb-20 pt-16 md:pt-0">
      <div className="px-4 lg:px-6 mt-4 flex flex-col gap-4">
        {/* Header */}
        <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">AI Insights</h1>
            <p className="text-muted-foreground">
              Smart recommendations and anomalies detected by your Seed fleet.
            </p>
          </div>
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center hidden md:flex">
            <Lightbulb className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Anomaly Alerts */}
          <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="text-red-500 h-5 w-5" />
              Crop Anomaly Alerts
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                  <Activity className="text-red-500 h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    Pest Infestation Detected
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Rover-01 detected early signs of aphid infestation in North
                    Field Sector B.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    10 mins ago
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Path Optimization */}
          <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Lightbulb className="text-yellow-500 h-5 w-5" />
              Path Optimization
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border bg-card/50 flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-yellow-500/20 flex items-center justify-center shrink-0">
                  <Activity className="text-yellow-500 h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    Optimize Rover-02 Route
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on current moisture levels, re-routing Rover-02 will
                    scan the driest areas 15% faster.
                  </p>
                  <button className="mt-3 text-sm font-medium text-primary hover:underline">
                    Apply New Route
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SeedInsights;
