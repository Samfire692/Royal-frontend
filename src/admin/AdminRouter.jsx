import React, { useState } from 'react'
import profilepic from '../assets/Images/admin profile pic.jfif'
import { Routes, Route, Outlet, Link, useLocation } from 'react-router-dom'
import { Dashboard } from './Dashboard'
import { AdminNavbar } from './AdminNavbar'
import { AdminProfile } from './AdminProfile'
import { AdminSitemanagement } from './AdminSitemanagement'
import { Promotion } from './Promotion'
import { AdminSignin } from './AdminSignin'
import { AdminAnnouncementBoard } from './AdminAnnouncementBoard'
import { Signup } from './Signup'
import { FaBars, FaTimes, FaSearch, FaBell } from 'react-icons/fa'
import { Search } from './Search'
import { Login } from './Login'
import { AdminForm } from './AdminForm'
import { Navigate } from 'react-router-dom'

export const AdminRouter = () => {
  const [navbar, setNavbar] = useState(false)

  return (
    <Routes>
      {/* PARENT ROUTE: This handles the Layout and Sidebar */}
      <Route path="/admin" element={
        <div className='text-black'>

          <div className='lg:block hidden'>
            <AdminNavbar />
          </div>

          <div>
            {navbar && (
              <div className='flex'>
                <AdminNavbar/>
                <button className='text-white border-0 rounded-xl w-9 h-9 p-1.5 absolute left-[72vw] md:left-[41vw] text-2xl top-2 bg-red-500' onClick={() => setNavbar(false)} style={{zIndex:"100"}}><FaTimes /></button>
              </div>
            )}
          </div>

          <div className='p-2 flex w-screen justify-between border border-b-slate-400 border-t-0 border-r-0 border-l-0'>
            <div>
              <button className='border rounded-xl text-xl text-black p-1.5 lg:hidden mt-3' onClick={() => setNavbar(true)}><FaBars /></button>
            </div>

            <div>
              {/* Space for center content if needed */}
            </div>

            <div className='flex justify-around gap-1.5 px-2'>
              <Search />
              <Link to="#">
                <button className='bg-slate-300 p-2.5 rounded-full mt-2 h-11 w-11'><FaBell className='text-2xl' /></button>
              </Link>
            </div>

          </div>

          <div className='px-2 lg:mx-20 pt-2 lg:w-[93vw] w-full'>
            {/* CHILD PAGES LOAD HERE */}
            <Outlet />
          </div>
        </div>
      }>
        {/* CHILD ROUTES: No need for /admin/ prefix here because they are nested */}
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='profile' element={<AdminProfile />} />
        <Route path='sitemanagement' element={<AdminSitemanagement />} />
        <Route path='promotion' element={<Promotion />} />
        <Route path='announcementboard' element={<AdminAnnouncementBoard />} />
        <Route path='signin' element={<AdminSignin />} />
      </Route>

      {/* OUTSIDE THE LAYOUT: Signup page */}
      <Route path='/admin/' element={<Login />} />
      <Route path='/admin/signup' element={<Signup />} />
      <Route path='/admin/form' element={<AdminForm/>}/>
    </Routes>
  )
}