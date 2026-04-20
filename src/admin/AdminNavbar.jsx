import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaTachometerAlt, FaUser, FaGlobe, FaArrowCircleUp, FaBullhorn, FaUserPlus, FaDoorOpen, FaHome } from 'react-icons/fa'
import schoolLogo from '../assets/Images/Royal Ambassadors Schools Logo.png'
import { supabase } from '../supabaseClient'

export const AdminNavbar = () => {

  const handleLogout = async()=>{
   await supabase.auth.signOut();

   localStorage.clear();
  }


  const linkClasses = ({ isActive }) => 
    `flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all overflow-hidden ` + 
    (isActive ? 'bg-white text-blue-600 shadow-md' : 'text-white hover:bg-blue-400')

  return (
   <div className='lg:px-3 lg:pt-5'>
      <nav className='fixed h-screen lg:h-[93vh] lg:rounded-2xl bg-blue-500 p-2 w-[70vw] md:w-[40vw] lg:w-[5vw] lg:hover:w-[18vw] transition-all group flex flex-col items-center overflow-hidden' style={{zIndex:"1"}}>
      <div className='mb-10 mt-2'>
        <img src={schoolLogo} alt="logo" className='w-12 lg:w-[4vw] min-w-11.25px rounded-full' />
      </div>

      <div className='flex flex-col gap-4 w-full'>
         <NavLink to="/" className={linkClasses}>
          <FaHome className='text-2xl min-w-7.5px' />
          <span className='font-bold whitespace-nowrap block lg:hidden lg:group-hover:block'>Home</span>
        </NavLink>

        <NavLink to="/admin/dashboard" className={linkClasses}>
          <FaTachometerAlt className='text-2xl min-w-7.5px' />
          <span className='font-bold whitespace-nowrap block lg:hidden lg:group-hover:block'>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/profile" className={linkClasses}>
          <FaUser className='text-2xl min-w-7.5px' />
          <span className='font-bold whitespace-nowrap block lg:hidden lg:group-hover:block'>Profile</span>
        </NavLink>

        <NavLink to="/admin/sitemanagement" className={linkClasses}>
          <FaGlobe className='text-2xl min-w-7.5px' />
          <span className='font-bold whitespace-nowrap block lg:hidden lg:group-hover:block'>Site Management</span>
        </NavLink>

        <NavLink to="/admin/promotion" className={linkClasses}>
          <FaArrowCircleUp className='text-2xl min-w-7.5px' />
          <span className='font-bold whitespace-nowrap block lg:hidden lg:group-hover:block'>Promotion</span>
        </NavLink>

        <NavLink to="/admin/announcementboard" className={linkClasses}>
          <FaBullhorn className='text-2xl min-w-7.5px' />
          <span className='font-bold whitespace-nowrap block lg:hidden lg:group-hover:block'>Announcement</span>
        </NavLink>

        <NavLink to="/admin/signin" className={linkClasses}>
          <FaUserPlus className='text-2xl min-w-7.5px' />
          <span className='font-bold whitespace-nowrap block lg:hidden lg:group-hover:block'>Sign In</span>
        </NavLink>

        <NavLink to="/admin/" className='flex items-center gap-3 w-full px-3 py-2 mt-20 text-red-100 hover:bg-red-600 rounded-lg transition-all' onClick={handleLogout}>
          <FaDoorOpen className='text-2xl min-w-7.5px' />
          <span className='font-bold whitespace-nowrap block lg:hidden lg:group-hover:block'>Logout</span>
        </NavLink>
        
      </div>
    </nav>
   </div>
  )
}