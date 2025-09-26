import React from "react";
import Hero from '../../components/student/Hero'
import Companies from "../../components/student/Companies";
import CourseSection from "../../components/student/CourseSection";
import CourseCard from "../../components/student/CourseCard";
import Testimonials from "../../components/student/Testimonials";
import CallToAction from "../../components/student/CallToAction";


const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center  bg-gray-100'>
      <Hero/>
      <Companies/>
      <CourseSection/>
      <CourseCard/>
      <Testimonials/>
      <CallToAction/>
    </div>
  );
};

export default Home;
