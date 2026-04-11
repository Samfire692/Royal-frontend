import { useState, useEffect } from "react"
import React from 'react'
import { supabase } from "../../supabaseClient"

export const AboutImg = () => {
     const [info, setInfo] = useState([])
        
          const fetchData = async() => {
            // Corrected: Just target 'site_settings' where all your school info lives now
            const { data, error } = await supabase
              .from("site_settings")
              .select("*")// Get that specific row for Royal Ambassadors
        
            if (error) {
              console.log("error: " + error.message)
            } else {
              setInfo(data);
            }
          }
        
          useEffect(() => {
            fetchData();
          }, [])
  return (
    <div className="md:mx-auto">
        {info.map((item)=> (
            <div key={item.id} className="">
                 <img src={item.about_image_url} alt="Royal ambassadors schools front building" className='h-100 w-150 rounded-3xl shadow-xl object-cover' />
            </div>
        ))}
    </div>
  )
}
