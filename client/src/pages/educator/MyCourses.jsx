import React, { useContext,useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";

const MyCourses = () => {

    const {currency,setAllcourses,allcourses,enrolledCourses} = useContext(AppContext);
    const [courses,setCourses] = useState([]);

    const fetchallcourses = async()=>{;
        if(allcourses && allcourses.length > 0) {
            setCourses(allcourses);
        }
    }

    useEffect(()=>{;
      fetchallcourses();
    },[allcourses])
    
  ;

  return courses && courses.length > 0 ?  (

    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/20 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-700 rounded-2xl p-6 lg:p-8 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">My Courses 📚</h1>
              <p className="text-purple-100 text-lg">Manage and track your course performance</p>
            </div>
          </div>
        </div>

        {/* Course Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{courses.length}</p>
                <p className="text-gray-600 text-sm">Total Courses</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{courses.reduce((total, course) => total + course.enrolledStudents.length, 0)}</p>
                <p className="text-gray-600 text-sm">Total Students</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{currency}{courses.reduce((total, course) => total + Math.floor(course.enrolledStudents.length * (course.coursePrice - (course.discount*course.coursePrice)/100)), 0)}</p>
                <p className="text-gray-600 text-sm">Total Earnings</p>
              </div>
            </div>
          </div>
        </div>
        {/* Courses Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Course Performance</h2>
              </div>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {courses.length} {courses.length === 1 ? 'Course' : 'Courses'}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Course Details</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Earnings</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Students</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Published On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {courses.map((course)=>{
                   return (
                     <tr key={course._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img 
                              src={course.courseThumbnail} 
                              alt="Course Thumbnail" 
                              className="w-16 h-12 object-cover rounded-lg border-2 border-gray-200 shadow-sm" 
                            />
                            <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold">
                              ✓
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 truncate">{course.courseTitle}</p>
                            <p className="text-xs text-gray-500 mt-1">Course ID: {course._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td> 
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {currency}{Math.floor(course.enrolledStudents.length * (course.coursePrice - (course.discount*course.coursePrice)/100))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {course.enrolledStudents.length}
                          </div>
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 font-medium">
                          {new Date(course.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </td> 
                    </tr>
                   )
                })}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>

    // <div className="bg-gray-50 min-h-screen p-6">
    //   {/* Page Header */}
    //   <div className="flex justify-between items-center mb-6">
    //     <div>
    //       <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
    //       <p className="text-gray-600">Manage and view all your created courses</p>
    //     </div>
    //     <Link 
    //       to="/educator/addcourse" 
    //       className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
    //     >
    //       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    //         <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    //       </svg>
    //       Create New Course
    //     </Link>
    //   </div>

    //   {/* Tab navigation */}
    //   <div className="mb-6 border-b border-gray-200">
    //     <nav className="-mb-px flex space-x-8">
    //       <button className="border-blue-500 text-blue-600 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm">
    //         All Courses
    //       </button>
    //       <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm">
    //         Published
    //       </button>
    //       <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm">
    //         Drafts
    //       </button>
    //     </nav>
    //   </div>

    //   {/* Courses grid */}
    //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //     {courses.map((course) => (
    //       <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 flex flex-col">
    //         <div className="relative">
    //           <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
    //           <div className="absolute top-4 right-4">
    //             <span className={`text-xs font-bold px-3 py-1 rounded-full ${
    //               course.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
    //             }`}>
    //               {course.status === "published" ? "Published" : "Draft"}
    //             </span>
    //           </div>
    //         </div>
            
    //         <div className="p-5 flex-grow">
    //           <h3 className="font-semibold text-lg mb-2 text-gray-800">{course.title}</h3>
              
    //           <div className="flex items-center text-sm text-gray-500 mb-4">
    //             <div className="flex items-center mr-4">
    //               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    //               </svg>
    //               {course.students} students
    //             </div>
    //             <div className="flex items-center">
    //               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    //               </svg>
    //               {course.lessons} lessons
    //             </div>
    //           </div>
              
    //           <div className="text-lg font-bold text-gray-800 mb-4">
    //             ${course.price}
    //           </div>
    //         </div>
            
    //         <div className="bg-gray-50 p-4 flex justify-between items-center border-t border-gray-200">
    //           <button className="text-blue-600 hover:text-blue-800 font-medium">
    //             Edit Course
    //           </button>
    //           <div className="flex space-x-2">
    //             <button className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100">
    //               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    //               </svg>
    //             </button>
    //             <button className="p-2 text-gray-500 hover:text-red-600 rounded-md hover:bg-gray-100">
    //               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    //               </svg>
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>

  )  : (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/20 flex items-center justify-center">
      <Loading />
    </div>
  )
};

export default MyCourses;
