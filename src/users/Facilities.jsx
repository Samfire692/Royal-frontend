import React from 'react'
import { Facilities as HomeFacilities } from './Home/Facilities'
import { FaRegUserCircle } from 'react-icons/fa'

export const Facilities = () => {
  return (
    <div className='py-4'>
      <HomeFacilities/><br />

      <div className='px-3'>
        <h2 className='font-bold text-2xl text-blue-900'>Our Academic Level</h2>

        <div>
          <div className='shadow-sm'>
             <FaRegUserCircle className='text-5xl'/>
          </div>
        </div>
      </div>
    </div>
  )
}
