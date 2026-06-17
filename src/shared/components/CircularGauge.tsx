/**
 * CircularGauge - Large circular progress gauge
 * Used for displaying overall health metrics
 */
interface CircularGaugeProps {
  value: number;
  status?: 'optimal' | 'warning' | 'critical';
}

export function CircularGauge({ value, status = 'optimal' }: CircularGaugeProps) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const colors = {
    optimal: '#00FF9C',
    warning: '#F59E0B',
    critical: '#EF4444',
  };
  const color = colors[status];

  return (
    <div className="relative h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16">
      <svg className="h-12 w-12 -rotate-90 sm:h-14 sm:w-14 lg:h-16 lg:w-16" viewBox="0 0 72 72" fill="none">
        <circle cx="36" cy="36" r={radius} stroke="var(--border-subtle)" strokeWidth="4" />
        <circle
          cx="36"
          cy="36"
          r={radius}
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-[10px] font-bold sm:text-xs lg:text-xs" style={{ color }}>
        {value}%
      </span>
    </div>
  );
}
