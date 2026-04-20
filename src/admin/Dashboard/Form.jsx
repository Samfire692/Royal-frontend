import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import Swal from 'sweetalert2';
import { FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const Form = () => {
  const [allAdmission, setAlladmission] = useState([]);
  
  const fetchdata = async ()=> {
    const {data, error}= await supabase
    .from("royal_admissionForm")
    .select("*")
    .order("created_at", {ascending:true})
    .limit(4) 

    if(error){
       Swal.fire({ icon: "warning", title: "oops", text: "failed to fetch: " + error.message })
    }else{
       setAlladmission(data)
    }
  }

  useEffect (()=> {
    fetchdata();
  },[])

  return (
        <div className='md:min-w-[60vw] px-3 py-2 rounded-2xl' style={{boxShadow:"0px 0px 3px royalblue"}}>
             <h2 className='font-bold text-2xl text-blue-900'>New Student Enrollment</h2>

             <Link className='flex flex-col gap-2 mt-4' to={"/admin/form"}>
              {allAdmission.map((form) => (
                <div key={form.id} className='flex justify-between p-3 shadow-sm shadow-slate-400/60 bg-white rounded-xl hover:scale-102 transition-all'>
                  <p className='font-bold text-blue-700'>{form.fullname}</p>
                  <span className='my-auto'><FaChevronRight/></span>
                </div>
              ))}
             </Link>
             
        </div>
  )
}
