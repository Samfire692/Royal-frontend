import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient';
import Swal from 'sweetalert2';

export const StudSubject = () => {
    const [filtersearch, setFiltersearch] = useState("");
    const [classArray, setClassarray] = useState([]);
    const [selectedClasses, setSelectedclasses] = useState({});
    const [searchMenu, setSearchmenu] = useState(false);
    const [subjectsArray, setSubjectarray] = useState([]);
    const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLocked, setIsLocked] = useState(false); 

    const fetchClasses = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not found");

            // 1. Check if they already have subjects saved
            const { data: existingChoices } = await supabase
                .from("studentchooseSubject")
                .select("class_id, subject_id")
                .eq("student_id", user.id);

            const { data: classes, error } = await supabase.from("royalclassrooms").select('*');
            if (error) throw error;
            setClassarray(classes);

            // 2. LOCK LOGIC: Only lock if they actually have saved subjects
            if (existingChoices && existingChoices.length > 0) {
                const savedClassId = existingChoices[0].class_id;
                const matchedClass = classes.find(c => c.id === savedClassId);
                if (matchedClass) {
                    setFiltersearch(matchedClass.class_name);
                    setSelectedclasses(matchedClass);
                    setIsLocked(true); 
                    setSelectedSubjectIds(existingChoices.map(item => item.subject_id));
                }
            } else {
                // First timer: allow them to use localStorage memory until they save
                const memoryClassId = localStorage.getItem('selected_student_class_id');
                if (memoryClassId) {
                    const matchedClass = classes.find(c => c.id.toString() === memoryClassId);
                    if (matchedClass) {
                        setFiltersearch(matchedClass.class_name);
                        setSelectedclasses(matchedClass);
                    }
                }
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleData = async () => {
        try {
            const { data, error } = await supabase
                .from("royalclassrooms")
                .select(`id, class_name, class_subjects(id, subjects(id, subject_name))`);
            if (error) throw error;
            setSubjectarray(data);
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error", text: error.message });
        }
    };

    // Auto-select for non-SSS classes
    useEffect(() => {
        if (selectedClasses.id && !isLocked) {
            const isSeniorClass = selectedClasses.class_name?.toUpperCase().includes("SSS");
            if (!isSeniorClass) {
                const classData = subjectsArray.find(cls => cls.id === selectedClasses.id);
                if (classData) {
                    const allIds = classData.class_subjects.map(sub => sub.subjects.id);
                    setSelectedSubjectIds(allIds);
                }
            }
        }
    }, [selectedClasses, subjectsArray, isLocked]);

    const handleSelect = (item) => {
        if (isLocked) return; 
        setFiltersearch(item.class_name);
        setSelectedclasses(item);
        setSearchmenu(false);
        localStorage.setItem('selected_student_class_id', item.id);
    };

    const clearFilter = () => {
        if (isLocked) return; 
        setFiltersearch("");
        setSelectedclasses({});
        setSelectedSubjectIds([]);
        localStorage.removeItem('selected_student_class_id');
    };

    const toggleSubject = (subjectId) => {
        const isSeniorClass = selectedClasses.class_name?.toUpperCase().includes("SSS");
        if (!isSeniorClass || isLocked) return; // Non-SSS or Locked can't toggle
        setSelectedSubjectIds(prev =>
            prev.includes(subjectId) ? prev.filter(id => id !== subjectId) : [...prev, subjectId]
        );
    };

    const saveToDatabase = async () => {
        if (!selectedClasses.id || selectedSubjectIds.length === 0) {
            return Swal.fire("Empty", "Please pick a class and subjects", "warning");
        }
        
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Once you save, your class will be locked. Only Admin can change it!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Save & Lock!'
        });

        if (result.isConfirmed) {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                
                // Update profile class_id
                await supabase.from("studentsignup").update({ class_id: selectedClasses.id }).eq("id", user.id);

                // Insert subjects
                await supabase.from("studentchooseSubject").delete().eq("student_id", user.id);
                const inserts = selectedSubjectIds.map(subId => ({
                    student_id: user.id,
                    class_id: selectedClasses.id,
                    subject_id: subId,
                }));
                await supabase.from("studentchooseSubject").insert(inserts);

                setIsLocked(true);
                localStorage.removeItem('selected_student_class_id');
                Swal.fire("Locked!", "Your subjects are now permanent.", "success");
            } catch (error) {
                Swal.fire("Error", error.message, "error");
            }
        }
    };

    useEffect(() => {
        fetchClasses();
        handleData();
    }, []);

    if (loading) return <div className='h-screen flex items-center justify-center'>Loading...</div>;

    return (
        <div className='p-4'>
            <h2 className='font-bold text-xl text-blue-600 mb-4'>Setup Your Profile</h2>
            
            <div className='relative'>
                <label className='text-sm font-semibold'>Select Your Class:</label>
                <input 
                    type="text" 
                    disabled={isLocked}
                    className={`border w-full h-10 p-2 rounded mt-1 ${isLocked ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                    value={filtersearch} 
                    onChange={(e) => setFiltersearch(e.target.value)}
                    onFocus={() => !isLocked && setSearchmenu(true)}
                    placeholder="Search class..."
                />
                {!isLocked && filtersearch && (
                    <button onClick={clearFilter} className='absolute right-3 top-9 text-red-500'>✕</button>
                )}

                {searchMenu && !isLocked && (
                    <div className='absolute bg-white border w-full z-20 shadow-lg max-h-40 overflow-y-auto'>
                        {classArray.filter(c => c.class_name.toLowerCase().includes(filtersearch.toLowerCase())).map(item => (
                            <div key={item.id} onClick={() => handleSelect(item)} className='p-2 hover:bg-blue-50 cursor-pointer border-b'>
                                {item.class_name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className='mt-6'>
                <p className='text-sm font-semibold mb-2'>Compulsory/Selected Subjects:</p>
                <div className='flex flex-wrap gap-2'>
                    {subjectsArray.filter(cls => cls.id === selectedClasses.id).map(cls => 
                        cls.class_subjects.map(sub => {
                            const isSelected = selectedSubjectIds.includes(sub.subjects.id);
                            return (
                                <button
                                    key={sub.id}
                                    disabled={isLocked}
                                    onClick={() => toggleSubject(sub.subjects.id)}
                                    className={`px-4 py-2 rounded-full border text-sm transition-all ${
                                        isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'
                                    } ${isLocked ? 'opacity-80 cursor-default' : ''}`}
                                >
                                    {sub.subjects.subject_name}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {!isLocked && selectedClasses.id && (
                <button onClick={saveToDatabase} className='mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-lg'>
                    Save & Permanent Lock
                </button>
            )}

            {isLocked && (
                <div className='mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
                    <p className='text-yellow-700 text-sm'>🔒 This profile is locked to <b>{selectedClasses.class_name}</b>. Contact the school admin to modify your subjects or class.</p>
                </div>
            )}
        </div>
    );
};