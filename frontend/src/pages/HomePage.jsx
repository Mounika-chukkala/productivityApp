import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BarChart3, CheckSquare, Flame } from "lucide-react";

const HomePage = () => {
  const user = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-[#F0F4E3] text-[#3D550C] font-sans overflow-hidden">
      {/* Hero Section */}
      <section className="px-6 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4">
          Welcome to <span className="text-[#81B622]">MyProductivity</span>
        </h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mt-2">
          Organize your day, build meaningful habits, and track your goals—all in one focused, distraction-free space.
        </p>
        {!user.token && (
          <Link
            to="/signup"
            className="mt-8 inline-block px-8 py-3 bg-[#81B622] text-white text-lg font-semibold rounded-full hover:bg-[#3D550C] transition-all duration-200"
          >
            Get Started
          </Link>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-6 rounded-t-[3rem] shadow-inner">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          <FeatureBlock
            icon={<CheckSquare size={48} className="text-[#3D550C] group-hover:scale-110 transition-transform" />}
            title="Smart Tasks"
            desc="Stay focused and on top of your daily to-dos with a beautiful task manager that motivates you."
          />
          <FeatureBlock
            icon={<Flame size={48} className="text-[#3D550C] group-hover:scale-110 transition-transform" />}
            title="Habit Builder"
            desc="Keep your fire alive! Build streaks and stay consistent with habits that matter."
          />
          <FeatureBlock
            icon={<BarChart3 size={48} className="text-[#3D550C] group-hover:scale-110 transition-transform" />}
            title="Insightful Dashboard"
            desc="Track your wins and visualize progress through simple yet effective graphs and stats."
          />
        </div>
      </section>

      {/* Footer Quote */}
      <div className="mt-16 text-center text-sm text-gray-500 italic">
        💡 “Consistency is what transforms average into excellence.”
      </div>
    </div>
  );
};

// Feature Block Component
const FeatureBlock = ({ icon, title, desc }) => {
  return (
    <div className="group text-center px-4 py-6 rounded-xl transition-all hover:bg-[#F0F4E3] hover:shadow-md">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
};

export default HomePage;
