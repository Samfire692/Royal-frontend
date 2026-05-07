import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaTachometerAlt, FaUser, FaGlobe, FaArrowCircleUp, FaBullhorn, FaUserPlus, FaDoorOpen, FaHome, FaEdit, FaPlusSquare } from 'react-icons/fa'
import schoolLogo from '../assets/Images/Royal Ambassadors Schools Logo.png'

export const TeachNavbar = () => {

     const linkClasses = ({ isActive }) => 
    `flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all overflow-hidden ` + 
    (isActive ? 'bg-white text-blue-600 shadow-md' : 'text-white hover:bg-blue-400')

  return (
   <div>
        <div className='lg:px-3 lg:pt-5'>
                <nav className='fixed h-screen lg:h-[93vh] lg:rounded-2xl bg-blue-500 p-2 w-[70vw] md:w-[40vw] lg:w-[5vw] lg:hover:w-[18vw] transition-all group flex flex-col items-center overflow-hidden' style={{zIndex:"1"}}>
                <div className='mb-10 mt-2'>
                  <img src={schoolLogo} alt="logo" className='w-12 lg:w-[4vw] min-w-11.25px rounded-full' />
                </div>
          
                <div className='flex flex-col gap-4 w-full'>
   
                  <NavLink to="/teacher/dashboard" className={linkClasses}>
                    <FaTachometerAlt className='text-2xl min-w-7.5px' />
                    <span className='font-bold whitespace-nowrap block lg:hidden lg:group-hover:block'>Dashboard</span>
                  </NavLink>
          
                  <NavLink to="/teacher/profile" className={linkClasses}>
                    <FaUser className='text-2xl min-w-7.5px' />
                    <span className='font-bold whitespace-nowrap block lg:hidden lg:group-hover:block'>Profile</span>
                  </NavLink>
          
                  <NavLink to="/teacher/insertResult" className={linkClasses}>
                    <FaPlusSquare className='text-2xl min-w-7.5px' />
                    <span className='font-bold whitespace-nowrap block lg:hidden lg:group-hover:block'>Insert Result</span>
                  </NavLink>
          
                  <NavLink to="/teacher/announcementboard" className={linkClasses}>
                    <FaBullhorn className='text-2xl min-w-7.5px' />
                    <span className='font-bold whitespace-nowrap block lg:hidden lg:group-hover:block'>Announcement</span>
                  </NavLink>
          
                  <NavLink to="/teacherlogin" className='flex items-center gap-3 w-full px-3 py-2 mt-20 text-red-100 hover:bg-red-600 rounded-lg transition-all'>
                    <FaDoorOpen className='text-2xl min-w-7.5px' />
                    <span className='font-bold whitespace-nowrap block lg:hidden lg:group-hover:block'>Logout</span>
                  </NavLink>
                </div>
              </nav>
             </div>
       </div>
  )
}
