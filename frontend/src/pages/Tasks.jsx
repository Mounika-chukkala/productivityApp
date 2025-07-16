// import { useEffect, useState } from "react";
// import axios from "axios";
// import { AnimatePresence, motion } from "framer-motion";
// import { useSelector } from "react-redux";

// const Tasks = () => {
//   const [tasks, setTasks] = useState([]);
//   const [view, setView] = useState("today");
//   const [showModal, setShowModal] = useState(false);
//   const [step, setStep] = useState(1);

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     scheduledDate: "",
//     endDate: "",
//     priority: "medium",
//     frequency: "once",
//     reminderTime: "",
//   });
// const user=useSelector((state)=>state.user);
//   // Example userId and token
//   const userId = user.id;
//   const token = user.token;

//   const fetchTasks = async () => {
//     try {
//       const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/${userId}`,{
//         headers:{
//           Authorization:`Bearer ${token}`
//         }
//       });
//       setTasks(res.data.tasks);
//     } catch (error) {
//       console.error("Error fetching tasks", error);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   // Add task
//   const handleSubmit = async () => {
//     if (!formData.title || !formData.scheduledDate) {
//       alert("Title and Scheduled Date are required!");
//       return;
//     }
// if (formData.reminderTime) {
//   const [hours, minutes] = formData.reminderTime.split(":");
//   const scheduledDate = formData.scheduledDate ? new Date(formData.scheduledDate) : new Date();
//   scheduledDate.setHours(hours);
//   scheduledDate.setMinutes(minutes);
//   scheduledDate.setSeconds(0);
//   scheduledDate.setMilliseconds(0);
//   formData.reminderTime = scheduledDate;
// }

//     if (formData.endDate && new Date(formData.endDate) < new Date(formData.scheduledDate)) {
//       alert("End date cannot be before Scheduled date!");
//       return;
//     }

//     if (new Date(formData.endDate) < new Date()) {
//       alert("End date cannot be in the past!");
//       return;
//     }

//     try {
//       const res = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/create-task`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setTasks([...tasks, res.data.task]);
//       setShowModal(false);
//       setStep(1);
//       setFormData({
//         title: "",
//         description: "",
//         scheduledDate: "",
//         endDate: "",
//         priority: "medium",
//         frequency: "once",
//         reminderTime: "",
//       });
//     } catch (error) {
//       console.error("Error adding task", error);
//     }
//   };
// const todayDate = new Date().toISOString().split("T")[0];

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       {/* Tabs */}
//       <div className="flex justify-center space-x-4 mb-6">
//         {["today", "completed", "weekly", "monthly"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setView(tab)}
//             className={`px-4 py-2 rounded ${
//               view === tab ? "bg-[#3D550C] text-white" : "bg-[#EAEAEA] text-[#3D550C]"
//             }`}
//           >
//             {tab === "today" && "Today"}
//             {tab === "completed" && "Completed"}
//             {tab === "weekly" && "Weekly Goals"}
//             {tab === "monthly" && "Monthly Goals"}
//           </button>
//         ))}
//       </div>

//       {/* Add Task */}
//       <div className="flex justify-center mb-6">
//         <button
//           onClick={() => setShowModal(true)}
//           className="bg-[#81B622] text-white px-6 py-2 rounded shadow hover:bg-[#3D550C] transition"
//         >
//           Add Task +
//         </button>
//       </div>

//       {/* Tasks List */}
//       <div>
//         {tasks
//           .filter((task) => {
//             if (view === "today") return !task.completed;
//             if (view === "completed") return task.completed;
//             // Weekly and Monthly: placeholder logic for now
//             if (view === "weekly") return task.frequency === "weekly";
//             if (view === "monthly") return task.frequency === "monthly";
//             return true;
//           })
//           .map((task) => (
//             <div
//               key={task._id}
//               className="bg-[#F5F5F5] p-4 rounded mb-3 flex justify-between items-center shadow"
//             >
//               <div>
//                 <h3 className="text-lg font-semibold">{task.title}</h3>
//                 <p className="text-sm">{task.description}</p>
//                 <p className="text-xs text-[#3D550C]">
//                   📅 {new Date(task.scheduledDate).toLocaleDateString()} | 🏷 {task.priority}
//                 </p>
//                 <p className="text-xs text-[#3D550C]">🔥 Streak: {task.streak || 0}</p>
//               </div>
//               <p
//                 className={`text-sm font-medium ${
//                   task.completed ? "text-green-600" : "text-yellow-600"
//                 }`}
//               >
//                 {task.completed ? "Completed" : "Pending"}
//               </p>
//             </div>
//           ))}
//       </div>

