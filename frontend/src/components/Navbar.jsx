import { Link, Outlet } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav className="flex justify-between items-center px-6 py-3 drop-shadow-lg  bg-white ">
        <h1 className="text-2xl font-bold font-serif text-[#556B2F]">MyProductivity</h1>
        <div className="space-x-5 mr-5">
          <Link
            to="/"
            className="text-[#2F3E2F] font-semibold hover:text-[#7D8C69]  transition"
          >
            Home
          </Link>
          <Link
            to="/tasks"
            className="text-[#2F3E2F] hover:text-[#7D8C69] font-bold transition"
          >
            Tasks
          </Link>
          <Link
            to="/habits"
            className="text-[#2F3E2F] hover:text-[#7D8C69] font-bold transition"
          >
            Habits
          </Link>
          <Link
            to="/notes"
            className="text-[#2F3E2F] hover:text-[#7D8C69] font-semibold transition"
          >
            Notes
          </Link>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
