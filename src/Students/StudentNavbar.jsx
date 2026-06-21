import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { FaTachometerAlt, FaUser, FaGlobe, FaArrowCircleUp, FaBullhorn, FaUserPlus, FaDoorOpen, FaHome, FaFile } from 'react-icons/fa'
import schoolLogo from '../assets/Images/Royal Ambassadors Schools Logo.png'
import { useNavigate } from 'react-router-dom'

export const StudentNavbar = () => {

    const navigate = useNavigate();
    const linkClasses = ({ isActive }) => 
    `flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all overflow-hidden ` + 
    (isActive ? 'bg-white text-blue-600 shadow-md' : 'text-white hover:bg-blue-400');

    const LogOut = async()=> {
      localStorage.clear("userProfile");

      navigate("/student/")
    }

    const fetchData = async()=> {
      const studentId = localStorage.getItem("userProfile");

      if(!studentId){
        navigate("/student/")
      }
    }

    useEffect(()=> {
      fetchData();
    }, [])

  return (
    <div>
        <div className='lg:px-3 lg:pt-5'>
             <nav className='fixed h-screen lg:h-[93vh] lg:rounded-2xl bg-blue-500 p-2 w-[70vw] md:w-[40vw] lg:w-[5vw] lg:hover:w-[18vw] transition-all group flex flex-col items-center overflow-hidden' style={{zIndex:"1"}}>
             <div className='mb-10 mt-2'>
               <img src={schoolLogo} alt="logo" className='w-12 lg:w-[4vw] min-w-11.25px rounded-full' />
             </div>
       
             <div className='flex flex-col gap-4 w-full'>

               <NavLink to="/student/dashboard" className={linkClasses}>
                 <FaTachometerAlt className='text-2xl min-w-7.5px' />
                 <span className='font-bold whitespace-nowrap block lg:hidden lg:group-hover:block'>Dashboard</span>
               </NavLink>
       
               <NavLink to="/student/profile" className={linkClasses}>
                 <FaUser className='text-2xl min-w-7.5px' />
                 <span className='font-bold whitespace-nowrap block lg:hidden lg:group-hover:block'>Profile</span>
               </NavLink>
       
               <NavLink to="/student/checkresult" className={linkClasses}>
                 <FaFile className='text-2xl min-w-7.5px' />
                 <span className='font-bold whitespace-nowrap block lg:hidden lg:group-hover:block'>Check Results</span>
               </NavLink>
       
               <button className='flex items-center gap-3 w-full px-3 py-2 mt-20 text-red-100 hover:bg-red-600 rounded-lg transition-all' onClick={LogOut}>
                 <FaDoorOpen className='text-2xl min-w-7.5px' />
                 <span className='font-bold whitespace-nowrap block lg:hidden lg:group-hover:block'>Logout</span>
               </button>
             </div>
           </nav>
          </div>
    </div>
  )
}