//       {/* Modal */}
//       <AnimatePresence>
//         {showModal && (
//           <motion.div
//             className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <motion.div
//               className="bg-white p-6 rounded-xl w-[90%] max-w-lg shadow-xl"
//               initial={{ scale: 0.8 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.8 }}
//             >
//               {/* Steps */}
//               {step === 1 && (
//                 <div>
//                   <h2 className="text-lg font-bold mb-2 text-[#3D550C]">Step 1: Basic Info</h2>
//                   <input
//                     type="text"
//                     placeholder="Title *"desc
//                     value={formData.title}
//                     onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                     className="w-full p-2 mb-2 border rounded"
//                   />
//                   <textarea
//                     rows={3}
//                     placeholder="Description"
//                     value={formData.description}
//                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                     className="w-full p-2 mb-2 border rounded"
//                   />
//                 </div>
//               )}
//               {step === 2 && (
//                 <div>
//                   <h2 className="text-lg font-bold mb-2 text-[#3D550C]">Step 2: Dates</h2>
//                   <h5 className="text-sm">Scheduled Date :</h5>
//                   <input
//                     type="date"
//                     value={formData.scheduledDate}
//                       min={todayDate}
//                     onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
//                     className="w-full p-2 mb-2 border rounded"
//                   />
//                   <h5 className="text-sm">End Date :</h5>
//                   <input
//                     type="date"
//                       min={formData.scheduledDate || todayDate}
//                     value={formData.endDate}
//                     onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
//                     className="w-full p-2 mb-2 border rounded"
//                   />
//                 </div>
//               )}
//               {step === 3 && (
//                 <div>
//                   <h2 className="text-lg font-bold mb-2 text-[#3D550C]">Step 3: Priority & Frequency</h2>
//                   <select
//                     value={formData.priority}
//                     onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
//                     className="w-full p-2 mb-2 border rounded"
//                   >
//                     <option value="low">Low</option>
//                     <option value="medium">Medium</option>
//                     <option value="high">High</option>
//                   </select>
//                   <select
//                     value={formData.frequency}
//                     onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
//                     className="w-full p-2 mb-2 border rounded"
//                   >
//                     <option value="once">Once</option>
//                     <option value="daily">Daily</option>
//                     <option value="weekly">Weekly</option>
//                     <option value="monthly">Monthly</option>
//                   </select>
//                 </div>
//               )}
//               {step === 4 && (
//                 <div>
//                   <h2 className="text-lg font-bold mb-2 text-[#3D550C]">Step 4: Reminder</h2>
//                   <input
//                     type="time"
//                     value={formData.reminderTime}
//                     onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
//                     className="w-full p-2 mb-2 border rounded"
//                   />
//                 </div>
//               )}

//               {/* Buttons */}
//               <div className="flex justify-between mt-4">
//                 <button
//                   disabled={step === 1}
//                   onClick={() => setStep(step - 1)}
//                   className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//                 >
//                   Prev
//                 </button>
//                 {step < 4 ? (
//                   <button
//                     onClick={() => setStep(step + 1)}
//                     className="px-4 py-2 bg-[#3D550C] text-white rounded"
//                   >
//                     Next
//                   </button>
//                 ) : (
//                   <button onClick={handleSubmit} className="px-4 py-2 bg-[#81B622] text-white rounded">
//                     Submit
//                   </button>
//                 )}
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Tasks;


import { useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector } from "react-redux";
import {toast} from "react-hot-toast"
import { X } from "lucide-react";
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

    // Convert reminderTime to proper datetime (optional backend format)
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
      toast.success("Hooray!!!Task Completed")
    } catch (error) {
            toast.error(error.response.data.message)

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
      toast.success("Task deleted")
    } catch (error) {
      toast.error(error.response.data.message)
      console.error("Error deleting task", error);
    }
  };

  const todayDate = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        {["today", "completed", "weekly", "monthly"].map((tab) => (
          <button
            key={tab}
            onClick={() => setView(tab)}
            className={`px-4 py-2 rounded ${
              view === tab ? "bg-[#3D550C] text-white" : "bg-[#EAEAEA] text-[#3D550C]"
            }`}
          >
            {tab === "today" && "Today"}
            {tab === "completed" && "Completed"}
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
        {tasks
          .filter((task) => {
            if (view === "today")
              return new Date(task.scheduledDate).toISOString().split("T")[0] === todayDate && !task.completed;
            if (view === "completed") return task.completed;
            if (view === "weekly") return task.frequency === "weekly";
            if (view === "monthly") return task.frequency === "monthly";
            return true;
          })
          .map((task) => (
            <div
              key={task._id}
              className="bg-[#F5F5F5] p-4 rounded mb-3 flex justify-between items-center shadow"
            >
              <div>
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <p className="text-sm">{task.description}</p>
                <p className="text-xs text-[#3D550C]">
                  📅 {new Date(task.scheduledDate).toLocaleDateString()} | 🏷 {task.priority} | 🔁 {task.frequency}
                </p>
                <p className="text-xs text-[#3D550C]">🔥 Streak: {task.streak || 0}</p>
              </div>
              <div className="flex flex-col space-y-2 text-sm">
                <button
                  onClick={() => toggleComplete(task._id, task.completed)}
                  className={`px-2 py-1 rounded ${
                    task.completed ? "bg-yellow-600 text-white" : "bg-green-600 text-white"
                  }`}
                >
                  {task.completed ? "Undo" : "Done"}
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="px-2 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
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
  {/* Close button */}
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

export default Tasks;
