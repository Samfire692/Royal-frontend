import React from 'react'
import { Stats } from './Stats'
import { Heroimage } from './Heroimage'

export const Frontdesk = () => {
  return (
    <div className=''>
        <div className='mb-2'>
            <h2 className='font-bold text-blue-800 text-xl'>Front Desk</h2>
        </div><hr />
 
        <div className='flex gap-2 flex-col mt-2'>
          <Stats/>
          <Heroimage/>
        </div>
        
    </div>
  )
}
