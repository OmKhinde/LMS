/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext= createContext({});

export const AppcontextProvider  = (props)=>{
    const currency = import.meta.env.VITE_CURRENCY;
    const [allcourses,setAllcourses] = useState([]);
    const [isEducator,setIsEducator] = useState(true);
    const navigate = useNavigate();
    
      const fetchallcourses = async()=>{
        setAllcourses(dummyCourses);
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
      },[])

    const value ={
        currency,
        allcourses,
        navigate,
        calculateRating,
        isEducator,
        setIsEducator
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

