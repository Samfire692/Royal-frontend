import React from 'react'
import { FaSearch } from 'react-icons/fa'

export const Search = () => {
  return (
    <div>
        <div className='py-2 px-3 flex my-1'>
            <FaSearch className='border-slate-700 w-9 h-10 text-xl p-2 absolute text-slate-700'/>
            <input type="text" className='border border-slate-400 lg:w-[80vw] md:w-[80vw]  h-10 rounded-xl ps-9 focus:outline-slate-600' placeholder='Search ...'/>
        </div>
    </div>
  )
}
