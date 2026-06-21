import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient';
import { ReportCard } from './ReportCard';

export const Result = () => {

    const [session, setSession] = useState([]);
    const [activeSessionMenu, setActivesessionmenu] = useState(false);
    const [studentLogin, setStudentlogin] = useState(null);

    const fetchData = async()=>{
      try{
       const {data:{user}} = await supabase.auth.getUser();
       const {data:studentData , error:studentError} = await supabase
       .from("studentsignup")
       .select("*")
       .eq("id", user?.id)
       .maybeSingle();

       if(studentError) throw studentError;
       setStudentlogin(studentData);
    //    console.log("student :", studentData)

       const {data:sessionData , error:sessionError} = await supabase
       .from("royal_session")
       .select("*")
       .order("created_at", {ascending:false})

       if(sessionError) throw sessionError;
       setSession(sessionData)
    //    console.log(sessionData);
      }catch(error){

      }finally{

      }
    }

    const submitSession = async(id, sessionTerm , sessionYear)=> {
        try{
        //   console.log(id + sessionTerm + sessionYear)
        localStorage.setItem("Student Id" , id)
        localStorage.setItem("Student Term", sessionTerm)
        localStorage.setItem("Student Year", sessionYear)

        window.location.reload();
        }catch(error){

        }finally{

        }
    }

    useEffect(()=>{
        fetchData();
    }, [])

  return (
    <div className='px-2'>
        <div>
            <h2 className='text-2xl font-bold'>Check Result</h2>
        </div>

        <div className='bg-blue-500 lg:w-sm p-3 rounded-2xl mt-2'>

            <div className='flex justify-between'>
                <p className='text-white text-xl'>Academic Session</p>
                <button className={`text-white transition-all ${activeSessionMenu ? "-rotate-180" : ""}`} onClick={()=> setActivesessionmenu(!activeSessionMenu)}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	             <path d="M0 0h24v24H0z" fill="none" />
	             <path fill="none" stroke="currentColor" stroke-dasharray="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15l-5 -5M12 15l5 -5">
		         <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="10;0" />
	             </path>
                 </svg>
                </button>
            </div>
           {activeSessionMenu && (
              <div>
                {session.map((sessions)=> (
                    <div key={sessions.id}>
                        <button className='text-white p-2 font-bold hover:bg-white hover:text-blue-500 w-full text-start mt-2 rounded-xl' onClick={()=> submitSession(studentLogin?.id ,sessions.session_term , sessions.session_year)} >{sessions.session_term} {sessions.session_year}</button>
                    </div>
                ))}
            </div>
           )}
        </div>

        <div className='p-2 mt-2'>
            <ReportCard/>
        </div>
    </div>
  )
}
