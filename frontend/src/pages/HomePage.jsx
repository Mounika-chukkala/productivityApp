import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const HomePage = () => {
  const user = useSelector((state) => state.user);

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-6 text-center bg-gradient-to-b from-[#F0F4E3] to-[#ffffff]">
      <h1 className="text-4xl md:text-5xl font-bold text-[#3D550C] mb-4 drop-shadow-sm">
        Welcome to MyProductivity 
      </h1>
      <p className="text-gray-600 mb-6 max-w-xl">
        Organize your tasks, build strong habits, and stay focused to achieve your goals. Empower your daily routine and crush your productivity milestones!
      </p>

      {!user.token && (
        <Link
          to="/signup"
          className="bg-[#81B622] text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#3D550C] hover:scale-105 transition-all shadow-md"
        >
          Get Started
        </Link>
      )}

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
          <h3 className="text-xl font-bold text-[#3D550C] mb-2 flex items-center justify-center">
             Tasks
          </h3>
          <p className="text-gray-500 text-sm">
            Manage your daily tasks effectively and mark them done to maintain focus and momentum.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
          <h3 className="text-xl font-bold text-[#3D550C] mb-2 flex items-center justify-center">
             Habits
          </h3>
          <p className="text-gray-500 text-sm">
            Build strong habits, keep your streak alive, and transform your daily routine with consistency.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
          <h3 className="text-xl font-bold text-[#3D550C] mb-2 flex items-center justify-center">
            Dashboard
          </h3>
          <p className="text-gray-500 text-sm">
            Visualize your productivity progress and gain insights to stay on track toward your bigger goals.
          </p>
        </div>
      </div>

      <div className="mt-12 text-sm text-gray-400">
        💡 Tip: Stay consistent and celebrate your small wins every day!
      </div>
    </div>
  );
};

export default HomePage;
