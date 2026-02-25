export const VALID_SERIAL_NUMBER =
  '6CjCgqHUM3uEJVUSDvPP1zCwUu86aF6XKApZXTmOBu2YcLVvx1wGhEvT8K8-3Akm';

const mapDeviceTypeToSensorType = (deviceType: string): 'NEST' | 'SEED' => {
  const nestTypes = [
    'NEST (Main Controller)',
    'NEST',
    'Weather Station',
    'Gateway',
  ];
  return nestTypes.some((t) =>
    deviceType.toLowerCase().includes(t.toLowerCase())
  )
    ? 'NEST'
    : 'SEED';
};

import { http } from '@/services/http';
import * as sensorApi from '@/api/sensor.api';
import * as mlApi from '@/api/ml.api';

// Helper to Register Device in Backend
export const registerNewDevice = async (fieldId: string, deviceData: any) => {
  try {
    const payload = {
      name: deviceData.name || 'IoT Sensor',
      type: mapDeviceTypeToSensorType(deviceData.type),
      location: {
        coordinates: {
          type: 'Point' as const,
          coordinates: [0, 0] as [number, number],
        },
      },
      unit: 'metric' as const,
      serialNumber: deviceData.serialNumber,
      manufacturer: deviceData.manufacturer,
      model: deviceData.model,
      firmwareVersion: deviceData.firmwareVersion,
    };
    const response = await sensorApi.createSensor(fieldId, payload);
    return response;
  } catch (error: any) {
    console.error(
      'Device registration failed:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteDevice = async (fieldId: string, sensorId: string) => {
  try {
    await sensorApi.deleteSensor(sensorId);
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
    // Re-using the field-level list if backend still supports it,
    // or we might need to fetch all sensors.
    const response = await http.get(`/fields/${fieldId}/sensors`);
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
    // Trigger manual sync through backend
    await mlApi.triggerManualSync(apiKey);

    let data: any = { sensors: [], machine: { id: apiKey } };

    // If registrationInfo is provided and has fieldId, get/create sensors
    if (registrationInfo?.fieldId) {
      // Get the list of sensors for this field
      const sensorsResponse = await http.get(
        `/fields/${registrationInfo.fieldId}/sensors`
      );
      console.log('Raw sensors response:', sensorsResponse);
      console.log('Raw sensors response.data:', sensorsResponse.data);
      // Backend returns {success: true, data: [...]} or just [...]
      const responseData = sensorsResponse.data;
      console.log('Parsing sensors - responseData:', responseData);
      const existingSensors = responseData?.data || responseData || [];
      console.log('Existing sensors:', existingSensors);

      if (existingSensors.length > 0) {
        const sensorId = existingSensors[0].id || existingSensors[0]._id;
        console.log('Found sensor ID:', sensorId);
        if (sensorId) {
          try {
            const latestData = await sensorApi.getLatestData(sensorId, 10);
            console.log('Latest sensor data:', latestData);
            data = {
              sensors: latestData,
              machine: { id: apiKey },
              sensorId,
            };
          } catch (dataErr) {
            console.warn('Failed to fetch sensor data:', dataErr);
          }
        }
      } else {
        // No sensors registered yet, create one
        console.log('No sensors found, registering new sensor...');
        try {
          const newSensor = await sensorApi.createSensor(
            registrationInfo.fieldId,
            {
              name: registrationInfo.name || 'Weather Station',
              type: mapDeviceTypeToSensorType(registrationInfo.type),
              location: {
                coordinates: {
                  type: 'Point',
                  coordinates: [0, 0],
                },
              },
              unit: 'metric',
            }
          );

          const newSensorId = newSensor.id || newSensor._id;
          if (newSensorId) {
            const latestData = await sensorApi.getLatestData(newSensorId, 10);
            data = {
              sensors: latestData,
              machine: { id: apiKey },
              sensorId: newSensorId,
            };
          }
        } catch (sensorErr) {
          console.warn('Failed to register sensor:', sensorErr);
        }
      }
    }

    // The rest of the mapping logic remains to update the UI local storage
    // using the data returned from our backend.
    const sensors = data.sensors || [];
    const realSerialNumber = data.machine?.id || apiKey;

    // Helper to safely get value or default (API uses 'type' not 'name')
    const getSensorValue = (
      sensors: any[],
      type: string,
      defaultValue: string = '0'
    ) => {
      const sensor = sensors.find((s: any) => s.type === type);
      return sensor && sensor.readings && sensor.readings.length > 0
        ? String(sensor.readings[0].value)
        : '0';
    };

    const getReadings = (sensors: any[], type: string): any[] => {
      const sensor = sensors.find((s: any) => s.type === type);
      return sensor && sensor.readings ? sensor.readings : [];
    };

    // Mapping logic remains to preserve the UI structure
    const weatherCategory = {
      id: 'weather',
      name: 'Weather Sensors',
      count: 3,
      color: 'cyan',
      previewSensors: [
        {
          name: 'Rain Fall',
          value: `${getSensorValue(sensors, 'rainfall')}mm`,
        },
        {
          name: 'Wind Spd',
          value: `${getSensorValue(sensors, 'wind_speed')}m/s`,
        },
        {
          name: 'Wind Dir',
          value: `${getSensorValue(sensors, 'wind_direction')}°`,
        },
      ],
      details: [
        {
          name: 'Wind Direction',
          value: getSensorValue(sensors, 'wind_direction'),
          unit: '°',
          color: 'purple',
          status: 'Good',
          readings: getReadings(sensors, 'wind_direction'),
        },
        {
          name: 'Wind Speed',
          value: getSensorValue(sensors, 'wind_speed'),
          unit: 'm/s',
          color: 'blue',
          status: 'Good',
          readings: getReadings(sensors, 'wind_speed'),
        },
        {
          name: 'Rain Fall',
          value: getSensorValue(sensors, 'rainfall'),
          unit: 'mm',
          color: 'cyan',
          status: 'Good',
          readings: getReadings(sensors, 'rainfall'),
        },
      ],
    };

    const soilCategory = {
      id: 'soil',
      name: 'Soil Sensors',
      count: 4,
      color: 'green',
      previewSensors: [
        {
          name: 'Temp Surf',
          value: `${getSensorValue(sensors, 'soil_temperature')}°C`,
        },
        {
          name: 'Moist Surf',
          value: `${getSensorValue(sensors, 'soil_moisture_1')}%`,
        },
        {
          name: 'Temp Root',
          value: `${getSensorValue(sensors, 'soil_temperature_2')}°C`,
        },
      ],
      details: [
        {
          name: 'Soil Temperature at Surface',
          value: getSensorValue(sensors, 'soil_temperature'),
          unit: '°C',
          color: 'orange',
          status: 'Good',
          readings: getReadings(sensors, 'soil_temperature'),
        },
        {
          name: 'Soil Moisture at Surface',
          value: getSensorValue(sensors, 'soil_moisture_1'),
          unit: '%',
          color: 'blue',
          status: 'Good',
          readings: getReadings(sensors, 'soil_moisture_1'),
        },
        {
          name: 'Soil Temperature at Root',
          value: getSensorValue(sensors, 'soil_temperature_2'),
          unit: '°C',
          color: 'orange',
          status: 'Good',
          readings: getReadings(sensors, 'soil_temperature_2'),
        },
        {
          name: 'Soil Moisture at Root',
          value: getSensorValue(sensors, 'soil_moisture_2'),
          unit: '%',
          color: 'blue',
          status: 'Good',
          readings: getReadings(sensors, 'soil_moisture_2'),
        },
      ],
    };

    const airCategory = {
      id: 'air',
      name: 'Air Sensors',
      count: 10,
      color: 'blue',
      previewSensors: [
        {
          name: 'PM 2.5',
          value: `${getSensorValue(sensors, 'pm2_5')}µg`,
        },
        { name: 'CO2', value: `${getSensorValue(sensors, 'co2')}ppm` },
        { name: 'Temp', value: `${getSensorValue(sensors, 'temperature')}°C` },
      ],
      details: [
        {
          name: 'PM 2.5',
          value: getSensorValue(sensors, 'pm2_5'),
          unit: 'µg/m³',
          color: 'blue',
          status: 'Good',
          readings: getReadings(sensors, 'pm2_5'),
        },
        {
          name: 'PM 10',
          value: getSensorValue(sensors, 'pm10'),
          unit: 'µg/m³',
          color: 'cyan',
          status: 'Good',
          readings: getReadings(sensors, 'pm10'),
        },
        {
          name: 'CO2',
          value: getSensorValue(sensors, 'co2'),
          unit: 'ppm',
          color: 'gray',
          status: 'Good',
          readings: getReadings(sensors, 'co2'),
        },
        {
          name: 'Air Temperature',
          value: getSensorValue(sensors, 'temperature'),
          unit: '°C',
          color: 'orange',
          status: 'Good',
          readings: getReadings(sensors, 'temperature'),
        },
        {
          name: 'Humidity',
          value: getSensorValue(sensors, 'humidity'),
          unit: '%',
          color: 'cyan',
          status: 'Good',
          readings: getReadings(sensors, 'humidity'),
        },
        {
          name: 'Air Pressure',
          value: getSensorValue(sensors, 'pressure'),
          unit: 'hPa',
          color: 'blue',
          status: 'Good',
          readings: getReadings(sensors, 'pressure'),
        },
        {
          name: 'SOX',
          value: getSensorValue(sensors, 'so2'),
          unit: 'ppm',
          color: 'yellow',
          status: 'Good',
          readings: getReadings(sensors, 'so2'),
        },
        {
          name: 'NOX',
          value: getSensorValue(sensors, 'no2'),
          unit: 'ppm',
          color: 'orange',
          status: 'Good',
          readings: getReadings(sensors, 'no2'),
        },
        {
          name: 'O3',
          value: getSensorValue(sensors, 'o3'),
          unit: 'ppm',
          color: 'green',
          status: 'Good',
          readings: getReadings(sensors, 'o3'),
        },
        {
          name: 'Leaf Wetness',
          value: getSensorValue(sensors, 'leaf_wetness'),
          unit: '%',
          color: 'green',
          status: 'Good',
          readings: getReadings(sensors, 'leaf_wetness'),
        },
      ],
    };

    const lightCategory = {
      id: 'light',
      name: 'Light Sensors',
      count: 2,
      color: 'yellow',
      previewSensors: [
        {
          name: 'Light',
          value: `${getSensorValue(sensors, 'illuminance')} Lux`,
        },
        {
          name: 'Radiation',
          value: `${getSensorValue(sensors, 'solar_radiation')} W/m²`,
        },
      ],
      details: [
        {
          name: 'Light',
          value: getSensorValue(sensors, 'illuminance'),
          unit: 'Lux',
          color: 'orange',
          status: 'Good',
          readings: getReadings(sensors, 'illuminance'),
        },
        {
          name: 'Radiation',
          value: getSensorValue(sensors, 'solar_radiation'),
          unit: 'W/m²',
          color: 'yellow',
          status: 'Good',
          readings: getReadings(sensors, 'solar_radiation'),
        },
      ],
    };

    const mappedData = [
      weatherCategory,
      soilCategory,
      airCategory,
      lightCategory,
    ];

    let latestTimestamp = data.machine?.installed_at;
    const currentTime = new Date().toISOString();

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
        status: data.machine?.is_online ? 'Active' : 'Offline',
        serialNumber: realSerialNumber,
        apiKey: apiKey,
        sensorId: data.sensorId,
        connectedAt: new Date().toISOString(),
        lastActiveAt: latestTimestamp || currentTime,
      },
      sensorData: mappedData,
    };
  } catch (error) {
    console.error('Device connection error:', error);
    throw error;
  }
};
