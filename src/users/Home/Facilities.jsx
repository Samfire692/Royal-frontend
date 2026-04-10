import React, { useEffect, useState } from 'react'
import { FaBook, FaSchool, FaChalkboardTeacher } from 'react-icons/fa'
import { supabase } from '../../supabaseClient'
import Swal from 'sweetalert2'

export const Facilities = () => {

   const [facilities, setFacilities]= useState([])

   const fetchdata =async()=> {
      const {data, error}= await supabase
      .from("site_settings")
      .select("*")

      if(error){
        Swal.fire({
         icon:"error",
         title:"Error",
         text:error.message
        })
      }else{
         setFacilities(data);
      }
   }

   useEffect(()=> {
      fetchdata()
   },[])

  return (
    <div className='px-3'>
        {facilities.map((item)=> (
          <section id='facilities' key={item.id}>
          <h3 className='text-2xl font-bold text-blue-900'>Facilities</h3><br />
          <div className='facilities flex flex-col md:flex-row gap-4 justify-center'>
             <div className='text-center shadow shadow-slate-700 p-2 pb-3.5 rounded-3xl lg:w-[25vw] md:w-[60vw]'>
                <span className='inline-block text-4xl shadow shadow-slate-600/80 w-18 h-18 p-4.5 rounded-full mb-2 text-blue-800'><FaBook/></span>
                <h4 className='text-2xl font-bold mb-1 text-blue-900'>Well-Structured Curriculum</h4>
                <p>{item.base_curriculum_desc}</p>
             </div>

             <div className='text-center shadow shadow-slate-700 p-2 pb-3.5 rounded-3xl lg:w-[25vw] md:w-[60vw]'>
                <span className='inline-block text-4xl shadow shadow-slate-600/80 w-18 h-18 p-4.5 rounded-full mb-2 text-blue-800'><FaSchool/></span>
                <h4 className='text-2xl font-bold mb-1 text-blue-900'>Safe & Modern Facilities</h4>
                <p>{item.base_facilities_desc}</p>
             </div>

             <div className='text-center shadow shadow-slate-700 p-2 pb-3.5 rounded-3xl lg:w-[25vw] md:w-[60vw]'>
                <span className='inline-block text-4xl shadow shadow-slate-600/80 w-18 h-18 p-4.5 rounded-full mb-2 text-blue-800'><FaChalkboardTeacher/></span>
                <h4 className='text-2xl font-bold mb-1 text-blue-900'>Qualified & Caring Teachers</h4>
                <p>{item.base_teachers_desc}</p>
             </div>

          </div>
        </section>
        ))}
    </div>
  )
}
