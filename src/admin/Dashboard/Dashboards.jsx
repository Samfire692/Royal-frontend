import React from 'react'
import { FaUserGraduate, FaChalkboardTeacher, FaUserCheck, FaChalkboard, FaUser, FaUserCog, FaChartPie } from 'react-icons/fa'
import { useState } from 'react'
import { useEffect } from 'react'
import CountUp from 'react-countup';
import { supabase } from '../../supabaseClient'
import Swal from 'sweetalert2'

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
             
             <div className='ps-5 py-3 rounded-3xl cursor-pointer bg-blue-200/20' style={{boxShadow:"0px 0px 3px royalblue"}}>
               <FaUserCog className='w-13 h-13 p-3 bg-blue-200/60 rounded-2xl text-blue-700'/>
               <span className='text-slate-600 block my-3.5 font-bold'>Admin</span>
               <h2 className='text-5xl font-semibold text-blue-800 px-2'>
                 <CountUp
                start={0}
                end={totalAdmin}
                duration={1}
               />
               </h2>
             </div>

             <div className='ps-5 py-3 rounded-3xl cursor-pointer bg-green-100/30' style={{boxShadow:"0px 0px 3px green"}}>
               <FaChalkboardTeacher className='w-13 h-13 p-3 rounded-2xl bg-green-200/60 text-green-700'/>
               <span className='text-slate-600 block my-3.5 font-bold'>Teachers</span>
               <h2 className='text-5xl font-semibold text-green-800 px-2'>
                 <CountUp
                start={0}
                end={totalTeachers}
                duration={1}
               />
               </h2>
             </div>

            <div className='ps-5 py-3 rounded-3xl cursor-pointer bg-purple-100/30' style={{boxShadow:"0px 0px 3px purple"}}>
               <FaUserGraduate className='w-13 h-13 p-3 rounded-2xl text-purple-700 bg-purple-300/30'/>
               <span className='text-slate-600 block my-3.5 font-bold'>Student</span>
               <h2 className='text-5xl font-semibold text-purple-700 px-2'>
                 <CountUp
                start={0}
                end={totalStudents}
                duration={1}
               />
               </h2>
             </div>

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
