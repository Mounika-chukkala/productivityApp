// const { default: Habits } = require("../../frontend/src/pages/Habits");
const Habit = require("../models/habitSchema");
const User=require("../models/userSchema")
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

async function getHabits(req,res){
const userId=req.user;
try {
 const habits = await Habit.find({ user: userId });
    res
      .status(201)
      .json({
        success: true,
        message: "habits fetched successfully",
        habits: habits,
      });} catch (error) {
    res.status(500).json({ error: error.message });
  
}
}

async function addHabit(req,res){
  try {
    const userId=req.user;
            const { title,frequency      } = req.body;
        const newHabit = new Task({
          user: userId,
          name:title,
          frequency: frequency || "Daily",
        });
        await newHabit.save();
        await User.findByIdAndUpdate(  )
        res
          .status(201)
          .json({ success: true, message: "Habit added", habit: newHabit });
      }
  catch (error) {
        res.status(500).json({ error: error.message });

  }

}

module.exports={markHabitDone,getHabits,addHabit}