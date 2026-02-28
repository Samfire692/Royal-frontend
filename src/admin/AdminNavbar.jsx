import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { FaHome, FaUser, FaGlobe, FaArrowCircleUp, FaBullhorn, FaUserPlus, FaDoorOpen, FaTimes } from 'react-icons/fa'
import schoolLogo from '../assets/Images/Royal Ambassadors Schools Logo.png'


export const AdminNavbar = () => {

  return (
    <div className=''>
{/* Desktop view */}
        <nav className={`flex flex-col h-[90vh] lg:h-screen mx-3 my-15 rounded-2xl lg:mx-0 lg:my-0 lg:rounded lg:w-[21vw] md:w-[40vw] px-2 pt-5 adminNav fixed bg-blue-600`} style={{zIndex:"1"}}>
         <div className='flex gap-3'>
          <img src={schoolLogo} alt="" className='rounded-full w-15'/>
          <h2 className='font-bold text-2xl my-auto'>Admin Page</h2>
         </div>
           

         <div className='flex flex-col gap-4 text-xl mt-8 ms-4'>
           <Link to={'/admin/dashboard'} className='p-2 flex gap-1'><FaHome className='my-auto text-2xl'/> Dashboard</Link>

           <Link to={'/admin/profile'} className='p-2 flex gap-1'><FaUser className='my-auto text-xl'/> Profile</Link>

           <Link to={'/admin/sitemanagement'} className='p-2 flex gap-1'><FaGlobe className='my-auto'/> Site management</Link>

           <Link to={'/admin/promotion'} className='p-2 flex gap-1'><FaArrowCircleUp className='my-auto'/> Promotion</Link>

           <Link to={'/admin/announcementboard'} className='p-2 flex gap-1'><FaBullhorn className='my-auto'/> Announcement Board</Link>

           <Link to={'/admin/signin'} className='p-2 flex gap-1'><FaUserPlus className='my-auto text-2xl'/> Create Account</Link>

           <Link to={"/admin/"} className='p-2 flex gap-1'><FaDoorOpen className='my-auto text-2xl'/> Logout</Link>
         </div>
      </nav>
       
    </div>
  )
}
