import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import Swal from 'sweetalert2';
import profilepic from '../../assets/Images/admin profile pic.jfif';

export const FirstTermViewResult = ({ targetYear }) => {
    const [loginUser, setLoginUser] = useState(null);
    const [students, setStudents] = useState([]);
    const [activeStudent, setActivestudent] = useState(null);
    const [studentResult, setStudentresult] = useState([]);
    const [teacherComment, setTeachercomment] = useState([]);
    const [teachComments, setTeachcomments] = useState({}); 
    const [commentLoading, setCommentloading] = useState(null);

    const fetchData = async () => {
        if (!targetYear) return;
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: teacherData, error: teacherError } = await supabase
                .from("teachersignup")
                .select("*")
                .eq("id", user.id)
                .single();

            if (teacherError) throw teacherError;
            setLoginUser(teacherData);

            const { data: studentData, error: studentError } = await supabase
                .from("studentsignup")
                .select("*")
                .eq("class_id", teacherData.assigned_class);

            if (studentError) throw studentError;

            if (!studentData || studentData.length === 0) {
                setStudents([]);
                return;
            }

            const studentIDs = studentData.map(student => student.id);

            const { data: studentResultData, error: studentResultError } = await supabase
                .from("student_results")
                .select("*")
                .in("student_id", studentIDs)
                .eq("session", targetYear);

            if (studentResultError) throw studentResultError;
            setStudentresult(studentResultData);

            const { data: commentdata, error: commenterror } = await supabase
                .from("teacher_comments")
                .select("*")
                .eq("term", "First Term")
                .eq("session", targetYear);

            if (commenterror) throw commenterror;
            setTeachercomment(commentdata);

            const initialCommentMap = {};
            commentdata.forEach(c => {
                initialCommentMap[c.student_id] = c.comment;
            });
            setTeachcomments(initialCommentMap);

            // 1. Calculate cumulative averages
            const computedStudents = studentData.map(student => {
                const results = studentResultData.filter(result => result.student_id === student.id);

                const sumTestExam = results.reduce((sum, result) => {
                    const test = Number(result.test_score) || 0;
                    const exam = Number(result.exam_score) || 0;
                    return sum + test + exam;
                }, 0);

                const subjectCount = results.length;
                const cumulativeAverage = subjectCount > 0 ? (sumTestExam / subjectCount).toFixed(2) : "0.00";

                return {
                    ...student,
                    // Store as a float number so JavaScript sorts it accurately mathematically
                    sortableAverage: parseFloat(cumulativeAverage), 
                    cumulativeAverage: cumulativeAverage
                };
            });

            // ✅ 2. SORT FROM HIGHEST PERCENTAGE TO LOWEST PERCENTAGE (Descending)
            computedStudents.sort((a, b) => b.sortableAverage - a.sortableAverage);

            setStudents(computedStudents);

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Data Sync Failure",
                text: error.message
            });
        }
    };

    const commentSubmit = async (studentId, existingComment) => {
        setCommentloading(studentId);
        const currentText = teachComments[studentId] || ""; 

        try {
            const { error } = await supabase
                .from("teacher_comments")
                .upsert({
                    ...(existingComment?.id && { id: existingComment.id }),
                    student_id: studentId,
                    teacher_id: loginUser?.id, 
                    term: "First Term",
                    session: targetYear,
                    comment: currentText
                });

            if (error) throw error;

            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Uploaded Successfully",
                timer: 1500,
                showConfirmButton: false
            });

            fetchData();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message
            });
        } finally {
            setCommentloading(null);
        }
    };

    const handleTextareaChange = (studentId, text) => {
        setTeachcomments(prev => ({
            ...prev,
            [studentId]: text
        }));
    };

    useEffect(() => {
        fetchData();
    }, [targetYear]);

    return (
        <div>
            <div>
                <h2 className='text-blue-500 font-bold text-lg'>First Term View Result</h2>
            </div>
            <br />

            <div className='flex flex-col gap-3'>
                {students.map((student) => {
                    const existingComment = teacherComment.find(c => c.student_id === student.id);

                    return (
                        <div className='shadow-sm shadow-slate-500/40 p-3 rounded-xl bg-white border border-slate-100' key={student.id}>
                            <div className='flex gap-2 justify-between items-center'>
                                <div className='flex gap-3 items-center'>
                                    <img src={student.profile_pic_url || profilepic} alt="" className='w-10 h-10 shadow-sm rounded-full object-cover' />
                                    <div className='grid'>
                                        {/* Using both properties just in case your column name varies */}
                                        <span className='text-blue-500 font-bold'>{student.full_name || student.student_name}</span>
                                        <small className='text-slate-400'><span className='font-bold'>Cum Avg :</span> {student.cumulativeAverage || "0.00"}%</small>
                                    </div>
                                </div>

                                <button 
                                    className={`transition-all duration-300 transform ${activeStudent === student.id ? "rotate-180" : ""}`} 
                                    onClick={() => setActivestudent(activeStudent === student.id ? null : student.id)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> 
                                        <path d="M0 0h24v24H0z" fill="none" /> 
                                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15l-5 -5M12 15l5 -5"/>
                                    </svg>
                                </button>
                            </div>

                            {activeStudent === student.id && (
                                <form className='mt-3 border-t border-dashed border-slate-100 pt-3'>
                                    <textarea 
                                        value={teachComments[student.id] || ""} 
                                        className='border w-full rounded-lg p-2 h-24 outline-none focus:border-blue-500 bg-slate-50/50 resize-none text-sm' 
                                        placeholder={`Enter performance remark for ${student.full_name || student.student_name}`} 
                                        onChange={(e) => handleTextareaChange(student.id, e.target.value)}
                                    />

                                    <div className='flex justify-end mt-2'>
                                        <button 
                                            className='bg-blue-600 w-32 p-2 rounded-xl text-white font-bold text-sm shadow-sm hover:bg-blue-700 active:scale-95 transition-transform flex items-center justify-center h-10' 
                                            onClick={() => commentSubmit(student.id, existingComment)} 
                                            type='button'
                                            disabled={commentLoading === student.id}
                                        >
                                            {commentLoading === student.id ? (
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : "Upload"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};