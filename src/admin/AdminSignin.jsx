import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Signup } from './Signup'
import { FaKey, FaChalkboardTeacher, FaUser } from 'react-icons/fa'
import { StuSignUp } from '../Students/StuSignUp'
import { TeachSignUp } from '../teachers/TeachSignUp'


export const AdminSignin = () => {

 const [activeForm, setActiveform] = useState("admin")

  return (
    <div className='pb-3'>
      <div className='title mb-4'>
        <h2 className='font-bold text-3xl'>Sign Up</h2>
      </div>

      <div className='h-[55vh] w-[95vw] flex place-items-center'>
        <div className='gap-2 lg:w-[60vw] w-full h-fit mx-auto p-2 rounded-2xl' style={{boxShadow:"1px 1px 15px royalblue"}}>

        <div className='h-fit mx-auto py-4 px-3 bg-blue-500/90 rounded-xl text-white font-bold flex gap-2 flex-col lg:flex-row justify-evenly'>

        <button className={`p-3 rounded-xl hover:bg-white hover:text-blue-500 ${
          activeForm === "admin" ? "bg-white text-blue-500" : "bg-transparent"
        }`} onClick={()=> setActiveform("admin")}><span className='flex gap-2 justify-center'><FaKey className='my-auto'/> Admin SignUp</span></button>

        <button className={`p-3 rounded-xl hover:bg-white hover:text-blue-500 ${
          activeForm === "teacher" ? "bg-white text-blue-500" : "bg-transparent"
        }`} onClick={()=> setActiveform("teacher")}><span className='flex gap-2 justify-center'><FaChalkboardTeacher className='my-auto'/> Teacher's SignUp</span></button>

        <button className={`p-3 rounded-xl hover:bg-white hover:text-blue-500 ${
          activeForm === "student" ? "bg-white text-blue-500" : "bg-transparent"
        }`} onClick={()=> setActiveform("student")}><span className='flex gap-2 justify-center'><FaUser className='my-auto'/> Student's SignUp</span></button>

      </div><br />

      <div className='lg:w-[93vw]'>
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
    </div>
  )
}
