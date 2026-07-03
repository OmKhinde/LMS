import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const Searchbar = ({ data }) => {
  const [input, setInput] = useState(data ? data : "");
  const navigate = useNavigate();

  const onSearchHandler = (e) => {
    e.preventDefault();
    navigate("/course-list/" + input);
  };
return (
  <form
    onSubmit={onSearchHandler}
    className="flex flex-wrap items-center w-full max-w-xl mx-auto mt-6 sm:mt-8 bg-white rounded-full shadow px-3 py-2 gap-2"
  >
    <img
      src={assets.search_icon}
      alt="search_icon"
      className="w-5 h-5 sm:w-6 sm:h-6 ml-1"
    />

    <input
      onChange={(e) => setInput(e.target.value)}
      value={input}
      type="text"
      placeholder="Search for Courses"
      className="flex-1 min-w-0 bg-transparent outline-none text-gray-600 px-2 sm:px-3 py-1 text-sm"
    />

    <button
      type="submit"
      className="bg-blue-600 rounded-full text-white px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap"
    >
      Search
    </button>
  </form>
);
};

export default Searchbar;