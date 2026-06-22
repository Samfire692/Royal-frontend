import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient';
import Swal from 'sweetalert2';
import { FirstTermViewResult } from './Result/FirstTermViewResult';

export const TeachStudentresult = () => {
    const [session, setSession] = useState([]);
    const [activeMenu, setActivemenu] = useState(false);
    const [teacherLogin , setTeacherlogin] = useState(null);
    const [activeMenuLoading, setActivemenuLoading] = useState("Loading pls wait ...");

    const fetchData = async()=> {
        try{
          const {data:{user}, error} = await supabase.auth.getUser();
          const {data:teacherData , error:teacherError} = await supabase
          .from("teachersignup")
          .select("*")
          .eq("id", user.id)
          .maybeSingle()

          if(error) throw error;
          setTeacherlogin(teacherData)
          // console.log("my name is" , user)
          
          // console.log("nn", teacherData.assigned_class);
        }catch(error){

        }finally{

        }
    }

    const fetchSession = async()=>{
      try{
        const {data , error} = await supabase
        .from("royal_session")
        .select("*")
        .order("created_at", {ascending:false})

        setSession(data);
        setActivemenuLoading("")
        // console.log('list of session' , data)
      }catch(error){
         Swal.fire({
            icon:"error",
            title:"Error",
            text:error.message
         })
      }finally{
         
      }
    }

    const chooseSession= async(id, session_term, session_year)=>{
        try{
        //    alert(id + session_term + session_year)
        localStorage.setItem("id", id)
        localStorage.setItem("Assignedclass" , teacherLogin?.assigned_class)
        localStorage.setItem("Term", session_term)
        localStorage.setItem("Session", session_year)

        window.location.reload();
        }catch(error){

        }finally{

        }
    }

    useEffect(()=> {
        fetchSession()
    }, [])


    useEffect(()=> {
        fetchData()
    }, [])
    
  return (
    <div className='pb-3 px-2'>
        <div>
            <h2 className='text-3xl font-bold'>Student Result</h2>
        </div>

        <div className='bg-blue-500 text-white p-3 rounded-xl mt-3 lg:w-md flex justify-between'>
          <div className='flex gap-2'>
            <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	            <path d="M0 0h24v24H0z" fill="none" />
	            <path fill="currentColor" d="M19 4h-2V3a1 1 0 0 0-2 0v1H9V3a1 1 0 0 0-2 0v1H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m1 15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7h16Zm0-9H4V7a1 1 0 0 1 1-1h2v1a1 1 0 0 0 2 0V6h6v1a1 1 0 0 0 2 0V6h2a1 1 0 0 1 1 1Z" />
               </svg>
            </span>
            <span className='font-bold'>Academic Calender</span>
          </div>
           
           <button onClick={()=>setActivemenu(!activeMenu)} className={`transition-all ${activeMenu ? "-rotate-180" : ""}`}>
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	         <path d="M0 0h24v24H0z" fill="none" />
          	 <path fill="none" stroke="currentColor" strokeDasharray="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15l-5 -5M12 15l5 -5">
		     <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="10;0" />
	         </path>
             </svg>
           </button>
        </div>

        {activeMenu && (
            <div className='shadow-sm shadow-slate-400 mt-3 w-55 rounded-2xl p-2 absolute bg-white'>
             <p className='flex justify-between px-3 font-bold'><span>Session</span> <span>Year</span></p>
             <p className='text-center animate-pulse font-bold text-slate-500 mt-2'>{activeMenuLoading}</p>
             {session.map((sessions)=>(
              <div className="" key={sessions.id}>
                <button className='p-1 border-b border-slate-300 rounded w-full mt-1 text-start hover:bg-blue-500 hover:text-white flex justify-between' onClick={()=> chooseSession(sessions.id, sessions.session_term , sessions.session_year)}><span>{sessions.session_term}</span> <span>{sessions.session_year}</span></button>
              </div>
             ))}
           </div>
        )}

        <div className='mt-4 px-2'>
            <FirstTermViewResult/>
        </div>
    </div>
  )
}
