import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { FaChevronDown, FaChevronUp, FaUserCircle, FaEdit, FaFileAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

export const FirstTermViewResult = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedStudent, setExpandedStudent] = useState(null);

    const fetchClassStudents = async () => {
        setLoading(true);
        try {
            // 1. Get the current logged-in Teacher
            const { data: { user } } = await supabase.auth.getUser();
            
            // 2. Get the Teacher's assigned class ID
            const { data: teacherData } = await supabase
                .from('teachersignup')
                .select('assigned_class') 
                .eq('email', user?.email)
                .single();

            if (teacherData?.assigned_class) {
                // 3. Fetch students directly from studentsignup where current_class matches the ID
                const { data: studentData, error } = await supabase
                    .from('studentsignup') 
                    .select('*')
                    .eq('current_class', teacherData.assigned_class); // Matching UUID to UUID

                if (error) throw error;
                
                console.log("Teacher Class ID:", teacherData.assigned_class);
                console.log("Students found:", studentData);

                setStudents(studentData || []);
            }
        } catch (err) {
            console.error("Link Error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClassStudents();
    }, []);

    const toggleDropdown = (id) => {
        setExpandedStudent(expandedStudent === id ? null : id);
    };

    if (loading) return <p className="p-4 animate-pulse text-slate-500">Loading class list...</p>;

    return (
        <div className="flex flex-col gap-4">
            {students.length === 0 ? (
                <p className="text-center py-10 text-slate-400 border border-dashed rounded-2xl">No students found in your class.</p>
            ) : (
                students.map((student) => (
                    <div key={student.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                        
                        {/* --- STUDENT HEADER --- */}
                        <div 
                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all"
                            onClick={() => toggleDropdown(student.id)}
                        >
                            <div className="flex items-center gap-4">
                                {student.student_img ? (
                                    <img src={student.student_img} alt="profile" className="w-12 h-12 rounded-full object-cover border" />
                                ) : (
                                    <FaUserCircle className="text-4xl text-slate-300" />
                                )}
                                <div>
                                    <h3 className="font-bold text-slate-800">{student.full_name}</h3>
                                    {/* Substituted student.current_class with admission_no to keep info clean */}
                                    <p className="text-xs text-slate-500 font-semibold">{student.admission_no} | <span className="text-blue-600">ID: {student.id.slice(0, 8)}</span></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {expandedStudent === student.id ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                        </div>

                        {/* --- DROPDOWN CONTENT --- */}
                        {expandedStudent === student.id && (
                            <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-6">
                                
                                {/* 1. Result Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Total Score</p>
                                        <p className="text-xl font-black text-slate-700">Empty</p> 
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Average</p>
                                        <p className="text-xl font-black text-blue-600">Empty</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Position</p>
                                        <p className="text-xl font-black text-orange-500">Empty</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Grade</p>
                                        <p className="text-xl font-black text-green-600">Empty</p>
                                    </div>
                                </div>

                                {/* 2. Comments Section */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                                            <FaEdit /> Class Teacher's Comment
                                        </label>
                                        <textarea 
                                            placeholder="Insert comment here..."
                                            className="p-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 h-20"
                                        ></textarea>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-slate-600 flex items-center gap-2">
                                            <FaFileAlt /> Principal's Remark
                                        </label>
                                        <textarea 
                                            disabled
                                            placeholder="Principal's comment appears here..."
                                            className="p-3 rounded-xl border border-slate-200 text-sm bg-slate-100 italic"
                                        ></textarea>
                                    </div>
                                </div>

                                {/* 3. Signature & Full Result Button */}
                                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-200">
                                    <div className="text-center md:text-left">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Teacher's Signature</p>
                                        <div className="w-40 h-12 border-b-2 border-slate-300 italic text-slate-400 text-sm flex items-end pb-1 px-2">
                                            Sign here...
                                        </div>
                                    </div>
                                    
                                    <button className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-700 transition-all shadow-lg shadow-slate-200">
                                        Display Full Result
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};