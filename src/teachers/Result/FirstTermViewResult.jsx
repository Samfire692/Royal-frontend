import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { FaChevronDown, FaChevronUp, FaUserCircle, FaEdit, FaSave, FaEraser, FaUpload, FaSignature, FaFileAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
// ✅ Import the signature pad library
import SignaturePad from 'react-signature-canvas';

// ✅ Accept targetYear dynamically from the parent component
export const FirstTermViewResult = ({ targetYear }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedStudent, setExpandedStudent] = useState(null);
    const [userId, setUserId] = useState(null);
    
    // ✅ Comments & Results state tracking
    const [allResults, setAllResults] = useState([]);
    const [comments, setComments] = useState({});

    // ✅ GLOBAL SIGNATURE STATE (Pulled out of the student loop mapping)
    const sigPad = useRef({}); 
    const [teacherSignature, setTeacherSignature] = useState(null); 

    const fetchData = async () => {
        if (!targetYear) return; // Wait until parent delivers the year string
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            setUserId(user?.id);

            // Fetch Teacher profile configurations & Global signature
            const { data: teacher } = await supabase
                .from('teachersignup')
                .select('assigned_class, signature_url') 
                .eq('id', user?.id)
                .single();

            if (teacher?.signature_url) {
                setTeacherSignature(teacher.signature_url);
            }

            if (teacher?.assigned_class) {
                // Fetch students registered under this specific classroom
                const { data: studentData } = await supabase
                    .from('studentsignup')
                    .select('*')
                    .eq('current_class', teacher.assigned_class);

                // Fetch scores matching the selected dynamic academic year
                const { data: scores } = await supabase
                    .from('student_results')
                    .select('*')
                    .eq('class_id', teacher.assigned_class)
                    .eq('session', targetYear) // Dynamic session filtering
                    .eq('term', 'First Term');

                // Fetch preexisting teacher comments for this term & session combo
                const { data: existingComments } = await supabase
                    .from('teacher_comments')
                    .select('student_id, comment')
                    .eq('term', 'First Term')
                    .eq('session', targetYear);

                // Map existing database comments into standard react object dictionary
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

    // Re-trigger dynamic tracking whenever parent context switches active year
    useEffect(() => { 
        fetchData(); 
    }, [targetYear]);

    // ✅ Metric aggregation mechanics
    const getStudentStats = (studentId) => {
        const studentScores = allResults.filter(r => r.student_id === studentId);
        if (studentScores.length === 0) return { percentage: "0%", total: 0 };
        const totalObtained = studentScores.reduce((acc, curr) => acc + (curr.total_score || 0), 0);
        const maxPossible = studentScores.length * 100;
        const percentage = ((totalObtained / maxPossible) * 100).toFixed(1);
        return { percentage: `${percentage}%`, total: totalObtained };
    };

    // ✅ Transaction persistence mapping
    const handleSaveComment = async (studentId) => {
        const commentText = comments[studentId];
        if (!commentText) return Swal.fire("Empty", "Write something first", "warning");
        
        const { error } = await supabase
            .from('teacher_comments')
            .upsert({ 
                student_id: studentId, 
                teacher_id: userId, 
                comment: commentText,
                term: 'First Term',
                session: targetYear // Dynamic context tracking
            }, { onConflict: 'student_id, term, session' });
            
        if (error) Swal.fire("Error", error.message, "error");
        else Swal.fire("Saved", "Comment updated successfully", "success");
    };

    // ✅ Canvas control hooks
    const clearSignature = () => {
        sigPad.current.clear();
    };

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
            Swal.fire({
                icon: 'success',
                title: 'Signature Saved',
                text: 'Applied uniformly to all report sheets.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire("Upload Error", "Could not synchronize canvas signature.", "error");
        }
    };

    const toggleDropdown = (id) => setExpandedStudent(expandedStudent === id ? null : id);

    if (loading) return <p className="p-4 animate-pulse text-slate-500 font-medium">Synchronizing scores layout...</p>;

    return (
        <div className="flex flex-col gap-4">
            
            {/* ✅ GLOBAL TEACHER SIGNATURE INTERACTIVE HUB (Placed cleanly at the top) */}
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
            {students.length === 0 ? (
                <div className="text-center p-8 bg-white border rounded-2xl text-slate-400 font-medium">
                    No student records discovered in your allocated classroom framework.
                </div>
            ) : (
                students.map((student) => {
                    const stats = getStudentStats(student.id);
                    return (
                        <div key={student.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all hover:border-slate-300">
                            <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/80" onClick={() => toggleDropdown(student.id)}>
                                <div className="flex items-center gap-4">
                                    {student.student_img ? (
                                        <img src={student.student_img} alt="profile" className="w-12 h-12 rounded-full object-cover border-2 border-blue-100" />
                                    ) : (
                                        <FaUserCircle className="text-4xl text-slate-300" />
                                    )}
                                    <div>
                                        <h3 className="font-bold text-slate-800">{student.full_name}</h3>
                                        <p className="text-xs text-slate-500">{student.admission_no} | <span className="text-blue-600 font-bold">{stats.percentage}</span></p>
                                    </div>
                                </div>
                                {expandedStudent === student.id ? <FaChevronUp className="text-slate-400" /> : <FaChevronDown className="text-slate-400" />}
                            </div>

                            {expandedStudent === student.id && (
                                <div className="p-6 border-t border-slate-100 bg-slate-50/40 space-y-5 animate-fade-in">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-sm">
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Aggregated Score</p>
                                            <p className="text-xl font-black text-slate-700">{stats.total}</p> 
                                        </div>
                                        <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-sm">
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Percentage</p>
                                            <p className="text-xl font-black text-blue-600">{stats.percentage}</p>
                                        </div>
                                    </div>

                                    {/* Remarks/Comments Field */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-600 flex items-center justify-between">
                                            <span className="flex items-center gap-1.5"><FaEdit /> Term Performance Remark</span>
                                            <button 
                                                onClick={() => handleSaveComment(student.id)}
                                                className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 font-bold transition-colors"
                                            >
                                                <FaSave /> UPDATE REMARK
                                            </button>
                                        </label>
                                        <textarea 
                                            value={comments[student.id] || ""}
                                            onChange={(e) => setComments({...comments, [student.id]: e.target.value})}
                                            placeholder="Enter terminal behavioral observations or performance remark..."
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