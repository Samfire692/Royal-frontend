import React from 'react'
import building from '/src/assets/Images/Secondary_Building.jpeg'
import { FaCheckCircle } from 'react-icons/fa'
import gsap from 'gsap'
import {useGSAP} from '@gsap/react'
import { useRef } from 'react'

export const Hero = () => {
  
  return (
    <div>
        <section id='hero'>
         <div className='hero lg:h-[80vh] lg:flex px-3 justify-evenly place-items-center pt-5 lg:pt-0 text-center lg:text-start'>
           <div>
            <h2 className='lg:w-[46vw] md:w-[80vw] text-blue-600'>Royal Ambassadors Schools</h2>
            <p className='text-lg'>Motto: <span>Academic, Excellence, Good Morals</span></p>

            <div className='flex mt-4 gap-4 mb-4 justify-center lg:justify-start text-blue-900'>
              <div>
                <h3 className='text-4xl font-bold'>18+</h3>
                <p>YEARS OF EXCELLENCE</p>
              </div>

              <div>
                <h3 className='text-4xl font-bold'>500+</h3>
                <p>STUDENTS GRADUATED</p>
              </div>

              <div>
                <h3 className='text-4xl font-bold'>95%</h3>
                <p>EXAMINATION SUCCESS RATE</p>
              </div>
            </div>

            <div className='flex gap-2 justify-center lg:justify-start mb-2'>
              <button className='border-2 border-slate-300 rounded-2xl w-50 py-2 focus:bg-blue-500 transition-all focus:text-white hover:bg-blue-500 hover:text-white'>Start Your Journey</button>
              <button className='border-2 border-slate-300 rounded-2xl w-40 py-2 focus:bg-green-500 transition-all focus:text-white hover:bg-slate-500 hover:text-white'>Contact</button>
            </div>           
           </div><br />

          <div className='flex'>
            <img src={building} alt="Royal Ambassadors Schools secondary building" className='lg:w-[30vw] h-fit rounded-3xl'/>
            <p className='absolute bg-blue-500 text-white py-1.5 rounded-2xl px-2 flex gap-1'><span><FaCheckCircle className='my-1'/></span> Government Approved</p>
          </div>

         </div>
       </section>
    </div>
  )
}
