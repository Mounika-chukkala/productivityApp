const Task = require("../models/taskSchema");
const Habit = require("../models/habitSchema");

// 1. Progress chart (tasks completed per day)
const getProgressData = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user, completed: true });

    const progressMap = {};
    tasks.forEach((task) => {
      const date = new Date(task.scheduledDate).toISOString().split('T')[0];
      progressMap[date] = (progressMap[date] || 0) + 1;
    });

    const dates = Object.keys(progressMap).sort();
    const completed = dates.map(date => progressMap[date]);

    res.json({ dates, completed });
  } catch (error) {
    res.status(500).json({ message: "Error getting progress", error });
  }
};

// 2. Priority distribution pie chart
const getPriorityDistribution = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user });

    const dist = { low: 0, medium: 0, high: 0 };
    tasks.forEach(task => {
      if (task.priority) dist[task.priority]++;
    });

    res.json({
      labels: ["Low", "Medium", "High"],
      values: [dist.low, dist.medium, dist.high]
    });
  } catch (error) {
    res.status(500).json({ message: "Error getting distribution", error });
  }
};

// 3. Streak bar chart for habits
const getStreakData = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user });
    const days = habits.map(h => h.title);
    const streaks = habits.map(h => h.currentStreak || 0);

    res.json({ days, streaks });
  } catch (error) {
    res.status(500).json({ message: "Error getting streak data", error });
  }
};

// 4. Time allocation stacked bar chart
const getTimeAllocation = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user });

    const map = {}; // { date: { low, medium, high } }

    tasks.forEach((task) => {
      const date = new Date(task.scheduledDate).toISOString().split("T")[0];
      if (!map[date]) map[date] = { low: 0, medium: 0, high: 0 };
      map[date][task.priority]++;
    });

    const labels = Object.keys(map).sort();
    const categories = ["Low", "Medium", "High"];
    const times = categories.map(priority => labels.map(date => map[date][priority.toLowerCase()]));

    res.json({ labels, categories, times });
  } catch (error) {
    res.status(500).json({ message: "Error getting time allocation", error });
  }
};

// 5. Overdue vs completed bar chart
const getOverdueVsCompleted = async (req, res) => {
  try {
    const now = new Date();

    const overdueCount = await Task.countDocuments({
      user: req.user,
      scheduledDate: { $lt: now },
      completed: false
    });

    const completedCount = await Task.countDocuments({
      user: req.user,
      completed: true
    });

    res.json({
      categories: ["Overdue", "Completed"],
      values: [overdueCount, completedCount]
    });
  } catch (error) {
    res.status(500).json({ message: "Error getting overdue/completed", error });
  }
};

module.exports = {
  getProgressData,
  getPriorityDistribution,
  getStreakData,
  getTimeAllocation,
  getOverdueVsCompleted,
};
