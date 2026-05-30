import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient';
import Swal from 'sweetalert2';

export const TeachSubject = () => {

    const [filtersearch, setFiltersearch] = useState("");
    const [classArray, setClassarray] = useState([]);
    const [selectedClasses, setSelectedclasses] = useState({});
    const [searchMenu, setSearchmenu] = useState(false);
    const [subjectsArray, setSubjectarray] = useState([]);
    const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    
    // ✅ CLASS TEACHER STATES
    const [isClassTeacherMenu, setIsClassTeacherMenu] = useState(false);
    const [requestClass, setRequestClass] = useState("");
    const [requestStatus, setRequestStatus] = useState("none");
    const [finalAssignedClass, setFinalAssignedClass] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [classNamesMap, setClassNamesMap] = useState({}); // ✅ Mapping IDs to Names

    // ✅ ROYAL CLUB STATES
    const [clubsList, setClubslist] = useState([]);
    const [managedClub, setManagedclub] = useState("");
    const [takenClubs, setTakenClubs] = useState([]); // ✅ Holds clubs already claimed by other teachers
    const [isClubSubmitting, setIsClubSubmitting] = useState(false);

    const fetchClasses = async () => {
        try {
            const { data, error } = await supabase.from("royalclassrooms").select('*');
            if (error) throw error;
            setClassarray(data);

            // ✅ Store names in a map for easy lookup
            const mapping = {};
            data.forEach(c => mapping[c.id] = c.class_name);
            setClassNamesMap(mapping);
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error", text: error.message });
        }
    };

    const handleData = async () => {
        try {
            const { data, error } = await supabase
                .from("royalclassrooms")
                .select(`
              id,
              class_name,
              class_subjects(id, subjects(id, subject_name))
            `);
            if (error) throw error;
            setSubjectarray(data);
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error", text: error.message });
        }
    };

    const getUser = async () => {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
            setUserId(data.user.id);
            fetchTeacherStatus(data.user.id);
        }
    };

    const fetchTeacherStatus = async (id) => {
        try {
            // 1. Fetch current teacher's status
            const { data, error } = await supabase
                .from("teachersignup")
                .select("class_teacher_status, pending_class_request, assigned_class, club_name")
                .eq("id", id)
                .single();

            if (data) {
                setRequestStatus(data.class_teacher_status || "none");
                setRequestClass(data.pending_class_request || "");
                setFinalAssignedClass(data.assigned_class);
                setManagedclub(data.club_name || "");
            }

            // 2. ✅ Fetch all club names that have already been taken by OTHER teachers
            const { data: allTeachers, error: teachersError } = await supabase
                .from("teachersignup")
                .select("club_name")
                .neq("id", id) // Exclude current user
                .not("club_name", "is", null);

            if (teachersError) throw teachersError;
            
            const occupied = allTeachers.map(t => t.club_name).filter(Boolean);
            setTakenClubs(occupied);

        } catch (error) {
            console.error("Error fetching status/occupied clubs:", error.message);
        }
    };

    const fetchClubs = async () => {
        try {
            const { data, error } = await supabase.from("royal_club").select("*");
            if (error) throw error;
            setClubslist(data);
        } catch (error) {
            console.error("Error fetching clubs:", error.message);
        }
    };

    const fetchExistingChoices = async (classId) => {
        try {
            if (!userId) return;
            const { data, error } = await supabase
                .from("teacherchooseSubject")
                .select("subject_id")
                .eq("class_id", classId)
                .eq("teacher_id", userId);

            if (error) throw error;
            const existingIds = data.map(item => item.subject_id);
            setSelectedSubjectIds(existingIds);
        } catch (error) {
            console.error("Error fetching choices:", error.message);
        }
    };

    const handleSelect = async (item) => {
        setFiltersearch(item.class_name);
        setSelectedclasses(item);
        setSearchmenu(false);
        fetchExistingChoices(item.id);
    };

    const clearFilter = () => {
        setFiltersearch("");
        setSelectedclasses({});
        setSelectedSubjectIds([]);
    };

    const toggleSubject = (subjectId) => {
        setSelectedSubjectIds(prev =>
            prev.includes(subjectId)
                ? prev.filter(id => id !== subjectId)
                : [...prev, subjectId]
        );
    };

    const saveToDatabase = async () => {
        if (!selectedClasses.id || !userId) return;
        try {
            const { data: existing, error: checkError } = await supabase
                .from("teacherchooseSubject")
                .select("subject_id, teacher_id")
                .eq("class_id", selectedClasses.id);

            if (checkError) throw checkError;

            const otherTeachersSubjects = existing
                .filter(item => item.teacher_id !== userId)
                .map(item => item.subject_id);

            const conflict = selectedSubjectIds.find(id => otherTeachersSubjects.includes(id));

            if (conflict) {
                Swal.fire({
                    icon: "warning",
                    title: "Subject Already Taken",
                    text: "One of the selected subjects has already been assigned to another teacher in this class"
                });
                return;
            }

            await supabase
                .from("teacherchooseSubject")
                .delete()
                .eq("class_id", selectedClasses.id)
                .eq("teacher_id", userId);

            const inserts = selectedSubjectIds.map(subId => ({
                class_id: selectedClasses.id,
                subject_id: subId,
                teacher_id: userId
            }));

            const { error } = await supabase.from("teacherchooseSubject").insert(inserts);
            if (error) throw error;
            Swal.fire("Saved!", "Your choices are now permanent", "success");
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    };

    const handleClassTeacherRequest = async () => {
        if (!requestClass) return Swal.fire("Wait", "Select a class first", "warning");

        setIsSubmitting(true); 
        try {
            const { error } = await supabase
                .from("teachersignup")
                .update({
                    pending_class_request: requestClass, 
                    class_teacher_status: "pending"
                })
                .eq("id", userId);

            if (error) throw error;
            setRequestStatus("pending");
            setIsClassTeacherMenu(false);
            Swal.fire("Request Sent", `Admin will review your request for ${classNamesMap[requestClass]}`, "success");
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClubUpdate = async () => {
        setIsClubSubmitting(true);
        try {
            const { error } = await supabase
                .from("teachersignup")
                .update({
                    club_name: managedClub || null // saves name directly, sets null if "Not assigning"
                })
                .eq("id", userId);

            if (error) throw error;
            
            // ✅ Refresh the local listings to recalculate occupied slots accurately
            if (userId) fetchTeacherStatus(userId);

            Swal.fire("Success", "Club coordinator assignment updated successfully", "success");
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        } finally {
            setIsClubSubmitting(false);
        }
    };

    const loadAllInitialData = async () => {
        await Promise.all([
            fetchClasses(),
            handleData(),
            getUser(),
            fetchClubs()
        ]);
        setLoading(false);
    };

    useEffect(() => {
        loadAllInitialData();
    }, []);

    if (loading) {
        return (
            <div className='h-[80vh] flex justify-center place-items-center flex-col'>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><rect width="24" height="24" fill="none" /><g><circle cx="12" cy="2.5" r="1.5" fill="currentColor" opacity="0.14" /><circle cx="16.75" cy="3.77" r="1.5" fill="currentColor" opacity="0.29" /><circle cx="20.23" cy="7.25" r="1.5" fill="currentColor" opacity="0.43" /><circle cx="21.5" cy="12" r="1.5" fill="currentColor" opacity="0.57" /><circle cx="20.23" cy="16.75" r="1.5" fill="currentColor" opacity="0.71" /><circle cx="16.75" cy="20.23" r="1.5" fill="currentColor" opacity="0.86" /><circle cx="12" cy="21.5" r="1.5" fill="currentColor" /><animateTransform attributeName="transform" calcMode="discrete" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12" /></g></svg>
                <p className='mt-2'>Fetching data . . .</p>
            </div>
        )
    }

    return (
        <div className='pb-10'>
            <h2 className='mt-2 font-bold text-xl text-blue-600'>Choose Classes & Subjects</h2>
            <div className='py-2'>
                <div>
                    <div className='flex justify-end relative'>
                        <input
                            type="text"
                            className='border w-full h-10 p-2'
                            onChange={(e) => {
                                setFiltersearch(e.target.value);
                                setSearchmenu(true);
                            }}
                            placeholder='Choose Class'
                            onClick={() => setSearchmenu(true)}
                            value={filtersearch}
                        />
                        {filtersearch.length > 0 && (
                            <button className='absolute right-2 top-2 text-red-600' onClick={clearFilter}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/></svg>
                            </button>
                        )}
                    </div>

                    {searchMenu && (
                        <div className='shadow-sm shadow-slate-500/40 mt-2 pb-2 pt-1 px-2 rounded-xl bg-white z-20'>
                            {classArray
                                .filter(item => item.class_name.toLowerCase().includes(filtersearch.toLowerCase()))
                                .map((item) => (
                                    <div key={item.id} onClick={() => handleSelect(item)}>
                                        <p className='p-2 hover:bg-slate-200/40 cursor-pointer rounded-xl mb-0.5 font-bold text-slate-500/70'>{item.class_name}</p>
                                        <hr className='text-slate-300' />
                                    </div>
                                ))}
                        </div>
                    )}

                    <div className='flex flex-wrap gap-2 mt-4'>
                        {subjectsArray
                            .filter(cls => cls.id === selectedClasses.id)
                            .map((cls) =>
                                cls.class_subjects.map((sub) => (
                                    <div key={sub.id}>
                                        <button
                                            onClick={() => toggleSubject(sub.subjects.id)}
                                            className={`border px-3 py-1.5 rounded-2xl transition-all duration-200 ${selectedSubjectIds.includes(sub.subjects.id)
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                                    : 'bg-white text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            {sub.subjects.subject_name}
                                        </button>
                                    </div>
                                ))
                            )
                        }
                    </div>

                    {selectedClasses.id && (
                        <button
                            onClick={saveToDatabase}
                            className='mt-6 w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold shadow-lg active:scale-95 transition-transform'
                        >
                            Update Permanent Selection
                        </button>
                    )}
                </div>
            </div>

            {/* CLASS TEACHER SECTION */}
            <section className='mt-1 border-t border-slate-100 pt-2'>
                <div className='flex items-center gap-2'>
                    <p className='font-bold text-slate-700'>Class teacher</p>
                    <button 
                        onClick={() => setIsClassTeacherMenu(!isClassTeacherMenu)} 
                        className={`transition-colors duration-300 ${requestStatus === 'approved' ? 'text-blue-600' : 'text-slate-400'}`}
                    >
                        {isClassTeacherMenu || requestStatus === 'approved' || requestStatus === 'pending' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="60px" height="50px" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <defs>
                                    <mask id="SVG4zf1KeAv">
                                        <path fill="#fff" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7h5c2.76 0 5 2.24 5 5c0 2.76 -2.24 5 -5 5h-10c-2.76 0 -5 -2.24 -5 -5c0 -2.76 2.24 -5 5 -5Z" />
                                        <circle cx="17" cy="12" r="3">
                                            <animate fill="freeze" attributeName="cx" dur="0.2s" values="7;17" />
                                        </circle>
                                    </mask>
                                </defs>
                                <path fill="currentColor" d="M0 0h24v24H0z" mask="url(#SVG4zf1KeAv)" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="60px" height="50px" viewBox="0 0 24 24">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path fill="none" stroke="currentColor" strokeDasharray="54" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7h5c2.76 0 5 2.24 5 5c0 2.76 -2.24 5 -5 5h-10c-2.76 0 -5 -2.24 -5 -5c0 -2.76 2.24 -5 5 -5Z">
                                    <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="54;0" />
                                </path>
                                <circle cx="7" cy="12" r="3" fill="currentColor" opacity="0">
                                    <animate fill="freeze" attributeName="opacity" begin="0.6s" dur="0.2s" to="1" />
                                </circle>
                            </svg>
                        )}
                    </button>
                </div>

                {isClassTeacherMenu && requestStatus !== 'approved' && (
                    <div className='mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200'>
                        <p className='text-xs font-bold text-slate-400 uppercase mb-3'>Select the class you manage:</p>
                        <select 
                            className='w-full h-11 border rounded-xl px-3 bg-white outline-none focus:border-blue-500'
                            value={requestClass}
                            onChange={(e) => setRequestClass(e.target.value)}
                        >
                            <option value="">-- Choose Class --</option>
                            {classArray.map(c => <option key={c.id} value={c.id}>{c.class_name}</option>)}
                        </select>
                        <button 
                            onClick={handleClassTeacherRequest}
                            disabled={isSubmitting}
                            className={`w-full mt-4 h-11 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 
                                ${isSubmitting 
                                    ? 'bg-blue-400 cursor-not-allowed text-white/80' 
                                    : 'bg-blue-600 text-white active:scale-95 hover:bg-blue-700'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : (
                                "Send Request to Admin"
                            )}
                        </button>
                    </div>
                )}

                <div className='mt-3'>
                    {requestStatus === 'pending' && (
                        <div className='bg-amber-50 border border-amber-100 p-3 rounded-xl flex items-center gap-2'>
                           <div className='w-2 h-2 bg-amber-500 rounded-full animate-pulse'></div>
                           <p className='text-xs font-bold text-amber-700'>Request for <span className='underline'>{classNamesMap[requestClass] || "Class"}</span> is pending Admin approval.</p>
                        </div>
                    )}
                    {requestStatus === 'approved' && (
                        <div className='bg-blue-50 border border-blue-100 p-3 rounded-xl flex items-center gap-2'>
                           <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                           <p className='text-xs font-bold text-blue-700'>Official Class Teacher for: <span className='uppercase'>{classNamesMap[finalAssignedClass] || "Assigned Class"}</span></p>
                        </div>
                    )}
                </div>
            </section>

            {/* ✅ AUTOMATED CLUB SECTION */}
            <section className='mt-4 border-t border-slate-100 pt-4'>
                <div className='p-4 bg-slate-50 rounded-2xl border border-slate-200'>
                    <p className='text-xs font-bold text-slate-400 uppercase mb-3'>Club Teacher / Coordinator:</p>
                    <select 
                        className='w-full h-11 border rounded-xl px-3 bg-white outline-none focus:border-blue-500 text-black font-semibold'
                        value={managedClub}
                        onChange={(e) => setManagedclub(e.target.value)}
                    >
                        <option value="">Not assigning a club</option>
                        {clubsList.map((c) => {
                            // ✅ Check if this club name is taken by another teacher
                            const isClubTaken = takenClubs.includes(c.club_name);
                            
                            return (
                                <option 
                                    value={c.club_name} 
                                    key={c.id}
                                    disabled={isClubTaken} // ✅ Gray out option if someone else took it
                                >
                                    {c.club_name} {isClubTaken ? "🔒 (Occupied)" : ""}
                                </option>
                            );
                        })}
                    </select>
                    <button 
                        onClick={handleClubUpdate}
                        disabled={isClubSubmitting}
                        className={`w-full mt-4 h-11 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 
                            ${isClubSubmitting 
                                ? 'bg-blue-400 cursor-not-allowed text-white/80' 
                                : 'bg-blue-600 text-white active:scale-95 hover:bg-blue-700'
                            }`}
                    >
                        {isClubSubmitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                            </>
                        ) : (
                            "Update Club Assignment"
                        )}
                    </button>
                </div>
            </section>
        </div>
    )
}