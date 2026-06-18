import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient';
import Swal from 'sweetalert2';
import profilepic from '../../assets/Images/admin profile pic.jfif'
import { FaGraduationCap, FaFile, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';

export const SecondTermResult = ({ targetYear }) => {

    const [studentArray, setStudentarray] = useState([]);
    const [classArray, setClassarray] = useState([]);
    const [add, setAdd] = useState(""); 
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null); 
    const [scores, setScores] = useState({});
    const [selectedSubjectId, setSelectedSubjectId] = useState(null); 
    const [results, setResults] = useState([]);
    const [viewResults, setViewresults] = useState("");
    const [loading, setLoading] = useState(false); 

    // --- FETCHING DATA FUNCTIONS ---
    const fetchStudents = async (classId) => {
        if (!classId) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("studentsignup")
                .select("*")
                .eq("class_id", classId)
                .order("full_name", { ascending: true });

            if (error) throw error;
            setStudentarray(data);
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        const user = JSON.parse(localStorage.getItem('TeacherProfile'));
        const currentTeacherId = user?.id;
        if (!currentTeacherId) return;
        try {
            const { data, error } = await supabase
                .from("teacherchooseSubject")
                .select(`id, class_id, subject_id, royalclassrooms(class_name), subjects(subject_name)`)
                .eq('teacher_id', currentTeacherId);
            if (error) throw error;
            setClassarray(data);
        } catch (error) {
            console.error(error.message);
        }
    };

    const fetchResults = async() => {
        try {
            // Filter by "Second Term" to keep this view clean
            const { data, error } = await supabase
                .from("student_results")
                .select("*")
                .eq("term", "Second Term");
            if(error) throw error;
            setResults(data);
        } catch(error) {
            console.error(error.message);
        }
    };

    // --- CORE OPERATIONS ---

    const handleUpload = async (studentId) => {
        const user = JSON.parse(localStorage.getItem('TeacherProfile'));
        const teacherId = user?.id;
        const testScore = scores[`${studentId}_test`];
        const examScore = scores[`${studentId}_exam`];
        const total = Number(testScore) + Number(examScore);

        if (!targetYear) return Swal.fire("Error", "Active academic session not synchronized yet.", "error");
        if (!selectedSubjectId) return Swal.fire("Wait", "Select a subject first!", "warning");
        if (!testScore || !examScore) return Swal.fire("Wait", "Enter both scores", "warning");

        // CHECK IF SECOND TERM RESULT ALREADY EXISTS FOR THIS LIVE ADMIN SESSION
        const existing = results.find(r => 
            r.student_id === studentId && 
            r.subject_id === selectedSubjectId && 
            r.session === targetYear &&
            r.term === "Second Term"
        );
        
        if (existing) return Swal.fire("Denied", "2nd Term result already uploaded for this session!", "error");

        setLoading(true);
        try {
            const { error } = await supabase
                .from("student_results") 
                .insert([{
                    student_id: studentId,
                    teacher_id: teacherId,
                    class_id: selectedClass,
                    subject_id: selectedSubjectId, 
                    test_score: Number(testScore),
                    exam_score: Number(examScore),
                    term: "Second Term", 
                    session: targetYear, // Directly saving under synced Admin year config
                    total_score: total
                }]);

            if (error) throw error;
            Swal.fire("Success", `2nd Term result uploaded!`, "success");
            setAdd(""); 
            await fetchResults();
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (resultId) => {
        const confirm = await Swal.fire({
            title: 'Delete 2nd Term Result?',
            text: "This cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete'
        });

        if (confirm.isConfirmed) {
            setLoading(true);
            try {
                const { error } = await supabase.from("student_results").delete().eq("id", resultId);
                if (error) throw error;
                Swal.fire("Deleted", "Record removed", "success");
                await fetchResults();
            } catch (error) {
                Swal.fire("Error", error.message, "error");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEdit = async (result) => {
        const { value: formValues } = await Swal.fire({
            title: 'Edit 2nd Term Scores',
            html:
                `<input id="swal-input1" class="swal2-input" type="number" placeholder="Test" value="${result.test_score}">` +
                `<input id="swal-input2" class="swal2-input" type="number" placeholder="Exam" value="${result.exam_score}">`,
            focusConfirm: false,
            preConfirm: () => [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value
            ]
        });

        if (formValues) {
            const [newTest, newExam] = formValues;
            setLoading(true);
            try {
                const { error } = await supabase
                    .from("student_results")
                    .update({ 
                        test_score: Number(newTest), 
                        exam_score: Number(newExam), 
                        total_score: Number(newTest) + Number(newExam) 
                    })
                    .eq("id", result.id);

                if (error) throw error;
                Swal.fire("Updated", "Scores modified", "success");
                await fetchResults();
            } catch (error) {
                Swal.fire("Error", error.message, "error");
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => { fetchClasses(); fetchResults(); }, []);

    return (
        <div className="relative">
            {/* SPINNER */}
            {loading && (
                <div className='fixed inset-0 bg-white/60 z-9999 flex items-center justify-center backdrop-blur-[1px]'>
                    <div className='flex flex-col items-center gap-2'>
                        <FaSpinner className='animate-spin text-blue-600' size={45} />
                        <span className='font-bold text-blue-600 animate-pulse'>Updating 2nd Term...</span>
                    </div>
                </div>
            )}

            <div>
                <h2 className='text-xl font-bold text-blue-800'>Second Term</h2>
            </div><hr className='w-23 border-blue-200' />

            {/* CLASS SELECTION */}
            <div className='mt-2 px-2'>
                <h2 className='uppercase font-bold mb-2 text-sm text-slate-500'>Select Class & Subject</h2>
                <div className='flex gap-3 overflow-x-auto pb-2'>
                    {classArray.map((items) => (
                        <div key={items.id} className='grid'>
                            <small className='font-bold uppercase text-slate-400 italic mx-auto text-[10px]'>{items.royalclassrooms?.class_name}</small>
                            <button onClick={() => {
                                setSelectedClass(items.class_id);
                                setSelectedSubject(items.subjects?.subject_name); 
                                setSelectedSubjectId(items.subject_id); 
                                fetchStudents(items.class_id);
                            }} className={`border px-3 h-9 mt-1 rounded-xl transition-all whitespace-nowrap ${selectedClass === items.class_id && selectedSubjectId === items.subject_id ? 'bg-blue-700 text-white border-blue-700' : 'border-slate-300 text-slate-400'
                                }`}>{items.subjects?.subject_name} </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* STUDENT LIST */}
            <div className='mt-5 flex gap-2 flex-col pb-6 lg:pe-3'>
                {studentArray.map((item) => (
                    <div key={item.id} className='shadow-sm shadow-slate-500/60 p-2 rounded-xl bg-white'>
                        <div className='flex justify-between gap-3'>
                            <div className='flex gap-4 w-md justify-between'>
                                <img src={item.profile_pic_url || profilepic} className='w-12 h-12 rounded-full' alt="" />
                                <span className='my-auto text-blue-500 font-semibold'>{item.full_name}</span>
                                <small className='text-slate-400 my-auto'>{item.special_id}</small>
                            </div>
                            <div>
                                <button className='text-slate-400 hover:text-blue-500' onClick={() => setAdd(add === item.id ? "" : item.id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none" /><g fill="none" stroke="currentColor" strokeDasharray="16" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M5 12h14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="16;0" /></path><path stroke-dashoffset="16" d="M12 5v14"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.5s" to="0" /></path></g></svg>
                                </button>
                            </div>
                        </div>

                       {add === item.id && (
                            <form className='mt-2 border-t pt-3'>
                                <div className='flex flex-col gap-4'>
                                    <div className='flex flex-wrap gap-4 items-center'>
                                        <div className='bg-blue-50 p-2 rounded-lg'>
                                            <p className='text-[10px] font-bold text-blue-400 uppercase'>Subject</p>
                                            <p className='font-bold text-slate-700 text-sm'>{selectedSubject || "Pick a Subject"}</p>
                                        </div>

                                        <div className='flex gap-4'>
                                            <div>
                                                <label className='text-[10px] font-bold block text-slate-500'>TEST (40):</label>
                                                <input
                                                    type="number"
                                                    className='border h-8 text-center rounded w-12 outline-none'
                                                    onChange={(e) => setScores({ ...scores, [`${item.id}_test`]: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className='text-[10px] font-bold block text-slate-500'>EXAM (60):</label>
                                                <input
                                                    type="number"
                                                    className='border h-8 text-center rounded w-12 outline-none'
                                                    onChange={(e) => setScores({ ...scores, [`${item.id}_exam`]: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className='bg-slate-50 p-2 rounded-lg border border-slate-100'>
                                            <p className='text-[9px] font-bold text-slate-400 uppercase'>Session</p>
                                            <p className='font-bold text-slate-500 text-[11px]'>{targetYear || "Syncing..."}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex justify-end mt-3'>
                                    <button
                                        type="button"
                                        onClick={() => handleUpload(item.id)}
                                        className='bg-blue-600 px-6 h-10 text-white rounded-xl font-bold active:scale-95 transition-all'
                                    >
                                        Upload 2nd Term
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className='md:me-4 py-2 px-1 shadow-sm mt-2 rounded-xl bg-slate-200/50'>
                            <div className='flex gap-2 text-slate-400 justify-around'>
                                <button className='mb-1 flex font-bold py-1 gap-1 text-xs'><FaGraduationCap size={18} className='my-auto' /> Profile</button>
                                <button className='mb-1 flex font-bold py-1 gap-1 text-xs'  onClick={()=> setViewresults(viewResults === item.id ? " " : item.id)}
                                    ><FaFile size={16} className='my-auto'/> 2nd Term History</button>
                            </div>
                        </div>

                         {viewResults === item.id && (
                            <div className='p-2'>
                                <h2 className='text-slate-400 font-bold my-2 text-xs uppercase'>Second Term History</h2>
                            <div className='flex flex-col gap-2'>
                              {results.filter(result=> result.student_id === item.id && result.subject_id === selectedSubjectId).map((res)=> (
                               <div key={res.id} className='flex gap-2.5 justify-around border-b border-b-slate-300 p-2 items-center'>
                                 <small className='my-auto font-bold text-slate-400'>{res.session}</small>
                                 
                                 <div className='flex-col flex'>
                                     <label className='text-[10px] font-bold text-center text-slate-400'>TEST</label>
                                     <p className={`text-center font-bold text-xl ${res.test_score < 20 ? 'text-red-500' : 'text-blue-600'}`}>{res.test_score}</p>
                                 </div>

                                  <div className='flex-col flex'>
                                     <label className='text-[10px] font-bold text-center text-slate-400'>EXAM</label>
                                     <p className={`text-center font-bold text-xl ${res.exam_score < 30 ? 'text-red-500' : 'text-blue-700'}`}>{res.exam_score}</p>
                                 </div>

                                 <div className='flex gap-3'>
                                    <button onClick={() => handleEdit(res)} className='text-blue-400 hover:text-blue-600'><FaEdit/></button>
                                    <button onClick={() => handleDelete(res.id)} className='text-red-400 hover:text-red-600'><FaTrash/></button>
                                 </div>
                               </div>
                            ))}
                          </div>
                        </div> 
                    )}
                    </div>
                ))}
            </div>
        </div>
    )
}