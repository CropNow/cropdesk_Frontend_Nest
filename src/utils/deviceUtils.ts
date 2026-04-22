import { DeviceType } from '../constants/deviceConstants';

/**
 * Type guard to check if a value is a valid DeviceType
 */
export const isDeviceType = (value: string | null): value is DeviceType => {
  return value === 'nest' || value === 'seed' || value === 'aero';
};

/**
 * Format weather summary data
 */
export const getWeatherSummary = () => {
  return {
    city: 'Kallakurichi, IN',
    temp: '30 C',
    condition: 'Partly cloudy',
  };
};

/**
 * Get status color based on FIS status type
 */
export const getStatusColor = (status: 'Optimal' | 'Warning' | 'Critical'): string => {
  const colors = {
    Optimal: '#00FF9C',
    Warning: '#F59E0B',
    Critical: '#EF4444',
  };
  return colors[status];
};

/**
 * Get status variant for badge component
 */
export const getStatusVariant = (status: 'Optimal' | 'Warning' | 'Critical'): 'success' | 'warning' | 'danger' => {
  if (status === 'Optimal') return 'success';
  if (status === 'Warning') return 'warning';
  return 'danger';
};

/**
 * Format current time with locale options
 */
export const formatCurrentTime = (date: Date) => {
  return {
    date: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
};
