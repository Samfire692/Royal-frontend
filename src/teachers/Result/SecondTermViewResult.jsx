import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { 
    FaChevronDown, 
    FaChevronUp, 
    FaUserCircle, 
    FaEdit, 
    FaSave, 
    FaEraser, 
    FaUpload, 
    FaSignature, 
    FaLock, 
    FaFileAlt, 
    FaTrophy, 
    FaMedal 
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import SignaturePad from 'react-signature-canvas';

export const SecondTermViewResult = ({ targetYear }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLocked, setIsLocked] = useState(false); 
    const [expandedStudent, setExpandedStudent] = useState(null);
    const [userId, setUserId] = useState(null);
    
    // Track both terms for cumulative calculation
    const [firstTermResults, setFirstTermResults] = useState([]);
    const [secondTermResults, setSecondTermResults] = useState([]);
    const [comments, setComments] = useState({});

    const sigPad = useRef({}); 
    const [teacherSignature, setTeacherSignature] = useState(null); 

    const fetchData = async () => {
        if (!targetYear) return;
        setLoading(true);
        try {
            const { data: activeSessionData } = await supabase
                .from("royal_session")
                .select("session_term")
                .eq("session_year", targetYear)
                .order("created_at", { ascending: false })
                .limit(1);

            if (activeSessionData && activeSessionData.length > 0) {
                const globalLiveTerm = activeSessionData[0].session_term;
                if (globalLiveTerm === "First Term") {
                    setIsLocked(true);
                    setLoading(false);
                    return;
                } else {
                    setIsLocked(false);
                }
            }

            const { data: { user } } = await supabase.auth.getUser();
            setUserId(user?.id);

            const { data: teacher } = await supabase
                .from('teachersignup')
                .select('assigned_class, signature_url') 
                .eq('id', user?.id)
                .single();

            if (teacher?.signature_url) {
                setTeacherSignature(teacher.signature_url);
            }

            if (teacher?.assigned_class) {
                const { data: studentData } = await supabase
                    .from('studentsignup')
                    .select('*')
                    .eq('current_class', teacher.assigned_class);

                // Fetch First Term scores for cumulative weight math
                const { data: firstScores } = await supabase
                    .from('student_results')
                    .select('*')
                    .eq('class_id', teacher.assigned_class)
                    .eq('session', targetYear)
                    .eq('term', 'First Term');

                // Fetch Second Term scores
                const { data: secondScores } = await supabase
                    .from('student_results')
                    .select('*')
                    .eq('class_id', teacher.assigned_class)
                    .eq('session', targetYear)
                    .eq('term', 'Second Term');

                const { data: existingComments } = await supabase
                    .from('teacher_comments')
                    .select('student_id, comment')
                    .eq('term', 'Second Term')
                    .eq('session', targetYear);

                const commentMap = {};
                if (existingComments) {
                    existingComments.forEach(c => {
                        commentMap[c.student_id] = c.comment;
                    });
                }

                setStudents(studentData || []);
                setFirstTermResults(firstScores || []);
                setSecondTermResults(secondScores || []);
                setComments(commentMap);
            }
        } catch (err) {
            console.error("Data loading error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [targetYear]);

    // ✅ SETTLED CUMULATIVE CALCULATION: (Term 1 + Term 2) / 2 per active subject
    const getStudentStats = (studentId) => {
        const s1Scores = firstTermResults.filter(r => r.student_id === studentId);
        const s2Scores = secondTermResults.filter(r => r.student_id === studentId);
        
        if (s2Scores.length === 0) {
            return { percentage: 0, percentageStr: "0%", total: 0, totalSubjects: 0 };
        }

        let totalCumulativeAverages = 0;
        const totalSubjects = s2Scores.length;

        s2Scores.forEach(term2Record => {
            const subName = term2Record.subject_name;
            const t2Total = term2Record.total_score || 0;
            
            // Find corresponding term 1 score for this subject
            const term1Record = s1Scores.find(r => r.subject_name === subName);
            const t1Total = term1Record ? (term1Record.total_score || 0) : t2Total; // Fallback to current term score if term 1 missing

            // Math: (Term 1 + Term 2) / 2
            const subjectCumulativeAverage = (t1Total + t2Total) / 2;
            totalCumulativeAverages += subjectCumulativeAverage;
        });

        // Overall Weighted Percentage Average
        const overallPercentage = totalSubjects > 0 ? parseFloat((totalCumulativeAverages / totalSubjects).toFixed(1)) : 0;

        return { 
            percentage: overallPercentage, 
            percentageStr: `${overallPercentage}%`, 
            total: Math.round(totalCumulativeAverages), // Aggregated cumulative balance
            totalSubjects: totalSubjects
        };
    };

    const getRankStylesAndBadge = (studentId) => {
        if (students.length === 0 || secondTermResults.length === 0) return { cardBg: "bg-white border-slate-200", badge: null, rankStr: "" };

        const sortedScores = students
            .map(s => ({ id: s.id, pct: getStudentStats(s.id).percentage }))
            .filter(s => s.pct > 0) 
            .sort((a, b) => b.pct - a.pct);

        const position = sortedScores.findIndex(s => s.id === studentId);
        if (position === -1) return { cardBg: "bg-white border-slate-200", badge: null, rankStr: "" };

        let actualRank = 1;
        for (let i = 0; i < position; i++) {
            if (sortedScores[i].pct > sortedScores[position].pct) {
                actualRank++;
            }
        }

        if (actualRank === 1) {
            return {
                cardBg: "bg-gradient-to-r from-amber-50 to-yellow-100/60 border-amber-300 shadow-md",
                badge: <span className="flex items-center gap-1 bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full border border-amber-600 tracking-wider shadow-sm"><FaTrophy /> 1ST PLACE</span>,
                rankStr: "1st"
            };
        }
        if (actualRank === 2) {
            return {
                cardBg: "bg-gradient-to-r from-slate-50 to-slate-200/60 border-slate-300 shadow-sm",
                badge: <span className="flex items-center gap-1 bg-slate-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full border border-slate-600 tracking-wider shadow-sm"><FaMedal /> 2ND PLACE</span>,
                rankStr: "2nd"
            };
        }
        if (actualRank === 3) {
            return {
                cardBg: "bg-gradient-to-r from-amber-50/40 to-orange-100/50 border-orange-200 shadow-sm",
                badge: <span className="flex items-center gap-1 bg-orange-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full border border-orange-700 tracking-wider shadow-sm"><FaMedal /> 3RD PLACE</span>,
                rankStr: "3rd"
            };
        }

        return { cardBg: "bg-white border-slate-200", badge: null, rankStr: `${actualRank}th` };
    };

    const handleSaveComment = async (studentId) => {
        const commentText = comments[studentId];
        if (!commentText) return Swal.fire("Empty", "Write something first", "warning");
        
        const { error } = await supabase
            .from('teacher_comments')
            .upsert({ 
                student_id: studentId, 
                teacher_id: userId, 
                comment: commentText,
                term: 'Second Term',
                session: targetYear
            }, { onConflict: 'student_id, term, session' });
            
        if (error) Swal.fire("Error", error.message, "error");
        else Swal.fire("Saved", "Second term comment updated", "success");
    };

    const clearSignature = () => sigPad.current.clear();

    const saveSignatureToDatabase = async () => {
        if (sigPad.current.isEmpty()) return Swal.fire("Empty Signature", "Please sign on the canvas before saving.", "warning");
        try {
            const signatureImage = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
            const { error: updateError } = await supabase.from('teachersignup').update({ signature_url: signatureImage }).eq('id', userId);
            if (updateError) throw updateError;
            setTeacherSignature(signatureImage);
            Swal.fire("Saved", "Signature applied uniformly.", "success");
        } catch (error) {
            Swal.fire("Upload Error", "Could not synchronize canvas signature.", "error");
        }
    };

    if (loading) return <p className="p-4 animate-pulse text-slate-500 font-medium">Synchronizing scores layout...</p>;

    if (isLocked) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-400">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4 shadow-sm"><FaLock size={24} /></div>
                <h3 className="font-bold text-lg text-slate-700 mb-1">Second Term Records Sealed</h3>
                <p className="text-sm max-w-md">You cannot inspect or modify Second Term summary details while the academic portal configuration is actively running inside the First Term cycle.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* GLOBAL SIGNATURE INTERACTIVE HUB */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                    <FaSignature className="text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Global Report Card Signature Pad</h3>
                </div>
                <div className="grid md:grid-cols-[1fr,auto] items-end gap-4">
                    <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl overflow-hidden flex justify-center items-center shadow-inner">
                        <SignaturePad ref={sigPad} canvasProps={{ className: "signatureCanvas w-full h-28", style: { background: 'white' } }} />
                    </div>
                    <div className="flex md:flex-col gap-2 w-full md:w-auto">
                        <button onClick={clearSignature} className="flex-1 flex items-center justify-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs"><FaEraser /> Clear</button>
                        <button onClick={saveSignatureToDatabase} className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-sm"><FaUpload /> Save Signature</button>
                    </div>
                </div>
                {teacherSignature && (
                    <div className="mt-3 p-2.5 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 w-fit">
                        <span className="text-xs font-bold text-green-700">Live Applied Stamp:</span>
                        <img src={teacherSignature} alt="saved stamp" className="h-8 border border-slate-200 bg-white p-0.5 rounded shadow-sm" />
                    </div>
                )}
            </div>

            {/* STUDENT LOOPS */}
            {students.length === 0 ? (
                <div className="text-center p-8 bg-white border rounded-2xl text-slate-400 font-medium">No student records discovered in your allocated classroom framework.</div>
            ) : (
                [...students]
                    .map(student => ({ ...student, stats: getStudentStats(student.id) }))
                    .sort((a, b) => b.stats.percentage - a.stats.percentage)
                    .map((student) => {
                        const stats = student.stats;
                        const gameSettings = getRankStylesAndBadge(student.id);

                        return (
                            <div key={student.id} className={`border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${gameSettings.cardBg}`}>
                                <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}>
                                    <div className="flex items-center gap-4">
                                        {student.student_img ? (
                                            <img src={student.student_img} alt="profile" className="w-12 h-12 rounded-full object-cover border-2 border-blue-100" />
                                        ) : (
                                            <FaUserCircle className="text-4xl text-slate-300" />
                                        )}
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-bold text-slate-800">{student.full_name}</h3>
                                                {gameSettings.badge}
                                            </div>
                                            <p className="text-xs text-slate-500">
                                                {student.admission_no} | Cum Avg: <span className="text-blue-600 font-bold">{stats.percentageStr}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {gameSettings.rankStr && <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-100/80 px-2 py-0.5 rounded border">{gameSettings.rankStr}</span>}
                                        {expandedStudent === student.id ? <FaChevronUp className="text-slate-500" /> : <FaChevronDown className="text-slate-500" />}
                                    </div>
                                </div>

                                {expandedStudent === student.id && (
                                    <div className="p-6 border-t border-slate-200/60 bg-white space-y-5">
                                        {/* Pure Calculations Dashboard */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-sm">
                                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Aggregated Score</p>
                                                <p className="text-xl font-black text-slate-700">{stats.total}</p> 
                                            </div>
                                            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-sm">
                                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">No. of Active Subjects</p>
                                                <p className="text-xl font-black text-slate-700">{stats.totalSubjects}</p> 
                                            </div>
                                            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-sm">
                                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Percentage</p>
                                                <p className="text-xl font-black text-blue-600">{stats.percentageStr}</p>
                                            </div>
                                        </div>

                                        {/* Remarks Layout */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-600 flex items-center justify-between">
                                                <span className="flex items-center gap-1.5"><FaEdit /> 2nd Term Performance Remark</span>
                                                <button onClick={() => handleSaveComment(student.id)} className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 font-bold transition-colors"><FaSave /> UPDATE REMARK</button>
                                            </label>
                                            <textarea 
                                                value={comments[student.id] || ""}
                                                onChange={(e) => setComments({...comments, [student.id]: e.target.value})}
                                                placeholder="Enter terminal behavioral observations or second term performance remark..."
                                                className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 h-20 bg-white"
                                            ></textarea>
                                        </div>

                                        <div className="flex justify-end pt-3 border-t border-slate-200/60">
                                            <button className="w-full md:w-auto bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-700 shadow-md text-xs flex items-center gap-2 justify-center">
                                                <FaFileAlt /> View Full Report Card
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
            )}
        </div>
    );
};