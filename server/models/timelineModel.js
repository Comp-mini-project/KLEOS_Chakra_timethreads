const mongoose = require("mongoose");

const timelineSchema = new mongoose.Schema(
  {},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Timeline", timelineSchema);
