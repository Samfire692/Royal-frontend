import React from 'react'
import { Link } from 'react-router-dom'
import { FaUser, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa'


export const Role = () => {
  return (
    <div className=''>
      <section id='role' className='h-screen py-3'>
        <h2 className='text-4xl font-bold text-center' style={{fontFamily:"cursive"}}>Choose your Role</h2><br /><br />

        <div className='cards flex flex-col md:flex-row gap-5 lg:gap-0 md:gap-1 place-items-center h-[80vh] justify-evenly px-3'>
            {/* Admin */}
           <Link to={"/admin/"} className='hover:rotate-3 hover:transition-all focus:rotate-3 focus:transition-all'>
             <div className='border-4 border-slate-100 py-3 px-2 lg:w-[25vw] md:w-[32vw] text-center rounded-4xl'>
             <FaUser className='text-9xl mx-auto mb-3'/><hr />
             <h3 className='text-2xl font-bold mt-2'>Admin</h3>
             <p>"Oversee school operations, manage staff records, and broadcast official news to the community."</p>
             </div>
           </Link>

           <Link className='hover:rotate-3 hover:transition-all focus:rotate-3 focus:transition-all'>
             <div className='border-4 border-slate-100 py-3 px-2 lg:w-[25vw] md:w-[31.9vw] text-center rounded-4xl'>
             <FaChalkboardTeacher className='text-9xl mx-auto mb-3'/><hr />
             <h3 className='text-2xl font-bold mt-2'>Teacher/Staff</h3>
             <p>"Manage your classroom, record student performance, and shape the next generation of leaders."</p>
           </div>
           </Link>

           <Link className='hover:rotate-3 hover:transition-all focus:rotate-3 focus:transition-all'>
             <div className='border-4 border-slate-100 py-3 px-2 lg:w-[25vw] md:w-[31vw] text-center rounded-4xl '>
             <FaUserGraduate className='text-9xl mx-auto mb-3'/><hr />
             <h3 className='text-2xl font-bold mt-2'>Student</h3>
             <p>"Access your learning materials, check academic results, and stay updated with school life."</p>
           </div>           
           </Link>


        </div>
      </section>
    </div>
  )
}
