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

export const updateDevice = async (
  fieldId: string,
  sensorId: string,
  deviceData: any
) => {
  try {
    const payload = {
      name: deviceData.name,
      type: mapDeviceTypeToSensorType(deviceData.type),
      status: deviceData.status,
      manufacturer: deviceData.manufacturer,
      model: deviceData.model,
      firmwareVersion: deviceData.firmwareVersion,
    };
    const response = await sensorApi.updateSensor(sensorId, payload);
    return response;
  } catch (error: any) {
    console.error(
      'Device update failed:',
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
    // Extract actual data array from envelope { success: true, data: [...] }
    return response.data?.data || response.data || [];
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
  // Allow both the GGESPL API Key AND the specific machine serial number
  const isValidSerial =
    apiKey === VALID_SERIAL_NUMBER || apiKey === 'WMS_D093F9';

  if (!isValidSerial) {
    throw new Error(
      'Invalid User API Key or Serial Number. Connection Refused.'
    );
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
        // Fetch latest data from ALL sensors to ensure we catch all metrics
        const allLatestData: any[] = [];
        for (const sensor of existingSensors) {
          const sid = sensor.id || sensor._id;
          if (sid) {
            try {
              const latest = await sensorApi.getLatestData(sid, 50);
              // Tag each reading with the sensor ID just in case
              const tagged = latest.map((l: any) => ({
                ...l,
                _sourceSensorId: sid,
              }));
              allLatestData.push(...tagged);
            } catch (err) {
              console.warn(`Failed to fetch data for sensor ${sid}:`, err);
            }
          }
        }

        data = {
          sensors: allLatestData,
          machine: { id: apiKey },
          sensorId: existingSensors[0].id || existingSensors[0]._id, // Default ID for historical calls
          allSensors: existingSensors,
        };
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
            const latestData = await sensorApi.getLatestData(newSensorId, 50);
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
    const sensors = (data.sensors || []).sort(
      (a: any, b: any) =>
        new Date(b.timestamp || 0).getTime() -
        new Date(a.timestamp || 0).getTime()
    );
    const realSerialNumber = data.machine?.id || apiKey;

    // Helper to safely get value or default (Ultra Robust)
    const getSensorValue = (
      sensors: any[],
      metricKey: string,
      defaultValue: string = '0'
    ) => {
      if (!sensors || sensors.length === 0) return defaultValue;

      const lowerKey = metricKey.toLowerCase();

      // 1. Search for a point dedicated to this metric (e.g. { metric: 'temp', value: 25 })
      const reading = sensors.find((s: any) => {
        const smetric = String(s.metric || s.type || '').toLowerCase();
        return smetric === lowerKey || smetric === lowerKey.replace(/_/g, ' ');
      });

      if (reading) {
        if (reading.value !== undefined) return String(reading.value);
        if (reading.val !== undefined) return String(reading.val);
        if (reading.readings && reading.readings.length > 0)
          return String(reading.readings[0].value);
      }

      // 2. Search for a multi-field object that contains this key (e.g. { temp: 25, wind: 10 })
      // OR search inside the 'values' object (New backend format)
      const multiFieldReading = sensors.find((s: any) => {
        // Check top-level keys
        const hasTopLevel = Object.keys(s).some(
          (k) => k.toLowerCase() === lowerKey
        );
        if (hasTopLevel) return true;

        // Check inside 'values' if it exists
        if (s.values && typeof s.values === 'object') {
          return Object.keys(s.values).some(
            (k) => k.toLowerCase() === lowerKey
          );
        }
        return false;
      });

      if (multiFieldReading) {
        // Try top-level first
        const topLevelKey = Object.keys(multiFieldReading).find(
          (k) => k.toLowerCase() === lowerKey
        );
        if (topLevelKey) return String(multiFieldReading[topLevelKey]);

        // Try inside 'values'
        if (multiFieldReading.values) {
          const valuesKey = Object.keys(multiFieldReading.values).find(
            (k) => k.toLowerCase() === lowerKey
          );
          if (valuesKey) return String(multiFieldReading.values[valuesKey]);
        }
      }

      return defaultValue;
    };

    const getReadings = (sensors: any[], metricKey: string): any[] => {
      if (!sensors || sensors.length === 0) return [];
      const lowerKey = metricKey.toLowerCase();

      // Find all entries that have this metric
      const matching = sensors.filter((s: any) => {
        const smetric = String(s.metric || s.type || '').toLowerCase();
        const hasTopLevel = Object.keys(s).some(
          (k) => k.toLowerCase() === lowerKey
        );
        const hasInValues =
          s.values &&
          typeof s.values === 'object' &&
          Object.keys(s.values).some((k) => k.toLowerCase() === lowerKey);
        return (
          smetric === lowerKey ||
          smetric === lowerKey.replace(/_/g, ' ') ||
          hasTopLevel ||
          hasInValues
        );
      });

      // Map to standardized { value, timestamp }
      return matching.map((s: any) => {
        let val = s.value !== undefined ? s.value : s.val;

        // Check top level
        if (val === undefined) {
          const actualKey = Object.keys(s).find(
            (k) => k.toLowerCase() === lowerKey
          );
          if (actualKey) val = s[actualKey];
        }

        // Check inside 'values'
        if (val === undefined && s.values) {
          const valuesKey = Object.keys(s.values).find(
            (k) => k.toLowerCase() === lowerKey
          );
          if (valuesKey) val = s.values[valuesKey];
        }

        return {
          value: parseFloat(String(val || 0)),
          timestamp:
            s.timestamp ||
            (s.readings && s.readings.length > 0
              ? s.readings[0].timestamp
              : new Date().toISOString()),
        };
      });
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
          name: 'Nitrogen',
          value: `${getSensorValue(sensors, 'nitrogen')} mg/kg`,
        },
        {
          name: 'Phosphorus',
          value: `${getSensorValue(sensors, 'phosphorus')} mg/kg`,
        },
        {
          name: 'Potassium',
          value: `${getSensorValue(sensors, 'potassium')} mg/kg`,
        },
      ],
      details: [
        {
          name: 'Nitrogen',
          value: getSensorValue(sensors, 'nitrogen'),
          unit: 'mg/kg',
          color: 'green',
          status: 'Good',
          readings: getReadings(sensors, 'nitrogen'),
        },
        {
          name: 'Phosphorus',
          value: getSensorValue(sensors, 'phosphorus'),
          unit: 'mg/kg',
          color: 'blue',
          status: 'Good',
          readings: getReadings(sensors, 'phosphorus'),
        },
        {
          name: 'Potassium',
          value: getSensorValue(sensors, 'potassium'),
          unit: 'mg/kg',
          color: 'orange',
          status: 'Good',
          readings: getReadings(sensors, 'potassium'),
        },
        {
          name: 'pH Level',
          value: getSensorValue(sensors, 'ph'),
          unit: 'pH',
          color: 'purple',
          status: 'Good',
          readings: getReadings(sensors, 'ph'),
        },
        {
          name: 'Organic Carbon',
          value: getSensorValue(sensors, 'organic_carbon'),
          unit: '%',
          color: 'amber',
          status: 'Good',
          readings: getReadings(sensors, 'organic_carbon'),
        },
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
        const readingTime =
          s.timestamp ||
          (s.readings && s.readings.length > 0
            ? s.readings[0].timestamp
            : null);

        if (
          readingTime &&
          (!latestTimestamp ||
            new Date(readingTime) > new Date(latestTimestamp))
        ) {
          latestTimestamp = readingTime;
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

/**
 * Historical Data and Export Integrations
 */

const METRIC_MAP: Record<string, string> = {
  // Weather
  'Rain Fall': 'rainfall',
  'Wind Speed': 'wind_speed',
  'Wind Direction': 'wind_direction',
  Humidity: 'humidity',
  'Air Temperature': 'temperature',
  'Air Pressure': 'pressure',
  Temperature: 'temperature',

  // Air Quality
  'PM 2.5': 'pm2_5',
  'PM 10': 'pm10',
  CO2: 'co2',
  SOX: 'so2',
  NOX: 'no2',
  O3: 'o3',

  // Soil
  'Soil Temperature at Surface': 'soil_temperature',
  'Soil Moisture at Surface': 'soil_moisture_1',
  'Soil Temperature at Root': 'soil_temperature_2',
  'Soil Moisture at Root': 'soil_moisture_2',
  'Leaf Wetness': 'leaf_wetness',
  Nitrogen: 'nitrogen',
  Phosphorus: 'phosphorus',
  Potassium: 'potassium',
  'pH Level': 'ph',
  'Organic Carbon': 'organic_carbon',

  // Light
  Light: 'illuminance',
  Radiation: 'solar_radiation',
};

/**
 * Fetch aggregated historical data for a sensor
 */
export const getHistoricalData = async (
  sensorId: string,
  uiMetricName: string,
  rangeLabel: string
) => {
  try {
    const metric =
      METRIC_MAP[uiMetricName] || uiMetricName.toLowerCase().replace(/ /g, '_');

    // Map range label (e.g. "7 Days", "1 Month") to API range (7d, 30d, 1m)
    let range = '7d';
    if (rangeLabel.includes('24 Hours')) range = '1d';
    else if (rangeLabel.includes('7 Days')) range = '7d';
    else if (rangeLabel.includes('7 Weeks')) range = '49d';
    else if (rangeLabel.includes('1 Month')) range = '1m';
    else if (rangeLabel.includes('30 Days')) range = '30d';

    const aggregation = range === '1d' ? 'hour' : 'day';

    return await sensorApi.getAggregatedData(
      sensorId,
      metric,
      range,
      aggregation
    );
  } catch (error) {
    console.error(
      `Failed to fetch historical data for ${uiMetricName}:`,
      error
    );
    return [];
  }
};

/**
 * Export sensor data as CSV or JSON
 */
export const downloadSensorData = async (
  sensorId: string,
  startDate: string,
  endDate: string,
  format: 'csv' | 'json' = 'json'
) => {
  try {
    const data = await sensorApi.exportData(
      sensorId,
      startDate,
      endDate,
      format
    );

    if (format === 'csv') {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `sensor_data_${sensorId}_${new Date().toISOString().split('T')[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const dataStr =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(data));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute(
        'download',
        `sensor_data_${sensorId}.json`
      );
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }
    return true;
  } catch (error) {
    console.error('Failed to export sensor data:', error);
    throw error;
  }
};
