const sensors = [
  {
    id: 60,
    name: 'Temp Sensor',
    type: 'Temp',
    unit: '°C',
    readings: [
      {
        value: 25.5,
        timestamp: '2026-01-24T09:26:40+00:00',
      },
    ],
  },
  {
    id: 61,
    name: 'PM2.5 Sensor',
    type: 'PM2.5',
    unit: 'µg/m³',
    readings: [
      {
        value: 20,
        timestamp: '2026-01-24T09:26:40+00:00',
      },
    ],
  },
  {
    id: 62,
    name: 'PM10 Sensor',
    type: 'PM10',
    unit: 'µg/m³',
    readings: [
      {
        value: 23,
        timestamp: '2026-01-24T09:26:40+00:00',
      },
    ],
  },
  {
    id: 63,
    name: 'Wind Speed Sensor',
    type: 'Wind Speed',
    unit: 'm/s',
    readings: [
      {
        value: 2,
        timestamp: '2026-01-24T09:26:40+00:00',
      },
    ],
  },
  {
    id: 64,
    name: 'Wind Direction Sensor',
    type: 'Wind Direction',
    unit: 'degree',
    readings: [
      {
        value: 280,
        timestamp: '2026-01-24T09:26:40+00:00',
      },
    ],
  },
  {
    id: 65,
    name: 'Humidity Sensor',
    type: 'Humidity',
    unit: '%',
    readings: [
      {
        value: 52.6,
        timestamp: '2026-01-24T09:26:40+00:00',
      },
    ],
  },
  {
    id: 66,
    name: 'SOX Sensor',
    type: 'SOX',
    unit: 'ppm',
    readings: [
      {
        value: 0.2,
        timestamp: '2026-01-24T09:26:40+00:00',
      },
    ],
  },
  {
    id: 67,
    name: 'NOX Sensor',
    type: 'NOX',
    unit: 'ppm',
    readings: [
      {
        value: 0.01,
        timestamp: '2026-01-24T09:26:40+00:00',
      },
    ],
  },
  {
    id: 68,
    name: 'Rainfall Sensor',
    type: 'Rainfall',
    unit: 'mm/h',
    readings: [
      {
        value: 12.9,
        timestamp: '2026-01-24T09:26:40+00:00',
      },
    ],
  },
  {
    id: 69,
    name: 'CO2 Sensor',
    type: 'CO2',
    unit: 'ppm',
    readings: [
      {
        value: 646,
        timestamp: '2026-01-24T09:26:40+00:00',
      },
    ],
  },
  {
    id: 70,
    name: 'SH Sensor',
    type: 'SH',
    unit: '%',
    readings: [
      {
        value: 61.31,
        timestamp: '2026-01-24T09:26:40+00:00',
      },
    ],
  },
  {
    id: 71,
    name: 'ST Sensor',
    type: 'ST',
    unit: '°C',
    readings: [
      {
        value: 24.2,
        timestamp: '2026-01-24T09:26:40+00:00',
      },
    ],
  },
  {
    id: 72,
    name: 'Light Sensor',
    type: 'Light',
    unit: 'Lux',
    readings: [
      {
        value: 730,
        timestamp: '2026-01-24T09:26:40+00:00',
      },
    ],
  },
  {
    id: 73,
    name: 'Radiation Sensor',
    type: 'Radiation',
    unit: 'W/m²',
    readings: [
      {
        value: 6,
        timestamp: '2026-01-24T09:26:40+00:00',
      },
    ],
  },
  {
    id: 74,
    name: 'Leaf Wetness Sensor',
    type: 'Leaf Wetness',
    unit: '%',
    readings: [
      {
        value: 0,
        timestamp: '2026-01-24T09:26:40+00:00',
      },
    ],
  },
  {
    id: 91,
    name: 'SHR Sensor',
    type: 'SHR',
    unit: '%',
    readings: [
      {
        value: 61.87,
        timestamp: '2026-01-24T09:26:40+00:00',
      },
    ],
  },
  {
    id: 92,
    name: 'STR Sensor',
    type: 'STR',
    unit: '°C',
    readings: [
      {
        value: 24.22,
        timestamp: '2026-01-24T09:26:40+00:00',
      },
    ],
  },
  {
    id: 93,
    name: 'Pressure Sensor',
    type: 'Pressure',
    unit: 'hPa',
    readings: [
      {
        value: 998,
        timestamp: '2026-01-24T09:26:40+00:00',
      },
    ],
  },
  {
    id: 94,
    name: 'O3 Sensor',
    type: 'O3',
    unit: 'ppm',
    readings: [
      {
        value: 0.02,
        timestamp: '2026-01-24T09:26:40+00:00',
      },
    ],
  },
];

// Logic from device.service.ts
const getSensorValue = (sensors, name, defaultValue = '0') => {
  const sensor = sensors.find((s) => s.name === name);
  return sensor && sensor.readings && sensor.readings.length > 0
    ? String(sensor.readings[0].value)
    : defaultValue;
};

// 1. Weather
const windSpeed = getSensorValue(sensors, 'Wind Speed Sensor');
const windDir = getSensorValue(sensors, 'Wind Direction Sensor');
const rainfall = getSensorValue(sensors, 'Rainfall Sensor');

console.log('--- Weather ---');
console.log('Wind Speed:', windSpeed);
console.log('Wind Direction:', windDir);
console.log('Rainfall:', rainfall);

// 2. Soil
const tempSurf = getSensorValue(sensors, 'ST Sensor');
const moistSurf = getSensorValue(sensors, 'SH Sensor');
const tempRoot = getSensorValue(sensors, 'STR Sensor');
const moistRoot = getSensorValue(sensors, 'SHR Sensor');

console.log('--- Soil ---');
console.log('ST:', tempSurf);
console.log('SH:', moistSurf);
console.log('STR:', tempRoot);
console.log('SHR:', moistRoot);

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

console.log('--- Air ---');
console.log('PM2.5:', pm25);
console.log('PM10:', pm10);
console.log('CO2:', co2);
console.log('Temp:', tempAir);
console.log('Humidity:', humidity);
console.log('Pressure:', pressure);
console.log('SOX:', sox);
console.log('NOX:', nox);
console.log('O3:', o3);
console.log('Leaf Wetness:', leafWetness);

// 4. Light
const light = getSensorValue(sensors, 'Light Sensor');
const radiation = getSensorValue(sensors, 'Radiation Sensor');

console.log('--- Light ---');
console.log('Light:', light);
console.log('Radiation:', radiation);
