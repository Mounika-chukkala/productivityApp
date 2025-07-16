// const { default: Habits } = require("../../frontend/src/pages/Habits");
const Habit = require("../models/habitSchema");
const User=require("../models/userSchema")
const markHabitDone = async (req, res) => {
  try {
    const habitId = req.params.id;
    const habit = await Habit.findOne({ _id: habitId, user: req.user });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const freq = habit.frequency.toLowerCase();
    const today = new Date();
    const last = habit.lastCompleted ? new Date(habit.lastCompleted) : null;

    const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() &&
                                   d1.getMonth() === d2.getMonth() &&
                                   d1.getDate() === d2.getDate();

    const isSameWeek = (d1, d2) => {
      const getWeekStart = (d) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); 
        date.setDate(diff);
        date.setHours(0,0,0,0);
        return date;
      };
      return getWeekStart(d1).getTime() === getWeekStart(d2).getTime();
    };

    const isSameMonth = (d1, d2) => d1.getFullYear() === d2.getFullYear() &&
                                    d1.getMonth() === d2.getMonth();

    if (last) {
      if (
        (freq === "daily" && isSameDay(today, last)) ||
        (freq === "weekly" && isSameWeek(today, last)) ||
        (freq === "monthly" && isSameMonth(today, last))
      ) {
        return res.status(400).json({ message: "Already marked for this period!" });
      } else {
        habit.currentStreak += 1;
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
            const { name,frequency } = req.body;
        const newHabit = new Habit({
          user: userId,
          name:name,
          frequency: frequency,
        });
        await newHabit.save();
        await User.findByIdAndUpdate( userId,
      { $push: { habits: newHabit._id } },
      { new: true })
      // console.log(newHabit,frequency)
        res
          .status(201)
          .json({ success: true, message: "Habit added", habit: newHabit });
      }
  catch (error) {
        res.status(500).json({ error: error.message });

  }

}

async function deleteHabit(req,res){
try{
  const habitId=req.params.id;
  const userId=req.user;
     const habit = await Habit.findById(habitId);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }
    if (habit.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this habit" });
    }
    await Habit.findByIdAndDelete(habitId);
await User.findByIdAndUpdate(userId,
      { $pull: { habits: habitId } },
      { new: true })
    res.status(200).json({ message: "Habit deleted successfully" });
  } catch (error) {
    console.error("Error deleting habit:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports={markHabitDone,getHabits,addHabit,deleteHabit}