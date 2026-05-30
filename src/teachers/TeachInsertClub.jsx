import React from 'react'
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import Swal from 'sweetalert2'

export const TeachInsertClub = () => {
    const [loginTeacher, setLoginteacher] = useState({});
    const [session, setSession] = useState([]);
    const [loading, setLoading] = useState(true);
    const [studentClub, setStudentclub] = useState([]);
    const [activeMenu, setActivemenu]= useState(null);

    const fetchClubstudent = async ()=> {
      try{
       const {data: {user}} = await supabase.auth.getUser();
       const {data:teacherData , error:teacherError} = await supabase
       .from("teachersignup")
       .select("*")
       .eq("email", user?.email)

       if(teacherError) throw teacherError
       const currentTeacher = teacherData?.[0] || {};
       setLoginteacher(currentTeacher);
       console.log("Info :" , user);

       const {data:sessionData, error:sessionError} = await supabase
       .from("royal_session")
       .select("*")
       .order("created_at", {ascending:false})
       
       if(sessionError) throw sessionError;
       setSession(sessionData);

       if(currentTeacher?.club_name){
        const {data:studentData, error:studentError} = await supabase
       .from("studentsignup")
       .select("*")
       .eq("club_name" , currentTeacher?.club_name);

        if(studentError) throw studentError;
        setStudentclub(studentData);
       }
        setLoading(false)
      }catch(error){
        if(error){
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
        fetchClubstudent();
    }, [])

    if(loading){
        return(
          <div className='h-[70vh] flex justify-center place-items-center flex-col'>
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
            <small className='font-bold mt-2'>Loading</small>
          </div>
        );
    }

  return (
    <div className='pb-2'>
        <div>
            <h2 className='text-3xl font-bold'>Insert Club</h2>
        </div>

       <section className='mt-4 p-3'>
          <div className='bg-blue-500 text-white max-w-6xl p-5 mx-auto rounded-4xl flex justify-between'>
            <p className='text-xl font-bold capitalize'>{loginTeacher?.club_name}</p>
            <select name="" id="" className='cursor-pointer'>
              {session.map((session)=> (
                <option value={session.session_year} key={session.id} className='text-black small grid'>{session.session_year} - {session.session_term}</option>
              ))}
            </select>
          </div>

          <div className='mt-3'>
           {studentClub.map((students)=> (
            <div key={students.id} className='shadow-sm shadow-slate-500 p-3 rounded-2xl max-w-6xl mx-auto mt-3'>
                <div className='flex justify-between'>
                    <p className=''>{students.full_name}</p>
                    <button onClick={()=> setActivemenu(activeMenu === students.id ? " " : students.id)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	                 <path d="M0 0h24v24H0z" fill="none" /> <path fill="none" stroke="currentColor" stroke-dasharray="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15l-5 -5M12 15l5 -5"> <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="10;0" />
	                 </path>
                     </svg>
                     </button>
                </div>

                {activeMenu === students.id && (
                    <div className='mt-3'>
                    <form action="">
                        <textarea name="" id="" className='border w-full h-25 rounded-xl'></textarea>
                        <div className='flex justify-end'>
                            <button className='bg-blue-500 w-20 p-2 text-white rounded-xl'>Submit</button>
                        </div>
                    </form>
                    </div>
                )}
            </div>
           ))}
          </div>
       </section>
    </div>
  )
}
