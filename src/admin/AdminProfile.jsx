import React from 'react'
import { supabase } from '../supabaseClient'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2';
import profilepic from '../assets/Images/admin profile pic.jfif'
import { FaCamera } from 'react-icons/fa';
import { ProfileCard } from './Profile/ProfileCard';

export const AdminProfile = () => {

  const [profile, setProfile]= useState([]);

  const fetchdata = async()=> {
    const {data: {user}}= await supabase.auth.getUser();
      const {data, error} = await supabase 
      .from("adminsignup")
      .select("*")
      .eq("id", user.id)


      if(error){
        console.log("Error" + error.message)
      }else{
        setProfile(data);
      }
  }

  useEffect (()=> {
    fetchdata();
  }, [])
  return (
    <div className='pb-12 h-fit'>
       <div className='mb-2'>
        <h2 className='text-3xl font-bold'>Profile</h2>
      </div><hr />
      
      {profile.map((item)=> (
        <section id='Profile'>
        <div className='Profile' key={item.id}>
         <div className='cover bg-blue-500 h-40'></div>

         <div className='px-4 flex flex-col md:flex-row gap-5'>
          <div className='shadow-sm -my-10 p-3 bg-white text-center lg:min-w-[20vw] md:min-w-[30vw]'>
              <img src={profilepic} alt="" className='mx-auto lg:my-0 -mt-18 md:my-0 w-30 rounded-full shadow-sm border-4 border-white'/>
           <div>
            <p className='mt-4 mb-1 font-bold text-xl text-blue-800'>{item.full_name}</p>
            <small className='text-slate-600'>{item.special_id}</small>

            <div className='grid grid-cols-3 md:grid-cols-1 gap-2 text-center md:text-start mt-4'>
              <div className='border border-slate-500/30 md:border-t-0 md:border-l-0 md:border-r-0 md:rounded rounded-2xl lg:w-full min-w-23 h-20 md:h-fit p-3.5 flex flex-col md:flex-row justify-between'>
                <p className='font-bold mb-1 text-blue-600 text-xxl'>Status</p>
                <span>{item.role}</span>
              </div>

              <div className='border border-slate-500/30 md:border-t-0 md:border-l-0 md:border-r-0 md:rounded rounded-2xl lg:w-full min-w-23 h-20 md:h-fit p-3.5 flex flex-col md:flex-row justify-between'>
                <p className='font-bold mb-1 text-blue-600 text-xxl'>Role</p>
                <span>{item.role}</span>
              </div>

              <div className='border border-slate-500/30 md:border-t-0 md:border-l-0 md:border-r-0 md:rounded rounded-2xl lg:w-full min-w-23 h-20 md:h-fit p-3.5 flex flex-col md:flex-row justify-between'>
                <p className='font-bold mb-1 text-blue-600 text-xxl'>Post</p>
                <span>{item.role}</span>
              </div>
            </div>
           </div>
          </div>

          <div className='mt-10 md:-my-10 w-full'>
            <ProfileCard/>
          </div>
         </div>
        </div>
      </section>
      ))}
    </div>
  )
}
