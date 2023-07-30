const mongoose = require("mongoose");
const { historyUID } = require("../utils/randomSecureKey");

const projectHistorySchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      default: () => historyUID(),
    },
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    developer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "developers",
      required: true,
    },
  },
);

const projectHistoryModel = mongoose.model("projectHistory", projectHistorySchema);

module.exports = projectHistoryModel;
