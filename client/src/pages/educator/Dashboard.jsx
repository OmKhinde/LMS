import React, { useEffect ,useContext ,useState} from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { dummyDashboardData } from "../../assets/assets";
import Loading from "../../components/student/Loading";

const Dashboard = () => {

  const {currency} =  useContext(AppContext);
  const { totalEarnings, enrolledStudentsData, totalCourses } = dummyDashboardData;
  const [dashboardData,setDashBoardData] = useState(null);
  const fetchDashboardData = async()=>{
    setDashBoardData(dummyDashboardData)
  }

  useEffect(()=>{
    fetchDashboardData();
  },[])

  // Calculate total enrolled students
  const totalStudents = enrolledStudentsData.length;
  
  // Get current date for greeting
  const today = new Date();
  const hours = today.getHours();
  let greeting = "Good Morning";
  if (hours >= 12 && hours < 18) greeting = "Good Afternoon";
  if (hours >= 18) greeting = "Good Evening";
  
  return dashboardData ? (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/20 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 lg:p-8 text-white shadow-lg">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">Welcome back, Educator! 👋</h1>
          <p className="text-blue-100 text-lg">Here's what's happening with your courses today</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {/* Total Courses Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-xl group-hover:bg-blue-200 transition-colors duration-300">
                  <img src={assets.appointments_icon} alt="courses icon" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800 mb-1">{dashboardData.totalCourses}</p>
                  <p className="text-sm text-gray-600 font-medium">Total Courses</p>
                </div>
              </div>
              <div className="text-blue-500">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Enrollments Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-200 transition-colors duration-300">
                  <img src={assets.patients_icon} alt="students icon" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800 mb-1">{dashboardData.enrolledStudentsData.length}</p>
                  <p className="text-sm text-gray-600 font-medium">Total Enrollments</p>
                </div>
              </div>
              <div className="text-green-500">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Earnings Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-xl group-hover:bg-yellow-200 transition-colors duration-300">
                  <img src={assets.earning_icon} alt="earnings icon" className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800 mb-1">{currency}{dashboardData.totalEarnings}</p>
                  <p className="text-sm text-gray-600 font-medium">Total Earnings</p>
                </div>
              </div>
              <div className="text-yellow-500">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Enrollments Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Latest Enrollments</h2>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">#</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Course Title</th> 
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                  {dashboardData.enrolledStudentsData.map((item,index)=>{
                    return (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 hidden sm:table-cell">
                          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                            {index+1}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <img 
                              src={item.student.imageUrl} 
                              alt="Profile" 
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 shadow-sm" 
                            />
                            <span className="text-sm font-semibold text-gray-900">{item.student.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-700">{item.courseTitle}</span>
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
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/20 flex items-center justify-center">
      <Loading />
    </div>
  );
  };

export default Dashboard;
