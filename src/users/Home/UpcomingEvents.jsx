import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient';

export const UpcomingEvents = () => {

    const [events, setEvent]= useState([]);

    const fetchEvents= async()=>{
      const {data, error} = await supabase
            .from("schoolabout")
            .select("*")
            .eq("id", 1)
      
            if(error){
              console.log("error" + error.message)
            }else{
              setEvent(data);
            }
    }

    useEffect(()=> {
        fetchEvents()
    }, [])

  return (
    <div className='px-3 mt-2'>
        <section>
            {events.map((item)=> (
                <div key={item.id} className='bg-blue-800 lg:flex p-2 rounded-xl'>
                  <div className='p-2 rounded-xl flex lg:flex-col flex-row gap-2 justify-center text-center' style={{background:"skyblue"}}>
                     <p className='text-2xl font-bold text-white'>{item.event_day}</p>
                     <p className='text-2xl font-bold text-white'>{item.event_month}</p>
                     <p className='text-2xl font-bold text-white'>{item.event_year}</p>
                  </div>

                  <div className='text-center w-full grid gap-2 py-2 place-items-center'>
                    <h2 className='text-2xl font-bold text-white underline'>Upcoming Events</h2>
                    <p className='text-2xl font-bold text-white'>{item.event_note}</p>
                  </div>
                </div>
            ))}
        </section><br />
    </div>
  )
}
