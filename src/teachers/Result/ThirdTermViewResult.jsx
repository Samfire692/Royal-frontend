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
    FaMedal,
    FaGraduationCap
} from 'react-icons/fa';
import Swal from 'sweetalert2';
import SignaturePad from 'react-signature-canvas';

export const ThirdTermViewResult = ({ targetYear }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLocked, setIsLocked] = useState(false); 
    const [expandedStudent, setExpandedStudent] = useState(null);
    const [userId, setUserId] = useState(null);
    
    // ✅ Stores results for ALL terms in the session to compute cumulative scores
    const [allResults, setAllResults] = useState([]);
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
                
                if (globalLiveTerm === "First Term" || globalLiveTerm === "Second Term") {
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

                // 🔥 CHANGED: Removed the .eq('term', 'Third Term') filter so we get 1st, 2nd, and 3rd term data
                const { data: scores } = await supabase
                    .from('student_results')
                    .select('*')
                    .eq('class_id', teacher.assigned_class)
                    .eq('session', targetYear);

                const { data: existingComments } = await supabase
                    .from('teacher_comments')
                    .select('student_id, comment')
                    .eq('term', 'Third Term')
                    .eq('session', targetYear);

                const commentMap = {};
                if (existingComments) {
                    existingComments.forEach(c => {
                        commentMap[c.student_id] = c.comment;
                    });
                }

                setStudents(studentData || []);
                setAllResults(scores || []);
                setComments(commentMap);
            }
        } catch (err) {
            console.error("Data loading error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchData(); 
    }, [targetYear]);

    // ✅ TRUE ANNUAL CUMULATIVE CALCULATION ENGINE
    const getStudentStats = (studentId) => {
        // Filter all records for this specific student across all terms
        const studentScores = allResults.filter(r => r.student_id === studentId);
        if (studentScores.length === 0) {
            return { cumulativePercentage: 0, cumulativePercentageStr: "0%", thirdTermTotal: 0, thirdTermScores: [], subjectSummaries: [] };
        }

        // Group scores by subject to find overall annual totals
        const subjectsMap = {};
        studentScores.forEach(record => {
            const subName = record.subject_name;
            if (!subjectsMap[subName]) {
                subjectsMap[subName] = { firstTerm: null, secondTerm: null, thirdTerm: null, ca: null, exam: null };
            }
            if (record.term === 'First Term') subjectsMap[subName].firstTerm = record.total_score || 0;
            if (record.term === 'Second Term') subjectsMap[subName].secondTerm = record.total_score || 0;
            if (record.term === 'Third Term') {
                subjectsMap[subName].thirdTerm = record.total_score || 0;
                subjectsMap[subName].ca = record.ca_score;
                subjectsMap[subName].exam = record.exam_score;
            }
        });

        let grandTotalObtained = 0;
        let totalPossibleWeight = 0;
        const subjectSummaries = [];
        const thirdTermScores = studentScores.filter(r => r.term === 'Third Term');
        const thirdTermTotal = thirdTermScores.reduce((acc, curr) => acc + (curr.total_score || 0), 0);

        // Calculate the cross-term averages per subject
        Object.keys(subjectsMap).forEach(subName => {
            const data = subjectsMap[subName];
            const termsTracked = [data.firstTerm, data.secondTerm, data.thirdTerm].filter(v => v !== null);
            
            if (termsTracked.length > 0) {
                const subjectSum = termsTracked.reduce((a, b) => a + b, 0);
                const subjectAnnualAvg = parseFloat((subjectSum / termsTracked.length).toFixed(1));
                
                grandTotalObtained += subjectAnnualAvg;
                totalPossibleWeight += 100;

                // We display this on the sheet breakdown
                subjectSummaries.push({
                    name: subName,
                    ca: data.ca,
                    exam: data.exam,
                    thirdTermTotal: data.thirdTerm,
                    annualAvg: subjectAnnualAvg
                });
            }
        });

        const cumulativePercentage = totalPossibleWeight > 0 
            ? parseFloat(((grandTotalObtained / totalPossibleWeight) * 100).toFixed(1)) 
            : 0;

        return {
            cumulativePercentage,
            cumulativePercentageStr: `${cumulativePercentage}%`,
            thirdTermTotal,
            rawScores: thirdTermScores, // Keeping compatibility for your third term table layout
            subjectSummaries // Contains calculated cross-term values
        };
    };

    const getRankStylesAndBadge = (actualRank) => {
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

    const handleSaveComment = async (e, studentId) => {
        if (e) e.stopPropagation(); 
        const commentText = comments[studentId];
        if (!commentText) return Swal.fire("Empty", "Write something first", "warning");
        
        const { error } = await supabase
            .from('teacher_comments')
            .upsert({ 
                student_id: studentId, 
                teacher_id: userId, 
                comment: commentText,
                term: 'Third Term',
                session: targetYear
            }, { onConflict: 'student_id, term, session' });
            
        if (error) Swal.fire("Error", error.message, "error");
        else Swal.fire("Saved", "Third term comment updated", "success");
    };

    const clearSignature = () => sigPad.current.clear();

    const saveSignatureToDatabase = async () => {
        if (sigPad.current.isEmpty()) {
            return Swal.fire("Empty Signature", "Please sign on the canvas before saving.", "warning");
        }
        try {
            const signatureImage = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
            const { error: updateError } = await supabase
                .from('teachersignup')
                .update({ signature_url: signatureImage })
                .eq('id', userId);

            if (updateError) throw updateError;
            setTeacherSignature(signatureImage);
            Swal.fire("Saved", "Signature applied uniformly.", "success");
        } catch (error) {
            Swal.fire("Upload Error", "Could not synchronize canvas signature.", "error");
        }
    };

    const toggleDropdown = (id) => setExpandedStudent(expandedStudent === id ? null : id);

    if (loading) return <p className="p-4 animate-pulse text-slate-500 font-medium">Synchronizing scores layout...</p>;

    if (isLocked) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-400">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <FaLock size={24} />
                </div>
                <h3 className="font-bold text-lg text-slate-700 mb-1">Third Term Records Sealed</h3>
                <p className="text-sm max-w-md">
                    You cannot inspect or modify Third Term summary details while the academic portal configuration is actively running inside the First or Second Term cycles.
                </p>
            </div>
        );
    }

    // Map and rank students based on their TRUE Annual Cumulative Percentage
    const studentsWithStats = students
        .map(student => ({
            ...student,
            stats: getStudentStats(student.id)
        }))
        .sort((a, b) => b.stats.cumulativePercentage - a.stats.cumulativePercentage);

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
                        <SignaturePad 
                            ref={sigPad} 
                            canvasProps={{
                                className: "signatureCanvas w-full h-28",
                                style: { background: 'white' }
                            }}
                        />
                    </div>
                    <div className="flex md:flex-col gap-2 w-full md:w-auto">
                        <button onClick={clearSignature} className="flex-1 flex items-center justify-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl font-bold transition-all text-xs">
                            <FaEraser /> Clear
                        </button>
                        <button onClick={saveSignatureToDatabase} className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold transition-all text-xs shadow-sm">
                            <FaUpload /> Save Signature
                        </button>
                    </div>
                </div>
                {teacherSignature && (
                    <div className="mt-3 p-2.5 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 w-fit">
                        <span className="text-xs font-bold text-green-700">Live Applied Stamp:</span>
                        <img src={teacherSignature} alt="saved stamp" className="h-8 border border-slate-200 bg-white p-0.5 rounded shadow-sm" />
                    </div>
                )}
            </div>

            {/* STUDENT RECORDS DISCOVERY LIST */}
            {studentsWithStats.length === 0 ? (
                <div className="text-center p-8 bg-white border rounded-2xl text-slate-400 font-medium">
                    No student records discovered in your allocated classroom framework.
                </div>
            ) : (
                studentsWithStats.map((student, index) => {
                    const stats = student.stats;
                    
                    let actualRank = 1;
                    for (let i = 0; i < index; i++) {
                        if (studentsWithStats[i].stats.cumulativePercentage > stats.cumulativePercentage) {
                            actualRank++;
                        }
                    }

                    const gameSettings = getRankStylesAndBadge(actualRank);

                    return (
                        <div 
                            key={student.id} 
                            className={`border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${gameSettings.cardBg}`}
                        >
                            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => toggleDropdown(student.id)}>
                                <div className="flex items-center gap-4">
                                    {student.student_img ? (
                                        <img src={student.student_img} alt="profile" className="w-12 h-12 rounded-full object-cover border-2 border-blue-100" />
                                    ) : (
                                        <FaUserCircle className="text-4xl text-slate-300" />
                                    )}
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-bold text-slate-800">{student.full_name}</h3>
                                            {stats.cumulativePercentage > 0 && gameSettings.badge}
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            {student.admission_no} | Annual Session Avg: <span className="text-blue-600 font-bold">{stats.cumulativePercentageStr}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {stats.cumulativePercentage > 0 && gameSettings.rankStr && (
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-100/80 px-2 py-0.5 rounded border">
                                            Year Rank: {gameSettings.rankStr}
                                        </span>
                                    )}
                                    {expandedStudent === student.id ? <FaChevronUp className="text-slate-500" /> : <FaChevronDown className="text-slate-500" />}
                                </div>
                            </div>

                            {expandedStudent === student.id && (
                                <div className="p-6 border-t border-slate-200/60 bg-white/60 space-y-5 backdrop-blur-sm">
                                    {/* High-Level Score Cards */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-sm">
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">3rd Term Score Total</p>
                                            <p className="text-xl font-black text-slate-700">{stats.thirdTermTotal}</p> 
                                        </div>
                                        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-sm">
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Overall Annual Average</p>
                                            <p className="text-xl font-black text-blue-600">{stats.cumulativePercentageStr}</p>
                                        </div>
                                    </div>

                                    {/* DETAILED SUBJECT SCORES BREAKDOWN SHEET WITH ANNUAL CUMULATIVE AVERAGE */}
                                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                        <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-2">
                                            <FaGraduationCap className="text-slate-500" />
                                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Subject Performance & Session Average Sheet</h4>
                                        </div>
                                        {stats.subjectSummaries.length === 0 ? (
                                            <p className="text-xs text-slate-400 p-4 text-center italic">No processing scores logged for this terminal cycle.</p>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse text-xs">
                                                    <thead>
                                                        <tr className="bg-slate-50/50 text-slate-400 border-b border-slate-200 uppercase font-bold tracking-wider">
                                                            <th className="p-3">Subject Name</th>
                                                            <th className="p-3 text-center">3rd Term CA</th>
                                                            <th className="p-3 text-center">3rd Term Exam</th>
                                                            <th className="p-3 text-center">3rd Term Total</th>
                                                            <th className="p-3 text-center bg-blue-50/50 text-blue-700">Annual Avg (1st+2nd+3rd)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                                                        {stats.subjectSummaries.map((subject, sIdx) => (
                                                            <tr key={sIdx} className="hover:bg-slate-50/40 transition-colors">
                                                                <td className="p-3 font-bold text-slate-700">{subject.name}</td>
                                                                <td className="p-3 text-center text-slate-500">{subject.ca ?? "-"}</td>
                                                                <td className="p-3 text-center text-slate-500">{subject.exam ?? "-"}</td>
                                                                <td className="p-3 text-center text-slate-600">{subject.thirdTermTotal ?? "-"}</td>
                                                                <td className="p-3 text-center bg-blue-50/20">
                                                                    <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md border border-blue-200">
                                                                        {subject.annualAvg}%
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>

                                    {/* Remarks/Comments Field */}
                                    <div className="space-y-2">
                                        <div className="text-xs font-bold text-slate-600 flex items-center justify-between">
                                            <span className="flex items-center gap-1.5"><FaEdit /> 3rd Term Performance Remark</span>
                                            <button 
                                                onClick={(e) => handleSaveComment(e, student.id)}
                                                className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 font-bold transition-colors"
                                            >
                                                <FaSave /> UPDATE REMARK
                                            </button>
                                        </div>
                                        <textarea 
                                            value={comments[student.id] || ""}
                                            onChange={(e) => setComments({...comments, [student.id]: e.target.value})}
                                            placeholder="Enter terminal behavioral observations or third term performance remark..."
                                            className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 h-20 bg-white"
                                        ></textarea>
                                    </div>

                                    {/* Navigation Anchor to Full Report Sheet View */}
                                    <div className="flex justify-end pt-3 border-t border-slate-200/60">
                                        <button className="w-full md:w-auto bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-700 shadow-md transition-colors text-xs flex items-center gap-2 justify-center">
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