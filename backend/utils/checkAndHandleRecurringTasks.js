const Notification=require("../models/Notifications")
const Task=require("../models/taskSchema")
async function createNotification  (userId, message) { 
  const newNotif = new Notification({
    user: userId,
    message,
  });
  await newNotif.save();
};

async function checkAndHandleRecurringTasks() {
  try {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tasks = await Task.find({
      frequency: { $in: ["weekly", "monthly"] },
      scheduledDate: { $lte: today },
    });

    for (let task of tasks) {
      if (!task.completed) {
          await createNotification(
    task.user._id,
    `Your task "${task.title}" scheduled on ${task.scheduledDate.toDateString()} is still incomplete!`
  );
  console.log(`Notification created for task: ${task.title}`);
      } else {
        let newDate = new Date(task.scheduledDate);

        if (task.frequency === "weekly") {
          newDate.setDate(newDate.getDate() + 7);
        } else if (task.frequency === "monthly") {
          newDate.setMonth(newDate.getMonth() + 1);
        }

        // Check if endDate exists and is not passed
        if (!task.endDate || newDate <= task.endDate) {
          task.scheduledDate = newDate;
          task.completed = false;
          task.completedAt = null;
          await task.save();
          console.log(`Task "${task.title}" rescheduled to ${newDate}`);
        } else {
          // Remove if expired
          await Task.findByIdAndDelete(task._id);
          console.log(`Task "${task.title}" completed and removed`);
        }
      }
    }
  } catch (error) {
    console.error("Error handling recurring tasks:", error);
  }
};



module.exports={checkAndHandleRecurringTasks}