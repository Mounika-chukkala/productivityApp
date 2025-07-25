import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BarChart3, CheckSquare, Flame } from "lucide-react";

const HomePage = () => {
  const user = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-[#f6fdf4] text-[#3d550c] font-sans flex flex-col overflow-hidden">
      <section className="  flex flex-col justify-center items-center text-center px-6 py-15 ">
        <h1 className="md:text-3xl font-extrabold tracking-tight leading-tight mb-4">
          Welcome to <span className="text-[#81b622]">Momentumly</span>
        </h1>
        <p className="text-lg text-[#5a7150] max-w-2xl mx-auto mt-2">
          Organize your day, build meaningful habits, and track your goals—
          all in one focused, distraction-free space.
        </p>
        {!user.token && (
          <Link
            to="/signup"
            className="mt-8 inline-block px-8 py-3 bg-[#81b622] text-white text-lg font-semibold rounded-full hover:bg-[#3d550c] transition-all duration-200"
          >
            Get Started
          </Link>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-white py-10 px-6 rounded-t-[3rem] shadow-inner w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          <FeatureBlock
            icon={<CheckSquare size={44} className="text-[#3d550c] group-hover:scale-110 transition-transform" />}
            title="Smart Tasks"
            desc="Stay focused and on top of your daily to-dos with a beautiful task manager that motivates you."
          />
          <FeatureBlock
            icon={<Flame size={44} className="text-[#3d550c] group-hover:scale-110 transition-transform" />}
            title="Habit Builder"
            desc="Keep your fire alive! Build streaks and stay consistent with habits that matter."
          />
          <FeatureBlock
            icon={<BarChart3 size={44} className="text-[#3d550c] group-hover:scale-110 transition-transform" />}
            title="Insightful Dashboard"
            desc="Track your wins and visualize progress through simple yet effective graphs and stats."
          />
        </div>
      </section>

      {/* Footer Quote */}
      <footer className="py-4 text-center text-sm text-[#5a7150] italic bg-[#f6fdf4]">
        💡 “Consistency is what transforms average into excellence.”
      </footer>
    </div>
  );
};

// Feature Block Component
const FeatureBlock = ({ icon, title, desc }) => {
  return (
    <div className="group bg-[#e6f4e3] hover:bg-[#d4e8cd] rounded-xl p-6 text-center transition-all shadow-sm hover:shadow-md">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-[#5a7150]">{desc}</p>
    </div>
  );
};

export default HomePage;
