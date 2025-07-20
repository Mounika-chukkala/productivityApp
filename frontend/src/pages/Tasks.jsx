import { useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {Trash } from "lucide-react";
import AddTaskModal from "./AddTaskModal";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState("today");
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ title: "", description: "", scheduledDate: "", endDate: "", priority: "medium", frequency: "once", reminderTime: "" });

  const user = useSelector(state => state.user);
  const token = user.token;
  const userId = user.id;
  const todayDate = new Date().toISOString().split("T")[0];

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
      setTasks(res.data.tasks);
    } catch (e) { console.error(e); }
  };
  useEffect(()=>fetchTasks
    , []);
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
  const groupedTasks = (priority) => filterTasks().filter(t => t.priority === priority);

  function filterTasks() {
    return tasks.filter(task => {
      const sd = new Date(task.scheduledDate).toISOString().split("T")[0];
      const ed = new Date(task.endDate).toISOString().split("T")[0];
      if (view === "today") return ((sd === todayDate || ed === todayDate) && !task.completed);
      if (view === "upcoming") return (new Date(task.scheduledDate) > new Date() && !task.completed);
      if (view === "completed") return task.completed;
      if (view === "weekly") return task.frequency === "weekly";
      if (view === "monthly") return task.frequency === "monthly";
      return true;
    }).sort((a,b) => ["high","medium","low"].indexOf(a.priority) - ["high","medium","low"].indexOf(b.priority));
  }

  const toggleComplete = async (id, status) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/update/${id}`, { completed: !status }, { headers:{Authorization:`Bearer ${token}`}});
      setTasks(tasks.map(t => t._id === id ? res.data.task : t));
      toast.success(res.data.message);
    } catch (e) { toast.error("Error toggling") }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/delete/${id}`, { headers:{Authorization:`Bearer ${token}`}});
      setTasks(tasks.filter(t => t._id !== id)); toast.success("Deleted");
    } catch (e) { toast.error("Error deleting") }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 font-sans">
      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {["today","completed","upcoming","weekly","monthly"].map(tab => (
          <button key={tab} onClick={()=>setView(tab)}
            className={`px-4 py-2 border-b-2 ${
               view===tab ? "border-[#81B622] text-[#3D550C]" : "border-transparent text-gray-500 hover:text-[#3D550C]"
            } transition`}>
            {tab.charAt(0).toUpperCase()+tab.slice(1).replace("upcoming","Upcoming").replace("weekly","Weekly Goals").replace("monthly","Monthly Goals")}
          </button>
        ))}
      </div>

      {/* Add Task Button */}
      <div className="flex justify-center mb-6">
        <button onClick={()=>setShowModal(true)}
          className="px-6 py-2 bg-[#81B622] text-white font-semibold hover:bg-[#3D550C] transition rounded">
          + Add Task
        </button>
      </div>

      {/* Task Lists by Priority */}
      {["high","medium","low"].map(level => {
        const list = groupedTasks(level);
        if (!list.length) return null;
        const color = level==="high"?"#e05c5c": level==="medium"?"#e0a55c":"#888";
        return (
          <div key={level} className="mb-6">
            <h3 className="text-lg font-bold" style={{ color }}>{level.charAt(0).toUpperCase()+level.slice(1) + " Priority"}</h3>
            <AnimatePresence>
              {list.map(task=> (
                <motion.div key={task._id} initial={{ opacity:0, x:-20 }}
                  animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:20 }}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 transition border-b border-gray-200">
                  <div className="flex flex-col">
                    <h4 className={`font-medium ${task.completed?"line-through text-gray-400":"text-gray-800"}`}>{task.title}</h4>
                    <div className="text-xs text-gray-500 flex gap-4">
                      <span>📅 {new Date(task.scheduledDate).toLocaleDateString()}</span>
                      <span>🔁 {task.frequency}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={()=>toggleComplete(task._id, task.completed)}
                      className="focus:outline-none">
                      {task.completed ? "Undo":"Done" }
                    </button>
                    <button onClick={()=>deleteTask(task._id)} className="text-gray-400 hover:text-red-500">
                      <Trash size={20}/>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Modal (same as your existing) */}
      <AddTaskModal show={showModal} setShow={setShowModal} step={step} setStep={setStep} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} todayDate={todayDate} />

    </div>
  );
};

// Your AddTaskModal should match the existing implementation above

export default Tasks;
