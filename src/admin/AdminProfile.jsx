import React from 'react'
import { supabase } from '../supabaseClient'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2';
import profilepic from '../assets/Images/admin profile pic.jfif'
import { FaCamera } from 'react-icons/fa';

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
    <div className='pb-9 h-fit'>
       <div className='mb-2'>
        <h2 className='text-3xl font-bold'>Profile</h2>
      </div><hr />
      
      {profile.map((item)=> (
        <section id='Profile'>
        <div className='Profile' key={item.id}>
         <div className='cover bg-blue-500 h-40'></div>

         <div className='px-4'>
          <div className='shadow-sm -my-8 p-3 bg-white text-center'>
              <img src={profilepic} alt="" className='mx-auto lg:my-0 -mt-18 md:my-0 w-33 rounded-full shadow-sm border-4 border-white'/>
           <div>
            <p className='mt-2 mb-1 font-bold text-xl text-blue-800'>{item.full_name}</p>
            <small className=''>{item.special_id}</small>
           </div>

          </div>
         </div>

        </div>
      </section>
      ))}
    </div>
  )
}
