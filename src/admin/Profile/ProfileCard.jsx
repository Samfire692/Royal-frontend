import React from 'react'
import { useState } from 'react'
import { Profiles } from './Profiles'
import { ProfileSettings } from './ProfileSettings'
import { Subjects } from './Subjects'
import { Classes } from './Classes'

export const ProfileCard = () => {

    const [activeProfile, setActiveprofile]= useState("profile")
  return (
    <div className='bg-white shadow-sm p-3'>
      <div className='flex gap-3'>
        <button className={`w-25 min-h-10 transition-all ${activeProfile === "profile" ? "border-b-3 border-b-blue-500" : ""}`} onClick={()=> setActiveprofile("profile")}>Profile</button>
        <button className={`w-25 min-h-10 transition-all ${activeProfile === "settings" ? "border-b-3 border-b-blue-500" : ""}`} onClick={()=>setActiveprofile ("settings")}>Settings</button>
        <button className={`w-25 min-h-10 transition-all ${activeProfile === "subjects" ? "border-b-3 border-b-blue-500" : ""}`} onClick={()=>setActiveprofile ("subjects")}>Subjects</button>
        <button className={`w-25 min-h-10 transition-all ${activeProfile === "classes" ? "border-b-3 border-b-blue-500" : ""}`} onClick={()=>setActiveprofile ("classes")}>Classes</button>
      </div> <hr className='my-3 text-slate-200'/>

      <div>
        {activeProfile === "profile" && (
            <Profiles/>
        )}

        {activeProfile === "settings" && (
            <ProfileSettings/>
        )}

        {activeProfile === "subjects" && (
            <Subjects/>
        )}

        {activeProfile === "classes" && (
            <Classes/>
        )}
      </div>
    </div>
  )
}
