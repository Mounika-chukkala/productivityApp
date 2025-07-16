

import { useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState("today");
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledDate: "",
    endDate: "",
    priority: "medium",
    frequency: "once",
    reminderTime: "",
  });

  const user = useSelector((state) => state.user);
  const userId = user.id;
  const token = user.token;

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(res.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async () => {
    if (!formData.title || !formData.scheduledDate) {
      alert("Title and Scheduled Date are required!");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (formData.scheduledDate < today) {
      alert("Scheduled date cannot be in the past!");
      return;
    }

    if (formData.endDate && formData.endDate < formData.scheduledDate) {
      alert("End date cannot be before Scheduled date!");
      return;
    }

    if (formData.reminderTime) {
      const [hours, minutes] = formData.reminderTime.split(":");
      const dateObj = new Date(formData.scheduledDate);
      dateObj.setHours(hours);
      dateObj.setMinutes(minutes);
      formData.reminderTime = dateObj.toISOString();
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/create-task`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks([...tasks, res.data.task]);
      setShowModal(false);
      setStep(1);
      setFormData({
        title: "",
        description: "",
        scheduledDate: "",
        endDate: "",
        priority: "medium",
        frequency: "once",
        reminderTime: "",
      });
    } catch (error) {
      console.error("Error adding task", error);
    }
  };

  const toggleComplete = async (taskId, currentStatus) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/update/${taskId}`,
        { completed: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(tasks.map((t) => (t._id === taskId ? res.data.task : t)));
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error toggling task");
      console.error("Error toggling complete", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/delete/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(tasks.filter((t) => t._id !== taskId));
      toast.success("Task deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting task");
      console.error("Error deleting task", error);
    }
  };

  const todayDate = new Date().toISOString().split("T")[0];

  const filteredTasks = tasks.filter((task) => {
    if (view === "today")
      return (
        (new Date(task.scheduledDate).toISOString().split("T")[0] === todayDate && !task.completed) ||
        (new Date(task.endDate).toISOString().split("T")[0] === todayDate && !task.completed)
      );
    if (view === "upcoming")
      return new Date(task.scheduledDate) > new Date() && !task.completed;
    if (view === "completed") return task.completed;
    if (view === "weekly") return task.frequency === "weekly";
    if (view === "monthly") return task.frequency === "monthly";
    return true;
  });

  // Group by priority
  const highPriorityTasks = filteredTasks.filter((t) => t.priority === "high");
  const mediumPriorityTasks = filteredTasks.filter((t) => t.priority === "medium");
  const lowPriorityTasks = filteredTasks.filter((t) => t.priority === "low");

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-6 flex-wrap">
        {["today", "completed", "upcoming", "weekly", "monthly"].map((tab) => (
          <button
            key={tab}
            onClick={() => setView(tab)}
            className={`px-4 py-2 rounded ${
              view === tab ? "bg-[#3D550C] text-white" : "bg-[#EAEAEA] text-[#3D550C]"
            }`}
          >
            {tab === "today" && "Today"}
            {tab === "completed" && "Completed"}
            {tab === "upcoming" && "Upcoming"}
            {tab === "weekly" && "Weekly Goals"}
            {tab === "monthly" && "Monthly Goals"}
          </button>
        ))}
      </div>

      {/* Add Task */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#81B622] text-white px-6 py-2 rounded shadow hover:bg-[#3D550C] transition"
        >
          Add Task +
        </button>
      </div>

      {/* Tasks List */}
      <div>
        {highPriorityTasks.length > 0 && (
          <>
            <h3 className="text-lg font-bold text-[#3D550C] mb-2"> High Priority</h3>
            {highPriorityTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                toggleComplete={toggleComplete}
                deleteTask={deleteTask}
              />
            ))}
          </>
        )}

        {mediumPriorityTasks.length > 0 && (
          <>
            <h3 className="text-lg font-bold text-[#6B8E23] mt-4 mb-2"> Medium Priority</h3>
            {mediumPriorityTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                toggleComplete={toggleComplete}
                deleteTask={deleteTask}
              />
            ))}
          </>
        )}

        {lowPriorityTasks.length > 0 && (
          <>
            <h3 className="text-lg font-bold text-gray-500 mt-4 mb-2">💤 Low Priority</h3>
            {lowPriorityTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                toggleComplete={toggleComplete}
                deleteTask={deleteTask}
              />
            ))}
          </>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl w-[90%] max-w-lg shadow-xl relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={() => {
                  setShowModal(false);
                  setStep(1);
                  setFormData({
                    title: "",
                    description: "",
                    scheduledDate: "",
                    endDate: "",
                    priority: "medium",
                    frequency: "once",
                    reminderTime: "",
                  });
                }}
                className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl font-bold"
              >
                &times;
              </button>

              {step === 1 && (
                <div>
                  <h2 className="text-lg font-bold mb-2 text-[#3D550C]">Step 1: Basic Info</h2>
                  <input
                    type="text"
                    placeholder="Title *"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <textarea
                    rows={3}
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 mb-2 border rounded"
                  />
                </div>
              )}
              {step === 2 && (
                <div>
                  <h2 className="text-lg font-bold mb-2 text-[#3D550C]">Step 2: Dates</h2>
                  <h5 className="text-sm">Scheduled Date:</h5>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    min={todayDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <h5 className="text-sm">End Date:</h5>
                  <input
                    type="date"
                    min={formData.scheduledDate || todayDate}
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full p-2 mb-2 border rounded"
                  />
                </div>
              )}
              {step === 3 && (
                <div>
                  <h2 className="text-lg font-bold mb-2 text-[#3D550C]">Step 3: Priority & Frequency</h2>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full p-2 mb-2 border rounded"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full p-2 mb-2 border rounded"
                  >
                    <option value="once">Once</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}
              {step === 4 && (
                <div>
                  <h2 className="text-lg font-bold mb-2 text-[#3D550C]">Step 4: Reminder</h2>
                  <input
                    type="time"
                    value={formData.reminderTime}
                    onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                    className="w-full p-2 mb-2 border rounded"
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  disabled={step === 1}
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                {step < 4 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="px-4 py-2 bg-[#3D550C] text-white rounded"
                  >
                    Next
                  </button>
                ) : (
                  <button onClick={handleSubmit} className="px-4 py-2 bg-[#81B622] text-white rounded">
                    Submit
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TaskCard = ({ task, toggleComplete, deleteTask }) => (
  <div
    className="flex justify-between items-center drop-shadow-lg px-2 py-3 hover:bg-gray-50 transition"
  >
    <div className="flex-1">
      <h3 className="text-base font-medium text-gray-800">{task.title}</h3>
      <p className="text-sm text-gray-500">{task.description}</p>
      <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-1">
        <span>
          🎯 {new Date(task.scheduledDate).toLocaleDateString()} -{" "}
          {new Date(task.endDate).toLocaleDateString()}
        </span>
        <span>🚨 {task.priority}</span>
        <span>🔁 {task.frequency}</span>
      </div>
    </div>
    <div className="flex gap-2 ml-4">
      <button
        onClick={() => toggleComplete(task._id, task.completed)}
        className={`px-3 py-1 rounded-md text-xs font-medium transition border ${
          task.completed
            ? "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
            : "bg-[#6B8E23] text-white border-[#6B8E23] hover:bg-[#5e7c1d]"
        }`}
      >
        {task.completed ? "Undo" : "Done"}
      </button>
      <button
        onClick={() => deleteTask(task._id)}
        className="px-3 py-1 rounded-md text-xs font-medium transition border bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
      >
        Delete
      </button>
    </div>
  </div>
);

export default Tasks;
