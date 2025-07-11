const Habit = require("../models/Habit");

const markHabitDone = async (req, res) => {
  try {
    const habitId = req.params.id;
    const habit = await Habit.findOne({ _id: habitId, user: req.user._id });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const last = habit.lastCompleted;
    if (last) {
      const lastDate = new Date(last);
      lastDate.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      if (lastDate.getTime() === today.getTime()) {
        return res.status(400).json({ message: "Habit already marked today!" });
      } else if (lastDate.getTime() === yesterday.getTime()) {
        habit.currentStreak += 1;
      } else {
        habit.currentStreak = 1; // missed days, reset
      }
    } else {
      habit.currentStreak = 1;
    }

    habit.lastCompleted = today;
    await habit.save();

    res.status(200).json({ message: "Habit marked as done!", habit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
