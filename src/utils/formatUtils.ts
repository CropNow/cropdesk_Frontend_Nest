/**
 * Format utilities - numbers, units, labels
 */

export const formatNumber = (value: number, decimals = 2): string => {
  return parseFloat(value.toFixed(decimals)).toString();
};

export const formatCurrency = (value: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
};

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${formatNumber(value, decimals)}%`;
};

export const formatDate = (date: string | Date, format = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions =
    format === 'short'
      ? { year: 'numeric', month: 'short', day: 'numeric' }
      : { year: 'numeric', month: 'long', day: 'numeric' };
  return dateObj.toLocaleDateString('en-US', options);
};

export const formatTime = (date: string | Date, format = '12h'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions =
    format === '12h'
      ? { hour: 'numeric', minute: '2-digit', hour12: true }
      : { hour: '2-digit', minute: '2-digit', hour12: false };
  return dateObj.toLocaleTimeString('en-US', options);
};

export const formatDateTime = (date: string | Date): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const formatTemperature = (celsius: number): string => {
  return `${formatNumber(celsius, 1)}°C`;
};

export const formatHumidity = (value: number): string => {
  return formatPercentage(value);
};

export const formatVolume = (liters: number): string => {
  if (liters > 1000) {
    return `${formatNumber(liters / 1000, 2)} m³`;
  }
  return `${formatNumber(liters, 0)} L`;
};

export const formatDistance = (meters: number): string => {
  if (meters > 1000) {
    return `${formatNumber(meters / 1000, 1)} km`;
  }
  return `${formatNumber(meters, 0)} m`;
};

export const truncateText = (text: string, length = 50): string => {
  if (text.length > length) {
    return `${text.substring(0, length)}...`;
  }
  return text;
};

export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const getSeverityColor = (severity: string): string => {
  const colors: Record<string, string> = {
    low: 'green',
    medium: 'yellow',
    high: 'orange',
    critical: 'red',
  };
  return colors[severity] || 'gray';
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: 'green',
    inactive: 'gray',
    error: 'red',
    online: 'green',
    offline: 'gray',
    warning: 'yellow',
  };
  return colors[status] || 'gray';
};
