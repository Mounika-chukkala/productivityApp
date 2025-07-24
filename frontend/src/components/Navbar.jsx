import React, { useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import {
  Bell,
  User,
  LogIn,
  UserPlus,
  Menu,
  Trash,
  LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../utils/userSlice";
import axios from "axios";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileDialog, setProfileDialog] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };

 
  return (
    <>
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-200 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-2xl font-sans select-none text-[#3D550C]">
Momentumly        </Link>

        <div className="hidden md:flex items-center gap-5 text-[#2F3E2F] font-sans text-base font-semibold">
          <Link to="/" className="flex items-center gap-1 hover:text-[#81B622] transition">Home</Link>
          {user.token && (
            <>
              <Link to="/tasks" className="flex items-center gap-1 hover:text-[#81B622] transition">Tasks</Link>
              <Link to="/habits" className="flex items-center gap-1 hover:text-[#81B622] transition"> Habits</Link>
                                      <Link to="/notes" className="flex items-center gap-1 hover:text-[#81B622] transition"> Notes</Link>

                            <Link to="/today" className="flex items-center gap-1 hover:text-[#81B622] transition"> Planning</Link>

              {/* <Link to="/dashboard" className="flex items-center gap-1 hover:text-[#81B622] transition"><LayoutDashboard size={18} /> Dashboard</Link> */}
            </>
          )}

          {user.token ? (
            <>
            <Link to="/notifications" className="hover:text-[#81B622] transition"><Bell size={20} /></Link>
          <Link to="/dashboard">
            <img
            onClick={() => setProfileDialog((prev) => !prev)}
            src={user.profilePic || `https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`}
            className="rounded-full w-6 h-6"
            />
            </Link>
            </>
          ) : (
            <>
              <Link to="/signin" className="flex items-center gap-1 hover:text-[#81B622] transition"><LogIn size={18} /> Sign In</Link>
              <Link to="/signup" className="flex items-center gap-1 rounded-full px-3 py-1 bg-gradient-to-r from-[#3D550C] to-[#81B622] text-white hover:from-[#81B622] hover:to-[#3D550C] transition"><UserPlus size={18} /> Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-3">
          {user.token ? (<>
              <Link to="/notifications" className="hover:text-[#81B622] transition"><Bell size={22} /></Link>
            <Link to="/dashboard">
              <img
                src={user.profilePic || `https://api.dicebear.com/9.x/initials/svg?seed=${user.name}`}
                className="rounded-full w-7 h-7"
              />
            </Link>
            </>
          ) : (
            <Link to="/signup" className="rounded-full p-1 bg-gradient-to-r from-[#3D550C] to-[#81B622] text-white hover:from-[#81B622] hover:to-[#3D550C] transition"><UserPlus size={18} /></Link>
          )}
          <Menu size={28} onClick={toggleMenu} className="cursor-pointer text-[#81B622]" />
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="absolute top-12 right-2 bg-white shadow-lg rounded-md p-4 w-44 z-50 md:hidden">
            <ul className="flex flex-col gap-3 font-sans font-medium text-[#2F3E2F]">
              <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 hover:text-[#81B622]"> Home</Link>
              {user.token && (
                <>
                  <Link to="/tasks" onClick={() => setIsOpen(false)} className="flex items-center gap-2 hover:text-[#81B622]"> Tasks</Link>
                  <Link to="/habits" onClick={() => setIsOpen(false)} className="flex items-center gap-2 hover:text-[#81B622]"> Habits</Link>
                                    <Link to="/notes" onClick={() => setIsOpen(false)} className="flex items-center gap-2 hover:text-[#81B622]"> Notes</Link>

                                    <Link to="/today" onClick={() => setIsOpen(false)} className="flex items-center gap-2 hover:text-[#81B622]"> Planning</Link>

                  <div onClick={() => { handleLogout(); setIsOpen(false); }} className="flex items-center gap-2 hover:text-[#81B622] cursor-pointer"> Log Out</div>
                </>
              )}
              {!user.token && (
                <>
                  <Link to="/signin" onClick={() => setIsOpen(false)} className="flex items-center gap-2 hover:text-[#81B622]"><LogIn size={18} /> Sign In</Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)} className="flex items-center gap-2 hover:text-[#81B622]"><UserPlus size={18} /> Sign Up</Link>
                </>
              )}
            </ul>
          </div>
        )}

        {/* Profile Dropdown on desktop */}
        {user.token && profileDialog && (
          <div className="hidden md:flex flex-col absolute right-3 rounded-md top-14 p-2 w-35 bg-white shadow-md border border-gray-200">
            <div onClick={() => { handleLogout(); setProfileDialog(false); }} className="flex items-center gap-2 hover:text-[#81B622] px-2 py-1 cursor-pointer"> <LogOut size={13}/> Log Out</div>
          </div>
        )}
      </nav>
      <Outlet />
    </>
  );
}
