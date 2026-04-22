import React from 'react'
import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'

export const Profiles = () => {

  const [profile, setProfile]= useState([]);
  const [loading, setLoading]= useState(true);

  useEffect(()=> {
    const fetchdata = async()=>{
    const {data: {user}} = await supabase.auth.getUser();
    const {data, error} = await supabase
    .from("adminsignup")
    .select("*")
    .eq("id", user.id)

    if(error){
      console.log("Error" + error.message);
    }else{
      setProfile(data);
      setLoading(false)
    }
  }

  fetchdata();
  }, [])

  if(loading){
    return (
      <div className='h-80 flex flex-col justify-center place-items-center'>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g><circle cx="12" cy="2.5" r="1.5" fill="currentColor" opacity="0.14"/><circle cx="16.75" cy="3.77" r="1.5" fill="currentColor" opacity="0.29"/><circle cx="20.23" cy="7.25" r="1.5" fill="currentColor" opacity="0.43"/><circle cx="21.5" cy="12" r="1.5" fill="currentColor" opacity="0.57"/><circle cx="20.23" cy="16.75" r="1.5" fill="currentColor" opacity="0.71"/><circle cx="16.75" cy="20.23" r="1.5" fill="currentColor" opacity="0.86"/><circle cx="12" cy="21.5" r="1.5" fill="currentColor"/><animateTransform attributeName="transform" calcMode="discrete" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"/></g></svg>

        <p className='mt-2'>Fetching Profile</p>
      </div>
    )
  }

  return (
    <div>
       {profile.map((item)=> (
         <div key={item}>
          <div className='form grid md:grid-cols-2 gap-4 py-4'>
            <div className='grid'>
              <label htmlFor="">Full Name</label>
              <input type="text" value={item.full_name} className='border h-12 p-3 mt-2 border-slate-600 text-slate-500'/>
            </div>

            <div className='grid'>
              <label htmlFor="">Email</label>
              <input type="text" value={item.email} className='border h-12 p-3 mt-2 border-slate-600 text-slate-500'/>
            </div>

            <div className='grid'>
              <label htmlFor="">Phone Number</label>
              <input type="text" value={item.phone_number || "no phone number added yet"} className='border h-12 p-3 mt-2 border-slate-600 text-slate-500'/>
            </div>

            <div className='grid'>
              <label htmlFor="">Admin ID</label>
              <input type="text" value={item.special_id} className='border h-12 p-3 mt-2 border-slate-600 text-slate-500'/>
            </div>

            <div className='grid'>
              <label htmlFor="">Gender</label>
              <input type="text" value={item.gender || "no gender added yet"} className='border h-12 p-3 mt-2 border-slate-600 text-slate-500'/>
            </div>

            <div className='grid'>
              <label htmlFor="">Date of birth</label>
              <input type="text" value={item.dob || "no date of birth added yet"} className='border h-12 p-3 mt-2 border-slate-600 text-slate-500'/>
            </div>
          </div>
         </div>
       ))}
    </div>
  )
}
