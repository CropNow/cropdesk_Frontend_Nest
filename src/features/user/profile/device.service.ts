export const VALID_SERIAL_NUMBER =
  '6CjCgqHUM3uEJVUSDvPP1zCwUu86aF6XKApZXTmOBu2YcLVvx1wGhEvT8K8-3Akm';
const API_URL = 'https://ggespl.com/api/machine/data/?api_key=';

// Helper to safely get value or default
const getSensorValue = (
  sensors: any[],
  name: string,
  defaultValue: string = '0'
) => {
  const sensor = sensors.find((s: any) => s.name === name);
  return sensor && sensor.readings && sensor.readings.length > 0
    ? String(sensor.readings[0].value)
    : defaultValue;
};

// Helper to get raw readings array
const getReadings = (sensors: any[], name: string): any[] => {
  const sensor = sensors.find((s: any) => s.name === name);
  return sensor && sensor.readings ? sensor.readings : [];
};

export const connectDevice = async (serialNumber: string) => {
  if (serialNumber !== VALID_SERIAL_NUMBER) {
    throw new Error('Invalid Serial Number. Connection Refused.');
  }

  try {
    const response = await fetch(`${API_URL}${serialNumber}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    const data = await response.json();
    const sensors = data.sensors || [];

    // Map API data to our fixed Category Structure

    // 1. Weather
    const windSpeed = getSensorValue(sensors, 'Wind Speed Sensor');
    const windDir = getSensorValue(sensors, 'Wind Direction Sensor');
    const rainfall = getSensorValue(sensors, 'Rainfall Sensor');

    const weatherCategory = {
      id: 'weather',
      name: 'Weather Sensors',
      count: 3,
      color: 'cyan',
      previewSensors: [
        { name: 'Rain Fall', value: `${rainfall}mm` },
        { name: 'Wind Spd', value: `${windSpeed}m/s` },
        { name: 'Wind Dir', value: `${windDir}°` }, // Direction usually degrees
      ],
      details: [
        {
          name: 'Wind Direction',
          value: windDir,
          unit: '°',
          color: 'purple',
          status: 'Good',
          readings: getReadings(sensors, 'Wind Direction Sensor'),
        },
        {
          name: 'Wind Speed',
          value: windSpeed,
          unit: 'm/s',
          color: 'blue',
          status: 'Good',
          readings: getReadings(sensors, 'Wind Speed Sensor'),
        },
        {
          name: 'Rain Fall',
          value: rainfall,
          unit: 'mm',
          color: 'cyan',
          status: 'Good',
          readings: getReadings(sensors, 'Rainfall Sensor'),
        },
      ],
    };

    // 2. Soil
    const tempSurf = getSensorValue(sensors, 'ST Sensor');
    const moistSurf = getSensorValue(sensors, 'SH Sensor');
    const tempRoot = getSensorValue(sensors, 'STR Sensor');
    const moistRoot = getSensorValue(sensors, 'SHR Sensor');

    const soilCategory = {
      id: 'soil',
      name: 'Soil Sensors',
      count: 4,
      color: 'green',
      previewSensors: [
        { name: 'Temp Surf', value: `${tempSurf}°C` },
        { name: 'Moist Surf', value: `${moistSurf}%` },
        { name: 'Temp Root', value: `${tempRoot}°C` },
      ],
      details: [
        {
          name: 'Soil Temperature at Surface',
          value: tempSurf,
          unit: '°C',
          color: 'orange',
          status: 'Good',
          readings: getReadings(sensors, 'ST Sensor'),
        },
        {
          name: 'Soil Moisture at Surface',
          value: moistSurf,
          unit: '%',
          color: 'blue',
          status: 'Good',
          readings: getReadings(sensors, 'SH Sensor'),
        },
        {
          name: 'Soil Temperature at Root',
          value: tempRoot,
          unit: '°C',
          color: 'orange',
          status: 'Good',
          readings: getReadings(sensors, 'STR Sensor'),
        },
        {
          name: 'Soil Moisture at Root',
          value: moistRoot,
          unit: '%',
          color: 'blue',
          status: 'Good',
          readings: getReadings(sensors, 'SHR Sensor'),
        },
      ],
    };

    // 3. Air
    const pm25 = getSensorValue(sensors, 'PM2.5 Sensor');
    const pm10 = getSensorValue(sensors, 'PM10 Sensor');
    const co2 = getSensorValue(sensors, 'CO2 Sensor');
    const tempAir = getSensorValue(sensors, 'Temp Sensor');
    const humidity = getSensorValue(sensors, 'Humidity Sensor');
    const pressure = getSensorValue(sensors, 'Pressure Sensor');
    const sox = getSensorValue(sensors, 'SOX Sensor');
    const nox = getSensorValue(sensors, 'NOX Sensor');
    const o3 = getSensorValue(sensors, 'O3 Sensor');
    const leafWetness = getSensorValue(sensors, 'Leaf Wetness Sensor');

    const airCategory = {
      id: 'air',
      name: 'Air Sensors',
      count: 10,
      color: 'blue',
      previewSensors: [
        { name: 'PM 2.5', value: `${pm25}µg` },
        { name: 'CO2', value: `${co2}ppm` },
        { name: 'Temp', value: `${tempAir}°C` },
      ],
      details: [
        {
          name: 'PM 2.5',
          value: pm25,
          unit: 'µg/m³',
          color: 'blue',
          status: 'Good',
          readings: getReadings(sensors, 'PM2.5 Sensor'),
        },
        {
          name: 'PM 10',
          value: pm10,
          unit: 'µg/m³',
          color: 'cyan',
          status: 'Good',
          readings: getReadings(sensors, 'PM10 Sensor'),
        },
        {
          name: 'CO2',
          value: co2,
          unit: 'ppm',
          color: 'gray',
          status: 'Good',
          readings: getReadings(sensors, 'CO2 Sensor'),
        },
        {
          name: 'Air Temperature',
          value: tempAir,
          unit: '°C',
          color: 'orange',
          status: 'Good',
          readings: getReadings(sensors, 'Temp Sensor'),
        },
        {
          name: 'Humidity',
          value: humidity,
          unit: '%',
          color: 'cyan',
          status: 'Good',
          readings: getReadings(sensors, 'Humidity Sensor'),
        },
        {
          name: 'Air Pressure',
          value: pressure,
          unit: 'hPa',
          color: 'blue',
          status: 'Good',
          readings: getReadings(sensors, 'Pressure Sensor'),
        },
        {
          name: 'SOX',
          value: sox,
          unit: 'ppm',
          color: 'yellow',
          status: 'Good',
          readings: getReadings(sensors, 'SOX Sensor'),
        },
        {
          name: 'NOX',
          value: nox,
          unit: 'ppm',
          color: 'orange',
          status: 'Good',
          readings: getReadings(sensors, 'NOX Sensor'),
        },
        {
          name: 'O3',
          value: o3,
          unit: 'ppm',
          color: 'green',
          status: 'Good',
          readings: getReadings(sensors, 'O3 Sensor'),
        },
        {
          name: 'Leaf Wetness',
          value: leafWetness,
          unit: '%',
          color: 'green',
          status: 'Good',
          readings: getReadings(sensors, 'Leaf Wetness Sensor'),
        },
      ],
    };

    // 4. Light
    const light = getSensorValue(sensors, 'Light Sensor');
    const radiation = getSensorValue(sensors, 'Radiation Sensor');

    const lightCategory = {
      id: 'light',
      name: 'Light Sensors',
      count: 2, // Only 2 provided in your API list for now
      color: 'yellow',
      previewSensors: [
        { name: 'Light', value: `${light} Lux` },
        { name: 'Radiation', value: `${radiation} W/m²` },
      ],
      details: [
        {
          name: 'Light',
          value: light,
          unit: 'Lux',
          color: 'orange',
          status: 'Good',
          readings: getReadings(sensors, 'Light Sensor'),
        },
        {
          name: 'Radiation',
          value: radiation,
          unit: 'W/m²',
          color: 'yellow',
          status: 'Good',
          readings: getReadings(sensors, 'Radiation Sensor'),
        },
      ],
    };

    const mappedData = [
      weatherCategory,
      soilCategory,
      airCategory,
      lightCategory,
    ];

    return {
      success: true,
      device: {
        name: data.machine?.name || 'Weather Station',
        type: 'STATION',
        manufacturer: 'CropNow Systems',
        model: 'Pro-X',
        status: data.machine?.is_online ? 'Active' : 'Offline', // Use API status
        serialNumber: serialNumber,
        connectedAt: new Date().toISOString(),
      },
      sensorData: mappedData,
    };
  } catch (error) {
    console.error('Device connection error:', error);
    throw error;
  }
};
