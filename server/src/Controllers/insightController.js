const City = require("../models/city");
const { buildWeatherInsights } = require("../service/insightService");
const { getCurrentWeather } = require("../service/weatherService");

const getInsights = async (req, res, next) => {
  try {
    const cities = await City.find({ user: req.user.id }).sort({ isFavorite: -1, createdAt: -1 });
    const enrichedCities = await Promise.all(
      cities.map(async (city) => {
        try {
          return {
            id: city._id,
            name: city.name,
            country: city.country,
            isFavorite: city.isFavorite,
            weather: await getCurrentWeather(city),
          };
        } catch (error) {
          return {
            id: city._id,
            name: city.name,
            country: city.country,
            isFavorite: city.isFavorite,
            weather: { unavailable: true },
          };
        }
      })
    );

    return res.json({ insights: buildWeatherInsights(enrichedCities) });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getInsights };
