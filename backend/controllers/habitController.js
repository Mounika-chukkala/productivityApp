const Habit = require("../models/habitSchema");
const User=require("../models/userSchema")
const Notification=require("../models/Notification")
// const markHabitDone = async (req, res) => {
//   try {
//     const habitId = req.params.id;
//     const habit = await Habit.findOne({ _id: habitId, user: req.user });

//     if (!habit) {
//       return res.status(404).json({ message: "Habit not found" });
//     }

//     const freq = habit.frequency.toLowerCase();
//     const today = new Date();
//     const last = habit.lastCompleted ? new Date(habit.lastCompleted) : null;

//     const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() &&
//                                    d1.getMonth() === d2.getMonth() &&
//                                    d1.getDate() === d2.getDate();

//     const isYesterday = (d1, d2) => {
//       const yesterday = new Date(d2);
//       yesterday.setDate(yesterday.getDate() - 1);
//       return isSameDay(d1, yesterday);
//     };

//     const isLastWeek = (d1, d2) => {
//       const getWeekStart = (d) => {
//         const date = new Date(d);
//         const day = date.getDay();
//         const diff = date.getDate() - day + (day === 0 ? -6 : 1); 
//         date.setDate(diff);
//         date.setHours(0,0,0,0);
//         return date;
//       };
//       const currentWeekStart = getWeekStart(d2);
//       const lastWeekStart = new Date(currentWeekStart);
//       lastWeekStart.setDate(lastWeekStart.getDate() - 7);
//       return getWeekStart(d1).getTime() === lastWeekStart.getTime();
//     };

//     const isLastMonth = (d1, d2) => {
//       const prevMonth = new Date(d2.getFullYear(), d2.getMonth() - 1, 1);
//       return d1.getFullYear() === prevMonth.getFullYear() &&
//              d1.getMonth() === prevMonth.getMonth();
//     };

//     if (last) {
//       if (
//         (freq === "daily" && isSameDay(today, last)) ||
//         (freq === "weekly" && isSameWeek(today, last)) ||
//         (freq === "monthly" && isSameMonth(today, last))
//       ) {
//         return res.status(400).json({ message: "Already marked for this period!" });
//       }

//       const missed = (
//         (freq === "daily" && !isYesterday(last, today)) ||
//         (freq === "weekly" && !isLastWeek(last, today)) ||
//         (freq === "monthly" && !isLastMonth(last, today))
//       );

//       if (missed) {
//         habit.currentStreak = 1; // they’re starting over today
//       } else {
//         habit.currentStreak += 1;
//       }

//     } else {
//       habit.currentStreak = 1;
//     }

//     habit.lastCompleted = today;
//     await habit.save();
// await Notification.create({
//   user: req.user,
//   message: `🎉 You completed "${habit.name}" for now! Great job!`,
// });

//     res.status(200).json({ message: "Habit marked as done!", habit });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const isSameDay = (d1, d2) => (
  d1.getDate() === d2.getDate() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getFullYear() === d2.getFullYear()
);

const isYesterday = (d1, d2) => {
  const yesterday = new Date(d2);
  yesterday.setDate(d2.getDate() - 1);
  return isSameDay(d1, yesterday);
};

const getWeekStart = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
};

const isSameWeek = (d1, d2) => (
  getWeekStart(d1).getTime() === getWeekStart(d2).getTime()
);

const isSameMonth = (d1, d2) => (
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth()
);

const isLastWeek = (d1, d2) => {
  const lastWeek = new Date(d2);
  lastWeek.setDate(lastWeek.getDate() - 7);
  return isSameWeek(d1, lastWeek);
};

const isLastMonth = (d1, d2) => {
  const lastMonth = new Date(d2);
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  return isSameMonth(d1, lastMonth);
};

// ---------- MAIN CONTROLLER ----------

