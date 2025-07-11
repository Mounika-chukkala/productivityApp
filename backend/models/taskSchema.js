const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  frequency: {
    type: String,
    enum: ["once", "daily", "weekly", "monthly"],
    default: "once",
  },  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  endDate: {
    type: Date,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  reminderTime: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
