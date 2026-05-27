import React from 'react'
import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient';
import Swal from 'sweetalert2'
import profilepic from '../../assets/Images/admin profile pic.jfif'

export const FirstTermViewResult = ({targetYear}) => {
    const [loginUser, setLoginuser] = useState(null);
    const [students, setStudents] = useState([]);
    const [activeStudent, setActivestudent]= useState(null);
    const [studentsResult , setStudentresult] = useState([]);
    const [teacherComment, setTeachercomment] = useState([]);
    const [teachComments, setTeachcomments]= useState("");
    const [commentLoading, setCommentloading] = useState(null);

    const fetchData = async()=>{
      if(!targetYear) return;  
     try{
      const {data : {user}} = await supabase.auth.getUser();
      const {data, error} = await supabase
      .from("teachersignup")
      .select("*")
      .eq("id", user.id)
      .single();

      if(error) throw error;
      console.log("Logged in as", data)

      const {data:studentData, error:studentError} = await supabase 
      .from("studentsignup")
      .select("*")
      .eq("class_id", data.assigned_class)

      if(studentError) throw studentError
      setStudents(studentData)
      const studentID = studentData.map(student=> student.id)

      const {data:studentResultData, error:studentResultError} = await supabase
      .from("student_results")
      .select("*")
      .in("student_id", studentID)
      .eq("session", targetYear)

      if(studentResultError) throw studentResultError
      setStudentresult(studentResultData);
      
      const students = studentData.map(student => {
        const studentsResult = studentResultData.filter(result=> result.student_id === student.id);

        const SumTestExam = studentsResult.reduce((sum , result)=> {
            const Test = Number(result.test_score) || 0;
            const Exam = Number (result.exam_score) || 0;
            return sum + Test + Exam
        }, 0)

        const subjectCount = studentsResult.length;
        const cumulativeAverage = subjectCount > 0 ? (SumTestExam / subjectCount).toFixed (2) : "0.00";

        return{
            ...student, cumulativeAverage:cumulativeAverage
        }
        })

      console.log("this" , students)
      setStudents(students)
      
      const {data:commentdata, error:commenterror} = await supabase
      .from("teacher_comments")
      .select("*")
      .eq("term", "First Term")


      if(commenterror) throw commenterror
      setTeachercomment(commentdata);

     }catch(error){
      if(error){
        Swal.fire({
        icon:"error",
        title:"Error",
        text:error.message
      })
      }else if(studentError){
        Swal.fire({
        icon:"error",
        title:"Error",
        text:studentError.message
      })}else if(studentResultError){
        Swal.fire({
        icon:"error",
        title:"Error",
        text:studentResultError.message
      })
    }else if(commenterror){
        Swal.fire({
        icon:"error",
        title:"Error",
        text:commenterror.message
        })
    }
    }finally{

    }
    }

    const commentSubmit = async(id, existingComment)=>{
      setCommentloading(id);

      try{
        const {error}= await supabase
        .from("teacher_comments")
        .upsert({
            ...(existingComment?.id && {id: existingComment.id}),
           student_id:id,
           teacher_id:loginUser?.id,
           term:"First Term",
           session:targetYear,
           comment:teachComments
        })

        if(error) throw error

        Swal.fire({
            icon:"success",
            title:"Success",
            text:"Uploaded Succesfully"
        })

        fetchData();
      }catch(error){
       Swal.fire({
        icon:"error",
        title:"Error",
        text:error.message
       })
      }finally{
        setCommentloading(null)
      }
    }

    useEffect(()=> {
        fetchData();
    }, [targetYear]);
    
  return (
    <div>
        <div>
            <h2 className='text-blue-500 font-bold text-lg'>First Term View Result</h2>
        </div><br />

        <div>
          {students.map((student)=>{
            const existingComment = teacherComment.find(c => c.student_id === student.id);

            return(
           <div className='mt-2 shadow-sm shadow-slate-500 p-3 rounded-xl' key={student.id}>
               <div className='flex gap-2 justify-between'>
                <div className='flex gap-2'>
                    <img src={student.profile_pic_url || profilepic} alt="" className='w-10 shadow-sm rounded-full h-fit'/>
                    <div className='grid'>
                        <span className='text-blue-500 font-bold my-auto'>{student.full_name}</span>
                        <small className='text-slate-400'><span className='font-bold'>Cum Avg :</span> {student.cumulativeAverage || "0.00"}%</small>
                    </div>
                </div>
                
                <button className={`transition-all ${activeStudent === student.id ? "rotate-180" : ""}`} onClick={()=> {setActivestudent(activeStudent === student.id ? " " : student.id); setTeachcomments(existingComment ? existingComment.comment : "")}}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path d="M0 0h24v24H0z" fill="none" /> <path fill="none" stroke="currentColor" stroke-dasharray="10" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15l-5 -5M12 15l5 -5"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="10;0" /></path>
                </svg></button>
            </div>

            {activeStudent === student.id && (
                <form className='mt-3'>
                         <textarea name="" id="" value={activeStudent === student.id ? (teachComments || (existingComment ? existingComment.comment : "")) : " "} className='border w-full rounded-lg p-2 h-30' placeholder={`Enter performance remark for ${student.full_name}`} onChange={(e)=>setTeachcomments(e.target.value)}></textarea>

                   <div className='flex justify-end'>
                      <button className='bg-blue-600 w-30 p-2 rounded-xl text-white' onClick={()=>commentSubmit(student.id, existingComment)} type='button'>{commentLoading === student.id
                      ? <span className='flex justify-center'>
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
                     : "Upload"}</button>
                   </div>
                </form>
            )}
           </div>)
           })}
        </div>
    </div>
  )
}
