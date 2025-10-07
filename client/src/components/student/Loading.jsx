import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Main Loading Spinner */}
        <div className="relative mb-8">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto absolute top-2 left-1/2 transform -translate-x-1/2" style={{animation: 'spin 1.5s linear infinite reverse'}}></div>
        </div>

        {/* Loading Text with Animation */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-2 animate-pulse">Loading Course</h2>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>

        {/* Progress Bar Animation */}
        <div className="w-64 bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
        </div>

        {/* Loading Steps */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center justify-center space-x-2 animate-pulse">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>Fetching course data...</span>
          </div>
          <div className="flex items-center justify-center space-x-2 animate-pulse" style={{animationDelay: '0.5s'}}>
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
            <span>Loading content...</span>
          </div>
          <div className="flex items-center justify-center space-x-2 animate-pulse" style={{animationDelay: '1s'}}>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span>Preparing interface...</span>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400 rounded-full opacity-20 animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-purple-400 rounded-full opacity-20 animate-ping" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-green-400 rounded-full opacity-20 animate-ping" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-pink-400 rounded-full opacity-20 animate-ping" style={{animationDelay: '1.5s'}}></div>
        </div>

        {/* Logo or Brand Element (Optional) */}
        <div className="mt-8 opacity-50">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mx-auto animate-pulse"></div>
          <p className="text-xs text-gray-500 mt-2 animate-pulse">LMS Platform</p>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 border border-blue-300 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-purple-300 rounded-full animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 border border-green-300 rounded-full animate-spin" style={{animationDuration: '25s'}}></div>
      </div>
    </div>
  );
};

export default Loading;
