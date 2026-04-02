import React from 'react'
import { FaBullseye, FaEye } from 'react-icons/fa'
import frontbuilding from '/src/assets/Images/building.jpeg'


export const About = () => {
 

  return (
    <div className='px-3'>
      <section id='about'>
        <h2 className='text-2xl mb-2 font-bold text-blue-900'>About us</h2>
        <div className="about flex flex-col lg:flex-row justify-around relative">
            <div className='lg:w-[50vw]'>
              <p>Royal Ambassador School is committed to academic excellence, character development, and disciplined leadership. </p>
              <button className='border px-2 rounded-4xl py-2 mt-2 focus:bg-blue-400 focus:text-white'>Read more</button><br /><br />

              <div className='flex flex-col lg:flex-row md:flex-row gap-4'>
                <div className='text-center shadow shadow-slate-500 py-4 rounded-2xl px-2 h-44 flex-1'>
                   <h4 className='flex text-2xl gap-1 justify-center mb-2 text-blue-900'><FaBullseye className='my-1'/> Our Mission</h4>
                   <p>To provide a safe and inspiring environment that delivers high-quality education, instills deep moral values, and prepares students to excel in their academics and life challenges.</p>
                </div>

                <div className='text-center shadow shadow-slate-500 py-4 rounded-2xl h-40 md:h-auto px-2 flex-1'>
                   <h4 className='flex text-2xl gap-1 justify-center mb-2 text-blue-900'><FaEye className='my-1'/> Our Vision</h4>
                   <p>To nurture empowered, confident, and compassionate learners ready to excel in a rapidly changing world.</p>
                </div>
              </div>
            </div><br />
 
            <img src={frontbuilding} alt="Royal ambassadors schools front building" className='rounded-3xl lg:w-[33vw] h-fit my-auto' />

        </div>
      </section>
    </div>
  )
}
