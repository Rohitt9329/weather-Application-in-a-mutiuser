const mongoose = require("mongoose");

const citySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    normalizedName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    country: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "",
    },
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 240,
      default: "",
    },
  },
  { timestamps: true }
);

citySchema.index({ user: 1, normalizedName: 1, country: 1 }, { unique: true });

module.exports = mongoose.model("City", citySchema);
