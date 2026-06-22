import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import Swal from 'sweetalert2';

export const PromotionClasses = () => {
    const [classArray, setClassarray] = useState([]);
    const [allClasses, setAllClasses] = useState([]); // To hold the list of all classes
    const [targetClassId, setTargetClassId] = useState(""); // The class they are moving to
    const [promotionSessionyear, setPromotionsessionYear] = useState(null);
    const [Classname, setClassName] = useState(null);
    const [check, setCheck] = useState(false);

    const fetchData = async () => {
        try {
            const promotionSessYear = localStorage.getItem("PromotionSessionYear");
            const classId = localStorage.getItem("ClassesId");
            const className = localStorage.getItem("ClassesName");

            setPromotionsessionYear(promotionSessYear);
            setClassName(className);

            // 1. Fetch the students in the current class
            const { data: classesData, error: classesError } = await supabase
                .from("studentsignup")
                .select("*")
                .eq("class_id", classId);

            if (classesError) throw classesError;
            setClassarray(classesData);

            // 2. Fetch ALL classes so we can populate the "Promote To" dropdown
            // IMPORTANT: Change "classes" to your actual classes table name if it's different!
            const { data: classList, error: classListError } = await supabase
                .from("royalclassrooms") 
                .select("*");
            
            if (classListError) throw classListError;
            setAllClasses(classList || []);

        } catch (error) {
            console.error(error);
        }
    };

    const toggleStudent = (id) => {
        setClassarray(prev => prev.map(students => students.id === id ? { ...students, isChecked: !students.isChecked } : students));
    };

    const selectedCount = classArray.filter(s => s.isChecked).length;

    const pickAll = () => {
        setCheck(true);
        setClassarray(prev => prev.map(student => ({
            ...student,
            isChecked: true
        })));
    };

    const cancelAll = () => {
        setCheck(false);
        setClassarray(prev => prev.map(student => ({
            ...student,
            isChecked: false
        })));
    };

    // Step 1: Just handle the selection (Auto vs Manual)
    const selectPromotionMethod = async () => {
        try {
            const studentsToPromote = classArray.filter(s => s.isChecked);
            const studentIds = studentsToPromote.map(s => s.id);

            if (studentIds.length === 0) {
                return Swal.fire("Error", "Please select at least one student.", "error");
            }

            const results = await Swal.fire({
                icon: "question",
                title: "Selection Method",
                text: "How do you want to select students for promotion?",
                showCancelButton: true,
                confirmButtonText: "Auto-Select (Based on Results)",
                cancelButtonText: "Manual Selection",
                reverseButtons: true
            });

            if (results.isConfirmed) {
                Swal.fire({ title: "Calculating...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });

                const { data, error } = await supabase
                    .from("student_results")
                    .select("*, subjects!subject_id(*), studentsignup!student_id(*)")
                    .in("student_id", studentIds)
                    .eq("session", promotionSessionyear);

                if (error) throw error;

                const passMarkPercentage = 50; // CHANGE THIS TO YOUR SCHOOL'S PASS MARK
                let passedStudentIds = [];

                studentIds.forEach(studentId => {
                    const thisStudentData = data.filter(item => item.student_id === studentId);
                    
                    if (thisStudentData.length > 0) {
                        const uniqueSubjects = [...new Set(thisStudentData.map(item => item.subject_id))];
                        const totalSubjects = uniqueSubjects.length;

                        let grandTotal = 0;
                        const maxScorePerSubject = 300; 
                        const totalObtainableScore = totalSubjects * maxScorePerSubject;

                        uniqueSubjects.forEach(subjectId => {
                            const first = thisStudentData.find(item => item.term === "First Term" && item.subject_id === subjectId);
                            const second = thisStudentData.find(item => item.term === "Second Term" && item.subject_id === subjectId);
                            const third = thisStudentData.find(item => item.term === "Third Term" && item.subject_id === subjectId);

                            const firstScore = Number(first?.test_score || 0) + Number(first?.exam_score || 0);
                            const secondScore = Number(second?.test_score || 0) + Number(second?.exam_score || 0);
                            const thirdScore = Number(third?.test_score || 0) + Number(third?.exam_score || 0);

                            grandTotal += (firstScore + secondScore + thirdScore);
                        });

                        let finalPercentage = 0;
                        if (totalObtainableScore > 0) {
                            finalPercentage = ((grandTotal / totalObtainableScore) * 100).toFixed(2);
                        }

                        if (Number(finalPercentage) >= passMarkPercentage) {
                            passedStudentIds.push(studentId);
                        }
                    }
                });

                setClassarray(prev => prev.map(student => ({
                    ...student,
                    isChecked: passedStudentIds.includes(student.id)
                })));

                Swal.fire("Complete", `Auto-selected ${passedStudentIds.length} students who scored ${passMarkPercentage}% or above.`, "success");

            } else if (results.dismiss === Swal.DismissReason.cancel) {
                Swal.fire("Ready", "Proceed with manually selected students. Pick the target class below.", "info");
            }
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    };

    // Step 2: Actually MOVE them in the database
    const executePromotion = async () => {
        if (!targetClassId) {
            return Swal.fire("Hold up!", "Please select the target class from the dropdown first.", "warning");
        }

        const studentsToPromote = classArray.filter(s => s.isChecked).map(s => s.id);
        
        if (studentsToPromote.length === 0) {
            return Swal.fire("Error", "No students selected for promotion.", "error");
        }

        try {
            Swal.fire({ title: "Moving Students...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });

            // Update the students' class_id in the database
            const { error } = await supabase
                .from("studentsignup")
                .update({ class_id: targetClassId })
                .in("id", studentsToPromote);

            if (error) throw error;

            Swal.fire("Success!", `${studentsToPromote.length} students have been successfully promoted!`, "success");
            
            // Refresh the current list so the promoted students disappear from this class view
            fetchData();
            setCheck(false);

        } catch (error) {
            Swal.fire("Database Error", error.message, "error");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <div className='flex gap-2 mb-4'>
                <h2 className='font-bold text-xl'>{promotionSessionyear}</h2>
                <h2 className='font-bold text-xl text-slate-400'>({Classname})</h2>
            </div>

            {/* NEW: Target Class Selection */}
            <div className='bg-white p-4 shadow-sm shadow-slate-300 rounded-xl mb-4'>
                <label className='font-bold text-slate-600 block mb-2'>Promote Selected Students To:</label>
                <select 
                    className='w-full p-2 border rounded-lg outline-none focus:border-blue-500'
                    value={targetClassId}
                    onChange={(e) => setTargetClassId(e.target.value)}
                >
                    <option value="">-- Select Destination Class --</option>
                    {allClasses.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.class_name}</option> // Change cls.class_name if needed
                    ))}
                </select>
            </div>

            <div className='mt-3'>
                <div className={`flex justify-end ${check ? "" : "hidden"}`}>
                    <button className='bg-red-500 w-20 p-1.5 rounded-xl text-white font-bold' onClick={cancelAll}>Cancel</button>
                </div>
                
                {classArray.map((cls) => (
                    <div className={`p-3 flex justify-between gap-2 shadow-sm mt-2 shadow-slate-400 rounded-xl cursor-pointer ${cls.isChecked ? 'bg-blue-500/10 ' : "bg-white"}`} key={cls.id} onClick={() => check && toggleStudent(cls.id)}>
                        <div>
                            <p className='font-bold text-blue-600'>{cls.full_name}</p>
                            <small className='text-slate-400'>{cls.special_id}</small>
                        </div>

                        {check && (
                            <div className='h-fit my-auto'>
                                {cls.isChecked ?
                                    <button className={` ${cls.isChecked ? "text-blue-500" : ""}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                            <path d="M0 0h24v24H0z" fill="none" />
                                            <mask id="SVGCa0448Wh">
                                                <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                                                    <path fill="#fff" fillOpacity="0" stroke="#fff" strokeDasharray="60" d="M3 12c0 -4.97 4.03 -9 9 -9c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9Z">
                                                        <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="60;0" />
                                                        <animate fill="freeze" attributeName="fill-opacity" begin="0.6s" dur="0.4s" to="1" />
                                                    </path>
                                                    <path fill="none" stroke="#000" strokeDasharray="14" strokeDashoffset="14" d="M8 12l3 3l5 -5">
                                                        <animate fill="freeze" attributeName="stroke-dashoffset" begin="1.1s" dur="0.2s" to="0" />
                                                    </path>
                                                </g>
                                            </mask>
                                            <path fill="currentColor" d="M0 0h24v24H0z" mask="url(#SVGCa0448Wh)" />
                                        </svg>
                                    </button>
                                    : ""
                                }
                            </div>
                        )}
                    </div>
                ))}

                <div className="flex flex-col gap-2 mt-4">
                    {selectedCount > 0 ? (
                        <>
                            <button className='bg-slate-500 w-full p-2 rounded-lg text-white font-bold' onClick={selectPromotionMethod}>
                                Filter Selection ({selectedCount} Selected)
                            </button>
                            {/* NEW: The button that actually moves them in the DB */}
                            <button className='bg-green-600 w-full p-3 rounded-lg text-white font-bold shadow-md' onClick={executePromotion}>
                                Finalize Promotion to Next Class
                            </button>
                        </>
                    ) : (
                        <button className='bg-blue-500 w-full p-2 rounded-lg text-white font-bold' onClick={pickAll}>
                            Pick Students
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};