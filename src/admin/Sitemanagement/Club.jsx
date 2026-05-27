import React from 'react'
import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import Swal from 'sweetalert2';

export const Club = () => {

    const [loading, setLoading] = useState(false);
    const [club, setClub] = useState("");
    const [clubArray, setClubarray] = useState([]);
    
    const sendClub = async(e)=> {
     e.preventDefault();
     setLoading(true)

     try{
       const {error} = await supabase
       .from("royal_club")
       .insert({
        club_name:club
       })

       if(error) throw error;
       Swal.fire({
        icon:"success",
        title:"Succesfull", 
        text:"Uploaded successfully"
       })
       setClub("");
     }catch(error){

        Swal.fire({
            icon:"error",
            title:"Error",
            text:error.message
        })

     }finally{
        setLoading(false)
     }
    }

    const fetchClub = async()=> {
       try{
         const {data, error} = await supabase
          .from("royal_club")
          .select("*")
          .order("created_at", {ascending:true});

          if(error) throw error;
          setClubarray(data);
          fetchClub();
       }catch(error){
         Swal.fire({
            icon:"error",
            title:"Error",
            text:error.message
        })
       }finally{

       }
    }

    useEffect(()=> {
        fetchClub();
    }, [])
  return (
    <div>
        <div className='mb-1'>
            <h2 className='text-xl font-bold'>Club</h2>
        </div><hr className='w-10'/>

        <div className='mt-2'>
            <label htmlFor=""> Add Clubs</label>

            <form action="" className='mt-2 flex flex-col lg:flex-row gap-2 justify-items-end' onSubmit={sendClub}>
                <input type="text" className='border w-full h-9 rounded-lg p-2' onChange={(e)=> setClub(e.target.value)} value={club}/>
                <button className='bg-blue-500 text-white w-20 h-8 rounded-md'>{loading 
                ?  <span className='flex justify-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><g>
		                <circle cx="12" cy="2.5" r="1.5" fill="currentColor" opacity=".14" />
		                <circle cx="16.75" cy="3.77" r="1.5" fill="currentColor" opacity=".29" />
		                <circle cx="20.23" cy="7.25" r="1.5" fill="currentColor" opacity=".43" />
		                <circle cx="21.5" cy="12" r="1.5" fill="currentColor" opacity=".57" />
		                <circle cx="20.23" cy="16.75" r="1.5" fill="currentColor" opacity=".71" />
		                <circle cx="16.75" cy="20.23" r="1.5" fill="currentColor" opacity=".86" />
		                <circle cx="12" cy="21.5" r="1.5" fill="currentColor" />
		                <animateTransform attributeName="transform" calcMode="discrete" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12" />
	                    </g>
                        </svg>
                      </span>
                      
                      :"Submit"
                }</button>
            </form>
        </div>

        <div className='flex flex-col gap-2 mt-3 pb-2'>
           {clubArray.map((clubs)=>(
             <div key={clubs.id} className='shadow-sm shadow-slate-500/40 rounded-lg p-2.5'>
               <p className='capitalize font-semibold'>{clubs.club_name}</p>
               <button></button>
             </div>
           ))}
        </div>
    </div>
  )
}
