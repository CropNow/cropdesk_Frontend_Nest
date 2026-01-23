import React from 'react';
const AgricultureNews = () => {
  const newsItems = [
    {
      id: 1,
      title: 'New AI Technology in Farming',
      summary: 'Usage of AI drones for monitoring crop health is increasing.',
      time: '2h ago',
    },
    {
      id: 2,
      title: 'Sustainable Irrigation Practices',
      summary: 'Farmers adopting new drip irrigation techniques to save water.',
      time: '5h ago',
    },
    {
      id: 3,
      title: 'Global Wheat Production Report',
      summary: 'Wheat production expected to rise by 5% this year globally.',
      time: '1d ago',
    },
  ];
  return (
    <div className="h-full flex flex-col gap-3 p-4 lg:p-6 rounded-2xl bg-card border border-border shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">
          Trending in Agriculture
        </h3>
        <span className="text-xs text-muted-foreground cursor-pointer hover:underline">
          View All
        </span>
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto max-h-[150px] pr-1">
        {newsItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-0.5 pb-2 border-b last:border-0 border-border/50"
          >
            <h4 className="text-sm font-medium text-foreground line-clamp-1">
              {item.title}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {item.summary}
            </p>
            <span className="text-[10px] text-muted-foreground/70">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AgricultureNews;
