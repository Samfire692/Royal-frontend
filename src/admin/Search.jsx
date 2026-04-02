import React from 'react'
import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'

export const Search = () => {
  return (
    <div className='flex gap-2 mt-2.5'>
        
           <div className='pb-1'>
          <input type="text" className='border border-slate-200 focus:outline-slate-700 w-[60vw] lg:w-[85vw] md:w-[80vw] h-10 rounded-xl text-black px-2' placeholder='What do need today ?'/>
          </div>

        <div className=''>
            <button className='shadow shadow-slate-500 p-2.5 font-bold rounded-full h-9 w-9'><FaSearch className=''/></button>
        </div>
    </div>
  )
}
