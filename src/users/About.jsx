import React, { useEffect, useState } from 'react'
import { About as HomeAbout } from './Home/About'
import { supabase } from '../supabaseClient'
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa'
import { Footer } from './Footer'

export const About = () => {
  const [propietress, setPropietress] = useState([]);

  const fetchdata = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")

    if (error) {
      console.log("error " + error.message);
    } else {
      setPropietress(data)
    }
  }

  useEffect(() => {
    fetchdata();
  }, [])

  return (
    <div className='pt-10 bg-white'>
      {/* Top Section from Home */}
      <HomeAbout /><br />

      <div className='px-4 md:px-10 lg:px-20 py-16 bg-slate-50/50'>
        {propietress.map((item) => (
          <div key={item.id} className='max-w-7xl mx-auto'>
            
            {/* Section Heading */}
            <div className='mb-12 text-center lg:text-left'>
              <h2 className='text-3xl md:text-4xl font-black text-blue-900'>From the Propietress</h2>
              <div className='w-20 h-1.5 bg-blue-600 rounded-full mt-2 mx-auto lg:mx-0'></div>
            </div>

            <div className='flex flex-col lg:flex-row items-center lg:items-start gap-12'>
              
              <div className='relative shrink-0'>
                <div className='w-64 h-64 md:w-80 md:h-80 rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500'>
                  <img 
                    src={item.prop_photo_url} 
                    alt={item.prop_name} 
                    className='w-full h-full object-cover' 
                  />
                </div>
          
                <div className='absolute -z-10 -bottom-4 -right-4 w-full h-full bg-blue-100 rounded-[3rem]'></div>
              </div>

              <div className='relative bg-white p-8 md:p-12 rounded-[3.5rem] shadow-xl shadow-blue-900/5 border border-slate-100 grow'>
                
                <FaQuoteLeft className='absolute top-8 left-8 text-6xl text-blue-50 opacity-50' />
                
                <div className='relative z-10'>
                  <p className='text-lg md:text-xl text-slate-600 font-medium italic leading-relaxed md:leading-9 mb-8'>
                    "{item.prop_speech}"
                  </p>
                  
                  <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-t border-slate-100 pt-6'>
                    <div>
                      <h4 className='text-2xl font-black text-blue-900'>{item.prop_name}</h4>
                      <p className='text-blue-600 font-bold uppercase tracking-widest text-xs'>The Propietress</p>
                    </div>
                    
                    <FaQuoteRight className='text-4xl text-blue-600/20' />
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <Footer/>
      </div>
    </div>
  )
}