const markHabitDone = async (req, res) => {
  try {
    const habitId = req.params.id;
    const habit = await Habit.findById(habitId);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const now = new Date();
    const lastDone = habit.lastDone ? new Date(habit.lastDone) : null;

    let alreadyMarked = false;

    switch (habit.frequency) {
      case "daily":
        alreadyMarked = lastDone && isSameDay(lastDone, now);
        break;
      case "weekly":
        alreadyMarked = lastDone && isSameWeek(lastDone, now);
        break;
      case "monthly":
        alreadyMarked = lastDone && isSameMonth(lastDone, now);
        break;
    }

    if (alreadyMarked) {
      return res.status(400).json({ message: "Habit already marked for this period" });
    }

    // --- Handle streak update ---
    if (!lastDone) {
      habit.streak = 1;
    } else {
      const isPrevPeriod =
        (habit.frequency === "daily" && isYesterday(lastDone, now)) ||
        (habit.frequency === "weekly" && isLastWeek(lastDone, now)) ||
        (habit.frequency === "monthly" && isLastMonth(lastDone, now));

      if (isPrevPeriod) {
        habit.streak += 1;
      } else {
        habit.streak = 1;
      }
    }

    habit.lastDone = now;
    await habit.save();

    await Notification.create({
      user: req.user,
      message: `🎉 You completed "${habit.name}" for now! Great job!`,
    });

    res.status(200).json({ message: "Habit marked as done", habit });
  } catch (error) {
    console.error("Error marking habit done:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

async function getHabits(req, res) {
  const userId = req.user;
  try {
    const habits = await Habit.find({ user: userId });

    const today = new Date();

    const isSameDay = (d1, d2) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    const isYesterday = (d1, d2) => {
      const yesterday = new Date(d2);
      yesterday.setDate(yesterday.getDate() - 1);
      return isSameDay(d1, yesterday);
    };

    const isLastWeek = (d1, d2) => {
      const getWeekStart = (d) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        date.setDate(diff);
        date.setHours(0, 0, 0, 0);
        return date;
      };
      const currentWeekStart = getWeekStart(d2);
      const lastWeekStart = new Date(currentWeekStart);
      lastWeekStart.setDate(lastWeekStart.getDate() - 7);
      return getWeekStart(d1).getTime() === lastWeekStart.getTime();
    };

    const isLastMonth = (d1, d2) => {
      const prevMonth = new Date(d2.getFullYear(), d2.getMonth() - 1, 1);
      return (
        d1.getFullYear() === prevMonth.getFullYear() &&
        d1.getMonth() === prevMonth.getMonth()
      );
    };

    for (const habit of habits) {
      const freq = habit.frequency.toLowerCase();
      const last = habit.lastCompleted ? new Date(habit.lastCompleted) : null;

      if (last) {
        let missed = false;

        if (freq === "daily") {
          if (!isSameDay(last, today) && !isYesterday(last, today)) missed = true;
        } else if (freq === "weekly") {
          const getWeekStart = (d) => {
            const date = new Date(d);
            const day = date.getDay();
            const diff = date.getDate() - day + (day === 0 ? -6 : 1);
            date.setDate(diff);
            date.setHours(0, 0, 0, 0);
            return date;
          };
          const thisWeek = getWeekStart(today).getTime();
          const lastWeek = getWeekStart(last).getTime();
          if (thisWeek !== lastWeek && !isLastWeek(last, today)) missed = true;
        } else if (freq === "monthly") {
          if (
            last.getFullYear() !== today.getFullYear() ||
            last.getMonth() !== today.getMonth()
          ) {
            if (!isLastMonth(last, today)) missed = true;
          }
        }

        if (missed) {
          habit.currentStreak = 0;
          await habit.save(); 
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "habits fetched successfully",
      habits: habits,
    });
  } catch (error) {
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
      await Notification.create({
  user: userId,
  message: `New habit "${newHabit.name}" added to your tracker.`,
});

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