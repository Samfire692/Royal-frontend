import React, { useState } from 'react'
import { FaNewspaper, FaCalendar, FaTimes } from 'react-icons/fa'
import { ClassSettings } from './Sitemanagement/ClassSettings'
import { MissionVision } from './Sitemanagement/MissionVision'
import { NewsTestimonial } from './Sitemanagement/NewsTestimonial'
import { Foundation } from './Sitemanagement/Foundation'
import { Gallery } from './Sitemanagement/Gallery'


export const AdminSitemanagement = () => {
 const [postNewUpdates, setPostNewUpadates] = useState(false)
 const [active , setActive] = useState('missionvision')

  return (
    <div className='lg:w-[93vw] px-2'>
      <div className=''>
        <h2 className='font-bold text-3xl mb-2'>Site Management</h2>  
      </div><hr />

      <section id='sel'>
        <div className='sel w-full mt-2'>
           <div className='flex flex-col gap-2 bg-blue-500 p-3 rounded-xl text-white font-bold'>
            <button className={`p-2 rounded-xl hover:bg-white hover:text-black ${active === "missionvision" ? "bg-white text-black" : "bg-transparent"}`} onClick={()=> setActive("missionvision")}>School About & Events</button> {/* mission, vision, core values, upcoming events */}
            <button className={`p-2 rounded-xl hover:bg-white hover:text-black ${active === "gallery" ? "bg-white text-black" : "bg-transparent"}`} onClick={()=> setActive("gallery")} >Photo Gallery & Media</button> {/* Gallery, Events, Videos */}
            <button className={`p-2 rounded-xl hover:bg-white hover:text-black ${active === "newsTestimonial" ? "bg-white text-black" : "bg-transparent"}`} onClick={()=> setActive("newsTestimonial")}>News & Testimonials</button> {/* News , Testimonial*/}
            <button className={`p-2 rounded-xl hover:bg-white hover:text-black ${active === "classSettings" ? "bg-white text-black" : "bg-transparent"}`} onClick={()=> setActive("classSettings")}>Class Settings</button> {/* classes */}
            <button className={`p-2 rounded-xl hover:bg-white hover:text-black ${active === "foundation" ? "bg-white text-black" : "bg-transparent"}`} onClick={()=> setActive("foundation")}>Foundation</button> {/* full view of admission forms submitted*/}
           </div>
        </div>
      </section><br />

      <section id='selDisplay'>
        <div className='selDisplay'>
          {active === 'classSettings' && (
            <ClassSettings/> 
          )}

          {active === 'missionvision' && (
            <MissionVision/>
          )}

          {active === 'newsTestimonial' && (
            <NewsTestimonial/>
          )}

          {active === 'foundation' && (
            <Foundation/>
          )}

          {active === 'gallery' && (
            <Gallery/>
          )}
        </div>
      </section>
    </div>
  )
}
