import React from 'react';
import {
  Zap,
  RefreshCw,
  Thermometer,
  CloudRain,
  Wind,
  Lightbulb,
  Sprout,
  MessageSquare,
  Plus,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const AIInsights = ({
  showEmptyState = false,
}: {
  showEmptyState?: boolean;
}) => {
  const navigate = useNavigate();
  const handleAction = async (actionName: string) => {
    console.log(`Action triggered: ${actionName}`);
    // Simulate backend call
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  if (showEmptyState) {
    return (
      <div className="bg-gradient-to-br from-indigo-500/10 via-background to-background dark:bg-card border border-border rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[300px] text-center">
        {/* Blurred Content Placeholder */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <button
            onClick={() => navigate('/register/farmer-details')}
            className="group flex flex-col items-center gap-4 transition-transform hover:scale-105 active:scale-95"
          >
            <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
              <Plus size={32} className="text-white" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-lg font-bold text-foreground">
                Activate AI Insights
              </span>
              <span className="text-xs text-muted-foreground">
                Complete your profile to enable AI features
              </span>
            </div>
          </button>
        </div>

        <div className="opacity-20 blur-sm pointer-events-none w-full h-full flex flex-col gap-8">
          <div className="flex items-center gap-4 opacity-50">
            <Zap size={24} />
            <h2 className="text-xl font-bold">AI Insights</h2>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
            <div className="h-4 bg-muted-foreground/20 rounded w-1/2"></div>
            <div className="h-4 bg-muted-foreground/20 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-500/10 via-background to-background dark:bg-card border border-border rounded-3xl p-8 flex flex-col transition-colors duration-300">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-500">
            <Zap size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">AI Insights</h2>
          </div>
        </div>
        <button className="p-2.5 bg-muted rounded-xl hover:bg-muted/80 transition-all">
          <RefreshCw size={18} className="text-muted-foreground" />
        </button>
      </div>

      <h3 className="text-xs font-bold text-muted-foreground uppercase mb-4">
        Key Insights
      </h3>

      <div className="space-y-3 mb-8">
        <InsightRow
          icon={<Thermometer size={18} className="text-orange-500" />}
          label="Soil Conditions"
          status="Optimal"
          description="moderate moisture, ideal temperature"
        />
        <InsightRow
          icon={<CloudRain size={18} className="text-green-500" />}
          label="Weather Conditions"
          status="Excellent"
          description="UV: safe, Wind: calm"
        />
        <InsightRow
          icon={<Wind size={18} className="text-indigo-500" />}
          label="Air Quality"
          status="Good"
          description="excellent (10.0 ppm)"
        />
      </div>

      <div className="mt-auto">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          <span className="text-xs text-muted-foreground">
            Last updated: 7:59:32 pm
          </span>
        </div>

        <div className="bg-gradient-to-br from-indigo-500/5 to-background dark:bg-secondary/30 border border-border rounded-2xl p-6 mb-6">
          <h4 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
            <Zap size={16} className="text-indigo-500" />
            Smart Analysis
          </h4>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Lightbulb
                size={18}
                className="text-yellow-500 shrink-0 mt-0.5"
              />
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Current conditions are{' '}
                  <span className="text-foreground font-bold">
                    optimal for crop growth
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Soil moisture levels are balanced, and temperature ranges
                  support healthy development.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Sprout size={18} className="text-green-500 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Consider light irrigation in the next 24 hours to maintain ideal
                moisture levels.
              </p>
            </div>
          </div>
        </div>

        <button
          disabled
          className="w-full py-4 bg-muted text-muted-foreground border border-border text-sm font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2 opacity-70"
        >
          <MessageSquare size={18} />
          Chat with AI Assistant (Coming Soon)
        </button>
      </div>
    </div>
  );
};

const InsightRow = ({ icon, label, status, description }: any) => (
  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-background to-secondary/30 dark:bg-secondary/30 border border-border rounded-xl">
    <div className="flex items-center gap-3">
      <div className="p-2.5 bg-background rounded-lg border border-border/50">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-foreground">{label}</h4>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
    <div className="px-3 py-1.5 bg-muted rounded-full text-xs font-bold text-muted-foreground">
      {status}
    </div>
  </div>
);

export default AIInsights;
