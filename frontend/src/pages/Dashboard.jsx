

import { useSelector } from "react-redux";

const Dashboard = () => {
  const user = useSelector((state) => state.user);
    const flaskURL = import.meta.env.VITE_FLASK_URL;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col-reverse lg:flex-row gap-8">
        <div className="flex-1 bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold text-[#3D550C] mb-4">
            Your Productivity Insights
          </h2>

          <div className="space-y-6">


            <img
  src={`${flaskURL}/chart/progress?user_id=${user.id}&token=${user.token}&t=${Date.now()}`}
  alt="Progress Chart"
  className="w-[90%] rounded-xl"
/>
<img
  src={`${flaskURL}/chart/distribution?user_id=${user.id}&token=${user.token}&t=${Date.now()}`}
  alt="Distribution Chart"
  className="w-[90%]   rounded-xl"
/>
{/* <img
  src={`${flaskURL}/chart/streak?user_id=${user.id}&token=${user.token}&t=${Date.now()}`}
  alt="Streak Chart"
  className="w-full rounded-xl"
/> */}
<img
  src={`${flaskURL}/chart/time-allocation?user_id=${user.id}&token=${user.token}&t=${Date.now()}`}
  alt="Time Allocation Chart"
  className="w-[90%]  rounded-xl"
/>
<img
  src={`${flaskURL}/chart/overdue-vs-completed?user_id=${user.id}&token=${user.token}&t=${Date.now()}`}
  alt="Overdue vs Completed Chart"
  className="w-[90%]  rounded-xl"
/>

          </div>
        </div>

        <div className="w-full flex lg:flex-col   lg:rounded-2xl bg-white h-[300px]  flex-row items-center lg:w-80  p-6  shadow-lg lg:text-center">
          <div className="flex mr-5 justify-start lg:justify-center mb-4">
            <img
              src={
                user.profilePic
                  ? user.profilePic
                  : `https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`
              }
              alt="Profile"
              className="lg:w-24 lg:h-24 w-15 h-15 rounded-full border-4 border-[#3D550C] object-cover"
            />
          </div>
          <div  className="bg-white lg:rounded-2xl">

          <h3 className="lg:text-xl text-md font-bold text-[#3D550C] mb-1">{user.name}</h3>
          <p className="text-gray-500 mb-1">@{user.username}</p>
          <p className="text-gray-600 mb-1">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
