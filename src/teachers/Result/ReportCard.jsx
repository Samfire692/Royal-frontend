import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient';
import Swal from 'sweetalert2';


export const ReportCard = () => {

    const [studentid, setStudentId] = useState(null);
    const [teacherdata, setTeacherdata] = useState(null);
    const [sessionTerm , setSessionterm] = useState(null);
    const [sessionYear, setSessionyear] = useState(null);
    const [studentInfo, setStudentinfo] = useState({});
    const [studentSubjectresults, setStudentsubjectResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [clubInfo, setClubinfo] = useState ({});
    const [teacherComments, setTeachercomments] = useState({});

    const fetchData = async()=> {
       try{
         const studentID = localStorage.getItem("StudentId");
         const SessionTerm = localStorage.getItem("Term");
         const SessionYear = localStorage.getItem("Session");

         setStudentId(studentID);
         setSessionterm(SessionTerm);
         setSessionyear(SessionYear);

         const {data:{user}} = await supabase.auth.getUser();
         const {data:teacherData, error:teacherError} = await supabase
         .from("teachersignup")
         .select("*")
         .eq("id", user?.id)
         .maybeSingle()
         

         if(teacherError) throw teacherError
         setTeacherdata(teacherData);
        //  console.log("currently" , user?.id)

         const {data, error} = await supabase
         .from("studentsignup")
         .select("*")
         .eq("id", studentID)
         .maybeSingle();

         if(error) throw error
        if(data?.class_id){
             const {data:classData , error:classError} = await supabase
         .from("royalclassrooms")
         .select("*")
         .eq("id", data.class_id)
         .maybeSingle();

         if(!classError && classData){
            data.royalclassrooms = classData
         }
        }
         setStudentinfo(data)

         const {data:subjectresultData, error:subjectresultError} = await supabase
         .from("student_results")
         .select("*, subjects!subject_id ( * )")
         .eq("student_id", studentID)
        //  .eq("term", SessionTerm)
         .eq("session", SessionYear)

         if(subjectresultError) throw subjectresultError;
         setStudentsubjectResults(subjectresultData || []);
         setLoading(false);
 
        //  if(subjectresultError)  throw subjectresultError;
        //  setStudentsubjectResults(subjectresultData);
        //  const TestScore = Number(subjectresultData?.test_score);
        //  const ExamScore = Number(subjectresultData?.exam_score);

        //  if(SessionTerm === "First Term"){
        //     const firstTermScores = TestScore + ExamScore;
        //     setFirsttermOverallScores(firstTermScores);
        //  }

        const {data:clubData, error:clubError} = await supabase
        .from("club_comments")
        .select("*")
        .eq("student_id", studentID)
        .eq("session", SessionYear)
        .eq("term", SessionTerm)
        .maybeSingle()


        if(clubError) throw clubError;
        setClubinfo(clubData);

        const {data:commentData , error:commentError} = await supabase
        .from("teacher_comments")
        .select("*")
        .eq("student_id", studentID)
        .eq("session", SessionYear)
        .eq("term", SessionTerm)
        .maybeSingle()

        if(commentError) throw commentError;
        setTeachercomments(commentData)

       }catch(error){
         Swal.fire({
            icon:"error",
            title:"Error",
            text:error.message
         })
       }
    }

    useEffect(()=> {
        fetchData();
    }, []);

    const Results = studentSubjectresults.filter(result => result.term === sessionTerm).map((results)=> {
                         const test = results?.test_score || 0;
                         const exam = results?.exam_score || 0;

                         const cummScore = Number(test) + Number(exam);
                         
                         let firstterm = "-"
                         let secondterm = "-"
                         let weightAverage = ""

                         if(sessionTerm === "First Term"){
                            weightAverage = cummScore;
                         }else if(sessionTerm === "Second Term"){
                            const firstTerm = studentSubjectresults.find(item => item.subject_id === results.subject_id && item.term === "First Term")

                            console.log("first score ", firstTerm) 

                            const firstTermScore = Number(firstTerm?.test_score || 0) + Number(firstTerm?.exam_score || 0);

                            const addition = firstTermScore + cummScore
                            weightAverage = addition / 2 || 0;

                            firstterm = firstTermScore || 0;
                         }else{
                            const firstTerm = studentSubjectresults.find(firstitem => firstitem.subject_id === results.subject_id && firstitem.term === "First Term")

                            const secondTerm = studentSubjectresults.find(seconditem => seconditem.subject_id === results.subject_id && seconditem.term === "Second Term")

                            const firstTermScore = Number(firstTerm?.test_score || 0) + Number(firstTerm?.exam_score || 0);
                            
                            const secondTermScore = Number(secondTerm?.test_score || 0) + Number(secondTerm?.exam_score || 0);
                            
                            console.log("second score", secondTerm);
                            const addition = firstTermScore + secondTermScore + cummScore
                            weightAverage = addition / 3 || 0;

                            firstterm = firstTermScore || 0;
                            secondterm = secondTermScore || 0;
                            console.log("second Term", secondTermScore)
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

                             return {
                              id: results.id,
                              subjectName: results.subjects?.subject_name || "Unknown",
                              test,
                              exam,
                              firstterm,
                              secondterm,
                              cummScore,
                              weightAverage: finalWeightAverage,
                              grade,
                              TeacherComment
                              };
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
            <div className='shadow-sm shadow-slate-400 rounded-2xl h-25 flex justify-center mt-3'>
                <p className='animate-pulse my-auto text-slate-500'>Creating Report Card . . .</p>
            </div>
        )
    }

  return (
    <div className='mx-auto overflow-x-scroll shadow-sm shadow-slate-500 rounded-xl p-3'>
        <div className='lg:w-full w-270 mx-auto'>
            <div className='flex justify-between px-3'>
           <div className='grid text-center h-fit my-auto'>
              <small className='uppercase font-bold italic'>Report Card</small>
              <small>For</small>
              <small>{studentInfo?.royalclassrooms?.class_name}</small>
              <button className='border-3 border-blue-500 py-1.5 px-0.5 rounded-lg mt-1'><span className='uppercase bg-blue-500 px-1.5 py-1.5 font-bold text-white rounded-md'>{sessionTerm}</span></button>
           </div>

           <div className='flex flex-wrap gap-3 w-sm'>
             <div>
                <small className='uppercase'>School : <span className='font-bold text-slate-700 border-b border-dashed'>RAMBS</span></small>
             </div>

              <div>
                <small className='uppercase'>Special Id : <span className=' font-bold text-slate-700 border-b border-dashed'>{studentInfo.special_id}</span></small>
             </div>

              <div>
                <small className='uppercase'>Led : <span className='font-bold text-slate-700 border-b border-dashed'>ALIMOSHO</span></small>
             </div>

              <div>
                <small className='uppercase'>Gender : <span className='font-bold text-slate-700 border-b border-dashed'>{studentInfo.gender || "Empty"}</span></small>
             </div>

              <div>
                <small className='uppercase'>Full Name : <span className='font-bold text-slate-700 border-b border-dashed'>{studentInfo.full_name}</span></small>
             </div>

              <div>
                <small className='uppercase'>Date Of Birth : <span className='font-bold text-slate-700 border-b border-dashed'>{studentInfo.date_of_birth || "empty"}</span></small>
             </div>

              <div>
                <small className='uppercase'>Year : <span className='font-bold text-slate-700 border-b border-dashed'>{sessionYear}</span></small>
             </div>
           </div>
        </div>

        <div className='mt-3'>
             <p className='text-center font-bold p-1'>ACADEMIC PERFORMANCE</p>
            <table className='border mx-auto'>
                <thead>
                    <tr>
                        <th>Subjects</th>
                        <th className='border'>Cont.Assessment</th>
                        <th className='border'>Exam Scores</th>
                        <th className='border'>1st term</th>
                        <th className='border'>2nd term</th>
                        <th className='border'>Cumm Score</th>
                        <th className='border'>Weight Average</th>
                        <th className='border'>Grade</th>
                        <th className='border'>Teacher's Comment</th>
                        <th className='border'>Sign</th>
                    </tr>
                </thead>

                <tbody>
                     {Results.map((res)=>(
                        <tr key={res.id}>
                             <td className='border ps-2'>{res.subjectName}</td> 
                             <td className='border text-center'>{res.test}</td>
                             <td className='border text-center'>{res.exam}</td>
                             <td className='border text-center'>{res.firstterm}</td>
                             <td className='border text-center'>{res.secondterm}</td>
                             <td className='border text-center'>{res.cummScore}</td>
                             <td className='border text-center'>{res.weightAverage}</td>
                             <td className='border text-center'>{res.grade}</td>
                             <td className='border text-center'>{res.TeacherComment}</td>
                             <td className='border text-center'>Null ...</td>
                        </tr>
                     ))}
                </tbody>

                <thead>
                    <tr>
                        <th className='border' colSpan={3}>Total</th>
                        <th className='border' colSpan={7}>Percentage</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td className='text-center font-bold text-2xl border' colSpan={3}>{totalCummulativeScore}</td>
                        <td className='text-center font-bold text-2xl border' colSpan={7}>{finalPercentage}</td>
                    </tr>
                </tbody>

                 <small className='p-1.5 uppercase font-bold flex justify-center w-full'>Sports Activities</small>

                <thead>
                    <tr>
                        <th className='border'>Organization</th>
                        <th className='border'>Office Held</th>
                        <th className='border' colSpan={8}>Significant Contributions</th>
                    </tr>
                </thead>

                <tbody>
                    <td className='border text-center'>{studentInfo?.club_name}</td>
                    <td className='border text-center'>Member</td>
                    <td className='border px-2' colSpan={8}>{clubInfo?.comment}</td>
                </tbody>
            </table>

            <div>
                <div className='w-full flex justify-between py-2'>
                    <div>
                       <small>Class Teacher's Comment :</small>
                       <span className='ps-1 border-b'>{teacherComments?.comment}</span>
                    </div>

                    <div>
                       <small>Signature & Date :</small>
                       <span className='ps-1 border-b'>
                        {teacherComments?.created_at ? new Date(teacherComments.created_at).toLocaleDateString('en-GB') : "-"} 
                        <span><img src={teacherdata?.signature_url} alt="" className='w-25'/></span>
                       </span>
                    </div>
                </div>

                 <div className='w-full flex justify-between'>
                    <div>
                       <small>Principal's Comment :</small>
                       <span className='ps-1 border-b'>{adminComment}</span>
                    </div>

                    <div>
                       <small>Signature & Date :</small>
                       <span className='ps-1 border-b'>{teacherComments?.created_at ? new Date(teacherComments.created_at).toLocaleDateString('en-GB') : "-"} Null . . .
                       </span>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </div>
  )
}
