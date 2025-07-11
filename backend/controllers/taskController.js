const Task = require("../models/taskSchema");
async function taskCreation(req, res) {
  try {
    const userId = req.user;
    const { title,
      description,
      scheduledDate,
      reminderTime,
      frequency,
      endDate,
      priority,  } = req.body;
    const newTask = new Task({
      user: userId,
      title,
      description,
      scheduledDate,
      priority:priority||"medium",
            reminderTime,
      frequency: frequency || "once",
      endDate,
    });
    await newTask.save();
    res
      .status(201)
      .json({ success: true, message: "Task created", task: newTask });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function getTasks(req, res) {
  try {
    const userId = req.params.userId;
    const myTasks = await Task.find({ user: userId });
    res
      .status(201)
      .json({
        success: true,
        message: "Tasks fetched successfully",
        tasks: myTasks,
      });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function updateTask(req, res) {
  try {
    const userId = req.user;
    const taskId = req.params.taskId;
    let task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

        const { title,
      description,
      scheduledDate,
      reminderTime,
      frequency,
      endDate,
      priority } = req.body;
task.title=title || task.title;
task.description = description||task.description;
task.reminderTime=reminderTime|| task.reminderTime;
task.frequency=frequency||task.frequency;
task.endDate=endDate|| task.endDate;

task.scheduledDate = scheduledDate || task.scheduledDate;
 task.priority = priority || task.priority;
 task.completed = completed || task.completed;

 await task.save();

     res.status(200).json({ message: "Task updated", task });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function deleteTask(req,res){
    try {
        const taskId=req.params.id;
        const userId=req.user;
        const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
        if (!task) {
            return res.status(404).json({ message: "Task not found or not authorized" });
    }
        res.status(200).json({ message: "Task deleted" });

    } catch (error) {
            return res.status(500).json({
      message: error.message,
    });

    }
}

module.exports = {
  taskCreation,
  getTasks,updateTask,deleteTask,
};
