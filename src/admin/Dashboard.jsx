import React from 'react'
import { FaUserGraduate, FaChalkboardTeacher, FaUserCheck, FaChalkboard } from 'react-icons/fa'
import { Form } from './Dashboard/Form'
import { Total } from './Dashboard/Total'
import { Attendance } from './Dashboard/Attendance'
import { Birthday } from './Dashboard/Birthday'

export const Dashboard = () => {
  return (
    <div className='text-black lg:w-[93vw] w-[97vw]'>
      <h2 className='text-3xl font-bold mb-3'>Dashboard</h2><hr />
     
      <section id='cards'>
        <div className='cards mt-2'>
          <h2 className='text-2xl font-bold'>Quick Statistics</h2>
        <div className='flex flex-wrap justify-around gap-2 lg:gap-0 bg-blue-600/90 rounded-xl py-3 mt-3 px-1'>
         
        <div className='flex bg-blue-300/90 py-4 px-3 gap-3 rounded-xl place-items-center lg:w-60 w-45 h-30'>
          <div>
            <h3 className='small'>Students</h3>
            <h4 className='font-bold text-4xl text-center'>500</h4>
          </div>
            <FaUserGraduate className='text-7xl text-blue-500/30 my-auto mx-auto'/>
        </div>

        <div className='flex bg-blue-300/90 py-4 px-3 gap-3 rounded-xl place-items-center lg:w-60 w-45 h-30'>
          <div>
            <h3 className='small'>Teachers</h3>
            <h4 className='font-bold text-4xl text-center'>30</h4>
          </div>
            <FaChalkboardTeacher className='text-7xl text-blue-500/30 my-auto mx-auto'/>
        </div>

          <div className='flex bg-blue-300/90 py-4 px-3 gap-3 rounded-xl place-items-center lg:w-60 w-45 h-30'>
           <div>
            <h3 className='small'>Attendance</h3>
            <h4 className='font-bold text-4xl text-center'>50%</h4>
           </div>
            <FaUserCheck className='text-7xl text-blue-500/30 my-auto mx-auto'/>
          </div>

          <div className='flex bg-blue-300/90 py-4 px-3 gap-3 rounded-xl place-items-center lg:w-60 w-45 h-30'>
           <div>
            <h3 className='small'>Classes</h3>
            <h4 className='font-bold text-4xl text-center'>15</h4>
          </div>
            <FaChalkboard className='text-7xl text-blue-500/30 my-auto mx-auto'/>
        </div>

      </div>
        </div>
      </section><br />

      <section id='formTotal'>
         <div className='formTotal flex md:flex-row flex-col gap-1.5'>
          <Form/><br />

          <Total/>

         </div>
      </section>

      <section id='attendance'>
        <div className='attendanceBday lg:flex py-5 gap-2'>
          <Attendance/><br />
          <Birthday/>
        </div>
      </section>

    </div>
  )
}
