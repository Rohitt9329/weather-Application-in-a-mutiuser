const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const weatherCodeMap = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
};

const fetchJson = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Weather provider returned ${response.status}`);
  }

  return response.json();
};

const geocodeCity = async (cityName) => {
  const params = new URLSearchParams({
    name: cityName,
    count: "1",
    language: "en",
    format: "json",
  });
  const data = await fetchJson(`${GEOCODE_URL}?${params.toString()}`);
  const result = data.results && data.results[0];

  if (!result) {
    const error = new Error("City was not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    name: result.name,
    country: result.country || "",
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
  };
};

const getCurrentWeather = async ({ latitude, longitude }) => {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
    ].join(","),
    daily: ["temperature_2m_max", "temperature_2m_min", "precipitation_probability_max"].join(","),
    timezone: "auto",
    forecast_days: "3",
  });
  const data = await fetchJson(`${FORECAST_URL}?${params.toString()}`);
  const current = data.current || {};

  return {
    temperature: current.temperature_2m,
    feelsLike: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    windDirection: current.wind_direction_10m,
    precipitation: current.precipitation,
    condition: weatherCodeMap[current.weather_code] || "Unknown",
    weatherCode: current.weather_code,
    isDay: Boolean(current.is_day),
    observedAt: current.time,
    units: data.current_units || {},
    forecast: (data.daily?.time || []).map((date, index) => ({
      date,
      high: data.daily.temperature_2m_max[index],
      low: data.daily.temperature_2m_min[index],
      rainChance: data.daily.precipitation_probability_max[index],
    })),
  };
};

module.exports = { geocodeCity, getCurrentWeather };
