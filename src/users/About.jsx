import React from 'react'
import { About as HomeAbout } from './Home/About'
import { supabase } from '../supabaseClient'
import { useState, useEffect } from 'react'
import { FaQuoteRight } from 'react-icons/fa'

export const About = () => {

  const [propietress ,setPropietress]=useState([]);

  const fetchdata =async()=> {
    const {data,error}= await supabase
    .from("site_settings")
    .select("*")

    if(error){
     console.log("error" + error.message);
    }else{
      setPropietress(data)
    }
  }

  useEffect(()=> {
    fetchdata();
  }, [])

  return (
    <div className='py-5'>
      <HomeAbout/><br />

     <div className='px-4'>
      {propietress.map((item)=> (
        <div> <h2 className='font-bold text-2xl text-blue-900'>Propietress Speech</h2><br />
        <div key={item.id} className='flex lg:flex-row gap-3 flex-col justify-evenly'>
          <img src={item.prop_photo_url} alt="" className='w-60 h-60 rounded-full mx-auto lg:mx-0 object-contain' />
          <div className='shadow-sm shadow-slate-500 max-w-4xl rounded-2xl flex justify-between p-3'>
           <div className='my-auto pt-5'>
              <p className='my-auto text-slate-400 font-bold italic lg:leading-9 leading-7'>{item.prop_speech}</p>
              <small className='text-end block mt-2 font-bold text-slate-400'>-{item.prop_name}</small>
           </div>
             <FaQuoteRight className='absolute text-5xl text-blue-600/30 lg:right-22 right-6'/>
          </div>
        </div>
        </div>
      ))}
     </div>

    </div>
  )
}
