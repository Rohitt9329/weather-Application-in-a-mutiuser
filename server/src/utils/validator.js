const isString = (value) => typeof value === "string";
const isEmail = (value) => isString(value) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const normalizeCityName = (value) => value.trim().replace(/\s+/g, " ").toLowerCase();

const validateRegisterPayload = ({ name, email, password } = {}) => {
  if (!isString(name) || name.trim().length < 2) {
    return "Name must be at least 2 characters";
  }

  if (!email || !isEmail(email)) {
    return "A valid email is required";
  }

  if (!isString(password) || password.length < 8) {
    return "Password must be at least 8 characters";
  }

  return null;
};

const validateLoginPayload = ({ email, password } = {}) => {
  if (!isEmail(email) || !isString(password) || !password) {
    return "Email and password are required";
  }

  return null;
};

const validateCityPayload = ({ name } = {}) => {
  if (!isString(name) || name.trim().length < 2) {
    return "City name must be at least 2 characters";
  }

  return null;
};

const validateCityUpdatePayload = ({ isFavorite, note } = {}) => {
  if (isFavorite !== undefined && typeof isFavorite !== "boolean") {
    return "isFavorite must be true or false";
  }

  if (note !== undefined) {
    if (!isString(note)) {
      return "Note must be text";
    }

    if (note.length > 240) {
      return "Note must be 240 characters or less";
    }
  }

  if (isFavorite === undefined && note === undefined) {
    return "At least one field is required";
  }

  return null;
};

module.exports = {
  normalizeCityName,
  validateCityPayload,
  validateCityUpdatePayload,
  validateLoginPayload,
  validateRegisterPayload,
};
