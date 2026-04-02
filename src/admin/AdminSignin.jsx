import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Signup } from './Signup'
import { FaKey, FaChalkboardTeacher, FaUser } from 'react-icons/fa'
import { StuSignUp } from '../Students/StuSignUp'
import { TeachSignUp } from '../teachers/TeachSignUp'


export const AdminSignin = () => {

 const [activeForm, setActiveform] = useState("admin")

  return (
    <div className=''>
      <div className='title mb-4'>
        <h2 className='font-bold text-3xl'>Sign Up</h2>
      </div>

      <div className='flex lg:flex-row flex-col gap-2'>

        <div className='h-fit py-4 px-2 bg-blue-500/90 lg:w-[18vw] md:w-[30vw] rounded-xl text-white font-bold flex gap-2 flex-col'>

        <button className={`p-2 rounded-xl hover:bg-white hover:text-blue-500 text-start ${
          activeForm === "admin" ? "bg-white text-blue-500" : "bg-transparent"
        }`} onClick={()=> setActiveform("admin")}><span className='flex gap-2'><FaKey className='my-auto'/> Admin SignUp</span></button>

        <button className={`p-2 rounded-xl hover:bg-white hover:text-blue-500 text-start ${
          activeForm === "teacher" ? "bg-white text-blue-500" : "bg-transparent"
        }`} onClick={()=> setActiveform("teacher")}><span className='flex gap-2'><FaChalkboardTeacher className='my-auto'/> Teacher's SignUp</span></button>

        <button className={`p-2 rounded-xl hover:bg-white hover:text-blue-500 text-start ${
          activeForm === "student" ? "bg-white text-blue-500" : "bg-transparent"
        }`} onClick={()=> setActiveform("student")}><span className='flex gap-2'><FaUser className='my-auto'/> Student's SignUp</span></button>

      </div>

      <div className='mx-auto w-[95vw] lg:w-fit'>
        {activeForm === "admin" && (
          <Signup/>
        )}

        {activeForm === "teacher" && (
          <TeachSignUp/>
        )}

        {activeForm === "student" && (
          <StuSignUp/>
        )}
        
      </div>
      </div>
    </div>
  )
}
