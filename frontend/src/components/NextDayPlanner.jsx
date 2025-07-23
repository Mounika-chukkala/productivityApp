
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const NextDayPlanner = () => {
  const [events, setEvents] = useState([{ time: "", title: "" }]);
  const [goals, setGoals] = useState([""]);
  const navigate = useNavigate();
  const [update,setUpdate]=useState(false);
  const [planId,setPlanId]=useState(null);
const {token}=useSelector((slice)=>slice.user)
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

    console.log(update)
    try {
      if(update){
        const data={events,goals,date:new Date().getDate()+1,planId:planId}
              const res= await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/update-plan`,data,{
        headers:{
          'Authorization':`Bearer ${token}`,
        }
      }) 
          console.log(res)


}
else{
  const data={events,goals,date:new Date().getDate()+1}
      const res= await axios.post(`${import.meta.env.VITE_BACKEND_URL}/create-plan`,data,{
        headers:{
          'Authorization':`Bearer ${token}`,
        }
      }) 
    } 
      toast.success("Plan saved successfully!");
      navigate("/today");
    } catch (err) {
      console.error(err);
      alert("Error saving your plan. Try again.");
    }
  };
async function fetchPlan(){
  try {
const res= await axios.get(`${import.meta.env.VITE_BACKEND_URL}/get-plan?date=${new Date().getDate()+1}`,{headers:{
            'Authorization':`Bearer ${token}`
          }})
if(res.data.plans){
   setUpdate(true);
  setPlanId(res.data.plans._id)      
  }     
          setEvents(res.data.plans.events||[]);
          setGoals(res.data.plans.goals||[]);
toast.success("Plan fetched successfully")

        } catch (error) {
    toast.error("Couldn't fetch the plan");
  }
}
  useEffect(()=>
{fetchPlan()},[]  )

  return (
    <div className="max-w-3xl mx-auto p-8 bg-[#F5FBEF] rounded-3xl shadow-lg mt-10 border border-[#DDEEC6]">
      <h2 className="text-3xl font-extrabold text-[#3D550C] mb-8 text-center">Plan Your Next Day</h2>

      {/* Events Section */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold text-[#81B622] mb-4">Events / Meetings</h3>
        {events.map((event, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="time"
              value={event.time}
              onChange={(e) => handleEventChange(idx, "time", e.target.value)}
              className="border border-[#A3B763] rounded-xl p-2 text-[#3D550C] bg-white shadow-sm w-full sm:w-40"
            />
            <input
              type="text"
              value={event.title}
              onChange={(e) => handleEventChange(idx, "title", e.target.value)}
              placeholder="Event Title"
              className="flex-1 border border-[#A3B763] rounded-xl p-2 text-[#3D550C] bg-white shadow-sm"
            />
          </div>
        ))}
        <button onClick={addEvent} className="text-sm text-[#6B8E23] font-medium hover:underline">
          + Add Event
        </button>
      </section>

      {/* Goals Section */}
      <section className="mb-10">
        <h3 className="text-2xl font-semibold text-[#81B622] mb-4">Goals to Achieve</h3>
        {goals.map((goal, idx) => (
          <input
            key={idx}
            type="text"
            value={goal}
            onChange={(e) => handleGoalChange(idx, e.target.value)}
            placeholder="Write a goal..."
            className="block w-full border border-[#A3B763] rounded-xl p-3 mb-3 text-[#3D550C] bg-white shadow-sm"
          />
        ))}
        <button onClick={addGoal} className="text-sm text-[#6B8E23] font-medium hover:underline">
          + Add Goal
        </button>
      </section>

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="px-8 py-3 bg-[#81B622] hover:bg-[#6B8E23] text-white font-semibold rounded-full shadow-lg transition-all duration-200"
        >
          Save Plan
        </button>
      </div>
    </div>
  );
};

export default NextDayPlanner;
