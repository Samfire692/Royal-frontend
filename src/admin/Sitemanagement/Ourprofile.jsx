import React from 'react'
import { Propietress } from './Propietress'
import { Aboutimg } from './Aboutimg'

export const Ourprofile = () => {
  return (
    <div>
        <div className='mb-2'>
            <h2 className='font-bold text-blue-800 text-xl'>Our Profile</h2>
        </div><hr />

         <div className='flex gap-2 flex-col mt-2'>
            <Propietress/>
            <Aboutimg/>
         </div>
    </div>
  )
}
