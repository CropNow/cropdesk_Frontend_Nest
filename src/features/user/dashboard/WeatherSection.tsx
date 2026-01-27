import React from 'react';
import {
  Cloud,
  Wind,
  Droplets,
  Eye,
  Calendar,
  CloudRain,
  Sun,
  MapPin,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WeatherSection = ({
  showEmptyState = false,
}: {
  showEmptyState?: boolean;
}) => {
  const [weather, setWeather] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [location, setLocation] = React.useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [locationName, setLocationName] = React.useState<string>('Locating...');

  // Old useEffect removed as it is replaced by the new logic below

  React.useEffect(() => {
    if (!location) return;

    const fetchWeatherAndLocation = async () => {
      const CACHE_KEY = 'weather_cache';
      const CACHE_DURATION = 3600000; // 1 hour

      try {
        // Check cache first
        const cachedDataStr = localStorage.getItem(CACHE_KEY);
        if (cachedDataStr) {
          const cachedData = JSON.parse(cachedDataStr);
          const now = Date.now();
          const isFresh = now - cachedData.timestamp < CACHE_DURATION;
          const isSameLocation =
            Math.abs(cachedData.location.lat - location.lat) < 0.01 &&
            Math.abs(cachedData.location.lon - location.lon) < 0.01;

          if (isFresh && isSameLocation) {
            console.log('Using cached weather data');
            setWeather(cachedData.weather);
            if (cachedData.locationName) {
              setLocationName(cachedData.locationName);
            }
            setLoading(false);
            return;
          }
        }

        // Fetch Weather
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m&hourly=visibility`
        );
        const weatherData = await weatherResponse.json();
        setWeather(weatherData);

        // Fetch Location Name (Reverse Geocoding)
        let resolvedLocationName = locationName;
        if (
          locationName === 'Locating...' ||
          locationName === 'Field Location' ||
          /^-?\d/.test(locationName)
        ) {
          const geoResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${location.lat}&longitude=${location.lon}&localityLanguage=en`
          );
          const geoData = await geoResponse.json();
          const city =
            geoData.city || geoData.locality || geoData.principalSubdivision;
          const country = geoData.countryCode || '';
          if (city) {
            resolvedLocationName = `${city}${country ? `, ${country}` : ''}`;
            setLocationName(resolvedLocationName);
          }
        }

        // Save to cache
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            weather: weatherData,
            locationName: resolvedLocationName,
            location: location,
            timestamp: Date.now(),
          })
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherAndLocation();

    // Refresh every 1 hour (3600000 ms)
    const intervalId = setInterval(fetchWeatherAndLocation, 3600000);

    return () => clearInterval(intervalId);
  }, [location]);

  const getWeatherIcon = (code: number) => {
    if (code === 0)
      return <Sun size={64} className="text-yellow-500 fill-yellow-500/20" />;
    if (code >= 1 && code <= 3)
      return <Cloud size={64} className="text-blue-500 fill-blue-500/20" />;
    if (code >= 51 && code <= 67)
      return <CloudRain size={64} className="text-blue-600 fill-blue-600/20" />;
    return <Cloud size={64} className="text-gray-500 fill-gray-500/20" />;
  };

  const getWeatherDescription = (code: number) => {
    if (code === 0) return 'Clear Sky';
    if (code >= 1 && code <= 3) return 'Partly Cloudy';
    if (code >= 45 && code <= 48) return 'Foggy';
    if (code >= 51 && code <= 67) return 'Rainy';
    if (code >= 71) return 'Snowy';
    return 'Cloudy';
  };

  const navigate = useNavigate();

  /* Early return removed - we try to fetch location even if empty state is requested */

  React.useEffect(() => {
    const fetchLocation = async () => {
      // 1. Try to get from LocalStorage (Prioritize Field Details)
      const userStr = localStorage.getItem('registeredUser');
      let foundLocation = false;

      if (userStr) {
        try {
          const user = JSON.parse(userStr);

          // Check Field Details (Prioritized as per user request)
          if (user.fieldDetails?.coordinates) {
            const [latStr, lonStr] = user.fieldDetails.coordinates
              .split(',')
              .map((s: string) => s.trim());
            const lat = parseFloat(latStr);
            const lon = parseFloat(lonStr);
            if (!isNaN(lat) && !isNaN(lon)) {
              console.log('Using stored field location:', lat, lon);
              setLocation({ lat, lon });
              foundLocation = true;
              // Try to set name if available or generic
              if (user.fieldDetails.fieldName) {
                setLocationName(user.fieldDetails.fieldName);
              } else {
                setLocationName('Field Location');
              }
            }
          }

          // Fallback to Farm Details (Legacy structure check)
          if (!foundLocation && user.farmDetails?.location?.latitude) {
            const farmLoc = user.farmDetails.location;
            console.log('Using stored farm location:', farmLoc);
            setLocation({
              lat: parseFloat(farmLoc.latitude),
              lon: parseFloat(farmLoc.longitude),
            });
            foundLocation = true;
            if (farmLoc.city && farmLoc.country) {
              setLocationName(`${farmLoc.city}, ${farmLoc.country}`);
            }
          }
        } catch (e) {
          console.error('Error parsing user data for location', e);
        }
      }

      if (foundLocation) return;

      // 2. Fallback to Device Geolocation if no stored location
      if (navigator.geolocation) {
        console.log('Requesting geolocation access...');
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('Geolocation success:', position.coords);
            setLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
            // Let the second useEffect handle reverse geocoding for name
          },
          (error) => {
            console.warn('Geolocation permission denied or error:', error);
            // 3. Fallback to Default only if we CANNOT show empty state
            // If showEmptyState is true, we leave location null so the Empty State UI renders below
            if (!showEmptyState) {
              const defaultLocation = { lat: 28.61, lon: 77.2 };
              setLocation(defaultLocation);
              setLocationName('New Delhi, India');
            } else {
              setLoading(false); // Stop loading to show empty state
            }
          }
        );
      } else {
        // No geolocation support
        if (!showEmptyState) {
          const defaultLocation = { lat: 28.61, lon: 77.2 };
          setLocation(defaultLocation);
          setLocationName('New Delhi, India');
        } else {
          setLoading(false);
        }
      }
    };

    fetchLocation();
  }, [showEmptyState]);

  // Logic to determine if we should show the Empty State UI
  // We show it ONLY if:
  // 1. showEmptyState prop is true
  // 2. AND we failed to get a location (location is null)
  // 3. AND we are done loading (or failed to load)
  const shouldRenderEmptyState = showEmptyState && !location && !loading;

  if (shouldRenderEmptyState) {
    return (
      <section className="flex flex-col gap-4 h-full relative overflow-hidden rounded-2xl border border-border bg-muted/30">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <button
            onClick={() => navigate('/register/farmer-details')}
            className="group flex flex-col items-center gap-2 transition-transform hover:scale-105 active:scale-95"
          >
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
              <Cloud size={24} className="text-white" />
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-sm font-bold text-foreground">
                Setup Weather
              </span>
              <span className="text-sm text-muted-foreground">
                Allow location or add details
              </span>
            </div>
          </button>
        </div>

        {/* Blurred Preview */}
        <div className="p-5 h-full opacity-20 pointer-events-none blur-sm grayscale">
          <div className="flex justify-between items-center mb-4">
            <div className="h-4 w-24 bg-foreground/20 rounded"></div>
            <div className="h-6 w-32 bg-foreground/20 rounded-lg"></div>
          </div>
          <div className="grid grid-cols-2 gap-8 items-center h-full">
            <div className="w-20 h-20 rounded-full bg-foreground/20"></div>
            <div className="space-y-2">
              <div className="h-8 w-24 bg-foreground/20 rounded"></div>
              <div className="h-4 w-16 bg-foreground/20 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (loading || !weather) {
    return (
      <section className="flex flex-col gap-4 h-full animate-pulse">
        <div className="h-full p-4 lg:p-5 rounded-2xl bg-muted border border-border shadow-sm">
          <div className="h-4 w-1/3 bg-muted-foreground/20 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-8">
            <div className="h-20 w-20 bg-muted-foreground/20 rounded-full"></div>
            <div className="space-y-4">
              <div className="h-4 w-full bg-muted-foreground/20 rounded"></div>
              <div className="h-4 w-full bg-muted-foreground/20 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const current = weather.current;
  // Approximation for visibility effectively if hourly unavailable or complex
  const visibility = weather.hourly?.visibility
    ? weather.hourly.visibility[0]
    : 10000;

  return (
    <section className="flex flex-col gap-4 h-full">
      <div className="h-full p-4 lg:p-5 rounded-2xl bg-gradient-to-br from-blue-500/20 via-blue-500/5 to-background border border-border shadow-sm relative overflow-hidden flex flex-col justify-between">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-border/10">
          <h3 className="text-sm font-bold text-foreground">Current Weather</h3>
          <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-lg">
            <MapPin size={16} className="text-primary" /> {locationName}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 lg:gap-8 items-center flex-1 pr-1 lg:pr-2">
          {/* Left Column: Temperature & Main State */}
          <div className="flex flex-col gap-0.5 lg:gap-1">
            <div className="flex items-center gap-1.5 lg:gap-4">
              <div className="scale-50 lg:scale-100 origin-left -ml-2 lg:ml-0">
                {getWeatherIcon(current.weather_code)}
              </div>
              <div>
                <div className="flex items-start text-foreground leading-none">
                  <span className="text-3xl lg:text-6xl font-bold tracking-tighter">
                    {Math.round(current.temperature_2m)}
                  </span>
                  <span className="text-lg lg:text-2xl font-bold mt-0.5 lg:mt-1 text-muted-foreground">
                    °C
                  </span>
                </div>
                <div className="text-[9px] lg:text-xs font-medium text-muted-foreground mt-0.5 lg:mt-1">
                  Feels Like{' '}
                  <span className="text-foreground font-bold">
                    {Math.round(current.apparent_temperature)}°
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-0 lg:mt-2 pl-0.5 lg:pl-1">
              <div className="text-xs lg:text-lg font-bold text-foreground truncate max-w-[100px] lg:max-w-none">
                {getWeatherDescription(current.weather_code)}
              </div>
            </div>
          </div>

          {/* Right Column: Details List */}
          <div className="flex flex-col justify-center gap-2 lg:gap-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 lg:gap-4">
                <div className="p-1.5 lg:p-2 bg-cyan-500/10 rounded-lg lg:rounded-xl">
                  <Wind size={14} className="text-cyan-500 lg:w-5 lg:h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] lg:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Wind
                  </span>
                  <span className="text-xs lg:text-lg font-bold text-foreground">
                    {current.wind_speed_10m}{' '}
                    <span className="text-[9px] lg:text-base">km/h</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 lg:gap-4">
                <div className="p-1.5 lg:p-2 bg-blue-500/10 rounded-lg lg:rounded-xl">
                  <Droplets size={14} className="text-blue-500 lg:w-5 lg:h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] lg:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Humidity
                  </span>
                  <span className="text-xs lg:text-lg font-bold text-foreground">
                    {current.relative_humidity_2m}%
                  </span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 lg:gap-4">
                <div className="p-1.5 lg:p-2 bg-purple-500/10 rounded-lg lg:rounded-xl">
                  <Eye size={14} className="text-purple-500 lg:w-5 lg:h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] lg:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Visibility
                  </span>
                  <span className="text-xs lg:text-lg font-bold text-foreground">
                    {(visibility / 1000).toFixed(1)}{' '}
                    <span className="text-[9px] lg:text-base">km</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer: Alert */}
      </div>
    </section>
  );
};

const MetricCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  color: 'cyan' | 'blue' | 'purple';
}) => {
  const colorClasses = {
    cyan: 'bg-cyan-500/5 border-cyan-500/10 text-cyan-500',
    blue: 'bg-blue-500/5 border-blue-500/10 text-blue-500',
    purple: 'bg-purple-500/5 border-purple-500/10 text-purple-500',
  };

  return (
    <div
      className={`p-3 rounded-xl border ${colorClasses[color].split(' ').slice(0, 2).join(' ')}`}
    >
      <div
        className={`flex items-center gap-2 mb-1 ${colorClasses[color].split(' ').slice(2).join(' ')}`}
      >
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  );
};

export default WeatherSection;
