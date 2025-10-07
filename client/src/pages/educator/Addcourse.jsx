import React, { useEffect, useRef } from "react";
import { assets } from "../../assets/assets";
import uniqid from 'uniqid';
import { useState } from "react";
import Quill from 'quill';

const Addcourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setcourseTitle] = useState('');
  const [coursePrice, setcoursePrice] = useState(0);
  const [discount, setdiscount] = useState(0);
  const [image, setimage] = useState(null);
  const [chapters, setchapters] = useState([]);
  const [showpopup, setShowpopup] = useState(false);
  const [currentChapterId, setcurrentChapterId] = useState(null);
  const [lectureDetails, setlectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false
  })

  const handleChapter  = (action,chapterIndex,chapterId)=>{
      if(action==='add'){
        const title  = prompt ('Enter Chapter Name:')
        if(title){
          const newChapter  = {
            chapterId : uniqid(),
            chapterTitle : title,
            chapterContent : [],
            collapsed : false,
            chapterOrder : chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder +1 : 1,
          };
          setchapters([...chapters,newChapter]);
        }
      }

      else if(action==='remove'){
          setchapters(chapters.filter((chapter)=>{
            return chapter.chapterId !== chapterId
          }))
      }
      else if(action==='toggle'){
          setchapters(
            chapters.map((chapter)=>{
              return  (
                chapter.chapterId === chapterId ? {...chapter,collapsed : !chapter.collapsed} : chapter
              )
            })
          )
      }
  }

  const handleLecture =  (action ,chapterId,lectureIndex) =>{
      if(action=='add'){
        setcurrentChapterId(chapterId);
        setShowpopup(true);
      }
      else if(action==='remove'){
        setchapters(
          chapters.map((chapter)=>{
            if(chapter.chapterId===chapterId){
                chapter.chapterContent.splice(lectureIndex,1);
            }
            return chapter;
          })
        )
      }
  }

  const addLectures = ()=>{
    setchapters(
      chapters.map((chapter)=>{
        if(chapter.chapterId===currentChapterId){
          const newLecture = {
            ...lectureDetails,
            lectureOrder : chapter.chapterContent.length  >0  ? chapter.chapterContent.slice(-1)[0].lectureOrder +1 :1,
            lectureId : uniqid()
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );
    setShowpopup(false),
    setlectureDetails({
      lectureTitle : '',
      lectureDuration: '',
      lectureUrl:'',
      isPreviewFree : false
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle form submission
    // For now, we'll just log the course data
    console.log('Course Data:', {
      courseTitle,
      coursePrice,
      discount,
      image,
      chapters,
      description: quillRef.current?.getContents()
    });
    
    // You can add your submit logic here
    alert('Course creation functionality needs to be implemented!');
  }

  useEffect(() => {
    //initiate quill ones   makes the editor ones
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow'
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-purple-50/20 p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 lg:p-8 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">Create New Course ✏️</h1>
              <p className="text-indigo-100 text-lg">Build engaging content for your students</p>
            </div>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">Course Information</h2>
            <p className="text-gray-600 text-sm mt-1">Fill in the basic details about your course</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-8">
            {/* Course Title */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                Course Title <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                onChange={e => setcourseTitle(e.target.value)} 
                value={courseTitle} 
                placeholder="Enter an engaging course title..." 
                className="w-full outline-none py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white" 
                required 
              />
              <p className="text-xs text-gray-500">Choose a clear, descriptive title that highlights what students will learn</p>
            </div>

            {/* Course Description */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                Course Description <span className="text-red-500">*</span>
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
                <div ref={editorRef} className="min-h-[120px]"></div>
              </div>
              <p className="text-xs text-gray-500">Provide a detailed description of what students will learn</p>
            </div>

            {/* Pricing Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  Course Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                  <input 
                    type="number" 
                    onChange={e => setcoursePrice(e.target.value)} 
                    value={coursePrice} 
                    placeholder="99" 
                    className="w-full outline-none py-3 pl-8 pr-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                  Discount Percentage
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    onChange={e => setdiscount(e.target.value)} 
                    value={discount} 
                    placeholder="10" 
                    className="w-full outline-none py-3 px-4 pr-8 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white" 
                    max="100"
                    min="0"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">%</span>
                </div>
              </div>
            </div>

            {/* Course Thumbnail */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                Course Thumbnail <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors duration-200">
                <label htmlFor="thumbnailImage" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-4">
                    {image ? (
                      <div className="relative">
                        <img 
                          className="w-32 h-20 object-cover rounded-lg border-2 border-gray-200" 
                          src={URL.createObjectURL(image)} 
                          alt="Course thumbnail preview" 
                        />
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <img src={assets.file_upload_icon} alt="Upload" className="w-8 h-8" />
                      </div>
                    )}
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700">
                        {image ? 'Click to change thumbnail' : 'Click to upload thumbnail'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended: 16:9 aspect ratio, max 2MB
                      </p>
                    </div>
                  </div>
                  <input 
                    type="file" 
                    id="thumbnailImage" 
                    onChange={e => setimage(e.target.files[0])} 
                    accept="image/*" 
                    hidden 
                  />
                </label>
              </div>
            </div>

            {/* Course Content Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mt-8">
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Course Content</h2>
                    <p className="text-gray-600 text-sm mt-1">Organize your course into chapters and lectures</p>
                  </div>
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {chapters.length} {chapters.length === 1 ? 'Chapter' : 'Chapters'}
                  </div>
                </div>
              </div>
              
              <div className="p-6 lg:p-8 space-y-6">
            {/* Chapters and lectures */}
            <div className="space-y-4">
              {chapters.map((chapter, chapterIndex) => {
                return (
                  <div key={chapterIndex} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => {handleChapter('toggle', chapterIndex, chapter.chapterId)}}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                          <img 
                            src={assets.dropdown_icon} 
                            className={`w-4 h-4 transition-transform duration-200 ${chapter.collapsed && "-rotate-90"}`} 
                            alt="Toggle chapter" 
                          />
                        </button>
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                            {chapterIndex + 1}
                          </span>
                          <span className="font-semibold text-gray-800">{chapter.chapterTitle}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {chapter.chapterContent.length} {chapter.chapterContent.length === 1 ? 'Lecture' : 'Lectures'}
                        </span>
                        <button 
                          onClick={() => {handleChapter('remove', chapterIndex, chapter.chapterId)}}
                          className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
                        >
                          <img src={assets.cross_icon} className="w-4 h-4" alt="Remove chapter" />
                        </button>
                      </div>
                    </div>
                    {!chapter.collapsed && (
                      <div className="p-4 space-y-3">
                        {chapter.chapterContent.map((lecture, lectureIndex) => {
                          return (
                            <div key={lectureIndex} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-200 transition-colors duration-200">
                              <div className="flex items-center gap-3">
                                <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">
                                  {lectureIndex + 1}
                                </span>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                  <span className="font-medium text-gray-800">{lecture.lectureTitle}</span>
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                      </svg>
                                      {lecture.lectureDuration} mins
                                    </span>
                                    <a 
                                      href={lecture.lectureUrl} 
                                      className="text-blue-500 hover:text-blue-700 underline" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                    >
                                      View Link
                                    </a>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${lecture.isPreviewFree ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                      {lecture.isPreviewFree ? 'Free Preview' : 'Premium'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <button 
                                onClick={() => {handleLecture('remove', chapter.chapterId, lectureIndex)}}
                                className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
                              >
                                <img src={assets.cross_icon} className="w-4 h-4" alt="Remove lecture" />
                              </button>
                            </div>
                          )
                        })}
                        <button 
                          className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                          onClick={() => {handleLecture('add', chapter.chapterId)}}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                          Add Lecture
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            
            {/* Add Chapter Button */}
            <div className="flex justify-center pt-4">
              <button 
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                onClick={() => handleChapter('add')}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Chapter
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-8">
          <button 
            type="submit"  
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 text-lg"
          >
            🚀 Create Course
          </button>
        </div>
      </form>
    </div>
  </div>

  {/* Lecture Details Modal */}
  {showpopup && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
      <div className="bg-white text-gray-700 rounded-2xl shadow-2xl w-full max-w-md relative transform transition-all duration-300 scale-100">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Add New Lecture</h2>
              <button 
                onClick={() => setShowpopup(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <img src={assets.cross_icon} alt="Close" className="w-4 h-4" />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lecture Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter lecture title..."
                  value={lectureDetails.lectureTitle}
                  onChange={(e) => {
                    setlectureDetails({
                      ...lectureDetails,
                      lectureTitle: e.target.value
                    })
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number" 
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="e.g., 45"
                  min="1"
                  value={lectureDetails.lectureDuration}
                  onChange={(e) => {
                    setlectureDetails({
                      ...lectureDetails,
                      lectureDuration: e.target.value
                    })
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lecture URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url" 
                  className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="https://youtube.com/watch?v=..."
                  value={lectureDetails.lectureUrl}
                  onChange={(e) => {
                    setlectureDetails({
                      ...lectureDetails,
                      lectureUrl: e.target.value
                    })
                  }}
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox" 
                  id="isPreviewFree"
                  className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  checked={lectureDetails.isPreviewFree}
                  onChange={(e) => {
                    setlectureDetails({
                      ...lectureDetails,
                      isPreviewFree: e.target.checked
                    })
                  }}
                />
                <label htmlFor="isPreviewFree" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Make this lecture free to preview
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button 
                type="button" 
                onClick={() => setShowpopup(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
              <button  
                onClick={() => addLectures()}
                type="button" 
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
              >
                Add Lecture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
};

export default Addcourse;