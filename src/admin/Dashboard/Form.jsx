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
    .limit(5) 

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
        <div className='md:w-[60vw] border p-2 rounded-2xl bg-slate-300'>
             <h2 className='font-bold text-2xl'>New Student Enrollment</h2>
             <p className=''>Admission counts = {allAdmission.length}</p>

             <Link className='flex flex-col gap-2 mt-2' to={"/admin/form"}>
              {allAdmission.map((form) => (
                <div key={form.id} className='flex justify-between p-3 bg-white rounded-xl'>
                  <p>{form.fullname}</p>
                  <span className='my-auto'><FaChevronRight/></span>
                </div>
              ))}
             </Link>
             
        </div>
  )
}
