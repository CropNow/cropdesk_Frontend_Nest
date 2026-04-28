const ML_API_URL = 'https://services.cropdesk.in/predict';

const payload = {
  "temperature": 25,
  "humidity": 60,
  "wind_speed": 0,
  "wind_direction": 0,
  "pressure": 0,
  "solar_radiation": 0,
  "rainfall": 0.5,
  "soil_moisture_1": 57,
  "soil_moisture_2": 0,
  "soil_temperature": 25,
  "leaf_wetness": 0,
  "pm2_5": 7,
  "no2": 0.18,
  "o3": 0.02,
  "co": 0,
  "hour": 12,
  "day": 28,
  "month": 4
};

async function test() {
  try {
    console.log("Sending payload:", payload);
    const response = await fetch(ML_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    console.log("Status:", response.status);
    if (!response.ok) {
      console.log("Error:", await response.text());
    } else {
      console.log("Success:", await response.json());
    }
  } catch (e) {
    console.error("Fetch error:", e);
  }
}

test();
