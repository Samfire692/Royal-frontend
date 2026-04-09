import React, { useState } from 'react'
import { News } from './News'
import { Testimonial } from './Testimonial'

export const NewsTestimonial = () => {

    const [active, setActive]= useState("news")
  return (
    <div>
         <div className='mb-1.5'>
            <h2 className='text-xl font-bold'>News & Testimonials</h2>
        </div><hr className='w-45'/>

        <section id='newsTestimonial'>
            <div className='newsTestimonial py-2 mt-3'>
                <div className='bg-blue-600 w-fit px-3 py-3 rounded-2xl text-white flex gap-2'>
                    <button className={`px-3 py-1.5 border-r-2 rounded-xl ${active === "news" ? "bg-white text-blue-700" : ""}`} onClick={()=> setActive("news")}>News</button>
                    <button className={`px-3 py-1.5 rounded-xl border-l-2 ${active === "testimonial" ? "bg-white text-blue-700" : ""}`} onClick={()=> setActive("testimonial")}>Testimonial</button>
                </div>
              
                <div className='mt-3 px-2'>
                    {active === "news" && (
                        <News/>
                    )}

                    {active === "testimonial" && (
                        <Testimonial/>
                    )}
                </div>

            </div>
        </section>
    </div>
  )
}
