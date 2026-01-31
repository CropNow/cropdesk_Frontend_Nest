export const VALID_SERIAL_NUMBER =
  '6CjCgqHUM3uEJVUSDvPP1zCwUu86aF6XKApZXTmOBu2YcLVvx1wGhEvT8K8-3Akm';
const API_URL = '/api-proxy/machine/data/?api_key=';

// Helper to safely get value or default
const getSensorValue = (
  sensors: any[],
  name: string,
  defaultValue: string = '0'
) => {
  const sensor = sensors.find((s: any) => s.name === name);
  return sensor && sensor.readings && sensor.readings.length > 0
    ? String(sensor.readings[0].value)
    : '0'; // Force 0 if no readings found (Zero State)
};

// Helper to get raw readings array
const getReadings = (sensors: any[], name: string): any[] => {
  const sensor = sensors.find((s: any) => s.name === name);
  return sensor && sensor.readings ? sensor.readings : [];
};

import { http } from '@/services/http';

// Helper to Register Device in Backend
const registerDevice = async (fieldId: string, deviceData: any) => {
  try {
    console.log('Registering/Ensuring device exists in backend...', deviceData);
    await http.post(`/fields/${fieldId}/sensors`, deviceData);
    console.log('Device registered successfully.');
  } catch (error: any) {
    // If error is 400 and message contains 'duplicate' or similar, strict check might be needed.
    // But for now we assume validation error means it might already exist or invalid data.
    console.warn(
      'Device registration skipped/failed (might already exist):',
      error.response?.data || error.message
    );
  }
};

