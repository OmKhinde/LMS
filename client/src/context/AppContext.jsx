/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser} from '@clerk/clerk-react'


// eslint-disable-next-line react-refresh/only-export-components
export const AppContext= createContext({});

export const AppcontextProvider  = (props)=>{
    const currency = import.meta.env.VITE_CURRENCY;
    const [allcourses,setAllcourses] = useState([]);
    const [isEducator,setIsEducator] = useState(true);
    const [enrolledCourses,setEnrolledCourses] = useState([]);
    const navigate = useNavigate();
    const {getToken} = useAuth();
    const {user} = useUser();
    
      const fetchallcourses = async()=>{
        setAllcourses(dummyCourses);
      }

      const fetchUserEnrolledCourses = async ()=>{
         setEnrolledCourses(dummyCourses);
      }

      const calculateRating = (course)=>{
        if(course.courseRatings.length === 0){
          return 0;
        }
        let totalrating = 0;
        course.courseRatings.forEach(rating => {
          totalrating += rating.rating
        });

        return totalrating/course.courseRatings.length;
      }

      useEffect(()=>{
        fetchallcourses()
        fetchUserEnrolledCourses();
      },[])

        const logtoken = async()=>{
          console.log(await getToken() )
        }
        useEffect(()=>{
          if(user){
            logtoken()
          }
        },[user])

      //to calculate chapter time
      const calculateChapterTime = (chapter)=>{
        let time= 0;
        chapter.chapterContent.map((lecture)=>time += lecture.lectureDuration )
        return humanizeDuration(time * 60 *1000,{units : ["h","m"]})
      }

      //to calculate course duration of the course
      const calculateCourseDuration = (course)=>{
        let time = 0;
        course.courseContent.map((chapter)=>{
          chapter.chapterContent.map(
            (lecture) => time+= lecture.lectureDuration
          )
        })
        return humanizeDuration(time * 60 *1000, { units: ["h", "m"] });
      }

      //function calculate to no. of lectures in the course
      const calculateNoofLectures = (course)=>{
        let totalLectures = 0;
        course.courseContent.forEach( chapter =>{
          if(Array.isArray(chapter.chapterContent)){
            totalLectures +=  chapter.chapterContent.length
          }
        });
        return totalLectures;

      }

    const value ={
        currency,
        allcourses,
        navigate,
        calculateRating,
        isEducator,
        setIsEducator,
        calculateCourseDuration,
        calculateNoofLectures,
        calculateChapterTime,
        enrolledCourses,
        fetchUserEnrolledCourses
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

