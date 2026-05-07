import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient';
import Swal from 'sweetalert2';

export const Subjects = () => {
  const [filtersearch, setFiltersearch] = useState("");
  const [classArray, setClassarray] = useState([]);
  const [selectedClasses, setSelectedclasses] = useState({});
  const [searchMenu, setSearchmenu] = useState(false);
  const [subjectsArray, setSubjectarray] = useState([]);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);

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
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: error.message });
    }
  };

  // fetch existing saved subjects
  const fetchExistingChoices = async (classId) => {
    try {
      const { data, error } = await supabase
        .from("chooseSubject")
        .select("subject_id")
        .eq("class_id", classId);

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

  // ✅ FIXED SAVE LOGIC
  const saveToDatabase = async () => {
    if (!selectedClasses.id) return;

    try {
      // 1. Get existing subjects for class
      const { data: existing, error: checkError } = await supabase
        .from("chooseSubject")
        .select("subject_id")
        .eq("class_id", selectedClasses.id);

      if (checkError) throw checkError;

      const existingIds = existing.map(item => item.subject_id);

      // 2. Check duplicates
      const conflict = selectedSubjectIds.find(id => existingIds.includes(id));

      if (conflict) {
        Swal.fire({
          icon: "warning",
          title: "Duplicate Subject",
          text: "One of these subjects has already been added to this class"
        });
        return;
      }

      // 3. Delete old entries
      await supabase
        .from("chooseSubject")
        .delete()
        .eq("class_id", selectedClasses.id);

      // 4. Insert new ones
      const inserts = selectedSubjectIds.map(subId => ({
        class_id: selectedClasses.id,
        subject_id: subId,
      }));

      const { error } = await supabase
        .from("chooseSubject")
        .insert(inserts);

      if (error) throw error;

      Swal.fire("Saved!", "Your choices are now permanent", "success");

    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  useEffect(() => { fetchClasses(); handleData(); }, []);

  return (
    <div className='pb-10'>
      <h2 className='mt-2 font-bold text-xl text-blue-600'>Choose Classes & Subjects</h2>
      <div className='py-2'>
        <div>
          <div className='flex justify-end'>
            <input 
              type="text" 
              className='border w-full h-10 p-2' 
              onChange={(e) => setFiltersearch(e.target.value)} 
              placeholder='Choose Class' 
              onKeyDown={() => setSearchmenu(true)} 
              value={filtersearch} 
            />
            {filtersearch.length > 0 && (
              <button className='absolute my-2 me-1 text-red-600' onClick={clearFilter}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect width="24" height="24" fill="none"/><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="60" d="M3 12c0 -4.97 4.03 -9 9 -9c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="60;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M12 12l4 4M12 12l-4 -4M12 12l-4 4M12 12l4 -4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" to="0"/></path></g></svg>
              </button>
            )}
          </div>
          
          {searchMenu && (
            <div className='shadow-sm shadow-slate-500/40 mt-2 pb-2 pt-1 px-2 rounded-xl bg-white relative z-10'>
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