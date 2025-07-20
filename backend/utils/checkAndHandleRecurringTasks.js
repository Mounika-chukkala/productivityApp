// const Notification=require("../models/Notifications")
// const Task=require("../models/taskSchema")
// async function createNotification  (userId, message) { 
//   const newNotif = new Notification({
//     user: userId,
//     message,
//   });
//   await newNotif.save();
// };

// async function checkAndHandleRecurringTasks() {
//   try {
//     const now = new Date();
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const tasks = await Task.find({
//       frequency: { $in: ["weekly", "monthly"] },
//       scheduledDate: { $lte: today },
//     });

//     for (let task of tasks) {
//       if (!task.completed) {
//           await createNotification(
//     task.user._id,
//     `Your task "${task.title}" scheduled on ${task.scheduledDate.toDateString()} is still incomplete!`
//   );
//   console.log(`Notification created for task: ${task.title}`);
//       } else {
//         let newDate = new Date(task.scheduledDate);

//         if (task.frequency === "weekly") {
//           newDate.setDate(newDate.getDate() + 7);
//         } else if (task.frequency === "monthly") {
//           newDate.setMonth(newDate.getMonth() + 1);
//         }

//         // Check if endDate exists and is not passed
//         if (!task.endDate || newDate <= task.endDate) {
//           task.scheduledDate = newDate;
//           task.completed = false;
//           task.completedAt = null;
//           await task.save();
//           console.log(`Task "${task.title}" rescheduled to ${newDate}`);
//         } else {
//           // Remove if expired
//           await Task.findByIdAndDelete(task._id);
//           console.log(`Task "${task.title}" completed and removed`);
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Error handling recurring tasks:", error);
//   }
// };



// module.exports={checkAndHandleRecurringTasks}




const Notification = require("../models/Notifications");
const Task = require("../models/taskSchema");

async function createNotification(userId, message) {
  const newNotif = new Notification({
    user: userId,
    message,
  });
  await newNotif.save();
}

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

        if (!task.endDate || newDate <= task.endDate) {
          task.scheduledDate = newDate;
          task.completed = false;
          task.completedAt = null;
          await task.save();
          console.log(`Task "${task.title}" rescheduled to ${newDate}`);
        } else {
          await Task.findByIdAndDelete(task._id);
          console.log(`Task "${task.title}" completed and removed`);
        }
      }
    }

    // 👇 Add this part after recurring task check — Reminder for streak / task deadline
    const upcomingTasks = await Task.find({
      scheduledDate: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // tasks due today
      },
      completed: false,
    });

    for (let task of upcomingTasks) {
      const hoursLeft = Math.ceil(
        (task.scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60)
      );

      if (hoursLeft <= 12) {
        await createNotification(
          task.user._id,
          `Reminder: Just ${hoursLeft} hour(s) left to complete your task "${task.title}" and keep your streak alive!`
        );
        console.log(`Streak reminder sent for task: ${task.title}`);
      }
    }
  } catch (error) {
    console.error("Error handling recurring tasks:", error);
  }
}

module.exports = { checkAndHandleRecurringTasks };
