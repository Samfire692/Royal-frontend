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
import { Login } from './Login'
import { AdminForm } from './AdminForm'
import { Navigate } from 'react-router-dom'
import { AdminList } from './Dashboard/AdminList'
import { TeacherList } from './Dashboard/TeacherList'
import { Studentlist } from './Dashboard/Studentlist'
import { Search } from '../Search'
import { AdminNotifications } from './AdminNotifications'

export const AdminRouter = () => {
  const [navbar, setNavbar] = useState(false)

  return (
    <Routes>
      {/* PARENT ROUTE: This handles the Layout and Sidebar */}
      <Route path="/admin/*" element={
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

          <div className='p-2 flex lg:block w-screen justify-between'>
            <div>
              <button className='border rounded-xl text-xl text-black p-1.5 lg:hidden mt-2' onClick={() => setNavbar(true)}><FaBars /></button>
            </div>


            <div className='flex justify-end'>
             <Search/>
            </div>

          </div>

          <div className='px-2 lg:mx-20 lg:w-[93vw] w-full'>
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
        <Route path='adminlist' element={<AdminList/>}/>
        <Route path='teacherlist' element={<TeacherList/>}/>
        <Route path='studentlist' element={<Studentlist/>}/>
      </Route>

      {/* OUTSIDE THE LAYOUT: Signup page */}
      <Route path='/admin/' element={<Login />} />
      <Route path='/admin/signup' element={<Signup />} />
      <Route path='/admin/form' element={<AdminForm/>}/>
      <Route path='/admin/notification' element={<AdminNotifications/>}/>
    </Routes>
  )
}