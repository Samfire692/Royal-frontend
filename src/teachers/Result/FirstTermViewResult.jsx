import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { FaChevronDown, FaChevronUp, FaUserCircle, FaEdit, FaFileAlt, FaSave, FaEraser, FaUpload } from 'react-icons/fa';
import Swal from 'sweetalert2';
// ✅ Import d signature pad library
import SignaturePad from 'react-signature-canvas';

export const FirstTermViewResult = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedStudent, setExpandedStudent] = useState(null);
    const [userId, setUserId] = useState(null);
    
    // ✅ Session & Comments State
    const [currentSession, setCurrentSession] = useState("2025/2026");
    const [allResults, setAllResults] = useState([]);
    const [comments, setComments] = useState({});

    // ✅ SIGNATURE STATE
    const sigPad = useRef({}); // A reference to d drawing canvas
    const [teacherSignature, setTeacherSignature] = useState(null); // Current saved signature URL

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            setUserId(user?.id);

            const { data: teacher } = await supabase
                .from('teachersignup')
                .select('assigned_class, signature_url') // ✅ Fetch stored sig
                .eq('id', user?.id)
                .single();

            // Set d teacher's existing signature if it exists
            if (teacher?.signature_url) {
                setTeacherSignature(teacher.signature_url);
            }

            if (teacher?.assigned_class) {
                const { data: studentData } = await supabase
                    .from('studentsignup')
                    .select('*')
                    .eq('current_class', teacher.assigned_class);

                const { data: scores } = await supabase
                    .from('student_results')
                    .select('*')
                    .eq('class_id', teacher.assigned_class)
                    .eq('session', currentSession)
                    .eq('term', 'First Term');

                setStudents(studentData || []);
                setAllResults(scores || []);
            }
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [currentSession]);

    // ✅ Calculation Logic
    const getStudentStats = (studentId) => {
        const studentScores = allResults.filter(r => r.student_id === studentId);
        if (studentScores.length === 0) return { percentage: "0%", total: 0 };
        const totalObtained = studentScores.reduce((acc, curr) => acc + (curr.total_score || 0), 0);
        const maxPossible = studentScores.length * 100;
        const percentage = ((totalObtained / maxPossible) * 100).toFixed(1);
        return { percentage: `${percentage}%`, total: totalObtained };
    };

    // ✅ Save Comment Logic
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
                session: currentSession
            }, { onConflict: 'student_id, term, session' });
        if (error) Swal.fire("Error", error.message, "error");
        else Swal.fire("Saved", "Comment updated", "success");
    };

    // ✅ --- SIGNATURE LOGIC --- ✅

    const clearSignature = () => {
        sigPad.current.clear(); // Clears d drawing canvas
    };

    const saveSignatureToDatabase = async () => {
        if (sigPad.current.isEmpty()) {
            return Swal.fire("Empty Signature", "Please sign on d canvas before saving.", "warning");
        }

        setLoading(true);

        try {
            // 1. Convert signature on canvas to a base64 image string
            const signatureImage = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
            
            // 2. We could upload this string to Supabase Storage, 
            // but for simplicity, we will save it directly in d column (it works for smaller images).
            const { error: updateError } = await supabase
                .from('teachersignup')
                .update({ signature_url: signatureImage })
                .eq('id', userId);

            if (updateError) throw updateError;

            // 3. Update UI state with new signature
            setTeacherSignature(signatureImage);
            
            Swal.fire({
                icon: 'success',
                title: 'Signature Saved',
                text: 'This signature will now be applied to all results.',
                timer: 2000,
                showConfirmButton: false
            });

        } catch (error) {
            console.error('Signature Error:', error.message);
            Swal.fire("Upload Error", "Could not save signature. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const toggleDropdown = (id) => setExpandedStudent(expandedStudent === id ? null : id);

    if (loading) return <p className="p-4 animate-pulse text-slate-500">Processing data...</p>;

    return (
        <div className="flex flex-col gap-4">
            {/* Session Selector */}
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border mb-2">
                <h2 className="font-bold text-slate-700">Class Results</h2>
                <select 
                    className="border rounded-lg px-3 py-1 text-sm font-bold text-blue-600 outline-none"
                    value={currentSession}
                    onChange={(e) => setCurrentSession(e.target.value)}
                >
                    <option value="2024/2025">2024/2025 Session</option>
                    <option value="2025/2026">2025/2026 Session</option>
                </select>
            </div>

            {students.map((student) => {
                const stats = getStudentStats(student.id);
                return (
                    <div key={student.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                        <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50" onClick={() => toggleDropdown(student.id)}>
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
                            {expandedStudent === student.id ? <FaChevronUp /> : <FaChevronDown />}
                        </div>

                        {expandedStudent === student.id && (
                            <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Aggregated Score</p>
                                        <p className="text-xl font-black text-slate-700">{stats.total}</p> 
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Total Percentage</p>
                                        <p className="text-xl font-black text-blue-600">{stats.percentage}</p>
                                    </div>
                                </div>

                                {/* Comments Section */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-600 flex items-center justify-between">
                                        <span className="flex items-center gap-2"><FaEdit /> Class Teacher's Comment</span>
                                        <button 
                                            onClick={() => handleSaveComment(student.id)}
                                            className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 font-bold"
                                        >
                                            <FaSave /> SUBMIT
                                        </button>
                                    </label>
                                    <textarea 
                                        value={comments[student.id] || ""}
                                        onChange={(e) => setComments({...comments, [student.id]: e.target.value})}
                                        placeholder="Enter student performance remark..."
                                        className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 h-20"
                                    ></textarea>
                                </div>

                                {/* ✅ INTERACTIVE SIGNATURE PAD */}
                                <div className="pt-4 border-t border-slate-200">
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-3">Teacher's Signature (Required for all results)</p>
                                    
                                    <div className="grid md:grid-cols-[1fr,auto] items-end gap-4">
                                        <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl overflow-hidden shadow-inner flex justify-center items-center">
                                            {/* ✅ Actual Drawing Canvas */}
                                            <SignaturePad 
                                                ref={sigPad} 
                                                canvasProps={{
                                                    className: "signatureCanvas w-full h-40",
                                                    style: { border: 'none', background: 'white' }
                                                }}
                                            />
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-3">
                                            <button 
                                                onClick={clearSignature}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-bold transition-all text-sm"
                                            >
                                                <FaEraser /> Clear
                                            </button>
                                            <button 
                                                onClick={saveSignatureToDatabase}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all text-sm shadow-md"
                                            >
                                                <FaUpload /> Save
                                            </button>
                                        </div>
                                    </div>

                                    {teacherSignature && (
                                        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
                                            <p className="text-xs font-bold text-blue-700">Saved Signature:</p>
                                            <img src={teacherSignature} alt="saved signature" className="h-10 border border-slate-200 bg-white" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-center md:justify-end pt-4 border-t border-slate-200">
                                    <button className="w-full md:w-auto bg-slate-800 text-white px-10 py-3.5 rounded-xl font-bold hover:bg-slate-700 shadow-lg active:scale-95 transition-transform flex items-center gap-2 justify-center">
                                        View Full Report Sheet
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};