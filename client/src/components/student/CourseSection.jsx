import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";

const CourseSection = () => {
  const { allcourses } = useContext(AppContext);

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-8 lg:px-40 flex flex-col items-center text-center">
      <h2 className="text-2xl sm:text-3xl font-medium text-gray-800">
        Learn from the best
      </h2>
      <p className="text-sm sm:text-base text-gray-500 mt-3 max-w-2xl">
        Discover our top-rated courses across various categories. From coding
        to design to business and wellness, our courses are crafted to deliver
        results.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-10">
        {Array.isArray(allcourses) &&
          allcourses.slice(0, 4).map((course, index) =>
            course ? <CourseCard key={index} course={course} /> : null
          )}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          to="/course-list"
          onClick={() => {
            scrollTo(0, 0);
          }}
          className="text-gray-600 text-sm sm:text-base border border-gray-500/30 px-6 sm:px-10 py-2.5 sm:py-3 rounded-full hover:bg-gray-50 transition-colors"
        >
          Show all courses
        </Link>
      </div>
    </section>
  );
};

export default CourseSection;