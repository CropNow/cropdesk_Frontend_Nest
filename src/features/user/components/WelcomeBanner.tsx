import React from 'react';

interface WelcomeBannerProps {
  name: string;
  university: string;
  activeCrops: number;
}

const WelcomeBanner = ({
  name,
  university,
  activeCrops,
}: WelcomeBannerProps) => {
  return (
    <div className="mx-4 lg:mx-6 mt-4 p-4 lg:p-8 rounded-2xl bg-gradient-to-br from-green-500/10 via-background/40 to-background border border-border shadow-sm">
      <p className="text-muted-foreground text-xs lg:text-sm mb-1 font-medium">
        Welcome Back
      </p>
      <h2 className="text-2xl lg:text-4xl font-bold text-foreground mb-2">
        {name}
      </h2>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs lg:text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          {university}
        </span>
        <span className="hidden xs:inline">•</span>
        <span>{activeCrops} Active Crops</span>
      </div>
    </div>
  );
};

export default WelcomeBanner;
