import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient';
import Swal from 'sweetalert2';
import { ReportCard } from './ReportCard';

export const FirstTermViewResult = () => {
    const [id, setId] = useState(null);
    const [term, setTerm] = useState(null);
    const [session, setSession] = useState(null);
    const [assignedClass , setAssignedclass] = useState(null);
    const [studentsArray, setStudentarray] = useState([]);
    const [activeMenu, setActivemenu] = useState(false);
    const [submitLoading, setSubmitloading] = useState(null);
    const [studentComments, setStudentcomments] = useState({});
    const [teacherLogin, setTeacherlogin] = useState([]);
    const [commentArray, setCommentarray] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeReportcard, setActivereportCard] = useState(null);

    const fetchData =async()=>{
      try{
        const Id = localStorage.getItem("id");
        const Term = localStorage.getItem("Term");
        const Session = localStorage.getItem("Session");
        const AssignedClass = localStorage.getItem("Assignedclass");

        setId(Id);
        setSession(Session);
        setTerm(Term);
        setAssignedclass(AssignedClass);
 
         if(!Id) return;

        const {data:{user}} = await supabase.auth.getUser();

        const {data:teacherData, error:teacherError} = await supabase
        .from("teachersignup")
        .select("*")
        .eq("id", user.id)
        .single();
        
        if(teacherError) throw teacherError;
        setTeacherlogin(teacherData);
        // console.log("Logged in right now is " , teacherData)

        const {data, error} = await supabase
        .from("studentsignup")
        .select("*")
        .eq("class_id", AssignedClass)

        if(error) throw error;
        setStudentarray(data);
        // console.log("list of students", data)
        setLoading(false)
      }catch(error){
        Swal.fire({
            icon:"error",
            title:"Error",
            text:error.message
        })
      }finally{

      }
    }

    const submitComments = async(id)=> {
       setSubmitloading(id);

       try{
        const {error} = await supabase
        .from("teacher_comments")
        .upsert({
            student_id:id,
            teacher_id:teacherLogin?.id,
            comment:studentComments[id] || "",
            term,
            session
        }, {onConflict: "student_id, term , session"})

        if(error) throw error
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
        setSubmitloading(null)
       }
    }

    const fetchComments = async(id)=> {
        try{
           const {data, error} = await supabase 
           .from("teacher_comments")
           .select("*")
           .eq("student_id", id)
           .eq("session", session)
           .eq("term", term)
           .maybeSingle();

           if(error) throw error;
           if (data) {
               setStudentcomments(prev => ({ ...prev, [id]: data.comment }));
           }
        }catch(error){
            Swal.fire({
            icon:"error",
            title:"Error", 
            text:error.message
        })
        }finally{

        }
    }

    const downloadReportcard = async(id, full_name)=> {
        try{
          const html2pdfModule = await import ('html2pdf.js');
          const html2pdf = html2pdfModule.default;
          const element = document.getElementById("reportCard")
          html2pdf (element, {
            margin: [15, 12, 15, 12],
            filename: `${full_name}_Report_Card.pdf`,
            image:{type:"jpeg", quality:0.98},
            html2canvas:{
                scale:2,
                useCORS:true,
                windowWidth:1100
            }, 
            jsPDF:{
                unit:'mm',
                format:'a4',
                orientation:'portrait'
            }
          })
        }catch(error){
        //   console.error("Download initializing failed", error);
        }finally{

        }
    }

    const viewReportCard = async(id)=> {
      localStorage.setItem("StudentId" , id);
    }

    useEffect(()=>{
        fetchData();
    }, [])

    if(loading){
        return(
            <div className='p-3 shadow-sm shadow-slate-400 rounded-xl text-center'>
                <span className=' animate-pulse font-bold text-slate-400 flex justify-center gap-2'>Fetching Students 
                <span>
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
                </span>
            </div>
        )
    }
  return (
    <div>
       <div className='flex gap-1'>
        <h2 className='text-xl font-bold text-blue-500'>{term}</h2>
        <small className='font-bold text-blue-500 mt-1.5'>({session})</small>
       </div>

       <div className='mt-3'>
         {studentsArray.map((students)=> (
            <div key={students.id} className='shadow-sm shadow-slate-400 rounded-xl p-2 mt-2'>
                <div className='flex justify-between'>
                    <div className='w-full flex justify-between pe-3'>
                      <div>
                        <p className='font-bold text-blue-700'>{students.full_name}</p>
                        <small className='text-slate-400'>{students.special_id}</small>
                      </div>
                        {/* <button className='text-blue-500 h-fit p-1 rounded-full my-auto bg-blue-500/20' onClick={()=> downloadReportcard(students.id, students.full_name)}>
                            <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	                        <path d="M0 0h24v24H0z" fill="none" />
	                        <g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
		                    <path fill="currentColor" fill-opacity="0" stroke-dasharray="20" d="M12 4h2v6h2.5l-4.5 4.5M12 4h-2v6h-2.5l4.5 4.5">
			                <animate attributeName="d" dur="1.5s" keyTimes="0;0.5;1" repeatCount="indefinite" values="M12 4h2v6h2.5l-4.5 4.5M12 4h-2v6h-2.5l4.5 4.5;M12 4h2v3h2.5l-4.5 4.5M12 4h-2v3h-2.5l4.5 4.5;M12 4h2v6h2.5l-4.5 4.5M12 4h-2v6h-2.5l4.5 4.5" />
			                <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="20;0" />
			                <animate fill="freeze" attributeName="fill-opacity" begin="0.7s" dur="0.4s" to="1" />
		                    </path>
		                    <path fill="none" stroke-dasharray="14" stroke-dashoffset="14" d="M6 19h12">
		                 	<animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" to="0" />
		                    </path>
	                        </g>
                            </svg>
                            </span>
                        </button> */}
                    </div>

                    <button onClick={()=> {
                        const menuOpen = activeMenu !== students.id;
                        setActivemenu(activeMenu === students.id ? "" : students.id) ;
                        if(menuOpen){
                            fetchComments(students.id);
                        }}} className={` transition-all ${activeMenu === students.id ? "-rotate-180" : " "}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	                  <path d="M0 0h24v24H0z" fill="none" />
          	          <path fill="none" stroke="currentColor" strokeDasharray="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15l-5 -5M12 15l5 -5">
		              <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="10;0" />
	                  </path>
                      </svg>
                    </button>
                </div>

                 <div className={`flex justify-center ${activeMenu === students.id ? "hidden" : ""}`}>
                    <button className='bg-blue-300/30 w-50 p-2 rounded-xl text-blue-500 font-bold' onClick={()=>{
                        setActivereportCard(activeReportcard === students.id ? "" : students.id); viewReportCard(students.id)
                    }}>View Report Card</button>
                 </div>

               {activeReportcard === students.id && (
                 <div className='mt-4'>
                    <div id='reportCard'>
                         <ReportCard/>
                    </div>
                    <div className='flex justify-center'>
                        <button className='bg-blue-500 w-40 rounded-xl text-white p-2 mt-2' onClick={()=> downloadReportcard(students.id, students.full_name)}>Download</button>
                    </div>
                 </div>
               )}

               {activeMenu === students.id &&(
                 <div className='mt-2'>
                    <textarea name="" id="" className='w-full border h-25 rounded-lg p-2' onChange={(e) => setStudentcomments({ ...studentComments, [students.id]: e.target.value })} value={studentComments[students.id] || ""}></textarea>
                    <button className='w-full p-2 bg-blue-500 rounded-xl text-white font-bold' onClick={()=> submitComments(students.id)}>{submitLoading === students.id
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
               )}
            </div>
         ))}
       </div><br />
    </div>
  )
}
