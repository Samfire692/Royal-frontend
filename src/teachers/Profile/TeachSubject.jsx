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
     const [userId, setUserId] = useState(null); // ✅ NEW
   
     const fetchClasses = async () => {
       try {
         const { data, error } = await supabase.from("royalclassrooms").select('*');
         if (error) throw error;
         setClassarray(data);
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
         setLoading(false)
       } catch (error) {
         Swal.fire({ icon: "error", title: "Error", text: error.message });
       }
     };

     // ✅ GET LOGGED IN USER
     const getUser = async () => {
       const { data } = await supabase.auth.getUser();
       setUserId(data?.user?.id);
     };
   
     // ✅ FETCH ONLY THIS TEACHER'S CHOICES
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
         // 1. Check ALL existing subjects in this class (other teachers included)
         const { data: existing, error: checkError } = await supabase
           .from("teacherchooseSubject")
           .select("subject_id, teacher_id")
           .eq("class_id", selectedClasses.id);
   
         if (checkError) throw checkError;
   
         // Remove current teacher's own subjects from conflict check
         const otherTeachersSubjects = existing
           .filter(item => item.teacher_id !== userId)
           .map(item => item.subject_id);
   
         // 2. Check conflict
         const conflict = selectedSubjectIds.find(id => otherTeachersSubjects.includes(id));
   
         if (conflict) {
           Swal.fire({
             icon: "warning",
             title: "Subject Already Taken",
             text: "One of the selected subjects has already been assigned to another teacher in this class"
           });
           return;
         }
   
         // 3. Delete ONLY this teacher's previous selection
         await supabase
           .from("teacherchooseSubject")
           .delete()
           .eq("class_id", selectedClasses.id)
           .eq("teacher_id", userId);
   
         // 4. Insert new ones
         const inserts = selectedSubjectIds.map(subId => ({
           class_id: selectedClasses.id,
           subject_id: subId,
           teacher_id: userId
         }));
   
         const { error } = await supabase
           .from("teacherchooseSubject")
           .insert(inserts);
   
         if (error) throw error;
   
         Swal.fire("Saved!", "Your choices are now permanent", "success");
   
       } catch (error) {
         Swal.fire("Error", error.message, "error");
       }
     };
   
     useEffect(() => { 
       fetchClasses(); 
       handleData(); 
       getUser(); 
     }, []);

     useEffect(() => {
       if (selectedClasses.id && userId) {
         fetchExistingChoices(selectedClasses.id);
       }
     }, [userId]);

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
                {/* SVG unchanged */}
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
                    <hr className='text-slate-300'/>
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
                      className={`border px-3 py-1.5 rounded-2xl transition-all duration-200 ${
                        selectedSubjectIds.includes(sub.subjects.id) 
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
    </div>
  )
}