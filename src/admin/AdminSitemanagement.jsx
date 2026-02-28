import React from 'react'
import { FaNewspaper, FaCalendar } from 'react-icons/fa'

export const AdminSitemanagement = () => {
  return (
    <div className='h-screen'>
      <h2 className='font-bold text-2xl mx-12.5 lg:mx-0 my-2 fixed text-black'>Site-management</h2><br /><br /><br />

      <section id='edit' className='flex justify-center'>
        <div className='edit px-3 lg:px-9 py-2 flex flex-col md:flex-row gap-4 md:h-fit w-screen md:w-fit'>
          
          <div className='bg-blue-500 px-3 pt-5 lg:w-[35vw] md:w-[45vw] rounded-xl'>
            <h3 className='font-bold text-xl flex gap-1'><FaNewspaper className='text-2xl my-auto'/> News</h3>
            <ul className='mt-3 list-disc ps-7 flex flex-col gap-2 h-30'>
              <li className='cursor-pointer underline hover:text-blue-700'>Post New Update</li>

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
    </div>
  )
}
