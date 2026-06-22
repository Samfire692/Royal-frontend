import React, { useEffect, useState } from 'react'
import {StuSignUp} from '../Students/StuSignUp'
import { supabase } from '../supabaseClient';

export const Studentsignup = () => {

    const [studentsArray, setStudentarray] = useState([]);
    const [teacherData, setTeacherdata] = useState([]);
    const [loading , setLoading] = useState(true);

    const fetchData = async()=> {
      try{
        const {data:{user}, error:userError} = await supabase.auth.getUser();
        const {data:teacherData, error:teacherError} = await supabase
        .from("teachersignup")
        .select("*")
        .eq("id", user?.id)
        .maybeSingle();

        if(userError) throw userError;
        setTeacherdata(user);
        
        const {data, error} = await supabase
        .from("studentsignup")
        .select("*")
        .eq("current_class", teacherData?.assigned_class)

        if(error) throw error;
        setStudentarray(data);
        setLoading(false)
        // console.log("brr", data)
      }catch(error){

      }finally{

      }
    }

    useEffect(()=> {
        fetchData();
    }, [])

    if(loading){
       return(
         <div className='shadow-sm shadow-slate-400 p-3 h-[70vh] flex flex-col gap-2 justify-center place-items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	        <path d="M0 0h24v24H0z" fill="none" />
	        <g>
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

            <p className='font-bold text-slate-500 animate-pulse'>Fetching Data</p>
        </div>
       )
    }

  return (
    <div className='p-2'>
        <div>
            <h2 className='text-3xl font-bold'>Student Signup</h2>
        </div>

        <div className='grid justify-center h-[40vh] place-items-center'>
            <div className='shadow-sm shadow-slate-500 w-fit p-3 rounded-xl'>
              <StuSignUp/>
            </div>
        </div>

        <hr/>

        <div className='mt-3'>
           {studentsArray.map((item)=> (
             <div key={item.id} className='shadow-sm shadow-slate-500 p-3 mt-3 rounded-xl flex lg:flex-row flex-col justify-between'>
               <div className='flex lg:block justify-between'>
                   <p className='font-bold text-blue-500'>{item.full_name}</p>
                   <small className='my-auto'>{item.special_id}</small>
               </div>
                <div className='my-auto flex flex-col lg:flex-row justify-between lg:w-6xl'>
                    <span className=''>{item.email || "pending"}</span>
                    <span className=''>{item.date_of_birth || "pending"}</span>
                    <span className={` text-green ${item.status === "active" ? "text-red-500" : ""}`}>{item.status || "pending"}</span>
                    <span className=''>{item.gender || "pending"}</span>
                    <span className=''>{item.club_name || "pending"}</span>
                </div>
             </div>
           ))}
        </div>
    </div>
  )
}
