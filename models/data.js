const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    data: {
      type: String,
      required: true,
    },
    // shortUrl: {
    //   type: String,
    //   required: true,
    // },
    expiryDate: {
      type: String,
      required: true,
    },
    isEncrypted: {
      type: Boolean,
      default: false,
    },
    accessLogs: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Data", dataSchema);
