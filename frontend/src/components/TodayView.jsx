

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const TodayView = () => {
  const [events, setEvents] = useState([]);
  const [goals, setGoals] = useState([]);
  const [checkedGoals, setCheckedGoals] = useState(() => {
    const stored = localStorage.getItem("checkedGoals");
    return stored ? JSON.parse(stored) : {};
  });

  const navigate = useNavigate();
  const { token } = useSelector((slice) => slice.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/get-plan?date=${new Date().getDate()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEvents(res.data.plans?.events || []);
        const sortedEvents = events.sort((a, b) => {
          const parseTime = (timeStr) => {
            const [time, modifier] = timeStr.split(" ");
            let [hours, minutes] = time.split(":").map(Number);

            if (modifier === "PM" && hours !== 12) hours += 12;
            if (modifier === "AM" && hours === 12) hours = 0;

            return hours * 60 + minutes;
          };

          return parseTime(a.time) - parseTime(b.time);
        });
        setEvents(sortedEvents)
        setGoals(res.data.plans?.goals || []);
      } catch (error) {
        console.error("Error fetching today's data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("checkedGoals", JSON.stringify(checkedGoals));
  }, [checkedGoals]);

  const toggleGoal = (goal) => {
    setCheckedGoals((prev) => ({
      ...prev,
      [goal]: !prev[goal],
    }));
  };

  return (
    <div className="p-6 min-h-screen font-sans max-w-4xl mx-auto bg-[#FAFAF5]  text-[#3D550C]">
      <h1 className="text-xl sm:text-3xl  font-bold mb-8 text-center">Today's Overview</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-[#DDEEC6]">
          {" "}
          Events
        </h2>
        {events.length > 0 ? (
          <div className="space-y-2">
            {events.map((event, index) => (
              <div
                key={index}
                className="border flex justify-between border-[#DDEEC6] p-3 bg-white text-[#3D550C] hover:bg-[#F5FBEF] transition"
              >
                <p className="font-semibold">{event.title}</p>
                <p className="text-sm text-[#2d352a]">{event.time}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No events planned today.</p>
        )}
      </section>

      {/* Goals Section */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2 border-[#dcf0c1]">
          {" "}
          Goals
        </h2>
        {goals.length > 0 ? (
          <div className="space-y-2">
            {goals.map((goal, index) => (
              <label key={index} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={checkedGoals[goal] || false}
                  onChange={() => toggleGoal(goal)}
                  className="accent-[#536e1b] w-5 h-5"
                />
                <span
                  className={`text-base ${
                    checkedGoals[goal]
                      ? "line-through text-gray-400"
                      : "text-[#3D550C]"
                  }`}
                >
                  {goal}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No goals added today.</p>
        )}
      </section>

      {/* Plan Next Day Button */}
      <div className="text-center relative">
        <button
          onClick={() => {
            localStorage.removeItem("checkedGoals");
            navigate("/plan-next-day");
          }}
          className="px-8 absolute right-0  py-3 bg-[#81B622] hover:bg-[#6B8E23] text-white font-semibold transition"
        >
          Plan for Next Day
        </button>
      </div>
    </div>
  );
};

export default TodayView;
