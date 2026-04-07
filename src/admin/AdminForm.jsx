import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient';
import Swal from 'sweetalert2';

export const AdminForm = () => {
  const navigate = useNavigate();
  const [allAdmission, setAlladmission]= useState([]);
  const [admissionActive, setAdmissionactive] = useState(false);

  const fetchForm = async ()=> {
    const {data, error} = await supabase
    .from("royal_admissionForm")
    .select("*")
    .order("created_at", {ascending:true})

    if(error){
        Swal.fire({ icon: "warning", title: "oops", text: "failed to fetch: " + error.message })
     }else{
        setAlladmission(data)
     }
   }
 
   useEffect (()=> {
     fetchForm();
   },[])

  return (
    <div>
        <div className='flex justify-between px-2 py-3'>
            <h2 className='text-2xl font-bold my-auto'>Admission Dashboard</h2>
            <button className='p-2 bg-slate-500 rounded-xl text-white' onClick={()=> navigate(-1)}>back</button>
        </div><hr />

        <section id='formUpload'>
            <div className='formUpload p-2'>
              {/* <h4 className='text-2xl underline text-center mb-2'>Lastest release</h4> */}
              <p className='italic text-xl'>Admission Request Total: {allAdmission.length}</p>

              <div>
                {allAdmission.map((items) => (
                    <div key={items.id}>
                        <div className={`py-2 cursor-pointer rounded-xl mb-2 ${admissionActive === items.id ? "bg-blue-500 text-white ps-2" : ""}`} onClick={()=> setAdmissionactive(items.id)}>{items.fullname}</div>
                         {admissionActive === items.id && (
                            <div className='border p-2 rounded-2xl'>
                            {/* <img src={items.passport_url} alt="" /> */}
                           <div className='mb-2'>
                             <h2 className='font-bold mb-1'>Personal Info :</h2>
                             <div className='shadow border rounded-xl mx-auto mb-2 w-fit'>
                                <a href={`https://lcvfseppngxjhhborygi.supabase.co/storage/v1/object/public/passports/${items.passport_url}`} target="_blank" rel="noreferrer">
                                <img src={`https://lcvfseppngxjhhborygi.supabase.co/storage/v1/object/public/passports/${items.passport_url}`} className="w-30 h-30 rounded-xl object-cover cursor-zoom-in hover:scale-105 transition-transform"/>
                                </a>
                             </div>
                             <p className='grid mb-1'><span className='font-bold text-blue-600'>Fullname :</span> {items.fullname}</p>
                             <p className='grid mb-1'><span className='font-bold text-blue-600'>Email:</span> {items.email}</p>
                             <p className='grid mb-1'><span className='font-bold text-blue-600'>Phone number:</span> {items.phone}</p>
                           </div>

                           <div className='mb-2'>
                             <h2 className='font-bold mb-1'>Guardians Info :</h2>
                             <p className='grid mb-1'><span className='font-bold text-blue-600'>Guardian name:</span> {items.guardian_name}</p>
                             <p className='grid mb-1'><span className='font-bold text-blue-600'>Guardian relationship:</span> {items.guardian_relationship}</p>
                             <p className='grid mb-1'><span className='font-bold text-blue-600'>Guardian phone number:</span> {items.guardian_phone}</p>
                             <p className='grid mb-1'><span className='font-bold text-blue-600'>Guardian address:</span> {items.address}</p>
                           </div>

                           <div className='mb-2'>
                            <h2 className='font-bold mb-1'>Academics section :</h2>
                             <p className='grid mb-1'><span className='font-bold text-blue-600'>Applied class:</span> {items.applied_class}</p>
                             <p className='grid mb-1'><span className='font-bold text-blue-600'>Last Class completed:</span> {items.last_class_completed}</p>
                             <p className='grid mb-1'><span className='font-bold text-blue-600'>Last School attended:</span> {items.last_school_attended}</p>
                           </div>
                        </div>
                         ) }
                    </div>
                ))}
              </div>
            </div>
        </section>
    </div>
  )
}
