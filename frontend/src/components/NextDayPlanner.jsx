import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NextDayPlanner = () => {
  const [events, setEvents] = useState([{ time: "", title: "" }]);
  const [goals, setGoals] = useState([""]);
  const navigate = useNavigate();

  const handleEventChange = (index, field, value) => {
    const updated = [...events];
    updated[index][field] = value;
    setEvents(updated);
  };

  const handleGoalChange = (index, value) => {
    const updated = [...goals];
    updated[index] = value;
    setGoals(updated);
  };

  const addEvent = () => setEvents([...events, { time: "", title: "" }]);
  const addGoal = () => setGoals([...goals, ""]);

  const handleSubmit = async () => {
    const date = new Date();
    date.setDate(date.getDate() + 1); // for tomorrow
    const formattedDate = date.toISOString().split("T")[0];

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/create-event`, events.map(e => ({ ...e, date: formattedDate })));
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/create-goal`, goals.map(g => ({ title: g, date: formattedDate })));
      alert("Plan saved successfully!");
      navigate("/today");
    } catch (err) {
      console.error(err);
      alert("Error saving your plan. Try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-green-50 rounded-2xl shadow-md mt-6">
      <h2 className="text-3xl font-bold text-green-900 mb-6 text-center">🗓️ Plan Your Next Day</h2>

      {/* Events Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-green-800 mb-3">Events / Meetings</h3>
        {events.map((event, idx) => (
          <div key={idx} className="flex items-center gap-3 mb-3">
            <input
              type="time"
              value={event.time}
              onChange={(e) => handleEventChange(idx, "time", e.target.value)}
              className="border rounded p-2 text-green-800 bg-white shadow-sm"
            />
            <input
              type="text"
              value={event.title}
              onChange={(e) => handleEventChange(idx, "title", e.target.value)}
              placeholder="Event Title"
              className="flex-1 border rounded p-2 shadow-sm"
            />
          </div>
        ))}
        <button onClick={addEvent} className="text-sm text-green-700 underline hover:text-green-900">
          + Add Event
        </button>
      </div>

      {/* Goals Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-green-800 mb-3">Goals to Achieve</h3>
        {goals.map((goal, idx) => (
          <input
            key={idx}
            type="text"
            value={goal}
            onChange={(e) => handleGoalChange(idx, e.target.value)}
            placeholder="Write a goal..."
            className="block w-full border rounded p-2 mb-2 shadow-sm"
          />
        ))}
        <button onClick={addGoal} className="text-sm text-green-700 underline hover:text-green-900">
          + Add Goal
        </button>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-green-600 text-white rounded-full shadow hover:bg-green-700"
        >
          ✅ Save Plan
        </button>
      </div>
    </div>
  );
};

export default NextDayPlanner;
