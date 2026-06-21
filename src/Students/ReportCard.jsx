import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient';
import Swal from 'sweetalert2';

export const ReportCard = () => {

    const [studentId , setStudentId] = useState(null);
    const [studentterm, setStudentterm] = useState(null);
    const [studentyear, setStudentyear] = useState(null); 
    const [subjectResult , setSubjectresult] = useState([]);
    const [loading , setLoading] = useState(true);

     const fetchData = async()=> {
      try{
        const studentID = localStorage.getItem("Student Id");
        const studentTerm = localStorage.getItem("Student Term");
        const studentYear = localStorage.getItem("Student Year");

        setStudentId(studentID);
        setStudentterm(studentTerm);
        setStudentyear(studentYear);

        if(!studentID) return;

        const {data:subjectresultData , error:subjectresultError} = await supabase
        .from("student_results")
        .select("* , subjects!subject_id(*)")
        .eq("student_id", studentID)
        .eq("session" , studentYear)
 
        if(subjectresultError) throw subjectresultError;
        setSubjectresult(subjectresultData);
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

    useEffect(()=> {
        fetchData();
    }, [])

    const Results = subjectResult.filter(item => item.term === studentterm).map((results)=> {
        const test = results?.test_score;
        const exam = results?.exam_score;
        const cummScore = Number(test) + Number(exam);

        let firstterm = "-"
        let secondterm = "-"
        let weightAverage = ""

        if(studentterm === "First Term"){
            weightAverage = cummScore;
             }else if(studentterm === "Second Term"){
                const firstTerm = subjectResult.find(item => item.subject_id === results.subject_id && item.term === "First Term") || 0

                console.log("first score ", firstTerm)

                const firstTermScore = Number(firstTerm?.test_score || 0) + Number(firstTerm?.exam_score || 0);

                const addition = firstTermScore + cummScore
                weightAverage = addition / 2;

                firstterm = firstTermScore;
                 }else{
                const firstTerm = subjectResult.find(firstitem => firstitem.subject_id === results.subject_id && firstitem.term === "First Term")

                const secondTerm = subjectResult.find(seconditem => seconditem.subject_id === results.subject_id && seconditem.term === "Second Term")

                const firstTermScore = Number(firstTerm?.test_score || 0) + Number(firstTerm?.exam_score || 0);
                            
                const secondTermScore = Number(secondTerm?.test_score || 0) + Number(secondTerm?.exam_score || 0);
                            
                console.log("second score", secondTerm);
                const addition = firstTermScore + secondTermScore + cummScore
                weightAverage = addition / 3;

                firstterm = firstTermScore;
                secondterm = secondTermScore;
                }

                const finalWeightAverage = Math.round(weightAverage);

                let grade = "_"
                         let score = Number(weightAverage);
                         let TeacherComment = "_"
                          if (score >= 75) {
                            grade = "A1";  
                            TeacherComment = "Excellent"
                             } else if (score >= 70) {
                               grade = "B2"; 
                               TeacherComment = "Very Good"
                             } else if (score >= 65) {
                               grade = "B3"; 
                               TeacherComment = "Good"
                             } else if (score >= 60) {
                               grade = "C4"; 
                               TeacherComment = "Credit"
                             } else if (score >= 55) {
                               grade = "C5"; 
                               TeacherComment = "Credit"
                             } else if (score >= 50) {
                               grade = "C6";
                               TeacherComment = "Credit"
                             } else if (score >= 45) {
                               grade = "D7"; 
                               TeacherComment = "Pass"
                             } else if (score >= 40) {
                               grade = "D8"; 
                               TeacherComment = "Pass"
                             } else {
                               grade = "F9";
                               TeacherComment = "Fail"
                             }

       return{
        subjectName:results?.subjects?.subject_name,
        test, 
        exam, 
        cummScore,
        firstterm,
        secondterm,                       
        weightAverage: finalWeightAverage,
        grade,
        TeacherComment
       } 
    });

    const totalSubjects = Results.length;
                             const totalCummulativeScore = Results.reduce((sum, item) => sum + item.weightAverage, 0);
                             const finalPercentage = totalSubjects > 0 ? ((totalCummulativeScore / (totalSubjects * 100)) * 100).toFixed(1) : "0.0";

                             let adminComment = "_"
                              if(finalPercentage >= 90){
                                adminComment = "Outstanding! Keep up the excellent work.";
                              }else if(finalPercentage >= 75){
                                adminComment = "Very Good. You are performing well.";
                              }else if(finalPercentage >= 60){
                                adminComment = "Good job, but there is room for improvement.";
                              }else if(finalPercentage >= 50){
                                adminComment = "Fair performance. You need to study harder.";
                              }else{
                                adminComment = "Needs improvement. Please contact the teacher for extra support."
                              }

  if(loading){
    return(
        <div className='h-25 flex justify-center shadow-sm shadow-slate-400 rounded-xl'>
            <span className='font-bold animate-pulse my-auto text-slate-400'>Loading  . . .</span>
        </div>
    )
  }                            

  return (
    <div>
        <div className='flex gap-2'>
          <h2 className='text-xl font-bold'>{studentterm}</h2>
          <span className='my-auto'>({studentyear})</span>
        </div>

         <div className='shadow mt-3 p-3 rounded-xl'>
          <div className='flex justify-around'>
            <div className='grid'>
             <label htmlFor="" className='font-bold text-xl text-blue-400 text-center'>Over All</label>
             <div className='flex justify-center place-items-center mt-2'>
                 <span className={`font-bold text-2xl rounded-full border-12 border-r-white border-l-white border-t-8 border-b-8 border-blue-400 w-30 h-30 flex place-items-center justify-center ${totalCummulativeScore < 500 ? "border-red-400" : "" }`} style={{animation:"spin 2s linear infinite"}}>
                 </span>
                 <span className={`absolute font-bold text-2xl text-blue-500 ${totalCummulativeScore < 500 ? "text-red-500" : ""}`}>{totalCummulativeScore}</span>
             </div>
            </div>

            <div className='grid'>
             <label htmlFor="" className='font-bold text-xl text-blue-400 text-center'>Percentage</label>
             <div className='flex justify-center place-items-center mt-2'>
                 <span className={`font-bold text-2xl rounded-full border-12 border-r-white border-l-white border-t-8 border-b-8 border-blue-400 w-30 h-30 flex place-items-center justify-center ${finalPercentage < 50 ? "border-red-400" : "" }`} style={{animation:"spin 2s linear infinite"}}>
                 </span>
                 <span className={`absolute font-bold text-2xl text-blue-500 ${finalPercentage < 50 ? "text-red-500" : ""}`}>{finalPercentage}%</span>
             </div>
            </div>

          </div>
        </div>

        <div>
           {Results.map((res)=> (
             <div key={res.id} className='p-3 shadow-sm shadow-slate-400 mt-2 rounded-xl'>
                <p className='font-bold'>{res.subjectName}</p>
                
                <div className='flex flex-wrap justify-around gap-3'>
                    <div className='grid mt-2'>
                      <label className='font-bold text-center text-slate-400'>Test</label>
                      <span className={`mx-auto text-center shadow w-11 h-10 rounded-lg text-xl font-bold p-2 text-blue-500 ${res.test < 20 ? "text-red-400" : ""}`}>{res.test}</span>
                   </div>

                   <div className='grid mt-2'>
                      <label className='font-bold text-slate-400'>Exam</label>
                       <span className={`mx-auto text-center shadow w-11 h-10 rounded-lg text-xl font-bold p-2 text-blue-500 ${res.exam < 30 ? "text-red-400" : ""}`}>{res.exam}</span>
                   </div>

                    <div className='grid mt-2'>
                      <label className='font-bold text-slate-400'>Total</label>
                      <span className={`mx-auto text-center shadow w-11 h-10 rounded-lg text-xl font-bold p-2 text-blue-500 ${res.cummScore < 50 ? "text-red-400" : ""}`}>{res.cummScore}</span>
                   </div>

                   <div className='grid mt-2'>
                      <label className='font-bold text-slate-400'>1st Term</label>
                      <span className={`mx-auto text-center shadow w-11 h-10 rounded-lg text-xl font-bold p-2 text-blue-500 ${res.firstterm < 50 ? "text-red-400" : ""}`}>{res.firstterm}</span>
                   </div>

                   <div className='grid mt-2'>
                      <label className='font-bold text-slate-400'>2nd Term</label>
                      <span className={`mx-auto text-center shadow w-11 h-10 rounded-lg text-xl font-bold p-2 text-blue-500 ${res.secondterm < 50 ? "text-red-400" : ""}`}>{res.secondterm}</span>
                   </div>

                   <div className='grid mt-2'>
                      <label className='font-bold text-slate-400'>Final</label>
                      <span className={`mx-auto text-center shadow w-11 h-10 rounded-lg text-xl font-bold p-2 text-blue-500 ${res.weightAverage < 50 ? "text-red-400" : ""}`}>{res.weightAverage}</span>
                   </div>

                   <div className='grid mt-2'>
                      <label className='font-bold text-slate-400'>Grade</label>
                      <span className={`mx-auto text-center shadow w-11 h-10 rounded-lg text-xl font-bold p-2 text-blue-500`}>{res.grade}</span>
                   </div>

                   <div className='grid mt-2'>
                      <label className='font-bold text-slate-400'>Teacher Comment</label>
                      <span className={`mx-auto rounded-lg text-xl font-bold p-2 text-blue-500`}>{res.TeacherComment}</span>
                   </div>
                </div>
             </div>
           ))}
        </div>

         <div className='mt-2 grid'>
             <label htmlFor="" className='font-bold'>Class Teacher Comment :</label>
             <span className='border-b border-dashed'>{adminComment}</span>
          </div>
    </div>
  )
}
