import React, { useState } from 'react'
import profilepic from '../assets/Images/admin profile pic.jfif'
import { Routes, Route, Outlet, Link } from 'react-router-dom'
import { Dashboard } from './Dashboard'
import { AdminNavbar } from './AdminNavbar'
import { AdminProfile } from './AdminProfile'
import { AdminSitemanagement } from './AdminSitemanagement'
import { Promotion } from './Promotion'
import { AdminSignin } from './AdminSignin'
import { AdminAnnouncementBoard } from './AdminAnnouncementBoard'
import { FaBars, FaTimes, FaSearch, FaBell } from 'react-icons/fa'
import { Search } from './Search'
import { Login } from './Login'

export const AdminRouter = () => {
  const [navbar, setNavbar] = useState(false)

  return (
   <Routes>
        <Route element={
          <div className=' bg-white text-black'>

          <div className='lg:block hidden'>
            <AdminNavbar />
          </div>

          <div>
            {navbar && (
             <div className='flex'>
              <AdminNavbar />
              <button className='text-white border-0 rounded-xl w-9 h-9 p-1.5 absolute text-2xl right-22 md:left-90 top-2 bg-red-500' onClick={()=> setNavbar(false)}><FaTimes/></button>
             </div>
          )}
          </div>
           
          <div className='p-2 flex w-screen justify-between border border-b-slate-400 border-t-0 border-r-0 border-l-0'>
           <div>
             <button className='border rounded-xl text-2xl text-black w-9 h-9 p-1.5 lg:hidden my-3.5' onClick={()=> setNavbar(true)}><FaBars/></button>
           </div>

           <div>
            <Search/>
           </div>

            <div className='flex justify-around py-1 lg:w-[7vw] lg:gap-0 gap-1.5 lg:mx-0'>
              <Link>
               <button className='bg-slate-300 p-2 rounded-full my-2'><FaBell className='text-xl'/></button>
              </Link>

              {/* <img src={profilepic} alt="dummy profile pic" className='w-12 h-12 my-0.5 rounded-full shadow shadow-slate-400'/> */}

              
            </div>

          </div>
           
           <div className='px-2 lg:mx-20 pt-2'>
            <Outlet/>
           </div>
          </div>
        }>
        <Route path='/admin/' element={<Login/>}/>

        <Route path='/admin/dashboard' element={<Dashboard/>}/>

        <Route path='/admin/profile' element={<AdminProfile />} />

        <Route path='/admin/sitemanagement' element={<AdminSitemanagement />} />

        <Route path='/admin/promotion' element={<Promotion />} />

        <Route path='/admin/announcementboard' element={<AdminAnnouncementBoard />} />

        <Route path='/admin/signin' element={<AdminSignin />} />
        </Route>
   </Routes>
  )
}