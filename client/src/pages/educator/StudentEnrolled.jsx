import React , { useEffect, useState,useContext} from 'react';
import { assets } from '../../assets/assets';
import { dummyStudentEnrolled } from '../../assets/assets';
import Loading from "../../components/student/Loading";
import { AppContext } from '../../context/AppContext';

const StudentEnrolled = ()=>{
    const [enrolledStudents, setEnrolledStudents] = useState(null);
    const fetchEnrolledStudents = async()=>{
        setEnrolledStudents(dummyStudentEnrolled);
    }

    const {allcourses,currency} = useContext(AppContext)

    useEffect(()=>{
        fetchEnrolledStudents()
    },[])

    return enrolledStudents? (
        <div>
            <div>
                <table className='table-fixed md:table-auto w-full overflow-hidden pb-4'>
                    <thead className='text-gray-900 border border-gray-500/20 text-sm text-left'>
                        <tr>
                            <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell '>
                                #
                            </th>
                            <th className='px-4 py-3 font-semibold'> Student Name</th>
                            <th className='px-4 py-3 font-semibold'> Course Title</th>
                            <th className='px-4 py-3 font-semibold hidden sm:table-cell '>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                            {enrolledStudents.map((student,studentindex)=>{
                                return  (
                                <tr key={studentindex} className="border-b border-gray-500/20">
                                    <td className="px-4 py-3 text-center hidden sm:table-cell"> {studentindex +1} </td>
                                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                                        <img 
                                            src={student.student.imageUrl} 
                                            alt="Student Profile" 
                                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/40x40/4F46E5/FFFFFF?text=' + student.student.name.charAt(0);
                                            }}
                                        />
                                        <span className="truncate font-medium text-gray-800"> {student.student.name} </span>
                                    </td> 
                                    <td className="px-4 py-3 font-medium text-gray-700">
                                        {student.courseTitle}
                                    </td>
                                
                                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{new Date(student.purchaseDate).toLocaleDateString()}</td> 
                                    
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    ) : <Loading/>
}

export default StudentEnrolled;