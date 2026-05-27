import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import {
    FaGraduationCap,
    FaSave,
    FaSearch,
    FaChevronDown,
    FaChevronUp,
    FaArrowLeft,
    FaFileInvoice
} from 'react-icons/fa';
import Swal from 'sweetalert2';

export const StudentResult = ({ targetYear, onBack }) => {

    const [students, setStudents] = useState([]);
    const [scores, setScores] = useState([]);
    const [comments, setComments] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [classFilter, setClassFilter] = useState("");
    const [expandedStudent, setExpandedStudent] = useState(null);

    // ==========================
    // NIGERIAN WAEC/NECO ACADEMIC GRADE SYSTEM
    // ==========================
    const getGrade = (score) => {
        if (!score && score !== 0) return "-";
        const num = Number(score);
        if (num >= 75) return "A1";
        if (num >= 70) return "B2";
        if (num >= 65) return "B3";
        if (num >= 60) return "C4";
        if (num >= 55) return "C5";
        if (num >= 50) return "C6";
        if (num >= 45) return "D7";
        if (num >= 40) return "E8";
        return "F9";
    };

    const getRemark = (score) => {
        if (!score && score !== 0) return "-";
        const num = Number(score);
        if (num >= 75) return "Excellent";
        if (num >= 70) return "Very Good";
        if (num >= 65) return "Good";
        if (num >= 50) return "Credit";
        if (num >= 40) return "Pass";
        return "Fail";
    };

    // ==========================
    // FETCH DATA
    // ==========================
    const fetchData = async (activeSession) => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }

            const { data: teacherData, error: teacherError } = await supabase
                .from('teachersignup')
                .select('*')
                .eq('email', user.email)
                .single();

            if (teacherError) throw teacherError;
            const targetClass = teacherData?.assigned_class;
            setClassFilter(targetClass || "Unassigned");

            if (!targetClass) {
                setStudents([]);
                return;
            }

            // Fetch current class students
            const { data: studentData, error: studentError } = await supabase
                .from('studentsignup')
                .select('*')
                .eq('current_class', targetClass)
                .order('full_name', { ascending: true });

            if (studentError) throw studentError;

            // Fetch exam & CA results rows
            const { data: scoreData, error: scoreError } = await supabase
                .from('student_results')
                .select('*')
                .eq('class_id', targetClass)
                .eq('session', activeSession)
                .eq('term', 'First Term');

            if (scoreError) throw scoreError;

            // Fetch saved comments row sheets
            const { data: commentData, error: commentError } = await supabase
                .from('teacher_comments')
                .select('*')
                .eq('term', 'First Term')
                .eq('session', activeSession);

            if (commentError) throw commentError;

            const mappedComments = {};
            commentData?.forEach((item) => {
                mappedComments[item.student_id] = item.comment;
            });

            setStudents(studentData || []);
            setScores(scoreData || []);
            setComments(mappedComments);

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                title: "Data Loading Error",
                text: error.message
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const activeSession = targetYear || "2025/2026";
        fetchData(activeSession);
    }, [targetYear]);

    // ==========================
    // REPORT CARD STATS LOGIC
    // ==========================
    const compileRowStats = (studentId) => {
        const rowScores = scores.filter(item => item.student_id === studentId);
        if (rowScores.length === 0) {
            return { totalMarks: 0, average: 0, subjectCount: 0 };
        }
        const totalMarks = rowScores.reduce((acc, curr) => acc + Number(curr.total_score || 0), 0);
        const subjectCount = rowScores.length;
        const average = (totalMarks / subjectCount).toFixed(1);

        return { totalMarks, average, subjectCount };
    };

    // ==========================
    // SAVE COMMENTS
    // ==========================
    const handleQuickSaveRemark = async (studentId) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const activeSession = targetYear || "2025/2026";

            const { error } = await supabase
                .from('teacher_comments')
                .upsert({
                    student_id: studentId,
                    teacher_id: user?.id,
                    comment: comments[studentId] || "",
                    term: 'First Term',
                    session: activeSession
                }, { onConflict: 'student_id,term,session' });

            if (error) throw error;

            Swal.fire({
                icon: "success",
                title: "Report Sheet Updated",
                text: "Teacher remark attached successfully",
                timer: 1300,
                showConfirmButton: false
            });

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Database Constraint Error",
                text: error.message
            });
        }
    };

    const toggleExpand = (studentId) => {
        setExpandedStudent(expandedStudent === studentId ? null : studentId);
    };

    const filteredStudents = students.filter(student =>
        student.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className='p-8 text-center text-slate-500 font-mono tracking-wider text-sm animate-pulse'>
                COMPILING REGISTERED SCHOOL TERMINAL REPORT BULK LEDGER...
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 text-slate-800 antialiased">
            
            {/* GO BACK ACTION BAR */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack || (() => window.history.back())}
                    className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm transition-all"
                >
                    <FaArrowLeft />
                    Return to Selection Panel
                </button>
            </div>

            {/* CLASS REPORT BANNER SUMMARY */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <FaGraduationCap className="text-blue-600" size={22} />
                        Academic Report Ledger Matrix
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 font-mono uppercase tracking-wider">
                        Class Code: <span className="text-slate-800 font-bold">{classFilter}</span> | Session Period: <span className="text-blue-600 font-bold">{targetYear || "2025/2026"}</span>
                    </p>
                </div>

                <div className="relative w-full md:w-72">
                    <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input
                        type="text"
                        placeholder="Filter report card by student name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 shadow-inner transition-all font-medium"
                    />
                </div>
            </div>

            {/* EXPANDABLE REPORT SHEETS CONTAINER */}
            <div className="space-y-4">
                {filteredStudents.length === 0 ? (
                    <div className='bg-white p-12 rounded-2xl border border-slate-200 text-slate-400 italic text-xs font-mono text-center shadow-sm'>
                        No structural student entries matched your search query in this term segment.
                    </div>
                ) : (
                    filteredStudents.map((student) => {
                        const { totalMarks, average, subjectCount } = compileRowStats(student.id);
                        const studentSubjectList = scores.filter(s => s.student_id === student.id);
                        const isExpanded = expandedStudent === student.id;

                        return (
                            <div
                                key={student.id}
                                className={`bg-white border rounded-2xl shadow-sm overflow-hidden transition-all duration-200 ${
                                    isExpanded ? 'border-slate-400 ring-4 ring-slate-800/5' : 'border-slate-200 hover:border-slate-300'
                                }`}
                            >
                                {/* STUDENT BAR HEADER TOGGLE */}
                                <div
                                    onClick={() => toggleExpand(student.id)}
                                    className="p-4 flex justify-between items-center cursor-pointer select-none bg-white hover:bg-slate-50/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                            <FaFileInvoice size={14} />
                                        </div>
                                        <div>
                                            <h2 className="font-extrabold text-slate-900 text-sm tracking-tight">
                                                {student.full_name}
                                            </h2>
                                            <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider mt-0.5">
                                                ADMISSION ID: {student.admission_no || "NOT ASSIGNED"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <small className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Terminal Average</small>
                                            <span className="font-mono font-black text-xs text-blue-600 px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-md">
                                                {average}%
                                            </span>
                                        </div>
                                        <div className="text-slate-400">
                                            {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                                        </div>
                                    </div>
                                </div>

                                {/* AUTHENTIC TRADITIONAL REPORT CARD STYLE COMPONENT */}
                                {isExpanded && (
                                    <div className="border-t border-slate-200 bg-slate-50/40 p-4 space-y-4">
                                        
                                        {/* TRADITIONAL REPORT SHEET GRID TABLE */}
                                        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider font-mono">
                                                        <th className="py-3 px-4 border-b border-slate-200">Academic Subject Field</th>
                                                        <th className="py-3 px-4 border-b border-slate-200 text-center w-24">CA Score</th>
                                                        <th className="py-3 px-4 border-b border-slate-200 text-center w-24">Exam Score</th>
                                                        <th className="py-3 px-4 border-b border-slate-200 text-center w-28 bg-slate-800">Total Score</th>
                                                        <th className="py-3 px-4 border-b border-slate-200 text-center w-24">Grade</th>
                                                        <th className="py-3 px-4 border-b border-slate-200 w-36">Subject Remark</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-xs divide-y divide-slate-200 font-medium text-slate-700">
                                                    {studentSubjectList.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="6" className="py-8 px-4 text-center text-slate-400 italic bg-slate-50/50">
                                                                No localized score inputs found recorded for this student terminal portfolio sheet view.
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        studentSubjectList.map((sub, idx) => (
                                                            <tr key={idx} className="hover:bg-slate-50/70 font-mono transition-colors">
                                                                <td className="py-3 px-4 font-sans font-bold text-slate-900 tracking-tight">{sub.subject_name}</td>
                                                                <td className="py-3 px-4 text-center text-slate-600">{sub.ca_score ?? "-"}</td>
                                                                <td className="py-3 px-4 text-center text-slate-600">{sub.exam_score ?? "-"}</td>
                                                                <td className="py-3 px-4 text-center font-black bg-slate-50 text-slate-900 border-x border-slate-100">{sub.total_score ?? "-"}</td>
                                                                <td className="py-3 px-4 text-center font-black text-blue-600">{getGrade(sub.total_score)}</td>
                                                                <td className="py-3 px-4 font-sans font-semibold text-slate-500 text-[11px] italic">{getRemark(sub.total_score)}</td>
                                                            </tr>
                                                        ))
                                                    )}

                                                    {/* INTEGRATED SUMMARY STATISTICAL FOOTER ROWS */}
                                                    {studentSubjectList.length > 0 && (
                                                        <>
                                                            <tr className="bg-slate-50 font-bold text-slate-800 border-t-2 border-slate-300">
                                                                <td colSpan="3" className="py-2.5 px-4 text-right text-[10px] font-sans font-black uppercase tracking-wider text-slate-400">Total Subjects Computed:</td>
                                                                <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-900">{subjectCount}</td>
                                                                <td colSpan="2" className="bg-slate-50"></td>
                                                            </tr>
                                                            <tr className="bg-slate-50 font-bold text-slate-800">
                                                                <td colSpan="3" className="py-2.5 px-4 text-right text-[10px] font-sans font-black uppercase tracking-wider text-slate-400">Total Marks Accumulated:</td>
                                                                <td className="py-2.5 px-4 text-center font-mono font-black text-slate-900 bg-slate-100 border border-slate-200">{totalMarks}</td>
                                                                <td colSpan="2" className="bg-slate-50"></td>
                                                            </tr>
                                                            <tr className="bg-slate-100 text-slate-900 font-bold">
                                                                <td colSpan="3" className="py-3 px-4 text-right text-[10px] font-sans font-black uppercase tracking-wider text-slate-500">Cumulative Weighted Average:</td>
                                                                <td className="py-3 px-4 text-center font-mono font-black text-sm text-white bg-blue-600 border border-blue-700 shadow-sm rounded">{average}%</td>
                                                                <td colSpan="2" className="bg-slate-100"></td>
                                                            </tr>
                                                        </>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* CLASS TEACHER METRICS & EVALUATIVE REMARKS COMPONENT */}
                                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                                            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 font-sans">
                                                Class Teacher Terminal Evaluation Comments & Conduct Remark
                                            </label>
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Example: A highly responsible student with brilliant performance. Keep it up!"
                                                    value={comments[student.id] || ""}
                                                    onChange={(e) =>
                                                        setComments({
                                                            ...comments,
                                                            [student.id]: e.target.value
                                                        })
                                                    }
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/10 transition-all"
                                                />
                                                <button
                                                    onClick={() => handleQuickSaveRemark(student.id)}
                                                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 sm:py-0 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm shrink-0"
                                                >
                                                    <FaSave size={12} />
                                                    Endorse Card
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};