import React, { useContext,useState } from "react";
import { AppContext } from "../../context/AppContext";

const MyEnrollments = () => {

  const { enrolledCourses, calculateCourseDuration,navigate } = useContext(AppContext);
  const [progressArray, setProgressArray] = useState([
    { lectureCompleted: 2, totalLectures: 7 },
    { lectureCompleted: 4, totalLectures: 7 },
    { lectureCompleted: 4, totalLectures: 7 },
    { lectureCompleted: 3, totalLectures: 7 },
    { lectureCompleted: 5, totalLectures: 6 },
    { lectureCompleted: 5, totalLectures: 6 },
    { lectureCompleted: 2, totalLectures: 5 },
    { lectureCompleted: 2, totalLectures: 12},
    { lectureCompleted: 27, totalLectures: 30 },
    { lectureCompleted: 7, totalLectures: 8},
    { lectureCompleted: 9, totalLectures: 10 },
  ])

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/20 py-8">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              My Enrollments
            </h1>
            <p className="text-gray-600">Track your learning progress and continue your courses</p>
          </div>

          {/* Enrollments Table Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 text-sm uppercase tracking-wider">Course</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 text-sm uppercase tracking-wider hidden md:table-cell">Duration</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900 text-sm uppercase tracking-wider hidden sm:table-cell">Progress</th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-900 text-sm uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {enrolledCourses.map((course, index) => {
                    const progress = progressArray[index];
                    const progressPercentage = progress ? Math.round((progress.lectureCompleted / progress.totalLectures) * 100) : 0;
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                        {/* Course Info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <img 
                                src={course.courseThumbnail} 
                                alt={course.courseTitle}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shadow-md"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm lg:text-base font-semibold text-gray-900 truncate">
                                {course.courseTitle}
                              </h3>
                              <p className="text-xs lg:text-sm text-gray-500 mt-1">
                                by GreatStack
                              </p>
                              {/* Mobile Progress */}
                              <div className="mt-2 sm:hidden">
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                  <span>{progress ? `${progress.lectureCompleted}/${progress.totalLectures} lectures` : 'N/A'}</span>
                                  <span>{progressPercentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${progressPercentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Duration */}
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="flex items-center text-sm text-gray-700">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {calculateCourseDuration(course)}
                          </div>
                        </td>

                        {/* Progress */}
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-700 font-medium">
                                {progress ? `${progress.lectureCompleted}/${progress.totalLectures}` : 'N/A'} lectures
                              </span>
                              <span className="text-blue-600 font-semibold">{progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => navigate('/player/' + course._id)}
                            className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 ${
                              progress && progress.lectureCompleted === progress.totalLectures
                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                            }`}
                          >
                            {progress && progress.lectureCompleted === progress.totalLectures ? (
                              <>
                                <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Completed
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Continue
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Empty State (if no enrollments) */}
          {enrolledCourses.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Enrollments Yet</h3>
              <p className="text-gray-600 mb-6">Start your learning journey by enrolling in courses</p>
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-200">
                Browse Courses
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyEnrollments;
