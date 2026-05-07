import React from 'react'
import { useState } from 'react'
import { StuProfile } from './StuProfile';
import { StuPassword } from './StuPassword';
import { StudSubject } from './StudSubject';


export const StudProfileCard = () => {

    const [activeProfile, setActiveprofile]= useState("profile");
  return (
     <div className='bg-white shadow-sm p-3'>
          <div className='flex gap-3'>
            <button className={`w-25 min-h-10 transition-all ${activeProfile === "profile" ? "border-b-3 border-b-blue-500" : ""}`} onClick={()=> setActiveprofile("profile")}>Profile</button>
            <button className={`w-25 min-h-10 transition-all ${activeProfile === "password" ? "border-b-3 border-b-blue-500" : ""}`} onClick={()=>setActiveprofile ("password")}>Password</button>
            <button className={`w-35 min-h-10 transition-all ${activeProfile === "subjects" ? "border-b-3 border-b-blue-500" : ""}`} onClick={()=>setActiveprofile ("subjects")}>Classes/Subjects</button>
          </div> <hr className='text-slate-200'/>
    
          <div>
            {activeProfile === "profile" && (
                <StuProfile/>
            )}
    
            {activeProfile === "password" && (
                <StuPassword/>
            )}
    
            {activeProfile === "subjects" && (
               <StudSubject/>
            )}
          </div>
        </div>
  )
}
