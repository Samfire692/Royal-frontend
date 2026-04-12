import React, { useState } from 'react'
import { Hero } from './Home/Hero'
import { About } from './Home/About'
import { Facilities } from './Home/Facilities'
import { useEffect } from 'react'
import { FaSpinner } from 'react-icons/fa'
import { supabase } from '../supabaseClient'
import schoolLogo from '../assets/Images/Royal Ambassadors Schools Logo.png'
import { UpcomingEvents } from './Home/UpcomingEvents'
import { News } from './Home/News'
import { Testimonial } from './Home/Testimonial'
import { Footer } from './Footer'

export const Home = () => {
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState([]);

  useEffect(() => {
    const fetchEverything = async () => {
        const { data } = await supabase
        .from('schoolabout')
        .select('*')
        .order("created_at", {ascending:false})
        .limit(6);
        
        if(data){
         setInfo(data);
        }
        setLoading(false); // ✅ Only stop loading after data lands
    };
    fetchEverything();
}, []);

  if (loading) {
    return (
        <div className="h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                 <img src={schoolLogo} alt="" className='w-20 h-20 rounded-full animate-pulse'/>
                <p className="font-bold text-gray-500 italic">Loading...</p>
            </div>
        </div>
    );
}
  return (
    <div className='pt-2 px-1 mt-4 lg:mt-0 flex flex-col gap-6'>
       <Hero info={info}/>
       <About info={info}/>
       <Facilities info={info}/>
       <UpcomingEvents info={info}/>
       <News info={info}/>
       <Testimonial info={info}/>

       <div>
        <Footer/>
       </div>
    </div>
    
  )
}
