import React, { useContext } from "react";
import { assets, dummyEducatorData } from '../../assets/assets'
import { Link, useLocation } from "react-router-dom";   // ✅ IMPORT useLocation
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const location = useLocation();
  const isCourseListPage = location.pathname.includes("course-list");

  const { openSignIn } = useClerk();
  const { user } = useUser();
  const { navigate, isEducator } = useContext(AppContext);

  const becomeEducator = async () => {
    if (isEducator || user?.publicMetadata?.role === "educator") {
      navigate("/educator");
      return;
    }
    navigate("/educator/apply");
  };

  const goHome = () => navigate("/");

  return (
    <nav
      className={`flex items-center justify-between border-b border-gray-300 py-3 px-3 sm:px-6 lg:px-12 
        ${isCourseListPage ? "bg-white" : "bg-cyan-100/70"}`}
    >
      {/* Logo */}
      <button
        type="button"
        onClick={goHome}
        className="flex items-center gap-2 focus:outline-none"
      >
        <img
          src={assets.logo}
          alt="Logo"
          className="w-24 sm:w-28 lg:w-32 cursor-pointer"
        />
      </button>

      {/* Desktop actions */}
      <div className="hidden md:flex items-center gap-6 text-gray-600 text-sm">
        {user && (
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={becomeEducator}
              className="hover:text-gray-900"
            >
              {isEducator ? "Educator Dashboard" : "Become Educator"}
            </button>

            <Link
              to="/myenrollments"
              className="hover:text-gray-900 whitespace-nowrap"
            >
              My Enrollments
            </Link>
          </div>
        )}

        {user ? (
          <UserButton />
        ) : (
          <button
            type="button"
            onClick={() => openSignIn()}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-blue-700 transition"
          >
            Create account
          </button>
        )}
      </div>

      {/* Mobile actions */}
      <div className="flex md:hidden items-center gap-2">
        {user && (
          <div className="flex items-center gap-1 text-[11px] text-gray-600">
            <button
              type="button"
              onClick={() => navigate("/myenrollments")}
              className="px-2 py-1 rounded-full bg-white/80 border border-gray-200 font-medium"
            >
              Enrollments
            </button>
            <button
              type="button"
              onClick={becomeEducator}
              className="px-2 py-1 rounded-full bg-white/80 border border-gray-200 font-medium"
            >
              {isEducator ? "Dashboard" : "Educator"}
            </button>
          </div>
        )}

        <div>
          {user ? (
            <UserButton />
          ) : (
            <button
              type="button"
              onClick={() => openSignIn()}
              className="p-1 rounded-full border border-gray-300 bg-white"
            >
              <img src={assets.user_icon} alt="Sign in" className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
