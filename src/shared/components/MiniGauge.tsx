/**
 * MiniGauge - Small circular progress gauge
 * Used for displaying individual metric values
 */
interface MiniGaugeProps {
  value: number;
  max?: number;
  color?: string;
}

export function MiniGauge({ value, max = 100, color = '#00FF9C' }: MiniGaugeProps) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / max) * circumference;

  return (
    <div className="relative h-7 w-7 sm:h-9 sm:w-9">
      <svg className="h-7 w-7 -rotate-90 sm:h-9 sm:w-9" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r={radius} stroke="var(--border-subtle)" strokeWidth="3" />
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
    </div>
  );
}
