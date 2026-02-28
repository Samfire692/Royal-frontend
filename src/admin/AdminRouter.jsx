import React from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Dashboard } from './Dashboard'
import { AdminNavbar } from './AdminNavbar'
import {AdminProfile} from './AdminProfile'
import {AdminSitemanagement} from './AdminSitemanagement'
import {Promotion} from './Promotion'
import {AdminSignin} from './AdminSignin'
import {AdminAnnouncementBoard} from './AdminAnnouncementBoard'
import { FaBars, FaTimes } from 'react-icons/fa'

 
export const AdminRouter = () => {
  const [navbar, setNavbar]= useState(false)

  return (
    <Routes>
      <Route element={<div className='lg:flex gap-2 justify-between bg-slate-200'>
      <div>
        {navbar && (
        <AdminNavbar/>
      )}

      <div className='hidden lg:block'>
        <AdminNavbar/>
      </div>
      </div>

      <div className='p-2 fixed'>
        <button className={`border p-2 text-xl h-fit lg:hidden text-center my-1.5 cursor-pointer ${!navbar ? "" : "bg-red-600 text-white"}`} style={{borderRadius:"10px"}} onClick={()=> setNavbar(!navbar)}>
        {!navbar ? <FaBars/> : <FaTimes className='float-end'/>}
      </button>
      </div>

      <div className='pt-2'>
        <Outlet/>
      </div>

      </div>}>
        <Route path='/admin/'/>
        <Route path='/admin/dashboard' element={<Dashboard/>}></Route>
        <Route path='/admin/profile' element={<AdminProfile/>}></Route>
        <Route path='/admin/sitemanagement' element={<AdminSitemanagement/>}></Route>
        <Route path='/admin/promotion' element={<Promotion/>}/>
        <Route path='/admin/announcementboard' element={<AdminAnnouncementBoard/>}></Route>
        <Route path='/admin/signin' element={<AdminSignin/>}></Route>
      </Route>
    </Routes>
  )
}
