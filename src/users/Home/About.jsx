import React, { useState, useEffect } from 'react'
import { FaBullseye, FaEye } from 'react-icons/fa'
import { supabase } from '../../supabaseClient'
import { AboutImg } from './AboutImg'

export const About = () => {
  const [info, setInfo] = useState([])
  const [loading, setLoading] = useState(true)
  
  const fetchData = async () => {
    const { data, error } = await supabase
      .from("schoolabout")
      .select("*")
      .eq("id", 1)

    if (error) {
      console.log("error " + error.message)
    } else {
      setInfo(data);
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div className='px-4 md:px-10 bg-white'>
      <section id='about' className='max-w-7xl mx-auto'>
        {loading ? (
          <div className="text-center py-10 text-blue-600 font-bold animate-pulse">Loading About Info...</div>
        ) : (
          info.map((item) => (
            <div key={item.id} className="flex flex-col lg:flex-row gap-16 items-center">
              
              {/* 1. Text Content Side */}
              <div className='flex-1'>
                <div className='mb-8'>
                  <h2 className='text-4xl md:text-5xl font-black text-blue-950 mb-4'>About Us</h2>
                  <div className='w-20 h-2 bg-blue-600 rounded-full'></div>
                </div>

                <p className='text-lg text-slate-600 leading-relaxed mb-10 font-medium'>
                  Royal Ambassador School is committed to academic excellence, character development, and disciplined leadership. We nurture students to become global ambassadors of change.
                </p>

                {/* Mission & Vision Cards */}
                <div className='flex flex-col md:flex-row gap-6'>
                  
                  {/* Mission Card */}
                  <div className='flex-1 bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-xl shadow-blue-900/5 group hover:border-blue-500 transition-all duration-500'>
                    <div className='w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:bg-blue-600 group-hover:text-white transition-all'>
                      <FaBullseye />
                    </div>
                    <h4 className='text-2xl font-black text-blue-950 mb-3'>Our Mission</h4>
                    <p className='text-slate-500 text-sm leading-relaxed'>{item.mission}</p>
                  </div>

                  {/* Vision Card */}
                  <div className='flex-1 bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-xl shadow-blue-900/5 group hover:border-blue-500 transition-all duration-500'>
                    <div className='w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:bg-blue-600 group-hover:text-white transition-all'>
                      <FaEye />
                    </div>
                    <h4 className='text-2xl font-black text-blue-950 mb-3'>Our Vision</h4>
                    <p className='text-slate-500 text-sm leading-relaxed'>{item.vision}</p>
                  </div>

                </div>
              </div>

              {/* 2. Image Side (AboutImg Component) */}
              <div className='flex-1 w-full lg:w-auto'>
                <div className='relative'>
                  <AboutImg />
                  {/* Decorative element to make the image pop */}
                  <div className='absolute -top-6 -right-6 w-32 h-32 bg-blue-50 rounded-full -z-10 animate-pulse'></div>
                  <div className='absolute -bottom-6 -left-6 w-24 h-24 bg-blue-100/50 rounded-full -z-10'></div>
                </div>
              </div>

            </div>
          )
        ))}
      </section>
    </div>
  )
}