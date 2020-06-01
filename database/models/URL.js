const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
  },
  key: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  opened: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const URL = mongoose.model("URL", urlSchema);

module.exports = URL;
