import React from 'react'
import { Link } from 'react-router-dom'
import { FaUser, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export const Role = () => {
  const navigate = useNavigate();

  return (
    <div className=''>
      <section id='role' className='h-screen py-3'>
        <div className='flex px-2'>
          <button className='bg-blue-500 rounded-2xl text-white font-bold h-fit p-2' onClick={()=> navigate("/")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024">
	          <path d="M0 0h1024v1024H0z" fill="none" />
	          <path fill="currentColor" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64" />
	          <path fill="currentColor" d="m237.2 512l265.5 265.3a32 32 0 0 1-45.4 45.4l-288-288a32 32 0 0 1 0-45.4l288-288a32 32 0 1 1 45.4 45.4z" />
            </svg>
          </button>
        </div>

         <div className=''>
          <h2 className='text-3xl font-bold text-center mx-auto' style={{fontFamily:"cursive"}}>Choose your Role</h2>
          <p className='text-center w-80 mx-auto text-slate-500'>Select the role that best describe you to get started</p>
         </div>
        <br />

        <div className='cards flex flex-col lg:flex-row gap-3 justify-evenly px-3'>
            {/* Admin */}
           <Link to={"/admin/"} className='hover:rotate-3 hover:transition-all focus:rotate-3 focus:transition-all'>
             <div className='border-4 border-slate-100 p-4 rounded-4xl flex gap-2 lg:w-md'>
             <FaUser className='text-7xl mx-auto w-28 p-3 text-blue-800 bg-blue-400/30 my-auto rounded-xl'/>
              <div>
                <h3 className='text-2xl font-bold mt-2 text-blue-900'>Admin</h3>
                <p>Manage users, settings and system operations with full access.</p>
              </div>
             </div>
           </Link>

           <Link className='hover:rotate-3 hover:transition-all focus:rotate-3 focus:transition-all' to={'/teacherlogin'}>
             <div className='border-4 border-slate-100 p-4 flex gap-2 rounded-4xl lg:w-md'>
             <FaChalkboardTeacher className='text-7xl mx-auto w-39 p-3 text-blue-800 bg-blue-400/30 my-auto rounded-xl'/>
             <div>
              <h3 className='text-2xl font-bold mt-2 text-blue-900'>Teacher</h3>
              <p>"Manage your classroom, record student performance, and shape the next generation of leaders."</p>
             </div>
           </div>
           </Link>

           <Link className='hover:rotate-3 hover:transition-all focus:rotate-3 focus:transition-all' to={'/student/'}>
             <div className='border-4 border-slate-100 p-4 rounded-4xl flex gap-2 lg:w-md'>
             <FaUserGraduate className='text-7xl mx-auto w-39 p-3 text-blue-800 bg-blue-400/30 my-auto rounded-xl'/>
            <div>
               <h3 className='text-2xl font-bold mt-2 text-blue-900'>Student</h3>
               <p>"Access your learning materials, check academic results, and stay updated with school life."</p>
            </div>
           </div>           
           </Link>


        </div>
      </section>
    </div>
  )
}
