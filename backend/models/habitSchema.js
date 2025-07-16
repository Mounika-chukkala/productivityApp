const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: "User",
      required: true },
  name: {
     type: String, 
     required: true }, 
  currentStreak: {
     type: Number,
      default: 0 },
  lastCompleted: {
     type: Date, 
     default: null },
  createdAt: {
     type: Date,
      default: Date.now },
});

module.exports = mongoose.model("Habit", habitSchema);
