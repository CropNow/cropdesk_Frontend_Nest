import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Leaf,
  ShieldAlert,
  Camera,
  Clock,
  MapPin,
  Bot,
  Navigation,
} from 'lucide-react';
import { mockDiseaseData } from '@/data/seed/mockDiseaseData';

const SeedDisease = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'high':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'critical':
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
            <h1 className="text-2xl font-bold mb-2">Crop Disease AI</h1>
            <p className="text-muted-foreground">
              Predictive disease modeling based on live rover data.
            </p>
          </div>
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center hidden md:flex">
            <Activity className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Intelligence Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockDiseaseData.map((item) => (
            <div
              key={item.id}
              className="bg-card/80 backdrop-blur-md rounded-2xl border border-border overflow-hidden flex flex-col group"
            >
              {/* Image Section */}
              <div className="relative w-full h-[220px] overflow-hidden bg-muted">
                <img
                  src={item.image}
                  alt={`${item.crop} - ${item.disease}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Badges */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[10px] uppercase font-mono px-2 py-1 rounded flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" />
                  Rover Capture
                </div>
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-sm">
                  <span className="text-sm leading-none">{item.cropEmoji}</span>{' '}
                  {item.crop}
                </div>
              </div>

              {/* Metadata Strip */}
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2.5 bg-muted/20 border-b border-border text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-1.5" title="Capture Time">
                  <Clock className="w-3.5 h-3.5" />
                  {item.capturedAt}
                </div>
                <div
                  className="flex items-center gap-1.5"
                  title="Zone Location"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  {item.zone}
                </div>
                <div
                  className="flex items-center gap-1.5"
                  title="Rover Vehicle"
                >
                  <Bot className="w-3.5 h-3.5" />
                  {item.roverId}
                </div>
                <div
                  className="flex items-center gap-1.5"
                  title="GPS Coordinates"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  {item.gps}
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold tracking-wider uppercase text-primary mb-1 block">
                      {item.crop}
                    </span>
                    <h3 className="text-lg font-bold text-foreground leading-tight">
                      {item.disease}
                    </h3>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getSeverityColor(item.severity)}`}
                  >
                    {item.severity} Risk
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-background/50 rounded-lg p-3 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">
                      AI Confidence
                    </p>
                    <p className="text-lg font-bold">{item.confidence}%</p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3 border border-border">
                    <p className="text-xs text-muted-foreground mb-1">
                      Affected Area
                    </p>
                    <p className="text-lg font-bold">{item.affectedArea}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> Visual Symptoms
                  </p>
                  <p className="text-sm border-l-2 border-primary/50 pl-3 py-1">
                    {item.symptoms}
                  </p>
                </div>
              </div>

              {/* Accordion Action */}
              <div className="mt-auto border-t border-border">
                <button
                  onClick={() =>
                    setExpandedId(expandedId === item.id ? null : item.id)
                  }
                  className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors text-sm font-medium"
                >
                  <span className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-primary" />
                    View Treatment Plan
                  </span>
                  {expandedId === item.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {/* Expanded Content */}
                {expandedId === item.id && (
                  <div className="p-4 bg-primary/5 border-t border-border animate-in slide-in-from-top-2 duration-200">
                    <p className="text-sm leading-relaxed">{item.treatment}</p>
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

export default SeedDisease;
