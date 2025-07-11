const mongoose = require("mongoose");
const streakSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  currentCount: {
    type: Number,
    default: 0,
  },
  bestCount: {
    type: Number,
    default: 0,
  },
  lastCompletedDate: {
    type: Date,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model("Streak", streakSchema);
