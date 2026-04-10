import React, { useState } from 'react'
import { Frontdesk } from './Frontdesk';
import { Ourprofile } from './Ourprofile';
import { Baseinfo } from './Baseinfo';

export const Foundation = () => {

    const [active, setActive]= useState("frontdesk");

  return (
    <div>
        <div>
            <h2 className='text-xl font-bold'>Foundation</h2>
        </div>

        {/* Toggle button */}
        <div className='bg-blue-600 py-2 flex justify-evenly mt-2 text-white rounded-xl lg:w-fit px-3'>
           <button className={`border-r-2 px-4 py-1.5 rounded ${active === 'frontdesk' ? "bg-white text-blue-800" : ""}`} onClick={()=> setActive("frontdesk")}>Front</button>
           <button className={`px-4 py-1.5 rounded ${active === 'ourprofile' ? "bg-white text-blue-800" : ""}`} onClick={()=> setActive("ourprofile")}>Propietress</button>
           <button className={`border-l-2 px-4 py-1.5 rounded ${active === 'baseinfo' ? "bg-white text-blue-800" : ""}`} onClick={()=> setActive("baseinfo")}>Base</button>
        </div>

        <div className='mt-3 px-2'>
            {active === 'frontdesk' && (
                <Frontdesk/>
            )}

            {active === 'ourprofile' && (
                <Ourprofile/>
            )}

            {active === 'baseinfo' && (
                <Baseinfo/>
            )}
        </div>
    </div>
  )
}
