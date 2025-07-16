import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { MoreVertical, Trash } from "lucide-react";
import toast from "react-hot-toast";

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    frequency: "daily",
  });
  const [menuOpenId, setMenuOpenId] = useState(null);

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
      toast.success("marked as done");
    } catch (error) {
      // console.error("Error marking done", error);
      toast.error(error.response.data.message)
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
      setMenuOpenId(null);
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

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-[#3D550C] mb-4">My Habits</h2>

      <div className="bg-[#F5F5F5] p-3 rounded shadow flex flex-col md:flex-row items-center gap-2 mb-5">
        <input
          type="text"
          placeholder="Habit name *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="flex-1 w-full lg:w-70 p-2 border rounded text-sm"
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
          className="bg-[#81B622] text-white px-4 py-2 rounded text-sm hover:bg-[#3D550C]"
        >
          Add
        </button>
      </div>

      {["daily", "weekly", "monthly"].map(
        (freq) =>
          grouped[freq].length > 0 && (
            <div key={freq} className="mb-6">
              <h3 className="text-lg font-bold text-[#3D550C] mb-3 capitalize">
                {freq} Habits
              </h3>
              {grouped[freq].map((habit) => (
                <div
                  key={habit._id}
                  className="bg-[#F5F5F5] px-3 py-2 rounded mb-3 shadow flex items-center justify-between "
                >
                  <h3 className="text-base font-medium">{habit.name} </h3>
                  <div className="flex items-center gap-3 ">
                    <button
                      onClick={() => markDone(habit._id)}
                      className={`px-3 py-1 rounded text-xs hover:bg-[#3D550C] hover:text-white ${new Date(habit.lastCompleted).toDateString() === new Date().toDateString()?"bg-white text-[#81B622]":"bg-[#81B622] text-white"}` }
                    >
                      {/* {habit.lastCompleted==Date.now()?"Marked today":"Mark as done"} */}
                      {/* Mark Done */}

                     {new Date(habit.lastCompleted).toDateString() === new Date().toDateString()
    ? `Marked  for ${habit.frequency=="daily"?"today":habit.frequency=="weekly"?"week":"month"}`
    : "Mark as done"}


                    </button>
                    <span className="text-sm text-[#3D550C] flex items-center">
                      🔥 {habit.currentStreak || 0}
                    </span>
                    <button
                      onClick={() => deleteHabit(habit._id)}
                      className=" text-gray-500 hover:text-black"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
      )}

      {habits.length === 0 && (
        <p className="text-center text-gray-500">
          No habits yet. Let's start strong!
        </p>
      )}
    </div>
  );
};

export default Habits;
