import { useEffect, useMemo, useState } from "react";

interface UseWeatherProps {
  farms: any[];
  selectedFarmId: string | null;
  isOnline: boolean;
  isCached: boolean;
}

export function useWeather({
  farms,
  selectedFarmId,
  isOnline,
  isCached,
}: UseWeatherProps) {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [locationName, setLocationName] = useState<string>("");

  useEffect(() => {
    const fetchWeather = async () => {
      if (!isOnline || !navigator.onLine || isCached) {
        console.log(
          "[Offline Mode Active] Skipping weather fetch while offline/using cache.",
        );
        return;
      }
      try {
        let lat = 28.61;
        let lon = 77.2;
        let name = "New Delhi, IN";

        const selectedFarm = farms.find(
          (f) => (f?.id || f?._id) === selectedFarmId,
        );
        if (
          selectedFarm?.location?.latitude &&
          selectedFarm?.location?.longitude
        ) {
          lat = parseFloat(selectedFarm.location.latitude);
          lon = parseFloat(selectedFarm.location.longitude);
          name = selectedFarm.location.city
            ? `${selectedFarm.location.city}, ${selectedFarm.location.country || "IN"}`
            : selectedFarm.name;
        } else if (navigator.geolocation) {
          try {
            const position: any = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 5000,
              });
            });
            lat = position.coords.latitude;
            lon = position.coords.longitude;

            const geoRes = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
            );
            const geoData = await geoRes.json();
            name =
              geoData.city ||
              geoData.locality ||
              `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
          } catch (geoErr) {
            console.warn("Geolocation failed, using default", geoErr);
          }
        }

        setLocationName(name);

        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&hourly=temperature_2m`,
        );
        const weather = await weatherRes.json();
        setWeatherData(weather);
      } catch (err) {
        console.error("Weather Fetch Error:", err);
      }
    };

    if (isOnline && navigator.onLine && !isCached && farms.length > 0) {
      fetchWeather();
    }
  }, [selectedFarmId, farms, isOnline, isCached]);

  const getWeatherDescription = (code: number) => {
    if (code === 0) return "Clear Sky";
    if (code >= 1 && code <= 3) return "Partly Cloudy";
    if (code >= 45 && code <= 48) return "Foggy";
    if (code >= 51 && code <= 67) return "Rainy";
    if (code >= 71) return "Snowy";
    return "Cloudy";
  };

  const weatherSummary = useMemo(() => {
    if (weatherData?.current) {
      return {
        city: locationName,
        temp: `${Math.round(weatherData.current.temperature_2m)}`,
        condition: getWeatherDescription(weatherData.current.weather_code),
      };
    }

    const farm = farms && farms.length > 0 ? farms[0] : null;
    const city =
      farm?.location?.city || farm?.location?.district || farm?.name || "N/A";
    const country = farm?.location?.country || "IN";
    return {
      city: city !== "N/A" ? `${city}, ${country}` : "N/A",
      temp: "--",
      condition: "Unknown",
    };
  }, [weatherData, locationName, farms]);

  return { weatherSummary };
}
