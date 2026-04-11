import React, { useEffect, useState } from 'react'
import building from '/src/assets/Images/Secondary_Building.jpeg'
import { FaCheckCircle } from 'react-icons/fa'
import { supabase } from '../../supabaseClient'
import { Motto } from './Motto'
import CountUp from 'react-countup';

export const Hero = () => {

  const [info, setInfo] = useState([])

  const fetchData = async () => {
    
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("id", 1); 

    if (error) {
      console.log("error: " + error.message)
    } else {
      setInfo(data);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div>
      <section id='hero'>
        {info.map((item) => (
          <div className='hero lg:h-[80vh] lg:flex px-3 justify-center place-items-center pt-5 lg:pt-0 text-center lg:text-start' key={item.id}>
            <div>
              <h2 className='max-w-2xl text-blue-600 font-bold text-4xl lg:text-6xl'>Royal Ambassadors Schools</h2>
              <Motto/>

              <div className='mt-4 mb-4 text-blue-900 grid lg:grid-cols-4 grid-cols-3 gap-2 px-2 '>
                <div className='rounded-2xl w-fit px-2 border-r-2 border-l-2 border-amber-400/70'>
                  <h3 className='text-4xl font-bold text-center'>
                    <CountUp
                     start={0}
                     end={item.stat_years}
                     duration={2.5}
                    />
                  </h3>
                  <p className='text-xs'>YEARS OF EXCELLENCE</p>
                </div>

                <div className='rounded-2xl w-fit px-2 border-r-2 border-l-2 border-amber-400/70'>
                  <h3 className='text-4xl font-bold text-center'>
                    <CountUp
                     start={0}
                     end={item.stat_graduates}
                     duration={2.5}
                    />
                  </h3>
                  <p className='text-xs'>STUDENTS GRADUATED</p>
                </div>

                <div className='rounded-2xl w-fit px-2 border-l-2 border-r-2 border-amber-400/70'>
                  <h3 className='text-4xl font-bold text-center'>
                    <CountUp
                     start={0}
                     end={item.stat_pass_rate}
                     duration={2.5}
                    />%
                  </h3>
                  <p className='text-xs'>EXAMINATION SUCCESS RATE</p>
                </div>
              </div>

              <div className='flex gap-2 justify-center mx-auto lg:mx-0 lg:justify-start mb-2 max-w-sm'>
                <button className='rounded-2xl w-full h-12 bg-blue-500 transition-all text-white'>Start Your Journey</button>
                <button className='rounded-2xl w-full h-12 bg-green-500 transition-all text-white'>Contact</button>
              </div>           
            </div><br />

            <div className='relative flex'>
              <img src={item.hero_image_url || building} alt="Royal Ambassadors Schools" className='h-70 w-100 rounded-3xl shadow-xl object-cover'/>
              <p className='absolute bg-blue-500 text-white py-1.5 rounded-2xl px-2 flex gap-1 shadow-md'>
                <span><FaCheckCircle className='my-1'/></span> Government Approved
              </p>
            </div>

          </div>
        ))}
      </section>
    </div>
  )
}