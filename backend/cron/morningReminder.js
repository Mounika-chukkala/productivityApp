const cron = require("node-cron");
const Habit = require("../models/habitSchema");
const Notification = require("../models/Notification");

// Runs every day at 9:00 AM
const  scheduleMorningCheck=()=>{
cron.schedule("0 9 * * *", async () => {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const habits = await Habit.find({ scheduledDate: today });

  for (const habit of habits) {
    await Notification.create({
      user: habit.user,
      message: `Reminder: Don't forget to complete "${habit.title}" today!`,
    });
  }

  console.log("✅ Daily reminders sent");
});

}

module.exports=scheduleMorningCheck