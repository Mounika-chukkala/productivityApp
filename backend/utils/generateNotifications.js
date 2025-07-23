// utils/generateNotifications.js
const Notification = require('../models/Notification');
const Task = require('../models/Task');
const Habit = require('../models/Habit');

async function generateNotifications(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tasks = await Task.find({ user: userId, scheduledDate: { $lte: today } });

  for (const task of tasks) {
    await Notification.findOneAndUpdate(
      { user: userId, message: `Complete your task: ${task.title}` },
      {},
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const habits = await Habit.find({ user: userId });
  for (const habit of habits) {
    const todayDate = new Date().toISOString().split('T')[0];
    if (!habit.trackedDates.includes(todayDate)) {
      await Notification.findOneAndUpdate(
        { user: userId, message: `You forgot to mark habit: ${habit.title} today` },
        {},
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
  }
}

module.exports = generateNotifications;
