import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient';
import Swal from 'sweetalert2';
import { PromotionClasses } from './Pormotion/PromotionClasses';

export const Promotion = () => {
  
  const [session, setSession] = useState([]);
  const [sessionMenu, setSessionmenu] = useState(false);
  const [classArray, setClassarray] = useState([]);

  const fetchData = async()=> {
   try{
    // const firstterm = "First Term"
      const {data:sessionData, error:sessionError} = await supabase
    .from("royal_session")
    .select("*")
    .eq("session_term", "First Term")
    .order("created_at", {ascending:false})

    if(sessionError) throw sessionError 
    setSession(sessionData)
    // console.log("current session", sessionData);

    const {data:classData, error:classError} = await supabase
    .from("royalclassrooms")
    .select("*")

    if(classError) throw classError;
    setClassarray(classData);
    console.log("lists of classes" , classData)
   }catch(error){
     Swal.fire({
      icon:"error", 
      title:"Error",
      text:error.message
     })
   }finally{

   }

  }

  const sessionBtn = async(sessionYear)=> {
    localStorage.setItem("PromotionSessionYear", sessionYear)
    window.location.reload();
  }

  const classBtn = async(id, className)=> {
    localStorage.setItem("ClassesId", id)
    localStorage.setItem("ClassesName", className )
    window.location.reload();
  }

  useEffect(()=>{
    fetchData();
  }, [])

  return (
    <div className='px-2 pb-2'>
      <div className=''>
        <h2 className='font-bold text-3xl'>Promotion</h2>
      </div>

      <div className='bg-blue-500 lg:w-sm p-3 mt-2 rounded-2xl'>
        <div className='flex justify-between'>
           <p className='font-bold text-xl text-white'>Academic Year</p>
           <button className={`text-white transition-all ${sessionMenu ? "-rotate-180" : ""}`} onClick={()=>setSessionmenu(!sessionMenu)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	          <path d="M0 0h24v24H0z" fill="none" />
	          <path fill="none" stroke="currentColor" stroke-dasharray="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15l-5 -5M12 15l5 -5">
		        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="10;0" />
	          </path>
            </svg>
           </button>
        </div>

       {sessionMenu && (
           <div>
          {session.map((sessions)=> (
          <div key={sessions.id} className=''>
            <button className='text-white p-2 font-semibold mt-2 w-full text-start rounded-xl hover:bg-white hover:text-blue-500' onClick={()=> sessionBtn(sessions.session_year)}>{sessions.session_year}</button>
          </div>
          ))}
        </div>
       )}
      </div>

      <div className='flex gap-2 mt-3 overflow-x-scroll pb-2 px-2'>
          {classArray.map((classes)=> (
            <div key={classes.id} className=''>
              <button className='p-2 rounded-xl font-bold text-blue-500 shadow-sm shadow-blue-500/50 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white' onClick={()=>classBtn(classes.id, classes.class_name)}>{classes.class_name}</button>
            </div>
          ))}
       </div>

       <div className='shadow-sm shadow-slate-400 max-w-6xl mx-auto p-2 rounded-xl mt-3'>
         <PromotionClasses/>
       </div>
    </div>
  )
}
