const crypto = require("crypto");
const mongoose = require("mongoose");

const PASSWORD_ITERATIONS = 120000;
const PASSWORD_KEY_LENGTH = 64;
const PASSWORD_DIGEST = "sha512";

const hashPassword = (password, salt = crypto.randomBytes(16).toString("hex")) => {
  const hash = crypto
    .pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST)
    .toString("hex");

  return `${salt}:${hash}`;
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 120,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.statics.hashPassword = hashPassword;

userSchema.methods.comparePassword = function comparePassword(password) {
  if (!this.passwordHash || typeof password !== "string") {
    return false;
  }

  const [salt, storedHash] = this.passwordHash.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const candidateHash = hashPassword(password, salt).split(":")[1];
  const storedBuffer = Buffer.from(storedHash, "hex");
  const candidateBuffer = Buffer.from(candidateHash, "hex");

  if (storedBuffer.length !== candidateBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(storedBuffer, candidateBuffer);
};

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
