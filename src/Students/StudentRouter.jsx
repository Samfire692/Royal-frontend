import React, { useState, useEffect } from 'react'
import { Route, Routes, Outlet, useNavigate } from 'react-router-dom'
import { StudentNavbar } from './StudentNavbar'
import { StudentDashboard } from './StudentDashboard'
import { StuLogin } from './StuLogin'
import { FaBars, FaTimes, FaBell } from 'react-icons/fa'
import { Search } from '../admin/Search'
import { Link } from 'react-router-dom'
import { StudentProfile } from './StudentProfile'

export const StudentRouter = () => {
    const [user, setUser] = useState(null)
    const [navbar, setNavbar] = useState(false)

    useEffect(() => {
        const storedUser = localStorage.getItem('userProfile')
        if (storedUser) setUser(JSON.parse(storedUser))
    }, [])

    return (
        <Routes>
            <Route path='student' element={
                <div>
                    <div className='lg:block hidden'>
                        <StudentNavbar/>
                    </div>

                    <div>
            {navbar && (
              <div className='flex'>
                <StudentNavbar />
                <button className='text-white border-0 rounded-xl w-9 h-9 p-1.5 absolute text-2xl right-22 md:left-90 top-2 bg-red-500' onClick={() => setNavbar(false)}><FaTimes /></button>
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
              <Search/>
              <Link to="#">
                <button className='bg-slate-300 p-2.5 rounded-full mt-2 h-11 w-11'><FaBell className='text-2xl' /></button>
              </Link>
            </div>

          </div>

          <div className='px-2 lg:mx-20 pt-2'>
            {/* CHILD PAGES LOAD HERE */}
            <Outlet context={{ user }}/>
          </div>

                </div>
            }>
             <Route path='dashboard' element={<StudentDashboard/>}/>
             <Route path='profile' element={<StudentProfile/>}/>
            </Route>
             
            <Route path='/student/' element={<StuLogin />}/>
        </Routes>
    )
}