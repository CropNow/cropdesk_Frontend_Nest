/**
 * Format utilities - numbers, units, labels
 */

export const formatNumber = (value: number, decimals = 2): string => {
  return parseFloat(value.toFixed(decimals)).toString();
};

export const formatCurrency = (value: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
};

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${formatNumber(value, decimals)}%`;
};

export const formatDate = (date: string | Date, format = "short"): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions =
    format === "short"
      ? { year: "numeric", month: "short", day: "numeric" }
      : { year: "numeric", month: "long", day: "numeric" };
  return dateObj.toLocaleDateString("en-US", options);
};

export const formatTime = (date: string | Date, format = "12h"): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions =
    format === "12h"
      ? { hour: "numeric", minute: "2-digit", hour12: true }
      : { hour: "2-digit", minute: "2-digit", hour12: false };
  return dateObj.toLocaleTimeString("en-US", options);
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
    low: "green",
    medium: "yellow",
    high: "orange",
    critical: "red",
  };
  return colors[severity] || "gray";
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: "green",
    inactive: "gray",
    error: "red",
    online: "green",
    offline: "gray",
    warning: "yellow",
  };
  return colors[status] || "gray";
};

export const parseUserAgent = (ua: string): string => {
  if (!ua) return "Unknown Device";

  const lowerUA = ua.toLowerCase();

  let browser = "Unknown Browser";
  if (lowerUA.includes("postman")) browser = "Postman";
  else if (lowerUA.includes("edg/")) browser = "Edge";
  else if (lowerUA.includes("chrome")) browser = "Chrome";
  else if (lowerUA.includes("firefox")) browser = "Firefox";
  else if (lowerUA.includes("safari") && !lowerUA.includes("chrome")) browser = "Safari";
  else if (lowerUA.includes("opera") || lowerUA.includes("opr/")) browser = "Opera";

  let os = "Unknown OS";
  if (lowerUA.includes("windows")) os = "Windows";
  else if (lowerUA.includes("mac")) os = "MacOS";
  else if (lowerUA.includes("linux") && !lowerUA.includes("android")) os = "Linux";
  else if (lowerUA.includes("android")) os = "Android";
  else if (lowerUA.includes("ios") || lowerUA.includes("iphone") || lowerUA.includes("ipad"))
    os = "iOS";

  if (browser === "Postman") return "Postman API Client";
  return `${browser} on ${os}`;
};

export const formatTimeAgo = (dateString: string): string => {
  if (!dateString) return "Unknown time";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;

  return date.toLocaleDateString();
};
