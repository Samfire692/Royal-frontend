import React, { useState } from 'react'
import { FaNewspaper, FaCalendar, FaTimes } from 'react-icons/fa'


export const AdminSitemanagement = () => {
 const [postNewUpdates, setPostNewUpadates] = useState(false)

  return (
    <div className='h-fit lg:h-screen text-white'>
      <h2 className='font-bold text-2xl mx-12.5 lg:mx-0 my-2 fixed text-black'>Site-management</h2><br /><br /><br />

      <section id='edit' className='flex justify-center'>
        <div className='edit px-3 lg:px-9 py-2 flex flex-col md:flex-row gap-4 md:h-fit w-screen md:w-fit'>
          
          <div className='bg-blue-500 px-3 pt-5 lg:w-[35vw] md:w-[45vw] rounded-xl'>
            <h3 className='font-bold text-xl flex gap-1'><FaNewspaper className='text-2xl my-auto'/> News</h3>
            <ul className='mt-3 list-disc ps-7 flex flex-col gap-2 h-30'>
              <li className='cursor-pointer underline hover:text-blue-700' onClick={()=> setPostNewUpadates(true)}>Post New Update</li>
              <li className='cursor-pointer underline hover:text-blue-700'>Update Feed</li>
              <li className='cursor-pointer underline hover:text-blue-700'>News Archive</li>
            </ul>
          </div>

          <div className='bg-blue-500 px-3 pt-5 lg:w-[35vw] md:w-[45vw] rounded-xl'>
            <h3 className='font-bold text-xl flex gap-1'><FaCalendar className='text-2xl my-auto'/> Events</h3>
            <ul className='mt-3 list-disc ps-7 flex flex-col gap-1 h-30'>
              <li className='cursor-pointer underline hover:text-blue-700'>Schedule Event</li>
              <li className='cursor-pointer underline hover:text-blue-700'>Manage Events</li>
              <li className='cursor-pointer underline hover:text-blue-700'>Upcoming Events</li>
              <li className='cursor-pointer underline hover:text-blue-700'>Past Events</li>
            </ul>
          </div>

        </div>
      </section>

      <section id='shortcuts' className=''>
         <div className='shortcuts lg:w-[75vw]'>
            {/* NEWS*/}
            {/* 1st */}
             {postNewUpdates && (
              <div className='flex justify-center gap-1'>
               <div className='border-4 rounded-2xl lg:w-[30vw] h-[50vh] flex lg:my-3 my-10 bg-white px-4'>
                <PostNewUpdate/>
                </div>
               <div className='text-end w-screen lg:w-fit absolute lg:relative pe-2'>
                 <button className='h-fit border p-1 text-2xl bg-red-600 rounded-xl' onClick={()=> setPostNewUpadates(false)}><FaTimes/></button>
               </div>
               </div>
           )}

         </div>
      </section>  
      
    </div>
  )
}
