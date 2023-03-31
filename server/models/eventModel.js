const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);