export const deleteDevice = async (fieldId: string, serialNumber: string) => {
  try {
    console.log(`Deleting device ${serialNumber} from field ${fieldId}...`);
    await http.delete(`/fields/${fieldId}/sensors/${serialNumber}`);
    console.log('Device deleted successfully.');
    return true;
  } catch (error: any) {
    console.error(
      'Failed to delete device:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getDevicesForField = async (fieldId: string) => {
  try {
    const response = await http.get(`/fields/${fieldId}/sensors`);
    // Backend returns array of sensors. Map to our Device interface if needed.
    // Assuming backend returns { id, name, type, serialNumber, ... } or similar
    return response.data;
  } catch (error) {
    console.error('Failed to fetch devices for field', error);
    return [];
  }
};

export const connectDevice = async (
  apiKey: string,
  registrationInfo?: {
    fieldId: string;
    name: string;
    type: string;
    manufacturer?: string;
    model?: string;
    firmwareVersion?: string;
    status?: string;
  }
) => {
  if (apiKey !== VALID_SERIAL_NUMBER) {
    throw new Error('Invalid User API Key. Connection Refused.');
  }

  try {
    const response = await fetch(`${API_URL}${apiKey}`);
    if (!response.ok) {
      throw new Error(
        `External Device API Error: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    const sensors = data.sensors || [];
    const realSerialNumber = data.machine?.id || apiKey;

    // 1. Register Device if Info Provided
    if (registrationInfo && registrationInfo.fieldId) {
      // Backend Schema ONLY allows 'NEST' or 'SEED'. Map logical types to these.
      const typeMapping: Record<string, string> = {
        WEATHER_STATION: 'NEST',
        NEST: 'NEST',
        VALVE_CONTROLLER: 'NEST',
        SENSOR_NODE: 'SEED',
      };
      const backendType = typeMapping[registrationInfo.type] || 'NEST';

      const sensorPayload = {
        name: registrationInfo.name || data.machine?.name || 'Unknown Device',
        type: backendType,
        // fieldId: registrationInfo.fieldId, // REMOVED: Passed in URL, not allowed in body
        serialNumber: String(realSerialNumber), // The CRITICAL link: Ensure String
        manufacturer: String(
          registrationInfo.manufacturer ||
            data.machine?.manufacturer ||
            'Generic'
        ),
        model: String(registrationInfo.model || 'Standard'),
        firmwareVersion: String(registrationInfo.firmwareVersion || '1.0.0'),
        unit: 'Multi', // Default unit for a multi-sensor station
        // status: registrationInfo.status?.toLowerCase() || 'active', // REMOVED: Not allowed in body
        location: {
          section: 'Main',
          coordinates: {
            type: 'Point',
            coordinates: [0, 0], // Default
          },
        },
      };

      let warningMessage = undefined;
      try {
        await registerDevice(registrationInfo.fieldId, sensorPayload);
      } catch (regErr: any) {
        console.error('Device Registration Detailed Error:', regErr);
        const backendMsg =
          regErr.response?.data?.message ||
          JSON.stringify(regErr.response?.data) ||
          regErr.message;

        warningMessage = `Device Registration Warning: ${backendMsg}. Data might not sync perfectly, but we will proceed.`;
      }
    }

    // 2. Sync Data to Backend
    try {
      // Map External Names to Backend 'Type' strings
      const sensorTypeMap: Record<string, string> = {
        'Temp Sensor': 'Temp',
        'Humidity Sensor': 'Humidity',
        'Light Sensor': 'Light',
        'Rainfall Sensor': 'Rainfall',
        'Wind Speed Sensor': 'Wind Speed',
        'Wind Direction Sensor': 'Wind Direction',
        'PM2.5 Sensor': 'PM2.5',
        'PM10 Sensor': 'PM10',
        'CO2 Sensor': 'CO2',
        'SOX Sensor': 'SOX',
        'NOX Sensor': 'NOX',
        'SH Sensor': 'SH',
        'SHR Sensor': 'SHR',
        'ST Sensor': 'ST',
        'STR Sensor': 'STR', // Correctly map to STR for soil_temperature_2
        'Pressure Sensor': 'Pressure',
        'Leaf Wetness Sensor': 'Leaf Wetness',
        'Radiation Sensor': 'Radiation',
        'O3 Sensor': 'O3',
      };

      const payload = {
        machine: {
          id: realSerialNumber, // Use real ID not API Key
          name: data.machine?.name,
          is_online: data.machine?.is_online,
          installed_at: data.machine?.installed_at,
          location: data.machine?.location || '',
        },
        sensors: sensors.map((s: any) => ({
          id: s.id,
          name: s.name,
          type:
            sensorTypeMap[s.name] || s.type || s.name.replace(' Sensor', ''),
          unit: s.unit,
          readings: s.readings || [],
        })),
      };

      console.log('Syncing sensor data to backend...', payload);
      await http.post('/sensor-data', payload);
      console.log('Sensor data synced successfully.');
    } catch (syncError: any) {
      console.error(
        'Failed to sync sensor data to backend (UI still updating):',
        syncError
      );
      // alert(`Sensor Data Sync Failed: ${syncError.response?.data?.message || syncError.message}`); // Optional: Uncomment if user wants explicit sync error
    }

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

    // Calculate latest activity timestamp
    let latestTimestamp = data.machine?.installed_at; // Default to install time
    if (sensors && sensors.length > 0) {
      sensors.forEach((s: any) => {
        if (s.readings && s.readings.length > 0) {
          const readingTime = s.readings[0].timestamp;
          if (
            readingTime &&
            (!latestTimestamp ||
              new Date(readingTime) > new Date(latestTimestamp))
          ) {
            latestTimestamp = readingTime;
          }
        }
      });
    }

    return {
      success: true,
      device: {
        name: data.machine?.name || 'Weather Station',
        type: 'STATION',
        manufacturer: 'CropNow Systems',
        model: 'Pro-X',
        status: data.machine?.is_online ? 'Active' : 'Offline', // Use API status
        serialNumber: realSerialNumber,
        apiKey: apiKey, // STORE API KEY for future polling
        connectedAt: new Date().toISOString(),
        lastActiveAt: latestTimestamp, // Return the calculated last active time
      },
      sensorData: mappedData,
      // @ts-ignore
      warning:
        typeof warningMessage !== 'undefined' ? warningMessage : undefined,
    };
  } catch (error) {
    console.error('Device connection error:', error);
    throw error;
  }
};
