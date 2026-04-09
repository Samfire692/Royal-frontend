import React from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { Home } from './Home'
import { About } from './About'
import {Admission} from './Admission'
import {Facilities} from './Facilities'
import {News} from './News'
import {Events} from './Events'
import {Contacts} from './Contacts'
import {Role} from './Role'
import { Navbar } from './Navbar'
import { Login } from '../admin/Login'
import { StuSignUp } from '../Students/StuSignUp'
import { AdmissionForm } from './AdmissionForm'
import { StuLogin } from '../Students/StuLogin'
import { StudentDashboard } from '../Students/StudentDashboard'

export const Router = () => {
  return (
    <Routes>
      <Route element={<><Navbar/><Outlet /></>}>
      <Route path='/' element={<Home/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/admission' element={<Admission/>}/>
      <Route path='/facilities' element={<Facilities/>}/>
      <Route path='/news' element={<News/>}/>
      <Route path='/events' element={<Events/>}/>
      <Route path='/contacts' element={<Contacts/>}/>
      </Route>

      <Route path='admissionform' element={<AdmissionForm/>}/>
      <Route path='role' element={<Role/>}/>

      {/* admin */}
      {/* <Route path='/admin/' element={<Login/>}></Route> */}
    </Routes>
  )
}
