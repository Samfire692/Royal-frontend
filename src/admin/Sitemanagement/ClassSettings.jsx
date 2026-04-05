import React, { useState } from 'react'
import { useEffect } from 'react'
import { FaPlus, FaSpinner } from 'react-icons/fa'
import { supabase } from '../../supabaseClient'

export const ClassSettings = () => {

    const [loading , setLoading] = useState(false);
    const [className , setClassName] = useState("")
 
    const handleClasses = (e)=>{
       e.preventDefault();
     
    }

     const clearClasses = (e)=>{
       e.preventDefault();
       setClassName("")
    }

  return (
    <div>
        <div className='mb-1'>
            <h2 className='font-bold text-xl'>Class Settings</h2>
        </div><hr className='w-33'/>

        <section id='classSet'>
            <div className='classSet mt-3'>
              <div>
                <h2 className='flex mb-1 text-slate-500/90'><span className='text-xl my-auto'><FaPlus/></span> <span className='font-bold'>Add Class</span></h2> 
                 <form action="" className='overflow-hidden' onSubmit={handleClasses}>
                   <input type="text" className='border rounded ps-2 py-1 w-full' placeholder='Insert class' onChange={(e)=> setClassName(e.target.value)} value={className} />  

                   <div className='flex mt-2 gap-2'>
                   <button className='bg-red-500 p-1 rounded text-white' onClick={clearClasses}>Cancel</button>
                   <button className='bg-blue-500 p-1 rounded text-white' disabled={!className}>{loading ? <FaSpinner className='animate-spin w-11 h-4 text-xl'/> : "submit"}</button>
                </div> 
                 </form> 
                 <hr />

                <div>

                </div>
              </div>
            </div>
        </section>
    </div>
  )
}
