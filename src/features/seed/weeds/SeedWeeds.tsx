import React, { useState } from 'react';
import {
  Target,
  ChevronDown,
  ChevronUp,
  Map,
  Sprout,
  ShieldAlert,
  Camera,
  Clock,
  MapPin,
  Bot,
  Navigation,
} from 'lucide-react';
import { mockWeedData } from '@/data/seed/mockWeedData';

const SeedWeeds = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getPressureColor = (pressure: string) => {
    switch (pressure.toLowerCase()) {
      case 'low':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'moderate':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'high':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'critical':
        return 'text-red-600 bg-red-600/10 border-red-600/20';
      default:
        return 'text-green-500 bg-green-500/10 border-green-500/20'; // Green = clear/low
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground pb-20 pt-16 md:pt-0">
      <div className="px-4 lg:px-6 mt-4 flex flex-col gap-4">
        {/* Header */}
        <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Weed Detection</h1>
            <p className="text-muted-foreground">
              Zone-based weed pressure mapping and targeting.
            </p>
          </div>
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center hidden md:flex">
            <Target className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area (Cards) */}
          <div className="lg:col-span-2 space-y-4">
            {mockWeedData.map((weed) => (
              <div
                key={weed.id}
                className="bg-card/80 backdrop-blur-md rounded-2xl border border-border overflow-hidden flex flex-col group"
              >
                {/* Image Section */}
                <div className="relative w-full h-[220px] overflow-hidden bg-muted">
                  <img
                    src={weed.image}
                    alt={`${weed.crop} - ${weed.commonName}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Badges */}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[10px] uppercase font-mono px-2 py-1 rounded flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5" />
                    Rover Capture
                  </div>
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-sm">
                    <span className="text-sm leading-none">
                      {weed.cropEmoji}
                    </span>{' '}
                    {weed.crop}
                  </div>
                </div>

                {/* Metadata Strip */}
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2.5 bg-muted/20 border-b border-border text-xs text-muted-foreground font-medium">
                  <div
                    className="flex items-center gap-1.5"
                    title="Capture Time"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {weed.capturedAt}
                  </div>
                  <div
                    className="flex items-center gap-1.5"
                    title="Zone Location"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {weed.zone}
                  </div>
                  <div
                    className="flex items-center gap-1.5"
                    title="Rover Vehicle"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    {weed.roverId}
                  </div>
                  <div
                    className="flex items-center gap-1.5"
                    title="GPS Coordinates"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    {weed.gps}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Map className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-bold tracking-wider uppercase text-primary">
                          {weed.zone}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        {weed.commonName}
                      </h3>
                      <p className="text-sm italic text-muted-foreground">
                        {weed.species}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getPressureColor(weed.weedPressure)}`}
                    >
                      {weed.weedPressure} Pressure
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {weed.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-background/50 rounded-lg p-2.5 border border-border text-center">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Stage
                      </p>
                      <p className="text-sm font-semibold">
                        {weed.growthStage}
                      </p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-2.5 border border-border text-center">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        Coverage
                      </p>
                      <p className="text-sm font-semibold">{weed.coverage}</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-2.5 border border-border md:col-span-2 flex items-center justify-center text-center">
                      <div className="flex items-center gap-1.5 text-orange-500/90 text-xs font-medium">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        {weed.threat}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accordion Action */}
                <div className="border-t border-border">
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === weed.id ? null : weed.id)
                    }
                    className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors text-sm font-medium"
                  >
                    <span className="flex items-center gap-2">
                      <Sprout className="w-4 h-4 text-primary" />
                      View Control Methods
                    </span>
                    {expandedId === weed.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {/* Expanded Content */}
                  {expandedId === weed.id && (
                    <div className="p-5 bg-background border-t border-border space-y-4 animate-in slide-in-from-top-2 duration-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold uppercase text-muted-foreground">
                            Type
                          </h4>
                          <p className="text-sm">{weed.controlMethod}</p>
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold uppercase text-muted-foreground">
                            Recommended Product
                          </h4>
                          <p className="text-sm">{weed.herbicide}</p>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <h4 className="text-xs font-bold uppercase text-muted-foreground">
                            Application Timing
                          </h4>
                          <p className="text-sm">{weed.applicationTiming}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border space-y-3">
                        <div className="flex gap-2">
                          <Sprout className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <p className="text-sm leading-tight text-foreground/90">
                            <span className="font-bold text-muted-foreground">
                              Crop Safety:
                            </span>{' '}
                            {weed.cropSafety}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <ShieldAlert className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                          <p className="text-sm leading-tight text-orange-500/90">
                            <span className="font-bold">Resistance:</span>{' '}
                            {weed.resistanceStatus}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Area (Visual Mock Zone Map) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border sticky top-24">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Map className="w-5 h-5 text-primary" />
                Live Field Zones
              </h3>

              <div className="grid grid-cols-2 gap-2 aspect-square mb-4">
                {/* Visual Representation of Field Zones */}
                <div className="bg-red-500/20 border-2 border-red-500/50 rounded-lg flex items-center justify-center font-bold text-red-500 relative overflow-hidden group hover:bg-red-500/30 transition-colors">
                  <span className="z-10 bg-background/80 px-2 py-0.5 rounded text-xs select-none">
                    Zone A
                  </span>
                </div>
                <div className="bg-yellow-500/20 border-2 border-yellow-500/50 rounded-lg flex items-center justify-center font-bold text-yellow-500 relative overflow-hidden group hover:bg-yellow-500/30 transition-colors">
                  <span className="z-10 bg-background/80 px-2 py-0.5 rounded text-xs select-none">
                    Zone B
                  </span>
                </div>
                <div className="bg-orange-500/20 border-2 border-orange-500/50 rounded-lg flex items-center justify-center font-bold text-orange-500 relative overflow-hidden group hover:bg-orange-500/30 transition-colors">
                  <span className="z-10 bg-background/80 px-2 py-0.5 rounded text-xs select-none">
                    Zone C
                  </span>
                </div>
                <div className="bg-green-500/20 border-2 border-green-500/50 rounded-lg flex items-center justify-center font-bold text-green-500 relative overflow-hidden group hover:bg-green-500/30 transition-colors">
                  <span className="z-10 bg-background/80 px-2 py-0.5 rounded text-xs select-none">
                    Zone D
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div> High
                  </span>
                  <span>Zone A</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>{' '}
                    Moderate
                  </span>
                  <span>Zone C</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>{' '}
                    Low
                  </span>
                  <span>Zone B</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>{' '}
                    Clear
                  </span>
                  <span>Zone D</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SeedWeeds;
