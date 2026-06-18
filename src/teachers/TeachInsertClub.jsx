import React from 'react'
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import Swal from 'sweetalert2'

export const TeachInsertClub = ({targetYear}) => {
    const [loginTeacher, setLoginteacher] = useState({});
    const [session, setSession] = useState([]);
    const [loading, setLoading] = useState(true);
    const [studentClub, setStudentclub] = useState([]);
    const [activeMenu, setActivemenu]= useState(null);
    const [submitLoading, setSubmitloading] = useState(null);
    const [comments, setComments] = useState("");
    const [clubComment , setClubcomment] = useState([]);
    const [selectedTerm , setSelectedterm] = useState("First Term");
    const [selectedSesssion, setSelectedsession] = useState("2025/2026");
    const [studentData, setStudentdata]= useState([]);
    const [clubComments, setClubcomments] = useState({});

    const fetchClubstudent = async ()=> {
      try {
        const {data: {user}} = await supabase.auth.getUser();
        const {data:teacherData , error:teacherError} = await supabase
          .from("teachersignup")
          .select("*")
          .eq("email", user?.email);

        if(teacherError) throw teacherError;
        const currentTeacher = teacherData?.[0] || {};
        setLoginteacher(currentTeacher);

        const {data:sessionData, error:sessionError} = await supabase
          .from("royal_session")
          .select("*")
          .order("created_at", {ascending:false});
        
        if(sessionError) throw sessionError;
        setSession(sessionData);

        let targetSession = selectedSesssion;
        let targetTerm = selectedTerm;

        if (loading && sessionData && sessionData.length > 0) {
          targetSession = sessionData[0].session_year;
          targetTerm = sessionData[0].session_term;
          setSelectedsession(targetSession);
          setSelectedterm(targetTerm);
        }

        if(currentTeacher?.club_name){
          const {data:fetchedStudents, error:studentError} = await supabase
            .from("studentsignup")
            .select("*, royalclassrooms!current_class(class_name)")
            .eq("club_name" , currentTeacher?.club_name);

          if(studentError) throw studentError;
          setStudentclub(fetchedStudents);

          const studentId = fetchedStudents?.map(student => student.id) || [];
          
          if(studentId.length > 0){
            const {data:clubCommentData, error:clubCommentError} = await supabase
              .from("club_comments")
              .select("*")
              .in("student_id", studentId)
              .eq("session", targetSession)
              .eq("term", targetTerm);

            if(clubCommentError) throw clubCommentError;
            setClubcomment(clubCommentData);

            const textMap = {};
            clubCommentData?.forEach(record => {
              textMap[record.student_id] = record.comment;
            });
            setClubcomments(textMap);
          } else {
            setClubcomment([]);
            setClubcomments({});
          }
        }
        
        setLoading(false);
        
      }catch(error){
        if(error){
            Swal.fire({
                icon:"error",
                title:"Error",
                text:error.message
            })
        }
      }
    }

    const submitComment = async(id)=>{
   setSubmitloading(id);
   const currentText = clubComments[id] || "";

   try{
    // 1. Check if a comment already exists for this specific student, session, and term
    const { data: existingRecord, error: checkError } = await supabase
      .from("club_comments")
      .select("id")
      .eq("student_id", id)
      .eq("session", selectedSesssion)
      .eq("term", selectedTerm)
      .maybeSingle(); // Safely returns null if nothing is found

    if (checkError) throw checkError;

    let error;

    if (existingRecord?.id) {
      // 2. If it exists, manually UPDATE that exact row using its unique ID
      const { error: updateError } = await supabase
        .from("club_comments")
        .update({ 
          comment: currentText,
          teacher_id: loginTeacher?.id 
        })
        .eq("id", existingRecord.id);
        
      error = updateError;
    } else {
      // 3. If it doesn't exist, INSERT a fresh brand new row
      const { error: insertError } = await supabase
        .from("club_comments")
        .insert({
          student_id: id,
          teacher_id: loginTeacher?.id,
          comment: currentText,
          session: selectedSesssion,
          term: selectedTerm
        });

      error = insertError;
    }

    if(error) throw error;
    
    // Update local state display
    setClubcomment(prev => {
      const filtered = prev.filter(c => c.student_id !== id);
      return [...filtered, { student_id: id, comment: currentText }];
    });

    Swal.fire({
        icon:"success",
        title:"Successful",
        text:"Uploaded Successfully"
    })
   }catch(error){
     if(error){
        Swal.fire({
            icon:"error",
            title:"Error",
            text:error.message
        })
     }
   }finally{
    setSubmitloading(null)
   }
}

    useEffect(()=> {
        fetchClubstudent();
    }, [selectedSesssion, selectedTerm])

    if(loading){
        return(
          <div className='h-[75vh] flex justify-center place-items-center flex-col'>
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
            <select 
              name="" 
              id="" 
              className='cursor-pointer'
              value={session.findIndex(s => s.session_year === selectedSesssion && s.session_term === selectedTerm)} 
              onChange={(e)=> {
                const selectedIndex = e.target.value;
                const chosen = session[selectedIndex];

                if(chosen){
                  setSelectedsession(chosen.session_year);
                  setSelectedterm(chosen.session_term);
                }
               }}>
              {session.map((sessionItem, index)=> (
                <option value={index} key={sessionItem.id} className='text-black small grid'>{sessionItem.session_year} - {sessionItem.session_term}</option>
              ))}
            </select>
          </div>

          <div className='mt-3'>
           {studentClub.map((students)=> {
            return(
            <div key={students.id} className='shadow-sm shadow-slate-500 p-3 rounded-2xl max-w-6xl mx-auto mt-3'>
                <div className='flex justify-between'>
                    <div className=''>
                        <div className='flex gap-2'>
                          <p className='font-semibold'>{students.full_name}</p>
                          <small className='mt-1 font-bold text-slate-500'>{students?.royalclassrooms?.class_name}</small>
                        </div>
                          <small className='text-slate-400 my-auto'>{students.special_id}</small>
                    </div>
                    <button className={`transition-all ${activeMenu === students.id ? " rotate-180" : ""}`} onClick={()=> setActivemenu(activeMenu === students.id ? " " : students.id)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                   <path d="M0 0h24v24H0z" fill="none" /> <path fill="none" stroke="currentColor" strokeDasharray="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15l-5 -5M12 15l5 -5"> <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="10;0" />
                   </path>
                     </svg>
                     </button>
                </div>

                {activeMenu === students.id && (
                    <div className='mt-3'>
                        <textarea name="" id="" className='border w-full h-25 rounded-xl p-2' value={clubComments[students.id] || ""} onChange={(e)=> setClubcomments(prev => ({...prev, [students.id]: e.target.value}))}></textarea>
                        <div className='flex justify-end'>
                            <button className='bg-blue-500 w-20 p-2 text-white rounded-xl' onClick={()=> submitComment(students.id)}>{submitLoading === students.id
                            ? 
                            <span className='flex justify-center'>
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
                            </span>
                            : "Submit"}</button>
                        </div>
                    </div>
                )}
            </div>
            )
           })}
          </div>
       </section>
    </div>
  )
}