import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CalendarCheck, CheckCircle } from "lucide-react";

const TodayView = () => {
  const [events, setEvents] = useState([]);
  const [goals, setGoals] = useState([]);
  const navigate = useNavigate();

  const todayDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, goalRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-events`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-goals`)
        ]);
        setEvents(eventRes.data || []);
        setGoals(goalRes.data || []);
      } catch (error) {
        console.error("Error fetching today's data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-[#F0FDF4] min-h-screen text-[#065F46]">
      <h1 className="text-2xl font-bold mb-4 text-[#064E3B]">Today's Overview</h1>

      {/* Events Section */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <CalendarCheck className="text-[#10B981]" />
          <h2 className="text-xl font-semibold">Events</h2>
        </div>
        {events.length > 0 ? (
          <ul className="space-y-2">
            {events.map((event) => (
              <li key={event._id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                <div className="font-medium">{event.title}</div>
                <div className="text-sm text-gray-600">{event.time}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No events for today.</p>
        )}
      </section>

      {/* Goals Section */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="text-[#10B981]" />
          <h2 className="text-xl font-semibold">Goals</h2>
        </div>
        {goals.length > 0 ? (
          <ul className="space-y-2">
            {goals.map((goal) => (
              <li key={goal._id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-200">
                <div className="font-medium">{goal.description}</div>
                <div className="text-sm text-gray-600">{goal.status}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No goals set for today.</p>
        )}
      </section>

      {/* Plan Next Day Button */}
      <div className="flex justify-center">
        <button
          onClick={() => navigate("/plan-next-day")}
          className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2 rounded-full shadow-md transition-all"
        >
          Plan Next Day
        </button>
      </div>
    </div>
  );
};

export default TodayView;
