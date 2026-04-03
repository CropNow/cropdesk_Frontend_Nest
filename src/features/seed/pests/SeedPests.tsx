import React, { useState } from 'react';
import {
  Bug,
  ChevronDown,
  ChevronUp,
  Crosshair,
  AlertTriangle,
  Camera,
  Clock,
  MapPin,
  Bot,
  Navigation,
} from 'lucide-react';
import { mockPestData } from '@/data/seed/mockPestData';

const SeedPests = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getDensityColor = (density: string) => {
    switch (density.toLowerCase()) {
      case 'low':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'moderate':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'high':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'severe':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground pb-20 pt-16 md:pt-0">
      <div className="px-4 lg:px-6 mt-4 flex flex-col gap-4">
        {/* Header */}
        <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Pest Intelligence</h1>
            <p className="text-muted-foreground">
              AI-driven pest management and threat thresholds.
            </p>
          </div>
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center hidden md:flex">
            <Bug className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Pest Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mockPestData.map((pest) => (
            <div
              key={pest.id}
              className="bg-card/80 backdrop-blur-md rounded-2xl border border-border overflow-hidden flex flex-col group"
            >
              {/* Image Section */}
              <div className="relative w-full h-[220px] overflow-hidden bg-muted">
                <img
                  src={pest.image}
                  alt={`${pest.crop} - ${pest.pestName}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Badges */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[10px] uppercase font-mono px-2 py-1 rounded flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" />
                  Rover Capture
                </div>
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-sm">
                  <span className="text-sm leading-none">{pest.cropEmoji}</span>{' '}
                  {pest.crop}
                </div>
              </div>

              {/* Metadata Strip */}
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2.5 bg-muted/20 border-b border-border text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5" title="Capture Time">
                  <Clock className="w-3.5 h-3.5" />
                  {pest.capturedAt}
                </div>
                <div
                  className="flex items-center gap-1.5"
                  title="Zone Location"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {pest.zone}
                </div>
                <div
                  className="flex items-center gap-1.5"
                  title="Rover Vehicle"
                >
                  <Bot className="w-3.5 h-3.5" />
                  {pest.roverId}
                </div>
                <div
                  className="flex items-center gap-1.5"
                  title="GPS Coordinates"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  {pest.gps}
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold tracking-wider uppercase text-primary">
                        {pest.type}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {pest.pestName}
                    </h3>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getDensityColor(pest.density)}`}
                  >
                    {pest.density} Density
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {pest.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {pest.zonesAffected.map((zone, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-background border border-border rounded-md text-xs font-medium"
                    >
                      {zone}
                    </span>
                  ))}
                </div>
              </div>

              {/* Accordion Action */}
              <div className="border-t border-border">
                <button
                  onClick={() =>
                    setExpandedId(expandedId === pest.id ? null : pest.id)
                  }
                  className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors text-sm font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-primary" />
                    Management Guidance
                  </span>
                  {expandedId === pest.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {/* Expanded Content */}
                {expandedId === pest.id && (
                  <div className="p-5 bg-background border-t border-border space-y-4 animate-in slide-in-from-top-2 duration-200">
                    <div>
                      <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">
                        When to Act
                      </h4>
                      <p className="text-sm p-3 bg-red-500/5 border border-red-500/20 rounded-lg text-red-500/90 font-medium">
                        {pest.whenToAct}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold uppercase text-muted-foreground">
                          What to Use
                        </h4>
                        <p className="text-sm">{pest.whatToUse}</p>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold uppercase text-muted-foreground">
                          Timing
                        </h4>
                        <p className="text-sm">{pest.timing}</p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <h4 className="text-xs font-bold uppercase text-muted-foreground">
                          Application Method
                        </h4>
                        <p className="text-sm">{pest.applicationMethod}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border space-y-3">
                      <div className="flex gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-yellow-500/90 leading-tight">
                          <span className="font-bold">Safety Notes:</span>{' '}
                          {pest.safetyNotes}
                        </p>
                      </div>
                      {pest.resistanceWarning && (
                        <div className="flex gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                          <p className="text-sm text-orange-500/90 leading-tight">
                            <span className="font-bold">
                              Resistance Warning:
                            </span>{' '}
                            {pest.resistanceWarning}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default SeedPests;
