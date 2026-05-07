const City = require("../models/city");
const { geocodeCity, getCurrentWeather } = require("../service/weatherService");
const {
  normalizeCityName,
  validateCityPayload,
  validateCityUpdatePayload,
} = require("../utils/validator");

const serializeCity = (city, weather) => ({
  id: city._id,
  name: city.name,
  country: city.country,
  latitude: city.latitude,
  longitude: city.longitude,
  isFavorite: city.isFavorite,
  note: city.note,
  createdAt: city.createdAt,
  updatedAt: city.updatedAt,
  weather,
});

const attachWeather = async (city) => {
  try {
    const weather = await getCurrentWeather(city);
    return serializeCity(city, weather);
  } catch (error) {
    return serializeCity(city, {
      unavailable: true,
      message: "Weather data could not be loaded right now",
    });
  }
};

const listCities = async (req, res, next) => {
  try {
    const cities = await City.find({ user: req.user.id }).sort({ isFavorite: -1, createdAt: -1 });
    const results = await Promise.all(cities.map(attachWeather));

    return res.json({ cities: results });
  } catch (error) {
    return next(error);
  }
};

const addCity = async (req, res, next) => {
  try {
    const validationError = validateCityPayload(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const location = await geocodeCity(req.body.name.trim());
    const city = await City.create({
      user: req.user.id,
      name: location.name,
      normalizedName: normalizeCityName(location.name),
      country: location.country,
      latitude: location.latitude,
      longitude: location.longitude,
      isFavorite: Boolean(req.body.isFavorite),
      note: typeof req.body.note === "string" ? req.body.note.trim() : "",
    });

    return res.status(201).json({ city: await attachWeather(city) });
  } catch (error) {
    return next(error);
  }
};

const getCity = async (req, res, next) => {
  try {
    const city = await City.findOne({ _id: req.params.id, user: req.user.id });

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    return res.json({ city: await attachWeather(city) });
  } catch (error) {
    return next(error);
  }
};

const updateCity = async (req, res, next) => {
  try {
    const validationError = validateCityUpdatePayload(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const updates = {};

    if (typeof req.body.isFavorite === "boolean") {
      updates.isFavorite = req.body.isFavorite;
    }

    if (typeof req.body.note === "string") {
      updates.note = req.body.note.trim();
    }

    const city = await City.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, updates, {
      new: true,
      runValidators: true,
    });

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    return res.json({ city: await attachWeather(city) });
  } catch (error) {
    return next(error);
  }
};

const deleteCity = async (req, res, next) => {
  try {
    const city = await City.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

const previewCity = async (req, res, next) => {
  try {
    const validationError = validateCityPayload(req.query);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const location = await geocodeCity(req.query.name.trim());
    const weather = await getCurrentWeather(location);

    return res.json({ location, weather });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  addCity,
  deleteCity,
  getCity,
  listCities,
  previewCity,
  updateCity,
};
