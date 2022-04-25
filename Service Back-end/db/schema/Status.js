const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema(
  {
    data: {
      type: String,
      required: true,
      trim: true,
    },
    error_code: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  { strict: false, timestamps: true }
);

module.exports =
  mongoose.models.Status || mongoose.model("Status", StatusSchema);
