const cron = require("node-cron");
const Habit = require("../models/habitSchema");
const Notification = require("../models/Notification");
const mongoose = require("mongoose");

const scheduleMissedHabitCheck = () => {
  cron.schedule("0 22 * * *", async () => {
    console.log("🔁 Running Missed Habit Check...");

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const habits = await Habit.find({});

      for (const habit of habits) {
        const hasMarkedToday = habit.streaks.some(
          (entry) => new Date(entry.date).toDateString() === today.toDateString()
        );

        if (!hasMarkedToday) {
          await Notification.create({
            user: habit.user,
            message: `You missed your habit "${habit.title}" today. Don't forget tomorrow!`,
            type: "missed",
          });
        }
      }
    } catch (err) {
      console.error("🚨 Error in missed habit check:", err);
    }
  });
};

module.exports = scheduleMissedHabitCheck;
