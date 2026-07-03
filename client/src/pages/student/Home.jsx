import React from "react";
import Hero from '../../components/student/Hero'
import Companies from "../../components/student/Companies";
import CourseSection from "../../components/student/CourseSection";
import Testimonials from "../../components/student/Testimonials";
import CallToAction from "../../components/student/CallToAction";


const Home = () => {
  return (
    <div className='flex flex-col items-center w-full bg-gray-100'>
      <div className="w-full flex flex-col items-center space-y-6 sm:space-y-8 text-center">
        <Hero/>
        <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-0 flex flex-col items-center">
          <Companies/>
        </div>
        <div className="w-full">
          <CourseSection/>
        </div>
        <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-0 flex flex-col items-center">
          <Testimonials/>
        </div>
        <div className="w-full px-0 pb-10">
          <CallToAction/>
        </div>
      </div>
    </div>
  );
};

export default Home;
