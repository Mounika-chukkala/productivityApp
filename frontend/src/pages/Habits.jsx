import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    frequency: "daily",
  });

  const user = useSelector((state) => state.user);
  const userId = user.id;
  const token = user.token;

  // Fetch habits
  const fetchHabits = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-habits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits(res.data.habits);
    } catch (error) {
      console.error("Error fetching habits", error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  // Add habit
  const handleAddHabit = async () => {
    if (!formData.name) {
      alert("Habit name is required!");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/create-habit`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setHabits([...habits, res.data.habit]);
      setFormData({ name: "", frequency: "daily" });
    } catch (error) {
      console.error("Error adding habit", error);
    }
  };

  // Mark as done (placeholder logic)
  const markDone = (id) => {
    console.log("Marking done", id);
    // You can implement an API call here
  };

  // Delete habit (placeholder)
  const deleteHabit = (id) => {
    console.log("Deleting habit", id);
    // You can implement an API call here
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-[#3D550C] mb-4">My Habits</h2>

      {/* Add habit section */}
      <div className="bg-[#F5F5F5] p-4 rounded shadow flex flex-col md:flex-row items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Habit name *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="flex-1 p-2 border rounded"
        />
        <select
          value={formData.frequency}
          onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        <button
          onClick={handleAddHabit}
          className="bg-[#81B622] text-white px-4 py-2 rounded hover:bg-[#3D550C]"
        >
          Add
        </button>
      </div>

      {/* Habits list */}
      {habits.length === 0 ? (
        <p className="text-center text-gray-500">No habits yet. Let's start strong!</p>
      ) : (
        habits.map((habit) => (
          <div
            key={habit._id}
            className="bg-[#F5F5F5] p-4 rounded mb-3 flex justify-between items-center shadow"
          >
            <div>
              <h3 className="text-lg font-semibold">{habit.name}</h3>
              <p className="text-xs text-[#3D550C]"> {habit.frequency}</p>
              <p className="text-xs text-[#3D550C]"> Streak: {habit.streak || 0}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => markDone(habit._id)}
                className="bg-[#81B622] text-white px-3 py-1 rounded text-xs hover:bg-[#3D550C]"
              >
                Done
              </button>
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                // onClick={() => editHabit(habit._id)}
              >
                Edit
              </button>
              <button
                onClick={() => deleteHabit(habit._id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-xs"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Habits;
