import React from "react";
import { assets } from "../../assets/assets";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const CallToAction = () => {
  const { openSignUp } = useClerk(); // or openSignIn
  const navigate = useNavigate();

  const handleGetStarted = () => {
    openSignUp(); // change to openSignIn() if you prefer sign-in
  };

  const handleLearnMore = () => {
    navigate("/course-list");
  };

  return (
    <section className="w-full flex flex-col items-center justify-center py-10 sm:py-16 px-4 sm:px-6 bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-100 rounded-2xl shadow-md mt-8 sm:mt-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 text-center leading-snug">
        Learn anything, anytime, anywhere
      </h1>

      <p className="text-gray-500 text-sm sm:text-base md:text-lg max-w-xl text-center mb-6 sm:mb-8 px-1">
        Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id
        veniam aliqua proident excepteur commodo do ea.
      </p>

      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        <button
          onClick={handleGetStarted}
          className="bg-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base shadow hover:bg-blue-700 transition-colors duration-200"
        >
          Get Started
        </button>

        <button
          onClick={handleLearnMore}
          className="bg-white text-blue-600 border border-blue-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base flex items-center gap-2 shadow hover:bg-blue-50 transition-colors duration-200"
        >
          <span>Learn More</span>
          <img
            src={assets.arrow_icon}
            alt="arrow"
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
        </button>
      </div>
    </section>
  );
};

export default CallToAction;