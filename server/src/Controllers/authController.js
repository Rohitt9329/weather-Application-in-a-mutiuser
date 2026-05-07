const User = require("../models/user");
const { signToken } = require("../utils/token");
const { validateLoginPayload, validateRegisterPayload } = require("../utils/validator");

const buildAuthResponse = (user) => ({
  user: user.toSafeJSON(),
  token: signToken({ sub: user._id.toString() }),
});

const register = async (req, res, next) => {
  try {
    const validationError = validateRegisterPayload(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const { name, email, password } = req.body;
    const exists = await User.exists({ email: email.toLowerCase().trim() });

    if (exists) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: User.hashPassword(password),
    });

    return res.status(201).json(buildAuthResponse(user));
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const validationError = validateLoginPayload(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+passwordHash");

    if (!user || !user.comparePassword(password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json(buildAuthResponse(user));
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res) => {
  return res.json({ user: req.user });
};

module.exports = { login, me, register };
