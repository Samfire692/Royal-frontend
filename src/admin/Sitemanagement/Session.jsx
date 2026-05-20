import React from 'react'
import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import Swal from 'sweetalert2';

export const Session = () => {

    const [session, setSession]= useState("");
    const [term, setTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [sessionData, setSessiondata] = useState([])

    const handData = async(e)=> {
       e.preventDefault();

       setLoading(true);

       try{
        const {error} = await supabase
        .from("royal_session")
        .insert({
            session_year:session,
            session_term:term
        })

        if(error) throw error;

        Swal.fire({
            icon:"success",
            title:"Successful",
            text:"Uploaded Successfully"
        })

       }catch(error){
         Swal.fire({
            icon:"error",
            title:"Error",
            text:error.message
         })
       }finally{
         setLoading(false)
         setSession("")
         setTerm("")
       }
    }

    const fetchData = async()=> {
        try{
          const {data, error} = await supabase
          .from("royal_session")
          .select("*")
          .order("created_at", {ascending:false})
          .limit(1);

          if(error) throw error;
          setSessiondata(data)
          fetchData(data);
        }catch(error){
           if(error.message.includes("Fetch")){
            Swal.fire({
                icon:"error",
                title:"Internet Connection",
                text:"No Internet Connection"
            })
           }else{
            Swal.fire({
                icon:"error",
                title:"Error",
                text:error.message
            })
           }
        }finally{
          
        }
    }

    useEffect(()=> {
        fetchData();
    }, [])
  return (
    <div>
        <div>
            <h2 className='font-bold text-xl'>Session</h2>
        </div>

        <div>
            <form action="" className='flex flex-wrap md:flex-nowrap gap-2 justify-end' onSubmit={handData}>
                <input type="text" className='border h-9 p-3 rounded mt-2 w-full' onChange={(e)=> setSession(e.target.value)} defaultValue={sessionData[0]?.session_year}/>
                <input type="text" className='border h-9 p-3 mt-2 w-full rounded' onChange={(e)=> setTerm(e.target.value)} defaultValue={sessionData[0]?.session_term}/>
                <button className='bg-blue-600 text-white w-30 h-fit mt-2.5 p-1 rounded' disabled={!term || !session}>{loading 
                ? 
                <span className='flex justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="M0 0h24v24H0z" fill="none" /><g>
		            <circle cx="12" cy="2.5" r="1.5" fill="currentColor" opacity=".14" />
		            <circle cx="16.75" cy="3.77" r="1.5" fill="currentColor" opacity=".29" />
		            <circle cx="20.23" cy="7.25" r="1.5" fill="currentColor" opacity=".43" />
		            <circle cx="21.5" cy="12" r="1.5" fill="currentColor" opacity=".57" />
		            <circle cx="20.23" cy="16.75" r="1.5" fill="currentColor" opacity=".71" />
		            <circle cx="16.75" cy="20.23" r="1.5" fill="currentColor" opacity=".86" />
		            <circle cx="12" cy="21.5" r="1.5" fill="currentColor" />
		            <animateTransform attributeName="transform" calcMode="discrete" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12" />
	                </g></svg>
                </span>
                : "Submit"}</button>
            </form>
        </div>
    </div>
  )
}
