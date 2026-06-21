import React from 'react'
import { FaUserGraduate, FaChalkboardTeacher, FaUserCheck, FaChalkboard, FaUser, FaUserCog, FaChartPie } from 'react-icons/fa'
import { useState } from 'react'
import { useEffect } from 'react'
import CountUp from 'react-countup';
import { supabase } from '../../supabaseClient'
import Swal from 'sweetalert2'
import {Link} from 'react-router-dom'

export const Dashboards = () => {

     const [totalAdmin, setTotaladmin] = useState(0)
      const [totalStudents, setTotalstudents] = useState(0)
      const [totalTeachers, setTotalteachers] = useState(0)
    
       const getStats= async ()=> {
          const {count:adminCount, error:adminerror } = await supabase 
          .from("adminsignup")
          .select("*", {count:'exact', head:true})
    
           const {count:studentCount, error:studenterror } = await supabase 
          .from("studentsignup")
          .select("*", {count:'exact', head:true})
    
           const {count:teacherCount, error:teachererror } = await supabase 
          .from("teachersignup")
          .select("*", {count:'exact', head:true})
    
          if(adminerror || studenterror || teachererror){
            Swal.fire({
              icon:"error",
              title:"Error",
              text:error.message
            })
          }else{
            setTotaladmin(adminCount || 0);
            setTotalstudents(studentCount || 0);
            setTotalteachers(teacherCount || 0);
          }
        };
    
      useEffect (()=> {
        getStats();
      }, [])

  return (
    <div>
     
      <section id='cards'>
         <div className='cards py-3 grid lg:grid-cols-4 grid-cols-2 gap-3'>
             
             <Link className='group' to={'/admin/adminlist'}><div className='ps-5 py-3 rounded-3xl bg-blue-200/20 group-hover:scale-102 transition-all' style={{boxShadow:"0px 0px 3px royalblue"}}>
              <div className='flex justify-between'>
                 <FaUserCog className='w-13 h-13 p-3 bg-blue-200/60 rounded-2xl text-blue-700'/>
                 <span className='text-blue-700/80 w-10 h-10 p-2 me-2 my-auto rounded-full group-hover:scale-130 transition-all'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path strokeDasharray="12" d="M10 14l-6.5 6.5M14 10l6.5 -6.5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="12;0"/></path><path strokeDasharray="8" stroke-dashoffset="8" d="M21 3h-6M3 21v-6M21 3v6M3 21h6"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.2s" to="0"/></path></g></svg></span>
              </div>

               <span className='text-slate-600 block my-3.5 font-bold'>Admin</span>
               <h2 className='text-5xl font-semibold text-blue-800 px-2'>
                 <CountUp
                start={0}
                end={totalAdmin}
                duration={1}
               />
               </h2>
             </div></Link>

             <Link className='group' to={'/admin/teacherlist'}>
               <div className='ps-5 py-3 rounded-3xl bg-green-100/30 group-hover:scale-102 transition-all' style={{boxShadow:"0px 0px 3px green"}}>
                 <div className='flex justify-between'>
                 <FaChalkboardTeacher className='w-13 h-13 p-3 rounded-2xl bg-green-200/60 text-green-700'/>
                 <span className='text-green-700/80 w-10 h-10 p-2 me-2 my-auto rounded-full group-hover:scale-130 transition-all'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path strokeDasharray="12" d="M10 14l-6.5 6.5M14 10l6.5 -6.5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="12;0"/></path><path strokeDasharray="8" stroke-dashoffset="8" d="M21 3h-6M3 21v-6M21 3v6M3 21h6"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.2s" to="0"/></path></g></svg></span>
                </div>
               <span className='text-slate-600 block my-3.5 font-bold'>Teachers</span>
               <h2 className='text-5xl font-semibold text-green-800 px-2'>
                 <CountUp
                start={0}
                end={totalTeachers}
                duration={1}
               />
               </h2>
             </div>
             </Link>

            <Link to={'/admin/studentlist'} className='group'>
              <div className='ps-5 py-3 rounded-3xl cursor-pointer bg-purple-100/30 group-hover:scale-102 transition-all' style={{boxShadow:"0px 0px 3px purple"}}>
              <div className='flex justify-between'>
               <FaUserGraduate className='w-13 h-13 p-3 rounded-2xl text-purple-700 bg-purple-300/30'/>
               <span className='text-purple-700/80 w-10 h-10 p-2 me-2 my-auto rounded-full group-hover:scale-130 transition-all'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path strokeDasharray="12" d="M10 14l-6.5 6.5M14 10l6.5 -6.5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="12;0"/></path><path strokeDasharray="8" stroke-dashoffset="8" d="M21 3h-6M3 21v-6M21 3v6M3 21h6"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.2s" to="0"/></path></g></svg></span>
              </div>

               <span className='text-slate-600 block my-3.5 font-bold'>Student</span>
               <h2 className='text-5xl font-semibold text-purple-700 px-2'>
                 <CountUp
                start={0}
                end={totalStudents}
                duration={1}
               />
               </h2>
             </div>
            </Link>

            <div className='ps-5 py-3 rounded-3xl cursor-pointer bg-orange-100/30' style={{boxShadow:"0px 0px 3px darkorange"}}>
               <FaChartPie className='w-13 h-13 p-3 rounded-2xl text-orange-900 bg-orange-100'/>
               <span className='text-slate-600 block my-3.5 font-bold'>Total</span>
               <h2 className='text-5xl font-semibold text-orange-900 px-2'>
                 <CountUp
                start={0}
                end={totalAdmin + totalStudents + totalTeachers}
                duration={1}
               />
               </h2>
             </div>

         </div>
      </section><br />
    </div>
  )
}
