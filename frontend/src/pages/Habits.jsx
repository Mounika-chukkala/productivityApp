


import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Trash, Flame } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    frequency: "daily",
  });

  const user = useSelector((state) => state.user);
  const token = user.token;

  const fetchHabits = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/get-habits`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHabits(res.data.habits);
    } catch (error) {
      console.error("Error fetching habits", error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleAddHabit = async () => {
    if (!formData.name) {
      alert("Habit name is required!");
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/create-habit`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHabits([...habits, res.data.habit]);
      setFormData({ name: "", frequency: "daily" });
      toast.success("Added successfully");
    } catch (error) {
      console.error("Error adding habit", error);
    }
  };

  const markDone = async (id) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/done/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHabits(habits.map((h) => (h._id === id ? res.data.habit : h)));
      toast.success("Marked as done");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error marking as done");
    }
  };

  const deleteHabit = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/delete-habit/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHabits(habits.filter((h) => h._id !== id));
      toast.success("Deleted successfully");
    } catch (error) {
      console.error("Error deleting habit", error);
    }
  };

  const grouped = {
    daily: habits.filter((h) => h.frequency === "daily"),
    weekly: habits.filter((h) => h.frequency === "weekly"),
    monthly: habits.filter((h) => h.frequency === "monthly"),
  };

  const isHabitMarkedToday = (habit) => {
    const today = new Date().toDateString();
    return new Date(habit.lastCompleted).toDateString() === today;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-screen">
      <h2 className="text-3xl font-bold text-[#3D550C] mb-6"> My Habits</h2>

      <div className="bg-[#F0F4E3] p-4 rounded-xl shadow flex flex-col md:flex-row items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="New Habit Name *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="flex-1 w-full p-2 border rounded text-sm"
        />
        <select
          value={formData.frequency}
          onChange={(e) =>
            setFormData({ ...formData, frequency: e.target.value })
          }
          className="p-2 border rounded text-sm"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <button
          onClick={handleAddHabit}
          className="bg-[#81B622] text-white px-4 py-2 rounded hover:bg-[#3D550C]"
        >
          Add Habit
        </button>
      </div>

      {["daily", "weekly", "monthly"].map(
        (freq) =>
          grouped[freq].length > 0 && (
            <div key={freq} className="mb-8">
              <h3 className="text-xl font-semibold text-[#3D550C] mb-4 capitalize">
                {freq} Habits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {grouped[freq].map((habit) => {
                  const isDone = isHabitMarkedToday(habit);
                  return (
                    <div
                      key={habit._id}
                      className="bg-[#FAFFF2] p-4 rounded-lg shadow flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => markDone(habit._id)}
                          className="focus:outline-none"
                        >
                          {isDone ? (
                            <motion.div
                            //   initial={{ scale: 1 }}
                            //   animate={{ scale: [1, 1.2, 1] }}
                            //   transition={{ duration: 0.6, repeat: Infinity }}
                            >
                              <Flame
                                size={24}
                                className="cursor-pointer text-[#81B622] fill-[#81B622]"
                              />
                            </motion.div>
                          ) : (
                            <Flame
                              size={24}
                              className="cursor-pointer text-[#3D550C] hover:text-[#81B622]"
                            />
                          )}
                        </button>
                        <div>
                          <h4 className="text-md font-medium text-[#3D550C]">
                            {habit.name}
                          </h4>
                          <p className="text-xs mt-1">
                            🔥 {habit.currentStreak || 0}{" "}
                            {habit.frequency === "daily"
                              ? "day"
                              : habit.frequency === "weekly"
                              ? "week"
                              : "month"}{" "}
                            streak
                          </p>
                          <p className="text-xs text-gray-500">
                            {isDone
                              ? `Marked for ${
                                  habit.frequency === "daily"
                                    ? "today"
                                    : habit.frequency === "weekly"
                                    ? "this week"
                                    : "this month"
                                }`
                              : "Not marked yet"}
                          </p>
                        </div>
                      </div>
                      <div className="text-gray-500 hover:text-red-500 cursor-pointer">
                        <Trash size={18} onClick={() => deleteHabit(habit._id)} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
      )}

      {habits.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No habits yet. Let’s build some great ones!
        </p>
      )}
    </div>
  );
};

export default Habits;
