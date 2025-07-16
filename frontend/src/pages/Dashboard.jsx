import { useSelector } from "react-redux";

const Dashboard = () => {
  const user = useSelector((state) => state.user);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col-reverse lg:flex-row gap-8">
        <div className="flex-1 bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
          <h2 className="text-xl font-semibold text-[#3D550C] mb-4">Your Productivity Insights</h2>
          <div className="w-full h-60 bg-gradient-to-r from-green-100 to-green-50 flex items-center justify-center rounded-xl">
            <p className="text-gray-500">Visual analytics will appear here soon...</p>
          </div>
        </div>

        <div className="w-full lg:w-80 bg-white  p-6 lg:rounded-2xl shadow-lg lg:text-center">
          <div className="flex justify-start lg:justify-center mb-4">
            <img
              src={
                user.profilePic
                  ? user.profilePic
                  : `https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`
              }
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-[#3D550C] object-cover"
            />
          </div>
          <h3 className="text-xl font-bold text-[#3D550C] mb-1">{user.name}</h3>
          <p className="text-gray-500 mb-1">@{user.username}</p>
          <p className="text-gray-600 mb-3">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
