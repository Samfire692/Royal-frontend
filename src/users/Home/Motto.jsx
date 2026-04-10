import { useState, useEffect } from "react"
import React from 'react'
import { supabase } from "../../supabaseClient"

export const Motto = () => {

     const [info, setInfo] = useState([])
    
      const fetchData = async() => {
        // Corrected: Just target 'site_settings' where all your school info lives now
        const { data, error } = await supabase
          .from("schoolabout")
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
    <div>
        {info.map((items)=> (
            <div key={items.id}>
                <p>Motto: {items.motto}</p>
            </div>
        ))}
    </div>
  )
}
