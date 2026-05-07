const getComfortLabel = (weather) => {
  const condition = typeof weather.condition === "string" ? weather.condition.toLowerCase() : "";

  if (Number.isFinite(weather.temperature) && weather.temperature >= 32) return "hot";
  if (Number.isFinite(weather.temperature) && weather.temperature <= 8) return "cold";
  if (weather.precipitation > 0 || condition.includes("rain")) return "wet";
  if (Number.isFinite(weather.windSpeed) && weather.windSpeed >= 35) return "windy";
  return "comfortable";
};

const buildRecommendation = (city) => {
  const weather = city.weather || {};
  const label = getComfortLabel(weather);
  const tips = [];

  if (label === "hot") {
    tips.push("Plan outdoor tasks early or late and stay hydrated.");
  }

  if (label === "cold") {
    tips.push("Layer up and watch for a sharp feels-like drop.");
  }

  if (label === "wet") {
    tips.push("Carry rain protection and expect slower travel.");
  }

  if (label === "windy") {
    tips.push("Secure light outdoor items and avoid exposed routes.");
  }

  if (label === "comfortable") {
    tips.push("Good window for errands, walking, or outdoor plans.");
  }

  return {
    cityId: city.id,
    city: city.name,
    country: city.country,
    condition: weather.condition,
    temperature: weather.temperature,
    label,
    favorite: city.isFavorite,
    recommendation: tips.join(" "),
  };
};

const buildWeatherInsights = (cities) => {
  const availableCities = cities.filter(
    (city) => city.weather && !city.weather.unavailable && Number.isFinite(city.weather.temperature)
  );
  const recommendations = availableCities.map(buildRecommendation);
  const favorites = recommendations.filter((item) => item.favorite);
  const rainRisk = recommendations.filter((item) => item.label === "wet");
  const hotCities = recommendations.filter((item) => item.label === "hot");
  const summaryParts = [];

  if (favorites.length) {
    summaryParts.push(`Favorite focus: ${favorites.map((item) => item.city).join(", ")}.`);
  }

  if (rainRisk.length) {
    summaryParts.push(`Rain risk is worth watching in ${rainRisk.map((item) => item.city).join(", ")}.`);
  }

  if (hotCities.length) {
    summaryParts.push(`Heat planning matters for ${hotCities.map((item) => item.city).join(", ")}.`);
  }

  if (!summaryParts.length && availableCities.length) {
    summaryParts.push("Your saved cities look manageable right now.");
  }

  if (!availableCities.length) {
    summaryParts.push("Add a city to unlock personalized weather planning.");
  }

  return {
    agent: "Weather Planning Agent",
    purpose: "Turns live dashboard weather into practical city-by-city planning guidance.",
    summary: summaryParts.join(" "),
    recommendations,
    limitations:
      "This local agent uses deterministic weather rules. It can be upgraded to LangChain/LangGraph with the same city context.",
  };
};

module.exports = { buildWeatherInsights };
