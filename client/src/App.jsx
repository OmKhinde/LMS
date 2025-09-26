import React from 'react'
import { Routes ,Route,useMatch} from 'react-router-dom'
import CourseList from './pages/student/CourseList'
import CourseDetailes from './pages/student/CourseDetailes'
import MyEnrollments from './pages/student/MyEnrollments'
import Home from './pages/student/Home'
import Player from './pages/student/Player'
import Loading from './components/student/Loading'
import Addcourse from './pages/educator/Addcourse'
import Dashboard from './pages/educator/Dashboard'
import MyCourses from './pages/educator/MyCourses'
import Educator from './pages/educator/Educator'
import StudentEnrolled from './pages/educator/StudentEnrolled'
import Navbar from './components/student/Navbar'
import Footer from './components/student/Footer'

const App = () => {

  const isEducatorRoute = useMatch('/educator/*');

  return (
    <div className='text-default min-h-screen bg-white'>
      {!isEducatorRoute && <Navbar/>}
      
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/course-list' element={<CourseList/>}/>
          <Route path='/course-list/:input' element={<CourseList/>}/>
          <Route path='/course/:id' element={<CourseDetailes/>}/>
          <Route path='/myenrollments' element={<MyEnrollments/>}/>
          <Route path='/player/:courseId' element={<Player/>}/>
          <Route path='/loading/:path' element={<Loading/>}/>
          <Route path='/educator' element={<Educator/>}>
              <Route path='addcourse'  element={<Addcourse/>}/>
              <Route path='dashboard'  element={<Dashboard/>}/>
              <Route path='mycourses'  element={<MyCourses/>}/>
              <Route path='studentenrolled'  element={<StudentEnrolled/>}/>
          </Route>
        </Routes>
      {!isEducatorRoute && <Footer/>}
    </div>
  )
}

export default App