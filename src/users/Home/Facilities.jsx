import React, { useEffect, useState } from 'react'
import { FaBook, FaSchool, FaChalkboardTeacher, FaArrowRight } from 'react-icons/fa'
import { supabase } from '../../supabaseClient'
import Swal from 'sweetalert2'

export const Facilities = () => {
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchdata = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message
      })
    } else {
      setFacilities(data);
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchdata()
  }, [])

  return (
    <section id='facilities' className='py-2 px-4 md:px-10 bg-slate-50/30'>
      <div className='max-w-7xl mx-auto'>
        
        {/* Section Header */}
        <div className='mb-12 text-center md:text-left'>
          <h3 className='text-3xl md:text-4xl font-black text-blue-900 text-start mb-2'>Our Core Pillars</h3>
          <div className='w-20 h-1.5 bg-blue-600 rounded-full mb-6'></div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-blue-600 font-bold animate-pulse">Loading Facilities...</div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {facilities.map((item) => (
              <React.Fragment key={item.id}>
                
                {/* 1. Curriculum Card */}
                <div className='bg-white p-8 rounded-[3rem] border-2 border-slate-100 shadow-xl shadow-blue-900/5 hover:border-blue-500 transition-all duration-500 group relative overflow-hidden'>
                   <div className='absolute -right-6 -bottom-6 text-9xl text-slate-50 group-hover:text-blue-50 transition-colors'><FaBook /></div>
                   <div className='relative z-10'>
                      <div className='w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform'>
                        <FaBook />
                      </div>
                      <h4 className='text-2xl font-black text-blue-950 mb-3'>Standard Curriculum</h4>
                      <p className='text-slate-500 leading-relaxed mb-6'>{item.base_curriculum_desc}</p>
                   </div>
                </div>

                {/* 2. Modern Facilities Card */}
                <div className='bg-white p-8 rounded-[3rem] border-2 border-slate-100 shadow-xl shadow-blue-900/5 hover:border-blue-500 transition-all duration-500 group relative overflow-hidden'>
                   <div className='absolute -right-6 -bottom-6 text-9xl text-slate-50 group-hover:text-blue-50 transition-colors'><FaSchool /></div>
                   <div className='relative z-10'>
                      <div className='w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform'>
                        <FaSchool />
                      </div>
                      <h4 className='text-2xl font-black text-blue-950 mb-3'>Modern Facilities</h4>
                      <p className='text-slate-500 leading-relaxed mb-6'>{item.base_facilities_desc}</p>
                   </div>
                </div>

                {/* 3. Caring Teachers Card */}
                <div className='bg-white p-8 rounded-[3rem] border-2 border-slate-100 shadow-xl shadow-blue-900/5 hover:border-blue-500 transition-all duration-500 group relative overflow-hidden'>
                   <div className='absolute -right-6 -bottom-6 text-9xl text-slate-50 group-hover:text-blue-50 transition-colors'><FaChalkboardTeacher /></div>
                   <div className='relative z-10'>
                      <div className='w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform'>
                        <FaChalkboardTeacher />
                      </div>
                      <h4 className='text-2xl font-black text-blue-950 mb-3'>Caring Educators</h4>
                      <p className='text-slate-500 leading-relaxed mb-6'>{item.base_teachers_desc}</p>
                   </div>
                </div>

              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}