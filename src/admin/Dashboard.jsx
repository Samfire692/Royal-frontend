import React from 'react'
import { FaUserGraduate, FaChalkboardTeacher, FaUserCheck, FaChalkboard, FaUser } from 'react-icons/fa'
import { Form } from './Dashboard/Form'
import { Total } from './Dashboard/Total'
import { Attendance } from './Dashboard/Attendance'
import { Birthday } from './Dashboard/Birthday'
import { useState } from 'react'
import { useEffect } from 'react'
import CountUp from 'react-countup';
import { supabase } from '../supabaseClient'
import Swal from 'sweetalert2'

export const Dashboard = () => {

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
    <div className='text-black lg:w-[93vw] w-[97vw]'>
      <h2 className='text-3xl font-bold mb-3'>Dashboard</h2><hr />
     
      <section id='cards'>
        <div className='cards mt-2 lg:pe-4'>
          <h2 className='text-2xl font-bold'>Quick Statistics</h2>
        <div className='grid grid-cols-2 lg:grid-cols-3 gap-2 justify-items-center bg-blue-600/90 rounded-xl py-3 mt-3 px-1'>
         
        <div className='flex bg-blue-300/90 py-4 px-3 gap-3 rounded-xl place-items-center w-45 h-30'>
          <div>
            <h3 className='small'>Admin</h3>
            <h4 className='font-bold text-4xl text-center'>
               <CountUp 
               start={0} 
               end={totalAdmin} 
               duration={1} 
              />
            </h4>
          </div>
            <FaUser className='text-7xl text-blue-500/30 my-auto mx-auto'/>
        </div>


        <div className='flex bg-blue-300/90 py-4 px-3 gap-3 rounded-xl place-items-center w-45 h-30'>
          <div>
            <h3 className='small'>Students</h3>
            <h4 className='font-bold text-4xl text-center'>
              <CountUp 
               start={0} 
               end={totalStudents} 
               duration={1} 
              />
            </h4>
          </div>
            <FaUserGraduate className='text-7xl text-blue-500/30 my-auto mx-auto'/>
        </div>

        <div className='flex bg-blue-300/90 py-4 px-3 gap-3 rounded-xl place-items-center w-45 h-30'>
           <div>
            <h3 className='small'>Teachers</h3>
            <h4 className='font-bold text-4xl text-center'> 
              <CountUp 
               start={0} 
               end={totalTeachers} 
               duration={1} 
              />
            </h4>
           </div>
            <FaChalkboardTeacher className='text-7xl text-blue-500/30 my-auto mx-auto'/>
          </div>

      </div>
        </div>
      </section><br />

      <section id='formTotal'>
         <div className='formTotal flex md:flex-row flex-col gap-1.5'>
          <Form/><br />

          <Total/>

         </div>
      </section>

      <section id='attendance'>
        <div className='attendanceBday lg:flex py-5 gap-2'>
          <Attendance/><br />
          <Birthday/>
        </div>
      </section>

    </div>
  )
}
