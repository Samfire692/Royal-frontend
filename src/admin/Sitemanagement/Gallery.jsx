import React, { useState } from 'react'
import { Events } from './Events'
import { Galleries } from './Galleries'

export const Gallery = () => {

    const [active, setActive] = useState("event");
  return (
    <div>
        <div className='mb-2'>
            <h2 className='font-bold text-xl'>Gallery</h2>
        </div><hr className='w-18'/>

         <section id='newsTestimonial'>
            <div className='newsTestimonial py-2 mt-3'>
                 <div className='bg-blue-600 w-fit px-3 py-3 rounded-2xl text-white flex gap-2'>
                   <button className={`px-3 py-1.5 border-r-2 rounded-xl ${active === "event" ? "bg-white text-blue-700" : ""}`} onClick={()=> setActive("event")}>Events</button>
                    <button className={`px-3 py-1.5 rounded-xl border-l-2 ${active === "galleries" ? "bg-white text-blue-700" : ""}`} onClick={()=> setActive("galleries")}>Galleries</button>
                 </div>
                      
               <div className='mt-3 px-2'>
                  {active === "event" && (
                    <Events/>
                   )}
        
                  {active === "galleries" && (
                   <Galleries/>
                  )}
               </div>
        
              </div>
        </section>

    </div>

    
  )
}
