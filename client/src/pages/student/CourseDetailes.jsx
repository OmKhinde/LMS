import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import Navbar from "../../components/student/Navbar";
import Footer from "../../components/student/Footer";

const CourseDetailes = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { allcourses, currency } = useContext(AppContext);
  
  const fetchAllCourse = async() => {
    if (allcourses && allcourses.length > 0) {
      const findCourse = allcourses.find(course => course._id === id);
      setCourseData(findCourse);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAllCourse();
  }, [allcourses, id])

  if (loading) {
    return <Loading />;
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
       
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-8 max-w-md bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Course Not Found</h2>
            <p className="text-gray-500 mb-6">The course you're looking for could not be found or may have been removed.</p>
            <button 
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
  
      
      <div className="flex-grow">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              <div className="lg:w-2/3 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{courseData.courseTitle}</h1>
                <p className="text-blue-100 mb-6">{courseData.courseDescription}</p>
                
                <div className="flex items-center mb-6">
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium mr-3">
                    {courseData.category}
                  </div>
                  <div className="flex items-center text-yellow-300 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1">{courseData.rating || "4.5"}</span>
                  </div>
                  <div className="text-blue-100">
                    {courseData.totalStudents || "0"} students enrolled
                  </div>
                </div>
                
                <div className="flex items-center mb-8">
                  <div className="flex items-center mr-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{courseData.courseDuration || "Self-paced"}</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>{courseData.totalLessons || 0} lessons</span>
                  </div>
                </div>
                
                <button className="bg-white text-blue-700 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors shadow-lg">
                  Enroll Now for {currency}{courseData.price}
                </button>
              </div>
              
              <div className="lg:w-1/3 w-full mt-6 lg:mt-0">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                  <img 
                    src={courseData.thumbnail || "https://via.placeholder.com/600x400?text=Course+Thumbnail"} 
                    alt={courseData.courseTitle}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-4">What you'll learn</h3>
                    <ul className="space-y-3">
                      {courseData.learningOutcomes ? (
                        courseData.learningOutcomes.map((outcome, index) => (
                          <li key={index} className="flex">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{outcome}</span>
                          </li>
                        ))
                      ) : (
                        <li className="flex">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Comprehensive knowledge of this subject</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto max-w-6xl py-12 px-4">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Course Description</h2>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: courseData.courseDescription || "No description available." }}
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Course Content</h2>
            
            {courseData.content && courseData.content.length > 0 ? (
              <div className="space-y-4">
                {courseData.content.map((section, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                      <h3 className="font-medium">{section.title}</h3>
                      <span className="text-sm text-gray-500">{section.lessons?.length || 0} lessons</span>
                    </div>
                    <ul className="divide-y divide-gray-200">
                      {section.lessons?.map((lesson, lessonIndex) => (
                        <li key={lessonIndex} className="px-4 py-3 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{lesson.title}</span>
                          <span className="ml-auto text-sm text-gray-500">{lesson.duration || "00:00"}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No content available for this course yet.</p>
            )}
          </div>
        </div>
      </div>
      
     
    </div>
  );
};

export default CourseDetailes;
